/* ripeam-luzes — simulador de luzes e marcas de navegação (RIPEAM-72, Regras 20 a 31 e Anexo I).
   A cena é vista do nosso barco: a outra embarcação aparece pelas luzes. O aspecto (a marcação
   relativa, medida a partir da proa DELA, de onde nós estamos) decide quais luzes ficam visíveis,
   pelos setores da Regra 21 (mastro 225°, bordos 112,5° cada, alcançado 135°, circulares 360°), com o corte
   prático de 1 a 5° do Anexo I, Seção 9; as posições seguem o Anexo I (alturas exageradas para leitura).
   Alcances mínimos: Regra 22. Marcas diurnas: Anexo I, Seção 6.

   opts de mount (todos opcionais):
     modo:     'explorar' | 'desafio'                      padrão 'explorar'
     tipo:     situação inicial, padrão 'pm50'. Valores:
               'pm50' (propulsão mecânica, 50 m ou mais), 'pm' (menos de 50 m), 'pm12' (menos de 12 m),
               'pm7' (menos de 7 m e até 7 nós), 'hover' (colchão de ar), 'vela', 'velamotor' (vela e motor),
               'remo' (a remo ou veleiro com menos de 7 m), 'arrasto', 'pesca' (exceto arrasto),
               'reboque', 'pratico', 'sg' (sem governo), 'mr' (manobra restrita), 'cal' (restrita pelo calado),
               'fundeada', 'encalhada'
     opcoes:   variações do tipo (ver TIPOS[...].opcoes), ex.: {tricolor:true} para 'vela', {longo:true} para
               'reboque', {sit:'fundeada'} para 'mr', {grande:true} para 'fundeada', {circ12:true} para 'pm12'
     aspecto:  graus, de onde vemos a outra a partir da proa dela (0 = de frente; 90 = pelo través de boreste)
     dia:      false   (true mostra as marcas diurnas)
     silhueta: true    (silhueta tênue do casco à noite; no desafio começa desligada)
     nomes:    true    (rótulos das luzes no modo explorar)
     titulo:   texto da legenda do instrumento

   Exemplos de bloco de lição:
     {t:'widget', w:'ripeam-luzes', opts:{tipo:'arrasto', aspecto:60}}
     {t:'widget', w:'ripeam-luzes', opts:{tipo:'vela', opcoes:{tricolor:true}, aspecto:300}}
     {t:'widget', w:'ripeam-luzes', opts:{tipo:'mr', dia:true}}
     {t:'widget', w:'ripeam-luzes', opts:{modo:'desafio'}} */
(function () {
  'use strict';
  var h = VL.h;
  var D2R = Math.PI / 180;
  var seq = 0;

  function n360(a) { return ((a % 360) + 360) % 360; }
  function n180(a) { a = n360(a); return a > 180 ? a - 360 : a; }
  function graus(a) { var v = Math.round(n360(a)) % 360; return (v < 10 ? '00' : v < 100 ? '0' : '') + v + '°'; }
  function en(txt) { return txt ? '<span class="rpl-en" data-intl="on"> (' + VL.esc(txt) + ')</span>' : ''; }
  function sortear(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function aleat(a, b) { return a + Math.random() * (b - a); }

  /* ---------- Setores da Regra 21 e corte prático do Anexo I, Seção 9 ----------
     th = de onde nós a vemos, em graus a partir da proa dela, no sentido horário (90 = través de boreste). */
  function intensidade(setor, th) {
    if (setor === 'circ') return 1;
    var r = n180(th), a = Math.abs(r), fora = 0, faixa = 3;
    if (setor === 'mastro') fora = a - 112.5;
    else if (setor === 'alc') fora = 112.5 - a;
    else if (setor === 'be') { if (r < 0) { fora = -r; faixa = 2; } else fora = r - 112.5; }
    else if (setor === 'bb') { if (r > 0) { fora = r; faixa = 2; } else fora = -112.5 - r; }
    if (fora <= 0) return 1;
    return Math.max(0, 1 - fora / faixa);
  }
  var SETOR_TXT = { mastro: '225° pela proa', be: '112,5° a boreste', bb: '112,5° a bombordo', alc: '135° pela popa', circ: '360°' };

  /* Projeção ortográfica vista do observador: x para a nossa direita, z para cima. */
  function proj(p, th) {
    var t = th * D2R, c = Math.cos(t), s = Math.sin(t);
    return { x: -p[1] * c + p[0] * s, z: p[2], d: p[1] * s + p[0] * c };
  }
  function envoltoria(pts) {
    pts = pts.slice().sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    if (pts.length < 3) return pts;
    function cr(o, a, b) { return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); }
    var lo = [], hi = [], i, p;
    for (i = 0; i < pts.length; i++) { p = pts[i]; while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (i = pts.length - 1; i >= 0; i--) { p = pts[i]; while (hi.length >= 2 && cr(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
    hi.pop(); lo.pop();
    return lo.concat(hi);
  }

  /* ---------- Silhuetas (cascos, casarias, mastros, velas) ---------- */
  var FORMAS = {
    navio: { conves: [[-0.5, 0.40], [-0.32, 0.5], [0.22, 0.5], [0.38, 0.32], [0.5, 0]], agua: [[-0.47, 0.34], [-0.3, 0.46], [0.2, 0.46], [0.36, 0.26], [0.455, 0]], tosado: 1.22 },
    barco: { conves: [[-0.5, 0.36], [-0.2, 0.5], [0.15, 0.48], [0.35, 0.3], [0.5, 0]], agua: [[-0.44, 0.28], [-0.2, 0.42], [0.15, 0.4], [0.33, 0.2], [0.43, 0]], tosado: 1.3 },
    barca: { conves: [[-0.5, 0.5], [0.44, 0.5], [0.5, 0.4]], agua: [[-0.49, 0.48], [0.4, 0.48], [0.46, 0.38]], tosado: 1 },
    hover: { conves: [[-0.5, 0.46], [0.3, 0.5], [0.46, 0.34], [0.5, 0]], agua: [[-0.5, 0.46], [0.3, 0.5], [0.46, 0.34], [0.5, 0.04]], tosado: 1 },
  };
  function casco(fc, L, B, borda, forma) {
    var F = FORMAS[forma], pts = [];
    F.conves.forEach(function (q) { var z = borda * (q[0] > 0.3 ? F.tosado : 1); pts.push([fc + q[0] * L, q[1] * B, z], [fc + q[0] * L, -q[1] * B, z]); });
    F.agua.forEach(function (q) { pts.push([fc + q[0] * L, q[1] * B, 0], [fc + q[0] * L, -q[1] * B, 0]); });
    return { t: 'solido', pts: pts };
  }
  function caixa(f1, f2, s, z1, z2, s0) {
    s0 = s0 || 0; var pts = [];
    [f1, f2].forEach(function (f) { [s0 - s, s0 + s].forEach(function (ss) { pts.push([f, ss, z1], [f, ss, z2]); }); });
    return { t: 'solido', pts: pts };
  }
  function haste(f, z1, z2, w, s) { return { t: 'linha', pts: [[f, s || 0, z1], [f, s || 0, z2]], w: w || 1.6 }; }
  function linha(pts, w) { return { t: 'linha', pts: pts, w: w || 1 }; }
  function vela(pts) { return { t: 'vela', pts: pts }; }

  function tplNavio() {
    return { L: 90, comp: 90, partes: [casco(0, 90, 14, 6, 'navio'), caixa(-43, -26, 6.4, 6, 11.5), caixa(-40, -25, 7.3, 11.5, 13.2), caixa(-40, -27, 5.6, 13.2, 16), caixa(-42, -37.5, 1.8, 13, 20), caixa(31, 42, 5, 6, 8), caixa(-20, -12, 5.4, 6, 8.2), caixa(-8, 0, 5.4, 6, 8.2), caixa(4, 12, 5.4, 6, 8.2), caixa(15, 22, 5.4, 6, 8.2), haste(25, 6, 19.6, 2), haste(-28, 16, 25.2, 2)] };
  }
  function tplCosteiro() {
    return { L: 30, comp: 30, partes: [casco(0, 30, 7, 2.5, 'navio'), caixa(-2.5, 5.5, 2.8, 2.5, 5.6), caixa(-8, -2.5, 2.4, 2.5, 3.6), haste(3, 5.6, 13.2, 1.6)] };
  }
  function tplVeleiro(motor) {
    return { L: 11, comp: 11, partes: [casco(0, 11, 3.6, 1.1, 'barco'), caixa(-2.6, 1.6, 1.2, 1.1, 1.75), haste(1, 1.75, 15.3, 1.6),
      vela([[0.9, 0, 2.3], [0.9, 0, 14.6], [-4.4, -1.7, 2.4]]), vela([[5.3, 0, 1.6], [1.3, 0, 13.2], [0.5, -1.5, 1.8]]),
      motor ? null : null].filter(Boolean) };
  }

  /* ---------- Fábrica das situações ---------- */
  function L(c, setor, f, s, z, nome, ingl, rot, extra) {
    var o = { c: c, setor: setor, p: [f, s, z], nome: nome, en: ingl, rot: rot };
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  }
  function M(forma, f, s, z, nome) { return { forma: forma, p: [f, s, z], nome: nome }; }
  var MARCA_NOME = { bola: 'bola', cilindro: 'cilindro', 'cone-baixo': 'cone com o vértice para baixo', 'cone-cima': 'cone com o vértice para cima', losango: 'losango', 'cones-vertices': 'dois cones unidos pelos vértices' };

  function luzesNavioPM(cfg, comMastroRe) {
    cfg.luzes.push(L('W', 'mastro', 25, 0, 18, 'Luz de mastro de vante', 'forward masthead light', 'mastro de vante'));
    if (comMastroRe) cfg.luzes.push(L('W', 'mastro', -28, 0, 24, 'Luz de mastro de ré, mais alta', 'after masthead light', 'mastro de ré'));
    cfg.luzes.push(L('G', 'be', -25, 7.2, 14, 'Luz de bordo de boreste', 'starboard sidelight', 'boreste'));
    cfg.luzes.push(L('R', 'bb', -25, -7.2, 14, 'Luz de bordo de bombordo', 'port sidelight', 'bombordo'));
    cfg.luzes.push(L('W', 'alc', -45, 0, 8, 'Luz de alcançado', 'sternlight', 'alcançado'));
  }
  function luzesNavioBordos(cfg) {
    cfg.luzes.push(L('G', 'be', -25, 7.2, 14, 'Luz de bordo de boreste', 'starboard sidelight', 'boreste'));
    cfg.luzes.push(L('R', 'bb', -25, -7.2, 14, 'Luz de bordo de bombordo', 'port sidelight', 'bombordo'));
    cfg.luzes.push(L('W', 'alc', -45, 0, 8, 'Luz de alcançado', 'sternlight', 'alcançado'));
  }
  function luzesCosteiroPM(cfg, comMastro) {
    if (comMastro !== false) cfg.luzes.push(L('W', 'mastro', 3, 0, 12.5, 'Luz de mastro', 'masthead light', 'mastro'));
    cfg.luzes.push(L('G', 'be', 2.5, 2.9, 5.2, 'Luz de bordo de boreste', 'starboard sidelight', 'boreste'));
    cfg.luzes.push(L('R', 'bb', 2.5, -2.9, 5.2, 'Luz de bordo de bombordo', 'port sidelight', 'bombordo'));
    cfg.luzes.push(L('W', 'alc', -14.6, 0, 3, 'Luz de alcançado', 'sternlight', 'alcançado'));
  }
  function fundeioNavio(cfg) {
    cfg.partes.push(haste(43, 7.3, 13.5, 1.2), haste(-44, 6, 9, 1.2));
    cfg.luzes.push(L('W', 'circ', 43, 0, 13, 'Luz de fundeio de vante, mais alta', 'forward anchor light', 'fundeio de vante'));
    cfg.luzes.push(L('W', 'circ', -44, 0, 8.5, 'Luz de fundeio de ré, mais baixa', 'after anchor light', 'fundeio de ré'));
  }
  function fundeioCosteiro(cfg) {
    cfg.luzes.push(L('W', 'circ', 3, 0, 12.5, 'Luz de fundeio, circular branca', 'anchor light', 'fundeio'));
  }
  function coluna(cfg, f, zs, cores, nomes, rots) {
    zs.forEach(function (z, i) { cfg.luzes.push(L(cores[i], 'circ', f, 0, z, nomes[i], 'all-round light', rots[i])); });
  }

  var FAM = {
    pm: 'Propulsão mecânica em movimento', vela: 'Veleiro navegando só a vela', hover: 'Colchão de ar (hovercraft)',
    arrasto: 'Pesca de arrasto', pesca: 'Pesca, exceto arrasto', reboque: 'Rebocador rebocando pela popa',
    pratico: 'Praticagem em serviço', sg: 'Sem governo', mr: 'Com capacidade de manobra restrita',
    cal: 'Restrita devido ao seu calado', fundeada: 'Fundeada', encalhada: 'Encalhada', remo: 'A remo ou veleiro pequeno',
    velamotor: 'Veleiro a vela e a motor', pescaDia: 'Engajada na pesca', reboqueLongo: 'Rebocando, reboque com mais de 200 m',
  };

  var TIPOS = {
    pm50: { rotulo: 'Propulsão mecânica, 50 m ou mais', grupo: 0 },
    pm: { rotulo: 'Propulsão mecânica, menos de 50 m', grupo: 0 },
    pm12: { rotulo: 'Propulsão mecânica, menos de 12 m', grupo: 0, opcoes: [{ k: 'circ12', rotulo: 'Circular branca no lugar das luzes de mastro e de alcançado', padrao: false }] },
    pm7: { rotulo: 'Propulsão mecânica, menos de 7 m e até 7 nós', grupo: 0, opcoes: [{ k: 'bordos7', rotulo: 'Luzes de bordos (se possível)', padrao: true }] },
    hover: { rotulo: 'Colchão de ar (hovercraft)', grupo: 0 },
    vela: { rotulo: 'Veleiro navegando a vela', grupo: 0, opcoes: [{ k: 'tricolor', rotulo: 'Lanterna tricolor no topo do mastro', padrao: false, exclui: 'rv' }, { k: 'rv', rotulo: 'Circulares vermelha sobre verde no mastro', padrao: false, exclui: 'tricolor' }] },
    velamotor: { rotulo: 'Veleiro a vela e a motor', grupo: 0 },
    remo: { rotulo: 'A remo, ou veleiro com menos de 7 m', grupo: 0, opcoes: [{ k: 'luzesVela', rotulo: 'Exibir as luzes de veleiro (opcional)', padrao: false }] },
    arrasto: { rotulo: 'Pesca de arrasto', grupo: 1, opcoes: [{ k: 'seg', rotulo: 'Com seguimento', padrao: true }, { k: 'mastroArr', rotulo: 'Luz de mastro à ré (obrigatória com 50 m ou mais)', padrao: false }] },
    pesca: { rotulo: 'Pesca, exceto arrasto', grupo: 1, opcoes: [{ k: 'seg', rotulo: 'Com seguimento', padrao: false }, { k: 'aparelho', rotulo: 'Aparelho a mais de 150 m, para boreste', padrao: false }] },
    reboque: { rotulo: 'Rebocando pela popa', grupo: 1, opcoes: [{ k: 'longo', rotulo: 'Reboque com mais de 200 m', padrao: false }, { k: 'restrito', rotulo: 'Restrição severa para desviar (Regra 27(c))', padrao: false }] },
    pratico: { rotulo: 'Praticagem em serviço', grupo: 1, opcoes: [{ k: 'fundeada', rotulo: 'Fundeada', padrao: false }] },
    sg: { rotulo: 'Sem governo', grupo: 1, opcoes: [{ k: 'seg', rotulo: 'Com seguimento', padrao: false }, { k: 'grande', rotulo: '50 m ou mais', padrao: true }] },
    mr: { rotulo: 'Com capacidade de manobra restrita', grupo: 1, opcoes: [{ k: 'sit', tipo: 'seg', rotulo: 'Situação', padrao: 'seg', valores: [['seg', 'Com seguimento'], ['parada', 'Sem seguimento'], ['fundeada', 'Fundeada']] }, { k: 'grande', rotulo: '50 m ou mais', padrao: true }] },
    cal: { rotulo: 'Restrita devido ao seu calado', grupo: 1 },
    fundeada: { rotulo: 'Fundeada', grupo: 2, opcoes: [{ k: 'grande', rotulo: '50 m ou mais', padrao: false }, { k: 'conves', rotulo: 'Iluminar o convés (obrigatório com 100 m ou mais)', padrao: false, so: 'grande' }] },
    encalhada: { rotulo: 'Encalhada', grupo: 2, opcoes: [{ k: 'grande', rotulo: '50 m ou mais', padrao: true }] },
  };
  var GRUPOS = ['Em movimento', 'Trabalhando ou com restrição', 'Parada'];

  function opcoesPadrao(tipo, o) {
    var r = {};
    (TIPOS[tipo].opcoes || []).forEach(function (op) { r[op.k] = o && o[op.k] !== undefined ? o[op.k] : op.padrao; });
    return r;
  }

  function montar(tipo, o) {
    o = opcoesPadrao(tipo, o);
    var cfg, b;
    function base(tpl, extra) {
      var c = { luzes: [], marcas: [], partes: tpl.partes.slice(), L: tpl.L, comp: tpl.comp, notas: [], direcional: true };
      for (var k in extra) c[k] = extra[k];
      return c;
    }
    switch (tipo) {
      case 'pm50':
        cfg = base(tplNavio(), { nome: 'Propulsão mecânica com 50 m ou mais, em movimento', en: 'power-driven vessel underway, 50 m or more', regra: 'Regra 23(a)', familia: 'pm',
          texto: 'Duas luzes de mastro brancas, a de ré mais alta que a de vante, mais as luzes de bordos (verde a boreste, vermelha a bombordo) e a luz de alcançado, branca, na popa. O alinhamento das duas luzes de mastro mostra o rumo dela: a de vante, mais baixa, fica do lado para onde a proa aponta.' });
        luzesNavioPM(cfg, true);
        cfg.diaTexto = 'Navegando com propulsão mecânica não usa marca diurna.';
        break;
      case 'pm':
        cfg = base(tplCosteiro(), { nome: 'Propulsão mecânica com menos de 50 m, em movimento', en: 'power-driven vessel underway, less than 50 m', regra: 'Regra 23(a)', familia: 'pm',
          texto: 'Uma luz de mastro branca, à vante, mais as luzes de bordos e a luz de alcançado. Abaixo de 50 m a segunda luz de mastro, à ré, é opcional.' });
        luzesCosteiroPM(cfg);
        cfg.diaTexto = 'Navegando com propulsão mecânica não usa marca diurna.';
        break;
      case 'pm12':
        cfg = base({ L: 8, comp: 8, partes: [casco(0, 8, 2.8, 1.0, 'barco'), caixa(-1.4, 0.6, 0.9, 1, 2.0), haste(-0.6, 2.0, 3.05, 1.2)] }, {
          nome: 'Propulsão mecânica com menos de 12 m, em movimento', en: 'power-driven vessel less than 12 m', familia: 'pm', regra: o.circ12 ? 'Regra 23(d)(i)' : 'Regra 23(a)',
          texto: 'Pode usar as luzes normais (mastro, bordos e alcançado) ou, no lugar das luzes de mastro e de alcançado, uma luz circular branca com as luzes de bordos. As luzes de bordos podem ficar juntas numa lanterna combinada na proa (Regra 21(b)).' });
        cfg.luzes.push(L('G', 'be', 3.7, 0.12, 1.25, 'Luz de bordo de boreste (lanterna combinada)', 'combined lantern', 'boreste'));
        cfg.luzes.push(L('R', 'bb', 3.7, -0.12, 1.25, 'Luz de bordo de bombordo (lanterna combinada)', 'combined lantern', 'bombordo'));
        if (o.circ12) cfg.luzes.push(L('W', 'circ', -0.6, 0, 3.0, 'Luz circular branca', 'all-round white light', 'circular branca'));
        else {
          cfg.luzes.push(L('W', 'mastro', -0.6, 0, 3.0, 'Luz de mastro, pelo menos 1 m acima das de bordos', 'masthead light', 'mastro'));
          cfg.luzes.push(L('W', 'alc', -4, 0, 1.2, 'Luz de alcançado', 'sternlight', 'alcançado'));
        }
        cfg.notas.push('Com a luz circular branca, quem vem por ante a ré do través vê só uma luz branca — igual à luz de alcançado.');
        cfg.diaTexto = 'Sem marca diurna.';
        break;
      case 'pm7':
        cfg = base({ L: 5.5, comp: 5.5, partes: [casco(0, 5.5, 2, 0.7, 'barco'), caixa(-0.6, 0.4, 0.6, 0.7, 1.3), haste(-2.4, 0.7, 1.95, 1)] }, {
          nome: 'Propulsão mecânica com menos de 7 m e velocidade máxima de até 7 nós', en: 'power-driven vessel < 7 m, max speed ≤ 7 kn', regra: 'Regra 23(d)(ii)', familia: 'pm', direcional: !!o.bordos7,
          texto: 'Pode exibir apenas uma luz circular branca e, se for possível, também as luzes de bordos.' });
        cfg.luzes.push(L('W', 'circ', -2.4, 0, 1.9, 'Luz circular branca', 'all-round white light', 'circular branca'));
        if (o.bordos7) {
          cfg.luzes.push(L('G', 'be', 2.6, 0.1, 0.9, 'Luz de bordo de boreste (lanterna combinada)', 'combined lantern', 'boreste'));
          cfg.luzes.push(L('R', 'bb', 2.6, -0.1, 0.9, 'Luz de bordo de bombordo (lanterna combinada)', 'combined lantern', 'bombordo'));
        }
        cfg.diaTexto = 'Sem marca diurna.';
        break;
      case 'hover':
        cfg = base({ L: 25, comp: 25, partes: [casco(0, 25, 11, 2.4, 'hover'), caixa(-6, 8, 4, 2.4, 5), haste(2, 5, 9.7, 1.4), caixa(-12, -10.4, 0.15, 2.4, 6.4, 3.5), caixa(-12, -10.4, 0.15, 2.4, 6.4, -3.5), caixa(-12, -10.4, 3.6, 6.2, 6.5)] }, {
          nome: 'Embarcação de colchão de ar sem deslocamento', en: 'air-cushion vessel, non-displacement mode', regra: 'Regra 23(b)', familia: 'hover',
          texto: 'Mostra as luzes de propulsão mecânica e, além delas, uma luz circular amarela intermitente, que pisca 120 vezes ou mais por minuto (Regra 21(f)).' });
        cfg.luzes.push(L('W', 'mastro', 2, 0, 9.3, 'Luz de mastro', 'masthead light', 'mastro'));
        cfg.luzes.push(L('G', 'be', 1, 4.2, 4.8, 'Luz de bordo de boreste', 'starboard sidelight', 'boreste'));
        cfg.luzes.push(L('R', 'bb', 1, -4.2, 4.8, 'Luz de bordo de bombordo', 'port sidelight', 'bombordo'));
        cfg.luzes.push(L('W', 'alc', -12.4, 0, 3, 'Luz de alcançado', 'sternlight', 'alcançado'));
        cfg.luzes.push(L('Y', 'circ', -4, 0, 6, 'Luz circular amarela intermitente', 'all-round flashing yellow light', 'amarela intermitente', { pisca: true }));
        cfg.diaTexto = 'Sem marca diurna.';
        break;
      case 'vela':
        cfg = base(tplVeleiro(), { nome: 'Embarcação a vela em movimento', en: 'sailing vessel underway', regra: o.tricolor ? 'Regra 25(b)' : (o.rv ? 'Regra 25(a) e (c)' : 'Regra 25(a)'), familia: 'vela',
          texto: 'Só luzes de bordos e luz de alcançado — nenhuma luz de mastro branca. Com menos de 20 m, as três podem ficar numa lanterna tricolor no topo do mastro. Também pode exibir, no topo do mastro, duas luzes circulares, vermelha sobre verde, mas nunca junto com a tricolor.' });
        if (o.tricolor) {
          cfg.luzes.push(L('G', 'be', 1, 0.02, 15.25, 'Lanterna tricolor: setor verde', 'tricolour lantern', 'tricolor'));
          cfg.luzes.push(L('R', 'bb', 1, -0.02, 15.25, 'Lanterna tricolor: setor vermelho', 'tricolour lantern', 'tricolor'));
          cfg.luzes.push(L('W', 'alc', 0.98, 0, 15.25, 'Lanterna tricolor: setor branco de alcançado', 'tricolour lantern', 'tricolor'));
          cfg.notas.push('A tricolor só vale navegando a vela. Com o motor ligado, use as luzes de bordos e de alcançado do convés e acenda a luz de mastro.');
        } else {
          cfg.luzes.push(L('G', 'be', 4.9, 0.75, 1.5, 'Luz de bordo de boreste', 'starboard sidelight', 'boreste'));
          cfg.luzes.push(L('R', 'bb', 4.9, -0.75, 1.5, 'Luz de bordo de bombordo', 'port sidelight', 'bombordo'));
          cfg.luzes.push(L('W', 'alc', -5.4, 0, 1.4, 'Luz de alcançado', 'sternlight', 'alcançado'));
        }
        if (o.rv) {
          cfg.luzes.push(L('R', 'circ', 1, 0, 14.6, 'Luz circular vermelha (superior)', 'all-round red light', 'circular vermelha'));
          cfg.luzes.push(L('G', 'circ', 1, 0, 13.4, 'Luz circular verde (inferior)', 'all-round green light', 'circular verde'));
        }
        cfg.diaTexto = 'Navegando só a vela, não usa marca diurna.';
        break;
      case 'velamotor':
        cfg = base(tplVeleiro(true), { nome: 'Embarcação a vela usando também o motor', en: 'vessel proceeding under sail and power', regra: 'Regra 25(e) e Regra 23(a)', familia: 'pm', familiaDia: 'velamotor',
          texto: 'Com o motor ligado ela é, para o RIPEAM, uma embarcação de propulsão mecânica (Regra 3(b) e (c)): à noite acende a luz de mastro, além das luzes de bordos e de alcançado. De dia, iça à vante um cone com o vértice para baixo (Regra 25(e)).' });
        cfg.luzes.push(L('W', 'mastro', 1.12, 0, 7.6, 'Luz de mastro', 'masthead light', 'mastro'));
        cfg.luzes.push(L('G', 'be', 4.9, 0.75, 1.5, 'Luz de bordo de boreste', 'starboard sidelight', 'boreste'));
        cfg.luzes.push(L('R', 'bb', 4.9, -0.75, 1.5, 'Luz de bordo de bombordo', 'port sidelight', 'bombordo'));
        cfg.luzes.push(L('W', 'alc', -5.4, 0, 1.4, 'Luz de alcançado', 'sternlight', 'alcançado'));
        cfg.marcas.push(M('cone-baixo', 1.7, 0, 9.6, 'Cone com o vértice para baixo, à vante'));
        cfg.partes.push(linha([[1.05, 0, 11.4], [1.7, 0, 10.2]], 0.6));
        cfg.diaTexto = 'Um cone preto com o vértice para baixo, à vante, onde melhor possa ser visto (Regra 25(e)).';
        cfg.notas.push('Muitos velejadores esquecem o cone ao ligar o motor: sem ele, os outros acham que você ainda tem a preferência de veleiro.');
        break;
      case 'remo':
        cfg = base({ L: 4.5, comp: 4.5, partes: [casco(0, 4.5, 1.5, 0.5, 'barco'), caixa(-0.45, 0.05, 0.22, 0.5, 1.25), caixa(-0.3, -0.1, 0.12, 1.3, 1.6), linha([[-0.1, 0.3, 0.9], [0.7, 1.9, 0.05]], 1.2), linha([[-0.1, -0.3, 0.9], [0.7, -1.9, 0.05]], 1.2)] }, {
          nome: 'Embarcação a remo (ou veleiro com menos de 7 m)', en: 'vessel under oars / sailing vessel < 7 m', regra: 'Regra 25(d)', familia: 'remo', direcional: !!o.luzesVela,
          texto: 'Pode exibir as luzes de veleiro. Se não exibir, deve ter à mão uma lanterna elétrica ou um lampião aceso, de luz branca, e mostrá-lo a tempo de evitar um abalroamento.' });
        if (o.luzesVela) {
          cfg.luzes.push(L('G', 'be', 2.1, 0.08, 0.75, 'Luz de bordo de boreste (lanterna combinada)', 'combined lantern', 'boreste'));
          cfg.luzes.push(L('R', 'bb', 2.1, -0.08, 0.75, 'Luz de bordo de bombordo (lanterna combinada)', 'combined lantern', 'bombordo'));
          cfg.luzes.push(L('W', 'alc', -2.2, 0, 0.7, 'Luz de alcançado', 'sternlight', 'alcançado'));
        } else cfg.luzes.push(L('W', 'circ', 0.15, 0.32, 1.25, 'Lanterna branca mostrada a tempo', 'white torch', 'lanterna'));
        cfg.diaTexto = 'Sem marca diurna.';
        break;
      case 'arrasto':
        cfg = base({ L: 24, comp: o.mastroArr ? 55 : 24, partes: [casco(0, 24, 7, 2.2, 'navio'), caixa(3, 8.5, 3, 2.2, 5.2), haste(5.5, 5.2, 11.4, 1.4), haste(-7, 2.2, 13.6, 1.6), haste(-7, 2.2, 9, 1.2, 2.6), haste(-7, 2.2, 9, 1.2, -2.6), linha([[-7, -2.6, 9], [-7, 2.6, 9]], 1.2)] }, {
          nome: 'Embarcação engajada na pesca de arrasto', en: 'vessel engaged in trawling', regra: 'Regra 26(b)', familia: 'arrasto', familiaDia: 'pescaDia', direcional: !!o.seg || !!o.mastroArr,
          texto: 'Duas luzes circulares na vertical: verde sobre branca. Com 50 m ou mais, também uma luz de mastro à ré e mais alta que a verde (abaixo de 50 m é opcional). Com seguimento, acende as luzes de bordos e de alcançado. De dia: dois cones unidos pelos vértices.' });
        coluna(cfg, 5.5, [10.6, 8.6], ['G', 'W'], ['Luz circular verde (superior)', 'Luz circular branca (inferior)'], ['circular verde', 'circular branca']);
        if (o.mastroArr) cfg.luzes.push(L('W', 'mastro', -7, 0, 13.2, 'Luz de mastro, à ré e acima da verde', 'masthead light', 'mastro'));
        if (o.seg) {
          cfg.luzes.push(L('G', 'be', 5.5, 3.1, 4.6, 'Luz de bordo de boreste', 'starboard sidelight', 'boreste'));
          cfg.luzes.push(L('R', 'bb', 5.5, -3.1, 4.6, 'Luz de bordo de bombordo', 'port sidelight', 'bombordo'));
          cfg.luzes.push(L('W', 'alc', -11.8, 0, 2.8, 'Luz de alcançado', 'sternlight', 'alcançado'));
        }
        cfg.marcas.push(M('cones-vertices', 5.5, 0, 9.4, 'Dois cones unidos pelos vértices'));
        cfg.diaTexto = 'Dois cones pretos unidos pelos vértices, um acima do outro (Regra 26(b)(i)).';
        cfg.notas.push('A luz branca de baixo fica acima das luzes de bordos a pelo menos o dobro da distância entre as duas circulares (Anexo I, Seção 2(j)).');
        break;
      case 'pesca':
        cfg = base({ L: 24, comp: 24, partes: [casco(0, 24, 7, 2.2, 'navio'), caixa(3, 8.5, 3, 2.2, 5.2), haste(5.5, 5.2, 11.4, 1.4), haste(-6, 2.2, 7.5, 1.4)] }, {
          nome: 'Embarcação engajada na pesca, exceto arrasto', en: 'vessel engaged in fishing, other than trawling', regra: 'Regra 26(c)', familia: 'pesca', familiaDia: 'pescaDia', direcional: !!o.seg,
          texto: 'Duas luzes circulares na vertical: vermelha sobre branca. Se o aparelho de pesca se estende mais de 150 m na horizontal, uma luz circular branca do lado do aparelho (de dia, um cone com o vértice para cima). Com seguimento, acende bordos e alcançado. Não usa luz de mastro.' });
        coluna(cfg, 5.5, [10.6, 8.6], ['R', 'W'], ['Luz circular vermelha (superior)', 'Luz circular branca (inferior)'], ['circular vermelha', 'circular branca']);
        if (o.aparelho) {
          cfg.partes.push(haste(5.5, 2.2, 7, 1, 3.5));
          cfg.luzes.push(L('W', 'circ', 5.5, 3.5, 6.5, 'Luz circular branca do lado do aparelho', 'all-round white light towards the gear', 'aparelho'));
          cfg.marcas.push(M('cone-cima', 5.5, 3.5, 6.2, 'Cone com o vértice para cima, do lado do aparelho'));
          cfg.notas.push('A luz do aparelho fica de 2 a 6 m, na horizontal, das duas circulares; nunca acima da branca nem abaixo das de bordos (Anexo I, Seção 4(a)).');
        }
        if (o.seg) {
          cfg.luzes.push(L('G', 'be', 5.5, 3.1, 4.6, 'Luz de bordo de boreste', 'starboard sidelight', 'boreste'));
          cfg.luzes.push(L('R', 'bb', 5.5, -3.1, 4.6, 'Luz de bordo de bombordo', 'port sidelight', 'bombordo'));
          cfg.luzes.push(L('W', 'alc', -11.8, 0, 2.8, 'Luz de alcançado', 'sternlight', 'alcançado'));
        }
        cfg.marcas.push(M('cones-vertices', 5.5, 0, 9.4, 'Dois cones unidos pelos vértices'));
        cfg.diaTexto = 'Dois cones pretos unidos pelos vértices (Regra 26(c)(i))' + (o.aparelho ? ' e um cone com o vértice para cima do lado do aparelho (Regra 26(c)(ii)).' : '.');
        break;
      case 'reboque': {
        var gap = o.longo ? 52 : 28, T = 68 + gap, fT = T / 2 - 14, fB = -T / 2 + 20;
        cfg = base({ L: T, comp: 28, partes: [casco(fT, 28, 8, 2.4, 'navio'), caixa(fT + 2, fT + 7.5, 3.2, 2.4, 6), haste(fT + 4.5, 6, 17.2, 1.6), haste(fT - 6, 2.4, 9, 1.4),
          casco(fB, 40, 10, 2.0, 'barca'), caixa(fB - 16, fB + 15, 4.6, 2, 3.6), haste(fB - 17, 3.6, 5.6, 1),
          linha([[fT - 14, 0, 1.8], [(fT - 14 + fB + 20) / 2, 0, 0.5], [fB + 20, 0, 1.6]], 1.2)] }, {
          nome: 'Embarcação de propulsão mecânica rebocando pela popa', en: 'power-driven vessel towing astern', regra: o.restrito ? 'Regra 24(a), (e) e 27(c)' : 'Regra 24(a) e (e)', familia: 'reboque', familiaDia: o.longo ? 'reboqueLongo' : null,
          texto: 'Duas luzes de mastro na vertical — três se o reboque passar de 200 m, medidos da popa do rebocador até o fim do reboque —, luzes de bordos, luz de alcançado e, acima dela, a luz de reboque amarela, com o mesmo setor da de alcançado. A rebocada mostra bordos e alcançado.' });
        var zs = o.longo ? [12.5, 14.5, 16.5] : [12.5, 14.5];
        zs.forEach(function (z, i) { cfg.luzes.push(L('W', 'mastro', fT + 4.5, 0, z, 'Luz de mastro ' + (i + 1) + ' de ' + zs.length + ' (na vertical)', 'masthead light', 'mastro')); });
        cfg.luzes.push(L('G', 'be', fT + 3, 3.5, 5.5, 'Luz de bordo de boreste', 'starboard sidelight', 'boreste'));
        cfg.luzes.push(L('R', 'bb', fT + 3, -3.5, 5.5, 'Luz de bordo de bombordo', 'port sidelight', 'bombordo'));
        cfg.luzes.push(L('W', 'alc', fT - 13.6, 0, 3.2, 'Luz de alcançado', 'sternlight', 'alcançado'));
        cfg.luzes.push(L('Y', 'alc', fT - 13.6, 0, 5.2, 'Luz de reboque, amarela, acima da de alcançado', 'towing light', 'reboque'));
        cfg.luzes.push(L('G', 'be', fB + 19.5, 4.8, 2.6, 'Rebocada: luz de bordo de boreste', 'towed vessel sidelight', 'rebocada'));
        cfg.luzes.push(L('R', 'bb', fB + 19.5, -4.8, 2.6, 'Rebocada: luz de bordo de bombordo', 'towed vessel sidelight', 'rebocada'));
        cfg.luzes.push(L('W', 'alc', fB - 20, 0, 2.6, 'Rebocada: luz de alcançado', 'towed vessel sternlight', 'rebocada'));
        if (o.restrito) {
          coluna(cfg, fT + 4.5, [10.5, 8.5, 6.5], ['R', 'W', 'R'], ['Circular vermelha (superior)', 'Circular branca (meio)', 'Circular vermelha (inferior)'], ['vermelha', 'branca', 'vermelha']);
          cfg.marcas.push(M('bola', fT + 4.5, 0, 11.2, 'Bola'), M('losango', fT + 4.5, 0, 9, 'Losango'), M('bola', fT + 4.5, 0, 6.8, 'Bola'));
        }
        if (o.longo) cfg.marcas.push(M('losango', fT - 6, 0, 7.6, 'Losango no rebocador'), M('losango', fB - 17, 0, 4.6, 'Losango no fim do reboque'));
        cfg.diaTexto = o.longo ? 'Reboque com mais de 200 m: um losango preto no rebocador e outro no fim do reboque (Regra 24(a)(v) e (e)(iii)).' : 'Com reboque de até 200 m não há marca diurna.';
        if (o.restrito) cfg.diaTexto += ' Com restrição severa: também bola, losango e bola na vertical (Regra 27(c)).';
        cfg.notas.push('Nunca passe entre o rebocador e o rebocado: há um cabo entre eles, às vezes submerso. A distância na cena está encurtada.');
        break;
      }
      case 'pratico':
        cfg = base({ L: 16, comp: 16, partes: [casco(0, 16, 5, 1.8, 'barco'), caixa(-1, 4, 2.3, 1.8, 4), haste(1.5, 4, 8.9, 1.4), haste(7.4, 2.3, 3.9, 1)] }, {
          nome: o.fundeada ? 'Embarcação de praticagem em serviço, fundeada' : 'Embarcação de praticagem em serviço, em movimento', en: 'pilot vessel on pilotage duty', regra: o.fundeada ? 'Regra 29(a)(iii)' : 'Regra 29(a)', familia: 'pratico', direcional: !o.fundeada,
          texto: 'No topo do mastro, duas luzes circulares na vertical: branca sobre vermelha. Em movimento, também as luzes de bordos e de alcançado; fundeada, também a luz de fundeio. Fora de serviço, usa as luzes de uma embarcação do seu tamanho.' });
        coluna(cfg, 1.5, [8.6, 7.6], ['W', 'R'], ['Luz circular branca (superior)', 'Luz circular vermelha (inferior)'], ['circular branca', 'circular vermelha']);
        if (o.fundeada) cfg.luzes.push(L('W', 'circ', 7.4, 0, 3.7, 'Luz de fundeio', 'anchor light', 'fundeio'));
        else {
          cfg.luzes.push(L('G', 'be', 1.2, 2.4, 3.7, 'Luz de bordo de boreste', 'starboard sidelight', 'boreste'));
          cfg.luzes.push(L('R', 'bb', 1.2, -2.4, 3.7, 'Luz de bordo de bombordo', 'port sidelight', 'bombordo'));
          cfg.luzes.push(L('W', 'alc', -7.8, 0, 2.2, 'Luz de alcançado', 'sternlight', 'alcançado'));
        }
        if (o.fundeada) cfg.marcas.push(M('bola', 7.4, 0, 3.4, 'Bola de fundeio, à vante'));
        cfg.diaTexto = 'O RIPEAM não prevê marca diurna para a praticagem' + (o.fundeada ? ' (fundeada, mostra a bola de fundeio)' : '') + '. É usual a bandeira H do Código Internacional de Sinais: "tenho prático a bordo".';
        break;
      case 'sg':
        if (o.grande) {
          cfg = base(tplNavio(), {}); coluna(cfg, 25, [15, 13], ['R', 'R'], ['Luz circular vermelha (superior)', 'Luz circular vermelha (inferior)'], ['circular vermelha', 'circular vermelha']);
          if (o.seg) luzesNavioBordos(cfg);
          cfg.marcas.push(M('bola', 25, 0, 14.9, 'Bola'), M('bola', 25, 0, 12.6, 'Bola'));
        } else {
          cfg = base(tplCosteiro(), {}); coluna(cfg, 3, [10.5, 8.5], ['R', 'R'], ['Luz circular vermelha (superior)', 'Luz circular vermelha (inferior)'], ['circular vermelha', 'circular vermelha']);
          if (o.seg) luzesCosteiroPM(cfg, false);
          cfg.marcas.push(M('bola', 3, 0, 11, 'Bola'), M('bola', 3, 0, 8.8, 'Bola'));
        }
        Object.assign(cfg, { nome: 'Embarcação sem governo' + (o.seg ? ', com seguimento' : ', sem seguimento'), en: 'vessel not under command', regra: o.seg ? 'Regra 27(a)(i) e (iii)' : 'Regra 27(a)(i)', familia: 'sg', familiaDia: 'sg', direcional: !!o.seg,
          texto: 'Duas luzes circulares vermelhas na vertical, onde melhor possam ser vistas. Não acende luz de mastro, porque não consegue manobrar como as regras exigem. Se ainda tem seguimento, acende as luzes de bordos e de alcançado. De dia: duas bolas pretas na vertical.',
          diaTexto: 'Duas bolas pretas na vertical (Regra 27(a)(ii)).' });
        cfg.notas.push('No texto oficial brasileiro do RIPEAM a cor vermelha das luzes aparece como "encarnada".');
        break;
      case 'mr': {
        var sit = o.sit || 'seg';
        if (o.grande) {
          cfg = base(tplNavio(), {});
          coluna(cfg, 25, [15, 13, 11], ['R', 'W', 'R'], ['Luz circular vermelha (superior)', 'Luz circular branca (meio)', 'Luz circular vermelha (inferior)'], ['vermelha', 'branca', 'vermelha']);
          if (sit === 'seg') luzesNavioPM(cfg, true);
          if (sit === 'fundeada') { fundeioNavio(cfg); cfg.marcas.push(M('bola', 41, 0, 10.6, 'Bola de fundeio, à vante')); cfg.partes.push(linha([[45, 0, 7.4], [25, 0, 19.4]], 0.8)); }
          cfg.marcas.push(M('bola', 25, 0, 15.2, 'Bola'), M('losango', 25, 0, 12.9, 'Losango'), M('bola', 25, 0, 10.6, 'Bola'));
        } else {
          cfg = base(tplCosteiro(), {});
          coluna(cfg, 3, [10.5, 8.5, 6.5], ['R', 'W', 'R'], ['Luz circular vermelha (superior)', 'Luz circular branca (meio)', 'Luz circular vermelha (inferior)'], ['vermelha', 'branca', 'vermelha']);
          if (sit === 'seg') luzesCosteiroPM(cfg);
          if (sit === 'fundeada') { fundeioCosteiro(cfg); cfg.marcas.push(M('bola', 10, 0, 5, 'Bola de fundeio, à vante')); cfg.partes.push(linha([[14.5, 0, 3], [3, 0, 13]], 0.8)); }
          cfg.marcas.push(M('bola', 3, 0, 11, 'Bola'), M('losango', 3, 0, 9, 'Losango'), M('bola', 3, 0, 7, 'Bola'));
        }
        Object.assign(cfg, { nome: 'Embarcação com capacidade de manobra restrita' + (sit === 'seg' ? ', com seguimento' : sit === 'parada' ? ', sem seguimento' : ', fundeada'),
          en: 'vessel restricted in her ability to manoeuvre', regra: sit === 'seg' ? 'Regra 27(b)(i) e (iii)' : sit === 'fundeada' ? 'Regra 27(b)(i) e (iv)' : 'Regra 27(b)(i)', familia: 'mr', familiaDia: 'mr', direcional: sit === 'seg',
          texto: 'Três luzes circulares na vertical: vermelha, branca, vermelha. Com seguimento, acrescenta luz ou luzes de mastro, bordos e alcançado; fundeada, acrescenta as luzes de fundeio. É o caso de quem draga, lança cabo submarino, faz transferência em movimento ou opera aeronaves. De dia: bola, losango, bola.',
          diaTexto: 'Bola, losango e bola na vertical (Regra 27(b)(ii))' + (sit === 'fundeada' ? ', mais a bola de fundeio à vante (Regra 27(b)(iv)).' : '.') });
        break;
      }
      case 'cal':
        cfg = base(tplNavio(), { nome: 'Embarcação restrita devido ao seu calado', en: 'vessel constrained by her draught', regra: 'Regra 28', familia: 'cal', familiaDia: 'cal',
          texto: 'Além das luzes de propulsão mecânica, pode exibir três luzes circulares vermelhas na vertical. Só uma embarcação de propulsão mecânica pode usar este sinal (Regra 3(h)). As outras, exceto sem governo e manobra restrita, devem evitar impedir a sua passagem (Regra 18(d)). De dia: um cilindro.' });
        luzesNavioPM(cfg, true);
        coluna(cfg, 25, [15, 13, 11], ['R', 'R', 'R'], ['Luz circular vermelha (superior)', 'Luz circular vermelha (meio)', 'Luz circular vermelha (inferior)'], ['vermelha', 'vermelha', 'vermelha']);
        cfg.marcas.push(M('cilindro', 25, 0, 13.4, 'Cilindro'));
        cfg.diaTexto = 'Um cilindro preto (Regra 28).';
        break;
      case 'fundeada':
        if (o.grande) {
          cfg = base(tplNavio(), {}); fundeioNavio(cfg);
          cfg.marcas.push(M('bola', 41, 0, 10.6, 'Bola, à vante')); cfg.partes.push(linha([[45, 0, 7.4], [25, 0, 19.4]], 0.8));
          if (o.conves) for (var fx = -38; fx <= 38; fx += 7) cfg.luzes.push(L('W', 'circ', fx, 0, 6.6, 'Iluminação do convés', 'deck lights', null, { conves: true }));
        } else {
          cfg = base(tplCosteiro(), {}); fundeioCosteiro(cfg);
          cfg.marcas.push(M('bola', 10, 0, 5, 'Bola, à vante')); cfg.partes.push(linha([[14.5, 0, 3], [3, 0, 13]], 0.8));
        }
        Object.assign(cfg, { nome: 'Embarcação fundeada' + (o.grande ? ', 50 m ou mais' : ', menos de 50 m'), en: 'vessel at anchor', regra: o.grande ? 'Regra 30(a)' + (o.conves ? ' e (c)' : '') : 'Regra 30(b)', familia: 'fundeada', familiaDia: 'fundeada', direcional: false,
          texto: o.grande ? 'Uma luz circular branca à vante e outra, mais baixa, na popa. A de vante mais alta mostra para que lado está a proa. Com 100 m ou mais, deve também iluminar o convés (Regra 30(c)). De dia: uma bola à vante.' : 'Com menos de 50 m basta uma luz circular branca onde melhor possa ser vista (pode também usar as duas luzes das maiores). De dia: uma bola à vante.',
          diaTexto: 'Uma bola preta à vante (Regra 30(a)(i)).' });
        cfg.notas.push('Com menos de 7 m, fundeada fora de canal, fundeadouro ou rota usual, fica dispensada das luzes e da marca (Regra 30(e)).');
        break;
      case 'encalhada':
        if (o.grande) { cfg = base(tplNavio(), {}); fundeioNavio(cfg); coluna(cfg, 25, [15, 13], ['R', 'R'], ['Luz circular vermelha (superior)', 'Luz circular vermelha (inferior)'], ['circular vermelha', 'circular vermelha']); cfg.marcas.push(M('bola', 25, 0, 15.2, 'Bola'), M('bola', 25, 0, 12.9, 'Bola'), M('bola', 25, 0, 10.6, 'Bola')); }
        else { cfg = base(tplCosteiro(), {}); fundeioCosteiro(cfg); coluna(cfg, 3, [10.5, 8.5], ['R', 'R'], ['Luz circular vermelha (superior)', 'Luz circular vermelha (inferior)'], ['circular vermelha', 'circular vermelha']); cfg.marcas.push(M('bola', 3, 0, 11, 'Bola'), M('bola', 3, 0, 9, 'Bola'), M('bola', 3, 0, 7, 'Bola')); }
        Object.assign(cfg, { nome: 'Embarcação encalhada', en: 'vessel aground', regra: 'Regra 30(d)', familia: 'encalhada', familiaDia: 'encalhada', direcional: false,
          texto: 'As luzes de fundeio e, além delas, duas luzes circulares vermelhas na vertical. De dia: três bolas pretas na vertical. Atenção: ali há pouca água.',
          diaTexto: 'Três bolas pretas na vertical (Regra 30(d)(ii)).' });
        cfg.notas.push('Com menos de 12 m, fica dispensada das duas vermelhas e das três bolas (Regra 30(f)).');
        break;
    }
    cfg.tipo = tipo; cfg.o = o;
    if (!cfg.familiaDia && cfg.familiaDia !== null) cfg.familiaDia = cfg.marcas.length ? cfg.familia : null;
    return cfg;
  }

  /* Alcance mínimo das luzes (Regra 22), em milhas náuticas. */
  function alcance(comp, setor, c) {
    var g = comp >= 50 ? 0 : comp >= 12 ? 1 : 2;
    if (setor === 'mastro') return [6, comp < 20 ? 3 : 5, 2][g];
    if (setor === 'be' || setor === 'bb') return [3, 2, 1][g];
    return [3, 2, 2][g];
  }
  var COR_NOME = { W: 'branca', R: 'vermelha', G: 'verde', Y: 'amarela' };
  var COR_VAR = { W: '--nav-white', R: '--nav-red', G: '--nav-green', Y: '--nav-yellow' };

  /* Luzes visíveis num aspecto, já projetadas (x normalizado pelo comprimento exibido). */
  function visiveis(cfg, th) {
    var out = [];
    cfg.luzes.forEach(function (l) {
      var i = intensidade(l.setor, th);
      if (i > 0) { var q = proj(l.p, th); out.push({ l: l, i: i, x: q.x, z: q.z, d: q.d }); }
    });
    return out;
  }
  /* Assinatura visual: colunas de luzes (da esquerda para a direita), cores de cima para baixo. */
  function assinatura(cfg, th) {
    var v = visiveis(cfg, th).filter(function (a) { return a.i >= 0.5 && !a.l.conves; });
    var tol = 0.035 * cfg.L;
    v.sort(function (a, b) { return a.x - b.x; });
    var cols = [];
    v.forEach(function (a) { var c = cols[cols.length - 1]; if (c && Math.abs(a.x - c.x) < tol) c.l.push(a); else cols.push({ x: a.x, l: [a] }); });
    return cols.map(function (c) { return c.l.sort(function (a, b) { return b.z - a.z; }).map(function (a) { return a.l.c; }).join(''); }).join('|');
  }
  function assinaturaDia(cfg, th) {
    var v = cfg.marcas.map(function (m) { var q = proj(m.p, th); return { x: q.x, z: q.z, f: m.forma }; });
    v.sort(function (a, b) { return a.x - b.x; });
    return v.map(function (a) { return a.f; }).join('|') + '#' + v.length;
  }
  function categoriaAspecto(cfg, th) {
    var v = visiveis(cfg, th).filter(function (a) { return a.i >= 0.5; });
    var g = v.some(function (a) { return a.l.setor === 'be' && !/rebocada/i.test(a.l.nome); });
    var r = v.some(function (a) { return a.l.setor === 'bb' && !/rebocada/i.test(a.l.nome); });
    if (g && r) return 'proa';
    if (g) return 'be';
    if (r) return 'bb';
    if (v.some(function (a) { return a.l.setor === 'alc'; })) return 'popa';
    return 'nada';
  }
  var CAT = {
    proa: 'Vem na nossa direção: vemos as duas luzes de bordos',
    be: 'Mostra o boreste (luz verde): a proa dela aponta para a nossa direita',
    bb: 'Mostra o bombordo (luz vermelha): a proa dela aponta para a nossa esquerda',
    popa: 'Vemos a popa dela: só a luz de alcançado, nenhuma de bordo',
    nada: 'Não dá para saber o rumo: só há luzes circulares',
  };
  function descAspecto(th) {
    var r = n180(th), a = Math.abs(r), lado = r > 0 ? 'boreste' : 'bombordo';
    if (a < 2.5) return 'pela proa dela';
    if (a > 177.5) return 'pela popa dela';
    if (Math.abs(a - 90) < 2.5) return 'pelo través de ' + lado + ' dela';
    if (a < 90) return 'pela bochecha de ' + lado + ' dela';
    return 'pela alheta de ' + lado + ' dela';
  }
  function descRumo(th) {
    var r = n180(th), a = Math.abs(r);
    if (a < 2.5) return 'A proa dela aponta direto para nós.';
    if (a > 177.5) return 'A popa está voltada para nós: ela se afasta, ou nós a alcançamos.';
    return 'A proa dela aponta para a nossa ' + (r > 0 ? 'direita' : 'esquerda') + (a < 87 ? ', aproximando-se da nossa linha.' : a > 93 ? ', afastando-se de nós.' : '.');
  }

  /* Variantes usadas no desafio. */
  var VAR_NOITE = [['pm50'], ['pm'], ['pm12', { circ12: true }], ['vela'], ['vela', { tricolor: true }], ['vela', { rv: true }], ['hover'],
    ['arrasto'], ['arrasto', { seg: false }], ['arrasto', { mastroArr: true }], ['pesca'], ['pesca', { seg: true }], ['pesca', { aparelho: true }],
    ['reboque'], ['reboque', { longo: true }], ['pratico'], ['pratico', { fundeada: true }], ['sg'], ['sg', { seg: true }], ['sg', { grande: false, seg: true }],
    ['mr', { sit: 'seg' }], ['mr', { sit: 'parada' }], ['mr', { sit: 'fundeada' }], ['cal'], ['fundeada'], ['fundeada', { grande: true }], ['encalhada'], ['encalhada', { grande: false }], ['velamotor']];
  var VAR_DIA = [['velamotor'], ['arrasto'], ['pesca', { aparelho: true }], ['reboque', { longo: true }], ['sg'], ['mr', { sit: 'seg' }], ['cal'], ['fundeada', { grande: true }], ['encalhada']];

  function gerarDesafio() {
    var dia = Math.random() < 0.22;
    for (var tent = 0; tent < 80; tent++) {
      var v = sortear(dia ? VAR_DIA : VAR_NOITE);
      var cfg = montar(v[0], v[1] || {});
      var fam = dia ? cfg.familiaDia : cfg.familia;
      if (!fam || fam === 'remo') continue;
      var cat = sortear(['proa', 'be', 'be', 'bb', 'bb', 'popa', 'popa']);
      var th = cat === 'proa' ? aleat(-1.2, 1.2) : cat === 'be' ? aleat(10, 104) : cat === 'bb' ? aleat(256, 350) : aleat(122, 238);
      th = n360(th);
      var sig = dia ? assinaturaDia(cfg, th) : assinatura(cfg, th);
      if (!sig || sig === '#0') continue;
      var conflito = false, outras = {};
      (dia ? VAR_DIA : VAR_NOITE).forEach(function (w) {
        var c2 = montar(w[0], w[1] || {});
        var f2 = dia ? c2.familiaDia : c2.familia;
        if (!f2 || f2 === fam) return;
        var s2 = dia ? assinaturaDia(c2, th) : assinatura(c2, th);
        if (s2 === sig) conflito = true; else outras[f2] = 1;
      });
      if (conflito) continue;
      var dist = VL.embaralhar(Object.keys(outras)).slice(0, 3);
      if (dist.length < 3) continue;
      return { cfg: cfg, th: th, dia: dia, fam: fam, opcoes: VL.embaralhar(dist.concat([fam])), cat: dia ? null : categoriaAspecto(cfg, th) };
    }
    var c = montar('pm50', {});
    return { cfg: c, th: 40, dia: false, fam: 'pm', opcoes: VL.embaralhar(['pm', 'vela', 'arrasto', 'reboque']), cat: categoriaAspecto(c, 40) };
  }

  /* ---------- Desenho do arco (rosa de setores) ---------- */
  function pt(cx, cy, r, a) { return [cx + r * Math.sin(a * D2R), cy - r * Math.cos(a * D2R)]; }
  function arco(cx, cy, r, a1, a2) {
    var p1 = pt(cx, cy, r, a1), p2 = pt(cx, cy, r, a2), grande = ((a2 - a1 + 360) % 360) > 180 ? 1 : 0;
    return 'M' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + grande + ' 1 ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
  }

  VL.widgets.define('ripeam-luzes', {
    css: ['assets/css/widgets/ripeam-luzes.css'],
    mount: function (el, opts) {
      opts = opts || {};
      var uid = 'rpl' + (++seq) + '-';
      var est = {
        modo: opts.modo === 'desafio' ? 'desafio' : 'explorar',
        dia: !!opts.dia, silhueta: opts.silhueta !== false, nomes: opts.nomes !== false,
        tipo: TIPOS[opts.tipo] ? opts.tipo : 'pm50', o: {}, th: typeof opts.aspecto === 'number' ? n360(opts.aspecto) : 35,
      };
      est.o = opcoesPadrao(est.tipo, opts.opcoes || {});
      var cfg = montar(est.tipo, est.o);
      var des = { n: 0, acertos: 0, total: 0, item: null, etapa: 0, revelar: false };
      var dims = { w: 800, h: 450 };

      /* ---------- Estrutura ---------- */
      var ins = VL.ui.instrumento({ titulo: opts.titulo || 'Luzes e marcas: o que você vê, do seu barco', controlesAntes: true });
      ins.raiz.classList.add('rpl-raiz');
      var svg = h('svg', { class: 'rpl-cena', role: 'img', 'aria-label': 'Cena', xmlns: 'http://www.w3.org/2000/svg' });
      var cenaWrap = h('div', { class: 'rpl-cena-wrap' }, svg, h('p', { class: 'rpl-dica-cena', 'aria-hidden': 'true' }, 'Arraste a cena para girar a embarcação'));
      var painel = h('div', { class: 'rpl-painel', 'aria-live': 'polite' });

      // Barra de ferramentas (acima da cena)
      var segModo = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Modo' });
      [['explorar', 'Explorar'], ['desafio', 'Desafio']].forEach(function (m) {
        segModo.appendChild(h('button', { type: 'button', 'data-v': m[0], onclick: function () { trocarModo(m[0]); } }, m[1]));
      });
      var segDia = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Hora do dia' });
      [['noite', 'Noite'], ['dia', 'Dia']].forEach(function (m) {
        segDia.appendChild(h('button', { type: 'button', 'data-v': m[0], onclick: function () { if (est.modo === 'desafio') return; est.dia = m[0] === 'dia'; tudo(); } }, m[1]));
      });
      function sw(rotulo, val, fn) {
        var inp = h('input', { type: 'checkbox', role: 'switch' }); inp.checked = !!val;
        inp.addEventListener('change', function () { fn(inp.checked); });
        return { el: h('label', { class: 'switch rpl-switch' }, inp, h('span', null, rotulo)), inp: inp };
      }
      var swSil = sw('Silhueta', est.silhueta, function (v) { est.silhueta = v; desenhar(); });
      var swNomes = sw('Nomes', est.nomes, function (v) { est.nomes = v; desenhar(); });
      ins.controles.appendChild(h('div', { class: 'rpl-linha' }, segModo, segDia, swSil.el, swNomes.el));

      // Tipo de embarcação e opções
      var sel = h('select', { class: 'rpl-sel', 'aria-label': 'Tipo de embarcação' });
      GRUPOS.forEach(function (g, gi) {
        var og = h('optgroup', { label: g });
        Object.keys(TIPOS).forEach(function (k) { if (TIPOS[k].grupo === gi) og.appendChild(h('option', { value: k }, TIPOS[k].rotulo)); });
        sel.appendChild(og);
      });
      sel.value = est.tipo;
      sel.addEventListener('change', function () { est.tipo = sel.value; est.o = opcoesPadrao(est.tipo, {}); montarOpcoes(); reconfigurar(); });
      var caixaOpcoes = h('div', { class: 'rpl-opcoes' });
      var blocoTipo = h('div', { class: 'rpl-tipo' }, h('label', { class: 'rpl-campo' }, h('span', { class: 'rpl-rot' }, 'Embarcação'), sel), caixaOpcoes);

      // Aspecto: rosa de setores arrastável + controle deslizante
      var dial = h('svg', { class: 'rpl-dial', viewBox: '0 0 140 140', role: 'slider', tabindex: '0', 'aria-label': 'Aspecto: de onde vemos a outra embarcação, em graus a partir da proa dela', 'aria-valuemin': '0', 'aria-valuemax': '359' });
      var faixa = h('input', { type: 'range', min: '0', max: '359', step: '1', class: 'rpl-faixa', 'aria-label': 'Aspecto em graus, a partir da proa dela' });
      var leitura = h('div', { class: 'rpl-leitura' });
      var blocoAspecto = h('div', { class: 'rpl-aspecto' }, dial, h('div', { class: 'rpl-aspecto-txt' }, h('span', { class: 'rpl-rot' }, 'Aspecto: de onde vemos a outra'), faixa, leitura));
      var blocoLuzes = h('div', { class: 'rpl-luzes' });

      ins.corpo.appendChild(h('div', { class: 'rpl-grade' }, cenaWrap, h('div', { class: 'rpl-lado' }, blocoTipo, painel), blocoAspecto, blocoLuzes));
      ins.legenda.appendChild(h('span', { class: 'rpl-fonte' }, 'RIPEAM-72, Regras 20 a 31 e Anexo I (texto promulgado pelos Decretos 80.068/1977 e 10.901/2021)'));
      el.appendChild(ins.raiz);

      faixa.addEventListener('input', function () { est.th = Number(faixa.value); desenhar(); });

      /* ---------- Opções contextuais ---------- */
      function montarOpcoes() {
        caixaOpcoes.innerHTML = '';
        (TIPOS[est.tipo].opcoes || []).forEach(function (op) {
          if (op.so && !est.o[op.so]) return;
          if (op.tipo === 'seg') {
            var g = h('div', { class: 'segmented rpl-seg-op', role: 'group', 'aria-label': op.rotulo });
            op.valores.forEach(function (v) {
              g.appendChild(h('button', { type: 'button', 'aria-pressed': String(est.o[op.k] === v[0]), onclick: function () { est.o[op.k] = v[0]; montarOpcoes(); reconfigurar(); } }, v[1]));
            });
            caixaOpcoes.appendChild(g);
          } else {
            var s = sw(op.rotulo, est.o[op.k], function (val) {
              est.o[op.k] = val;
              if (val && op.exclui) est.o[op.exclui] = false;
              montarOpcoes(); reconfigurar();
            });
            caixaOpcoes.appendChild(s.el);
          }
        });
      }

      /* ---------- Cena: fundo ---------- */
      var gFundo = h('g'), gDin = h('g'), defs = h('defs');
      svg.appendChild(defs); svg.appendChild(gFundo); svg.appendChild(gDin);
      (function criarDefs() {
        var s = '';
        s += '<linearGradient id="' + uid + 'ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--rpl-ceu-a)"/><stop offset="1" style="stop-color:var(--rpl-ceu-b)"/></linearGradient>';
        s += '<linearGradient id="' + uid + 'mar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--rpl-mar-a)"/><stop offset="1" style="stop-color:var(--rpl-mar-b)"/></linearGradient>';
        ['W', 'R', 'G', 'Y'].forEach(function (c) {
          s += '<radialGradient id="' + uid + 'halo' + c + '"><stop offset="0" style="stop-color:var(' + COR_VAR[c] + ');stop-opacity:.75"/><stop offset=".35" style="stop-color:var(' + COR_VAR[c] + ');stop-opacity:.28"/><stop offset="1" style="stop-color:var(' + COR_VAR[c] + ');stop-opacity:0"/></radialGradient>';
          s += '<linearGradient id="' + uid + 'refl' + c + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(' + COR_VAR[c] + ');stop-opacity:.55"/><stop offset="1" style="stop-color:var(' + COR_VAR[c] + ');stop-opacity:0"/></linearGradient>';
        });
        defs.innerHTML = s;
      })();
      var estrelas = [];
      for (var i = 0; i < 46; i++) estrelas.push([Math.random(), Math.random() * 0.92, Math.random() < 0.15 ? 1.3 : 0.8, 0.25 + Math.random() * 0.5]);
      var ondas = [];
      for (var j = 0; j < 26; j++) ondas.push([Math.random(), Math.random(), 0.04 + Math.random() * 0.12]);

      function desenharFundo() {
        var W = dims.w, H = dims.h, yh = Math.round(H * 0.54), s = '';
        s += '<rect x="0" y="0" width="' + W + '" height="' + (yh + 1) + '" fill="url(#' + uid + 'ceu)"/>';
        s += '<rect x="0" y="' + yh + '" width="' + W + '" height="' + (H - yh) + '" fill="url(#' + uid + 'mar)"/>';
        if (!est.dia) estrelas.forEach(function (e) { s += '<circle class="rpl-estrela" cx="' + (e[0] * W).toFixed(1) + '" cy="' + (e[1] * yh).toFixed(1) + '" r="' + e[2] + '" opacity="' + e[3].toFixed(2) + '"/>'; });
        ondas.forEach(function (o) { var y = yh + 6 + o[1] * (H - yh - 10), x = o[0] * W, w = o[2] * W * (0.5 + (y - yh) / (H - yh)); s += '<line class="rpl-onda" x1="' + x.toFixed(1) + '" y1="' + y.toFixed(1) + '" x2="' + (x + w).toFixed(1) + '" y2="' + y.toFixed(1) + '"/>'; });
        s += '<line class="rpl-horizonte" x1="0" y1="' + yh + '" x2="' + W + '" y2="' + yh + '"/>';
        gFundo.innerHTML = s;
        svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
        svg.setAttribute('data-periodo', est.dia ? 'dia' : 'noite');
      }

      /* ---------- Cena: embarcação ---------- */
      function escala() {
        var W = dims.w, H = dims.h, y0 = Math.round(H * 0.79);
        var sx = (W * (W < 480 ? 0.86 : 0.74)) / cfg.L;
        var maxZ = 0, gap = 99;
        var pontos = cfg.luzes.map(function (l) { return l.p; }).concat(cfg.marcas.map(function (m) { return m.p; }));
        pontos.forEach(function (p, a) {
          maxZ = Math.max(maxZ, p[2]);
          pontos.forEach(function (q, b) { if (b > a && Math.abs(p[0] - q[0]) < 0.6 && Math.abs(p[1] - q[1]) < 0.6 && Math.abs(p[2] - q[2]) > 0.05) gap = Math.min(gap, Math.abs(p[2] - q[2])); });
        });
        cfg.partes.forEach(function (pp) { pp.pts.forEach(function (p) { maxZ = Math.max(maxZ, p[2]); }); });
        var sz = Math.max(sx, gap < 99 ? 15 / gap : sx);
        sz = Math.min(sz, (y0 - 20) / maxZ);
        sz = Math.max(sz, Math.min(sx, (y0 - 20) / maxZ));
        return { sx: sx, sz: sz, y0: y0, cx: W / 2, ex: sz / sx };
      }

      function desenhar() {
        var th = est.modo === 'desafio' && des.item ? des.item.th : est.th;
        var dia = est.modo === 'desafio' && des.item ? des.item.dia : est.dia;
        var E = escala(), s = '';
        function X(q) { return E.cx + q.x * E.sx; }
        function Y(z) { return E.y0 - z * E.sz; }
        // Silhueta
        var mostrarSil = dia || est.silhueta;
        if (mostrarSil) {
          s += '<g class="rpl-sil' + (dia ? ' rpl-sil-dia' : '') + '">';
          cfg.partes.forEach(function (pp) {
            var pr = pp.pts.map(function (p) { var q = proj(p, th); return [X(q), Y(q.z)]; });
            if (pp.t === 'solido') s += '<polygon points="' + envoltoria(pr).map(function (a) { return a[0].toFixed(1) + ',' + a[1].toFixed(1); }).join(' ') + '"/>';
            else if (pp.t === 'vela') s += '<polygon class="rpl-vela" points="' + pr.map(function (a) { return a[0].toFixed(1) + ',' + a[1].toFixed(1); }).join(' ') + '"/>';
            else s += '<polyline class="rpl-haste" style="stroke-width:' + Math.max(1.5, pp.w * Math.min(1.6, E.sx / 6)).toFixed(1) + 'px" points="' + pr.map(function (a) { return a[0].toFixed(1) + ',' + a[1].toFixed(1); }).join(' ') + '"/>';
          });
          s += '</g>';
        }
        var vis = visiveis(cfg, th);
        if (!dia) {
          // ordena: mais longe primeiro
          vis.sort(function (a, b) { return a.d - b.d; });
          var pos = vis.map(function (v) { return { v: v, x: X(v), y: Y(v.z) }; });
          // luzes no mesmo ponto (lanterna combinada/tricolor): lado a lado
          pos.forEach(function (a, ia) { pos.forEach(function (b, ib) { if (ib > ia && Math.abs(a.x - b.x) < 2 && Math.abs(a.y - b.y) < 2) { a.x -= 3.2; b.x += 3.2; } }); });
          var rh = Math.max(14, Math.min(26, dims.w / 30)), rc = Math.max(2.6, Math.min(3.8, dims.w / 210));
          var refl = '', halos = '', nucleos = '';
          pos.forEach(function (p) {
            var c = p.v.l.c, I = p.v.i, conves = p.v.l.conves;
            var cls = p.v.l.pisca ? ' class="rpl-pisca"' : '';
            if (conves) { nucleos += '<circle class="rpl-conves" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="1.6"/>'; return; }
            var hl = rh * (p.v.l.setor === 'mastro' ? 1.15 : 1);
            refl += '<rect' + cls + ' x="' + (p.x - 1.6).toFixed(1) + '" y="' + (E.y0 + 2) + '" width="3.2" height="' + Math.min(70, (E.y0 - p.y) * 0.8 + 14).toFixed(1) + '" fill="url(#' + uid + 'refl' + c + ')" opacity="' + (0.7 * I).toFixed(2) + '"/>';
            halos += '<circle' + cls + ' cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + hl.toFixed(1) + '" fill="url(#' + uid + 'halo' + c + ')" opacity="' + I.toFixed(2) + '"/>';
            nucleos += '<g' + cls + ' opacity="' + I.toFixed(2) + '"><circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + rc.toFixed(1) + '" style="fill:var(' + COR_VAR[c] + ')"/>' +
              '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + (rc * 0.45).toFixed(1) + '" class="rpl-nucleo"/></g>';
          });
          s += '<g class="rpl-refl">' + refl + '</g><g class="rpl-halos">' + halos + '</g><g>' + nucleos + '</g>';
          // nomes
          var mostrarNomes = (est.modo === 'explorar' && est.nomes) || (est.modo === 'desafio' && des.revelar);
          if (mostrarNomes) {
            var rots = [];
            pos.slice().sort(function (a, b) { return a.y - b.y; }).forEach(function (p) {
              if (!p.v.l.rot || p.v.i < 0.5) return;
              if (rots.some(function (r) { return r.t === p.v.l.rot && Math.abs(r.px - p.x) < 10 && Math.abs(r.py - p.y) < 10; })) return;
              var txt = p.v.l.rot, w = txt.length * 6.6 + 8;
              var lx = p.x + 12, ly = p.y + 4;
              if (lx + w > dims.w - 4) lx = p.x - 12 - w;
              rots.forEach(function (r) { if (Math.abs(r.y - ly) < 14 && lx < r.x + r.w && lx + w > r.x) ly = r.y + 14; });
              rots.push({ x: lx, y: ly, w: w, px: p.x, py: p.y, t: txt });
            });
            rots.forEach(function (r) {
              var ax = r.x > r.px ? r.x - 2 : r.x + r.w + 2;
              s += '<line class="rpl-guia" x1="' + r.px.toFixed(1) + '" y1="' + r.py.toFixed(1) + '" x2="' + ax.toFixed(1) + '" y2="' + (r.y - 4).toFixed(1) + '"/>';
              s += '<text class="rpl-rotulo" x="' + (r.x + 4).toFixed(1) + '" y="' + r.y.toFixed(1) + '">' + VL.esc(r.t) + '</text>';
            });
          }
        } else {
          var u = Math.max(14, Math.min(24, E.sx * 0.9));
          cfg.marcas.forEach(function (m) {
            var q = proj(m.p, th), x = X(q), y = Y(q.z);
            s += '<g class="rpl-marca">' + formaSVG(m.forma, x, y, u) + '</g>';
          });
          if (est.modo === 'explorar' && est.nomes) cfg.marcas.forEach(function (m) {
            var q = proj(m.p, th), x = X(q) + u + 6, y = Y(q.z) + 4;
            s += '<text class="rpl-rotulo rpl-rotulo-dia" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '">' + VL.esc(MARCA_NOME[m.forma]) + '</text>';
          });
        }
        if (E.ex > 1.25) s += '<text class="rpl-nota-escala" x="' + (dims.w - 8) + '" y="' + (dims.h - 8) + '" text-anchor="end">alturas fora de escala, para leitura</text>';
        gDin.innerHTML = s;
        atualizarDial(th);
        atualizarAria(th, dia, vis);
        if (est.modo === 'explorar') atualizarVisiveis(th);
      }

      function formaSVG(f, x, y, u) {
        var r = u / 2;
        function P(a) { return a.map(function (q) { return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' '); }
        switch (f) {
          case 'bola': return '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r.toFixed(1) + '"/>';
          case 'cilindro': return '<rect x="' + (x - r).toFixed(1) + '" y="' + (y - u).toFixed(1) + '" width="' + u.toFixed(1) + '" height="' + (2 * u).toFixed(1) + '"/>';
          case 'cone-baixo': return '<polygon points="' + P([[x - r, y - r], [x + r, y - r], [x, y + r]]) + '"/>';
          case 'cone-cima': return '<polygon points="' + P([[x - r, y + r], [x + r, y + r], [x, y - r]]) + '"/>';
          case 'losango': return '<polygon points="' + P([[x, y - u], [x + r, y], [x, y + u], [x - r, y]]) + '"/>';
          case 'cones-vertices': return '<polygon points="' + P([[x - r, y - u], [x + r, y - u], [x, y]]) + '"/><polygon points="' + P([[x, y], [x + r, y + u], [x - r, y + u]]) + '"/>';
        }
        return '';
      }

      /* ---------- Rosa de setores (vista de cima) ---------- */
      (function criarDial() {
        var c = 70, s = '';
        s += '<circle cx="70" cy="70" r="66" class="rpl-dial-fundo"/>';
        s += '<path d="' + arco(c, c, 54, 247.5, 112.5) + '" class="rpl-dial-arco rpl-dial-mastro"/>';
        s += '<path d="' + arco(c, c, 46, 0, 112.5) + '" class="rpl-dial-arco" style="stroke:var(--nav-green)"/>';
        s += '<path d="' + arco(c, c, 46, 247.5, 360) + '" class="rpl-dial-arco" style="stroke:var(--nav-red)"/>';
        s += '<path d="' + arco(c, c, 46, 112.5, 247.5) + '" class="rpl-dial-arco" style="stroke:var(--nav-white)"/>';
        [0, 112.5, 247.5].forEach(function (a) { var p1 = pt(c, c, 30, a), p2 = pt(c, c, 62, a); s += '<line class="rpl-dial-lim" x1="' + p1[0].toFixed(1) + '" y1="' + p1[1].toFixed(1) + '" x2="' + p2[0].toFixed(1) + '" y2="' + p2[1].toFixed(1) + '"/>'; });
        s += '<path class="rpl-dial-barco" d="M70 50 C76 58 77 70 76 86 L64 86 C63 70 64 58 70 50 Z"/>';
        s += '<text class="rpl-dial-txt" x="70" y="44" text-anchor="middle">proa</text>';
        s += '<g class="rpl-dial-nos"><line x1="70" y1="70" x2="70" y2="70" class="rpl-dial-visada"/><circle r="10.5" class="rpl-dial-marcador"/><text class="rpl-dial-nos-txt" text-anchor="middle" dy="3.4">nós</text></g>';
        dial.innerHTML = s;
      })();
      function atualizarDial(th) {
        var p = pt(70, 70, 58, th), g = dial.querySelector('.rpl-dial-nos');
        g.querySelector('circle').setAttribute('cx', p[0].toFixed(1)); g.querySelector('circle').setAttribute('cy', p[1].toFixed(1));
        g.querySelector('text').setAttribute('x', p[0].toFixed(1)); g.querySelector('text').setAttribute('y', p[1].toFixed(1));
        var ln = g.querySelector('line'); ln.setAttribute('x2', p[0].toFixed(1)); ln.setAttribute('y2', p[1].toFixed(1));
        dial.setAttribute('aria-valuenow', String(Math.round(th) % 360));
        dial.setAttribute('aria-valuetext', graus(th) + ', ' + descAspecto(th));
        if (est.modo === 'explorar') {
          faixa.value = String(Math.round(th) % 360);
          leitura.innerHTML = '<strong>' + graus(th) + '</strong> — vemos ' + descAspecto(th) + '. ' + descRumo(th) + avisoFronteira(th);
        }
      }
      function avisoFronteira(th) {
        var a = Math.abs(n180(th));
        if (Math.abs(a - 112.5) < 3.5 || a < 2.5) return ' <span class="rpl-fronteira">Na fronteira entre setores as luzes se sobrepõem ou somem por 1 a 5 graus (Anexo I, Seção 9).</span>';
        return '';
      }
      function angDoPonteiro(ev) {
        var r = dial.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width * 140 - 70, y = (ev.clientY - r.top) / r.height * 140 - 70;
        return n360(Math.atan2(x, -y) / D2R);
      }
      var arrastandoDial = false;
      dial.addEventListener('pointerdown', function (ev) { if (est.modo !== 'explorar') return; arrastandoDial = true; try { dial.setPointerCapture(ev.pointerId); } catch (e) { /* sem captura */ } est.th = Math.round(angDoPonteiro(ev)); desenhar(); ev.preventDefault(); });
      dial.addEventListener('pointermove', function (ev) { if (!arrastandoDial) return; est.th = Math.round(angDoPonteiro(ev)); desenhar(); });
      dial.addEventListener('pointerup', function () { arrastandoDial = false; });
      dial.addEventListener('pointercancel', function () { arrastandoDial = false; });
      dial.addEventListener('keydown', function (ev) {
        if (est.modo !== 'explorar') return;
        var passo = ev.shiftKey ? 1 : 5, m = { ArrowRight: passo, ArrowUp: passo, ArrowLeft: -passo, ArrowDown: -passo, PageUp: 22.5, PageDown: -22.5 }[ev.key];
        if (ev.key === 'Home') { est.th = 0; desenhar(); ev.preventDefault(); return; }
        if (m) { est.th = n360(Math.round(est.th + m)); desenhar(); ev.preventDefault(); }
      });
      // arrastar a cena na horizontal gira a embarcação
      var arr = null;
      svg.addEventListener('pointerdown', function (ev) { if (est.modo !== 'explorar') return; arr = { x: ev.clientX, th: est.th, id: ev.pointerId }; });
      svg.addEventListener('pointermove', function (ev) {
        if (!arr || arr.id !== ev.pointerId) return;
        var dx = ev.clientX - arr.x;
        if (Math.abs(dx) > 4) { try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* ok */ } }
        est.th = n360(Math.round(arr.th + dx * 0.5)); desenhar();
      });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) { svg.addEventListener(t, function () { arr = null; }); });

      function atualizarAria(th, dia, vis) {
        var txt;
        if (dia) txt = 'Cena de dia. ' + (cfg.marcas.length ? 'Marcas: ' + cfg.marcas.map(function (m) { return MARCA_NOME[m.forma]; }).join(', ') + '.' : 'Nenhuma marca diurna.');
        else {
          var v = vis.filter(function (a) { return a.i >= 0.5 && !a.l.conves; }).sort(function (a, b) { return b.z - a.z; });
          txt = 'Cena noturna. Luzes visíveis, de cima para baixo: ' + (v.length ? v.map(function (a) { return COR_NOME[a.l.c]; }).join(', ') : 'nenhuma') + '.';
        }
        if (est.modo === 'explorar') txt = cfg.nome + '. Vista ' + descAspecto(th) + '. ' + txt;
        svg.setAttribute('aria-label', txt);
      }

      /* ---------- Painel (modo explorar) ---------- */
      var listaVis = null;
      function painelExplorar() {
        painel.innerHTML = '';
        painel.appendChild(h('h3', { class: 'rpl-titulo', html: VL.esc(cfg.nome) + en(cfg.en) }));
        painel.appendChild(h('p', { class: 'rpl-regra' }, h('span', { class: 'chip' }, 'RIPEAM, ' + cfg.regra)));
        painel.appendChild(h('p', { class: 'rpl-texto' }, cfg.texto));
        if (est.dia) {
          painel.appendChild(h('h4', { class: 'rpl-sub' }, 'De dia'));
          painel.appendChild(h('p', { class: 'rpl-texto' }, cfg.diaTexto || 'Sem marca diurna.'));
          painel.appendChild(h('p', { class: 'rpl-miudo' }, 'Marcas são pretas. Bola com 0,6 m de diâmetro ou mais; cone com base de 0,6 m e altura igual; cilindro com o dobro da altura; losango são dois cones unidos pela base; 1,5 m entre marcas. Abaixo de 20 m podem ser menores (Anexo I, Seção 6). As regras de luzes valem do pôr ao nascer do sol e, de dia, com visibilidade restrita (Regra 20).'));
        }
        blocoLuzes.innerHTML = '';
        if (!est.dia) {
          blocoLuzes.appendChild(h('h4', { class: 'rpl-sub' }, 'Luzes desta situação'));
          listaVis = h('ul', { class: 'rpl-lista' });
          blocoLuzes.appendChild(listaVis);
        } else listaVis = null;
        cfg.notas.forEach(function (n) { painel.appendChild(h('p', { class: 'rpl-nota' }, n)); });
        if (!est.dia) painel.appendChild(h('details', { class: 'rpl-como' }, h('summary', null, 'Como funcionam os setores'),
          h('p', null, 'Cada luz só aparece num arco do horizonte (Regra 21). A de mastro cobre 225°: da proa até 22,5° por ante a ré do través, dos dois lados. Cada luz de bordo cobre 112,5°: da proa até 22,5° por ante a ré do través do seu lado — verde a boreste, vermelha a bombordo. A de alcançado cobre os 135° que sobram, pela popa. Circulares cobrem 360°.'),
          h('p', null, 'Na rosa ao lado da cena, a embarcação está no centro com a proa para cima, e o ponto magenta é o nosso barco. Arraste o ponto, a cena ou o controle deslizante.')));
        atualizarVisiveis(est.th);
      }
      function atualizarVisiveis(th) {
        if (!listaVis || est.dia || est.modo !== 'explorar') return;
        listaVis.innerHTML = '';
        var vistos = {};
        cfg.luzes.forEach(function (l) {
          if (l.conves) { if (vistos.conves) return; vistos.conves = 1; }
          var I = intensidade(l.setor, th);
          var li = h('li', { class: 'rpl-item', 'data-vis': I > 0 ? '1' : '0' },
            h('span', { class: 'rpl-bolinha', style: { background: 'var(' + COR_VAR[l.c] + ')' }, 'aria-hidden': 'true' }),
            h('span', { class: 'rpl-item-txt', html: '<strong>' + VL.esc(l.nome) + '</strong>' + en(l.en) + '<span class="rpl-miudo">' + (l.conves ? 'luzes de trabalho' : 'setor ' + SETOR_TXT[l.setor] + '; alcance mínimo ' + alcance(cfg.comp, l.setor, l.c) + ' milhas (Regra 22)') + (l.pisca ? '; 120 ou mais lampejos por minuto' : '') + '</span>' }),
            h('span', { class: 'rpl-estado' }, I > 0 ? (I < 1 ? 'no limite' : 'visível') : 'não vemos'));
          listaVis.appendChild(li);
        });
      }

      /* ---------- Desafio ---------- */
      function novoDesafio() {
        des.item = gerarDesafio(); des.etapa = 1; des.revelar = false; des.n++;
        cfg = des.item.cfg;
        desenharFundoPara(des.item.dia);
        desenhar(); painelDesafio();
      }
      function desenharFundoPara(dia) { var d = est.dia; est.dia = dia; desenharFundo(); est.dia = d; }
      function painelDesafio(feedback) {
        var it = des.item;
        painel.innerHTML = '';
        painel.appendChild(h('p', { class: 'rpl-placar' }, placarTxt()));
        if (des.etapa === 1) {
          painel.appendChild(h('h3', { class: 'rpl-titulo' }, it.dia ? 'De dia, você vê estas marcas. Que embarcação é?' : 'À noite, você vê estas luzes. Que embarcação é?'));
          var ul = h('div', { class: 'rpl-opcs', role: 'group', 'aria-label': 'Alternativas' });
          it.opcoes.forEach(function (f) {
            ul.appendChild(h('button', { type: 'button', class: 'rpl-opc', onclick: function () { responder1(f, ul); } }, FAM[f]));
          });
          painel.appendChild(ul);
        } else if (des.etapa === 2) {
          painel.appendChild(h('h3', { class: 'rpl-titulo' }, 'E para onde ela aponta, em relação a nós?'));
          var ul2 = h('div', { class: 'rpl-opcs', role: 'group', 'aria-label': 'Alternativas' });
          ['proa', 'be', 'bb', 'popa', 'nada'].forEach(function (k) {
            ul2.appendChild(h('button', { type: 'button', class: 'rpl-opc', onclick: function () { responder2(k, ul2); } }, CAT[k]));
          });
          painel.appendChild(ul2);
        }
        if (feedback) painel.appendChild(feedback);
      }
      function placarTxt() { return 'Situação ' + des.n + ' · acertos: ' + des.acertos + ' de ' + des.total; }
      function atualizarPlacar() { var p = VL.$('.rpl-placar', painel); if (p) p.textContent = placarTxt(); }
      function marcar(ul, certo, escolhido, rotulos) {
        atualizarPlacar();
        VL.$$('.rpl-opc', ul).forEach(function (b) {
          b.disabled = true;
          if (b.textContent === rotulos[certo]) b.setAttribute('data-res', 'certa');
          else if (b.textContent === rotulos[escolhido]) b.setAttribute('data-res', 'errada');
        });
      }
      function responder1(f, ul) {
        var it = des.item, ok = f === it.fam;
        des.total++; if (ok) des.acertos++;
        marcar(ul, it.fam, f, FAM);
        des.revelar = true; desenhar();
        var corpo = h('div', null,
          h('p', { class: 'rpl-res', 'data-ok': ok ? '1' : '0' }, ok ? 'Certo.' : 'Não. É: ' + FAM[it.fam] + '.'),
          h('p', { html: '<strong>' + VL.esc(it.cfg.nome) + '</strong>' + en(it.cfg.en) + ' — RIPEAM, ' + VL.esc(it.cfg.regra) + '.' }),
          h('p', null, it.dia ? it.cfg.diaTexto : it.cfg.texto));
        var seg = it.dia ? null : h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { des.etapa = 2; painelDesafio(); } }, 'Continuar');
        var prox = h('button', { type: 'button', class: 'btn' + (it.dia ? ' btn-primary' : ''), onclick: novoDesafio }, 'Próxima situação');
        var fb = h('div', { class: 'rpl-fb' }, corpo, h('div', { class: 'btn-row' }, seg, it.dia ? prox : null));
        painel.appendChild(fb);
        (seg || prox).focus();
      }
      function responder2(k, ul) {
        var it = des.item, ok = k === it.cat;
        des.total++; if (ok) des.acertos++;
        marcar(ul, it.cat, k, CAT);
        var exp = {
          proa: 'As duas luzes de bordos aparecem juntas só quando estamos praticamente na proa dela (cada uma cobre 112,5°, da proa para o seu bordo — Regra 21(b)). Se as duas fossem de propulsão mecânica, seria roda a roda (Regra 14).',
          be: 'A luz verde fica a boreste e cobre 112,5°, da proa até 22,5° por ante a ré do través (Regra 21(b)). Se vemos a verde e não a vermelha, estamos do lado de boreste dela: a proa aponta para a nossa direita.',
          bb: 'A luz vermelha fica a bombordo e cobre 112,5° (Regra 21(b)). Se vemos a vermelha e não a verde, estamos do lado de bombordo dela: a proa aponta para a nossa esquerda.',
          popa: 'A luz de alcançado cobre 135° pela popa (Regra 21(c)). Vendo só ela (e nenhuma luz de bordo), estamos mais de 22,5° por ante a ré do través: se nos aproximarmos, nós é que estaremos alcançando (Regra 13).',
          nada: 'Luzes circulares cobrem 360° (Regra 21(e)) e não mostram o rumo. Sem luzes de bordos nem de alcançado, ela está parada, fundeada, encalhada ou sem seguimento.',
        }[it.cat];
        var fb = h('div', { class: 'rpl-fb' },
          h('p', { class: 'rpl-res', 'data-ok': ok ? '1' : '0' }, ok ? 'Certo.' : 'Não. ' + CAT[it.cat] + '.'),
          h('p', null, exp),
          h('p', { class: 'rpl-miudo' }, 'Aspecto sorteado: ' + graus(it.th) + ', vemos ' + descAspecto(it.th) + '.'),
          h('div', { class: 'btn-row' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: novoDesafio }, 'Próxima situação')));
        des.etapa = 3;
        painel.appendChild(fb);
        VL.$('.btn-primary', fb).focus();
      }

      /* ---------- Orquestração ---------- */
      function sincronizarControles() {
        VL.$$('button', segModo).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === est.modo)); });
        VL.$$('button', segDia).forEach(function (b) { b.setAttribute('aria-pressed', String((b.getAttribute('data-v') === 'dia') === est.dia)); });
        var exp = est.modo === 'explorar';
        segDia.hidden = !exp;
        blocoTipo.hidden = !exp; blocoAspecto.hidden = !exp; blocoLuzes.hidden = !exp; swNomes.el.hidden = !exp;
        ins.raiz.setAttribute('data-modo', est.modo);
      }
      function reconfigurar() { cfg = montar(est.tipo, est.o); desenhar(); painelExplorar(); }
      function tudo() { sincronizarControles(); desenharFundo(); if (est.modo === 'explorar') { cfg = montar(est.tipo, est.o); desenhar(); painelExplorar(); } else if (des.item) { desenharFundoPara(des.item.dia); desenhar(); } }
      function trocarModo(m) {
        if (m === est.modo) return;
        est.modo = m; sincronizarControles();
        if (m === 'desafio') { est.silExp = est.silhueta; est.silhueta = false; swSil.inp.checked = false; des.n = 0; des.acertos = 0; des.total = 0; novoDesafio(); }
        else { des.item = null; if (est.silExp !== undefined) { est.silhueta = est.silExp; swSil.inp.checked = est.silhueta; } tudo(); }
      }

      var ro = new ResizeObserver(function () {
        var w = Math.round(svg.clientWidth), hh = Math.round(svg.clientHeight);
        if (w < 50 || hh < 50 || (w === dims.w && hh === dims.h)) return;
        dims.w = w; dims.h = hh;
        if (est.modo === 'desafio' && des.item) desenharFundoPara(des.item.dia); else desenharFundo();
        desenhar();
      });
      ro.observe(svg);
      var offTema = VL.on('tema', function () { desenhar(); });

      montarOpcoes();
      sincronizarControles();
      desenharFundo();
      if (est.modo === 'desafio') { est.silExp = est.silhueta; est.silhueta = opts.silhueta === true; swSil.inp.checked = est.silhueta; novoDesafio(); } else { desenhar(); painelExplorar(); }

      return function limpar() { ro.disconnect(); offTema(); };
    },
  });

  // Exposto para testes de lógica (node) e para outros widgets.
  VL.ripeamLuzes = { intensidade: intensidade, montar: montar, assinatura: assinatura, categoriaAspecto: categoriaAspecto, gerarDesafio: gerarDesafio, TIPOS: TIPOS };
})();
