/* Simulados e flashcards: níveis, carga de dados (com estado vazio quando o arquivo ainda não existe),
   estatísticas a partir de VL.progress e pequenas peças de interface usadas pelas páginas da aba. */
(function () {
  'use strict';
  var h = VL.h;
  var S = VL.simulados = VL.simulados || {};

  var NORMAM = 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf';
  S.URL_CPA = 'https://www.marinha.mil.br/dpc/exame-para-a-categoria-de-capitao-amador';

  /* Formato oficial: NORMAM-211/DPC, Anexo 5-A, Seção I (itens 1 b–d, 2 c–e, 3 b–d). Ver data/fontes.js. */
  S.NIVEIS = [
    {
      id: 'arrais', nome: 'Arrais-Amador', curto: 'Arrais', sigla: 'ARA', oficial: true, curso: 'arrais', minutos: 120, n: 40, nota: 5,
      fQuestoes: 'normas-98', fNota: 'normas-99', fMateriais: 'normas-100',
      tempo: '2 horas', formato: 'Prova eletrônica ou escrita com 40 questões, em até 2 horas',
      materiais: ['Protocolo de inscrição', 'Documento oficial de identificação', 'Caneta esferográfica azul ou preta'],
      alternativas: '4 por questão no nosso banco. O formato real não é publicado.',
    },
    {
      id: 'mestre', nome: 'Mestre-Amador', curto: 'Mestre', sigla: 'MSA', oficial: true, curso: 'mestre', minutos: 180, n: 40, nota: 5,
      /* a prova real tem 4 questões com carta náutica; no banco, o tema equivalente é "Problemas de carta" */
      carta: { tema: 'Problemas de carta', n: 4 },
      fQuestoes: 'normas-92', fNota: 'normas-93', fMateriais: 'normas-94',
      tempo: '3 horas', formato: 'Prova eletrônica ou escrita com 40 questões de múltipla escolha, quatro delas com carta náutica, em até 3 horas',
      materiais: ['Protocolo de inscrição', 'Documento oficial de identificação', 'Caneta esferográfica azul ou preta',
        'Material de desenho: lápis ou lapiseira, régua, um par de esquadros ou régua paralela, transferidor, compasso e borracha'],
      alternativas: '4 por questão no nosso banco. O formato real não é publicado.',
    },
    {
      id: 'capitao', nome: 'Capitão-Amador', curto: 'Capitão', sigla: 'CPA', oficial: true, curso: 'capitao', minutos: 240, n: 40, nota: 5,
      fQuestoes: 'normas-78', fNota: 'normas-79', fMateriais: 'normas-80', fAlternativas: 'normas-89',
      tempo: '4 horas', formato: 'Prova escrita com 40 questões, em até 4 horas',
      materiais: ['Protocolo de inscrição', 'Documento oficial de identificação', 'Caneta esferográfica azul ou preta',
        'Material de desenho: lápis ou lapiseira, régua paralela e/ou um par de esquadros, compasso e borracha'],
      alternativas: '5 por questão (A a E), como nas provas publicadas pela DPC.',
    },
    { id: 'vela', nome: 'Vela prática', curto: 'Vela', oficial: false, curso: 'vela', minutos: 30, n: 20, nota: 5 },
    { id: 'travessia', nome: 'Travessia oceânica', curto: 'Travessia', oficial: false, curso: 'travessia', minutos: 30, n: 20, nota: 5 },
    { id: 'radio', nome: 'Rádio e segurança', curto: 'Rádio', oficial: false, curso: 'radio', minutos: 30, n: 20, nota: 5 },
  ];
  S.nivel = function (id) { for (var i = 0; i < S.NIVEIS.length; i++) if (S.NIVEIS[i].id === id) return S.NIVEIS[i]; return null; };

  /* Referência de reserva enquanto data/fontes.js não traz o fato (mesma fonte e localizador da pesquisa). */
  var RESERVA = {
    'normas-78': ['Seção I, item 1, alínea b, p. 5-A-1'], 'normas-79': ['Seção I, item 1, alínea c, p. 5-A-1'],
    'normas-80': ['Seção I, item 1, alínea d, p. 5-A-1'],
    'normas-92': ['Seção I, item 2, alínea c, p. 5-A-4'], 'normas-93': ['Seção I, item 2, alínea d, p. 5-A-4'],
    'normas-94': ['Seção I, item 2, alínea e, p. 5-A-5'],
    'normas-98': ['Seção I, item 3, alínea b, p. 5-A-7'], 'normas-99': ['Seção I, item 3, alínea c, p. 5-A-7'],
    'normas-100': ['Seção I, item 3, alínea d, p. 5-A-7'],
    'normas-101': ['Seção I, item 2, alínea g (p. 5-A-5) e item 3, alínea f (p. 5-A-7)'],
    'normas-90': ['Página oficial com provas, gabaritos e aprovados desde 2017', 'DPC: provas de Capitão-Amador', S.URL_CPA],
    'normas-89': ['Gabarito preliminar ES-CPA-II/2026, página única', 'Gabarito CPA-II/2026',
      'https://www.marinha.mil.br/dpc/sites/www.marinha.mil.br.dpc/files/2026-10/2-ES-CPA-II-2026-GABARITO-PRELIMINAR-06OUT2026.pdf'],
  };
  /** Link de fonte de um fato verificado (com selo automático "a confirmar"). Usa a referência de reserva se o
      fato ainda não existir em data/fontes.js. Com `curto`, o link mostra esse texto e o localizador vai no título. */
  S.fonte = function (id, curto) {
    var fatos = VL.data.fontes && VL.data.fontes.fatos;
    var f = fatos && fatos[id];
    if (!f) {
      var r = RESERVA[id];
      if (!r) return VL.ui.fonte(id);
      f = { txt: r[1] || 'NORMAM-211, Anexo 5-A', url: r[2] || NORMAM, locator: (r[2] ? '' : 'NORMAM-211/DPC, Anexo 5-A, ') + r[0], consultado: '2026-10-07' };
    }
    if (curto) f = Object.assign({}, f, { txt: curto, locator: (f.txt && f.txt !== curto ? f.txt : f.locator) || '' });
    return VL.ui.fonte(f);
  };
  /** Questões de carta disponíveis no banco (tema equivalente às questões com carta náutica da prova real). */
  S.questoesCarta = function (n, vis) {
    if (!n.carta) return [];
    var slug = VL.slug(n.carta.tema);
    return vis.filter(function (q) { return VL.slug(q.tema || '') === slug; });
  };
  /** Monta a prova: n questões equilibrando assuntos; no Mestre, garante as de carta (até 4), como na prova real. */
  S.montarProva = function (n, vis) {
    var carta = S.questoesCarta(n, vis);
    if (!carta.length) return VL.quiz.sortear(vis, n.n);
    var ids = {}; carta.forEach(function (q) { ids[q.id] = 1; });
    var k = Math.min(n.carta.n, carta.length, n.n);
    var sel = VL.quiz.sortear(carta, k);
    sel = sel.concat(VL.quiz.sortear(vis.filter(function (q) { return !ids[q.id]; }), n.n - sel.length));
    if (sel.length < n.n) { /* banco pequeno: completa com as de carta que sobraram */
      var ja = {}; sel.forEach(function (q) { ja[q.id] = 1; });
      VL.embaralhar(carta).forEach(function (q) { if (!ja[q.id] && sel.length < n.n) sel.push(q); });
    }
    return VL.embaralhar(sel);
  };
  /** "a, b e c" */
  S.lista = function (itens) {
    var xs = itens.map(function (x, i) { return i ? x.charAt(0).toLowerCase() + x.slice(1) : x; });
    return xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' e ' + xs[xs.length - 1];
  };

  /* ---------- Dados (cache por sessão: um arquivo ausente não é pedido de novo a cada página) ---------- */
  var cache = {};
  S.dado = function (nome) {
    if (!cache[nome]) cache[nome] = VL.carregarDado(nome).then(function (v) { return v == null ? null : v; }, function () { return null; });
    return cache[nome];
  };
  function visivel(x) { return !x.intl || VL.settings.get('intl'); }
  S.visiveis = function (lista) { return (lista || []).filter(visivel); };
  /** Banco de questões do nível → array (vazio se o arquivo não existe). */
  S.banco = function (nivel) {
    return S.dado('questoes/' + nivel).then(function (v) {
      var qs = Array.isArray(v) ? v : (v && Array.isArray(v.questoes) ? v.questoes : []);
      return qs.filter(function (q) { return q && q.id && Array.isArray(q.alternativas); });
    });
  };
  S.bancos = function () {
    return Promise.all(S.NIVEIS.map(function (n) { return S.banco(n.id); })).then(function (lista) {
      var out = {}; S.NIVEIS.forEach(function (n, i) { out[n.id] = lista[i]; }); return out;
    });
  };
  /** Índice de baralhos → [{id, titulo, nivel, arquivo}] */
  S.indice = function () {
    return S.dado('flashcards/indice').then(function (v) {
      return (v && Array.isArray(v.decks) ? v.decks : []).filter(function (d) { return d && d.id; });
    });
  };
  function nomeArquivo(d) {
    var a = String(d.arquivo || d.id).replace(/^data\//, '').replace(/\.js$/, '');
    return a.indexOf('flashcards/') === 0 ? a : 'flashcards/' + a;
  }
  /** Baralho completo de um item do índice (ou null). */
  S.baralho = function (d) {
    return S.dado(nomeArquivo(d)).then(function (b) {
      if (!b || !Array.isArray(b.cartas)) return null;
      return { id: b.id || d.id, titulo: b.titulo || d.titulo || d.id, nivel: b.nivel || d.nivel, cartas: b.cartas };
    });
  };
  /** Todos os baralhos do índice já carregados: [{meta, deck}] (sem os que falharam). */
  S.baralhos = function () {
    return S.indice().then(function (idx) {
      return Promise.all(idx.map(S.baralho)).then(function (bs) {
        var out = [];
        idx.forEach(function (meta, i) { if (bs[i]) out.push({ meta: meta, deck: bs[i] }); });
        return out;
      });
    });
  };
  /** Junta os baralhos de um nível num só (id = nível). Ids repetidos entre baralhos ganham prefixo. */
  function mapearCartas(itens) {
    var vistos = {};
    return itens.map(function (it) {
      return { it: it, cartas: (it.deck.cartas || []).map(function (c) {
        var id = c.id;
        if (vistos[id]) id = it.deck.id + '/' + c.id;
        vistos[id] = 1;
        return id === c.id ? c : Object.assign({}, c, { id: id });
      }) };
    });
  }
  S.juntar = function (nivel, itens) {
    var cartas = [];
    mapearCartas(itens).forEach(function (m) { cartas = cartas.concat(m.cartas); });
    var n = S.nivel(nivel);
    return { id: nivel, titulo: (n ? n.nome : nivel), nivel: nivel, cartas: cartas };
  };
  /* Um baralho do nível visto como parte do baralho juntado: usa o MESMO id (= nível) e os mesmos ids de cartas,
     então avaliar cartas aqui ou no "todos os baralhos" muda as mesmas contagens. `parte` guarda o id do baralho
     original, usado nos links. */
  S.parte = function (nivel, itens, idBaralho) {
    var m = mapearCartas(itens).filter(function (x) { return x.it.deck.id === idBaralho; })[0];
    if (!m) return null;
    var t = String(m.it.deck.titulo || idBaralho).replace(/^[a-zçãé]+:\s*/i, '');
    return { id: nivel, parte: idBaralho, titulo: t.charAt(0).toUpperCase() + t.slice(1), nivel: nivel, cartas: m.cartas };
  };
  /** Agrupa baralhos por nível: {nivel: [{meta, deck}]} e lista de "outros". */
  S.porNivel = function (itens) {
    var g = {}, outros = [];
    itens.forEach(function (it) {
      var nv = it.deck.nivel || it.meta.nivel;
      if (S.nivel(nv)) (g[nv] = g[nv] || []).push(it); else outros.push(it);
    });
    return { grupos: g, outros: outros };
  };
  /** Conjuntos de baralhos cujo estado SRS é independente (sem contar duas vezes): nível juntado + avulsos. */
  S.baralhosSRS = function (itens) {
    var pn = S.porNivel(itens), out = [];
    Object.keys(pn.grupos).forEach(function (nv) {
      out.push(S.juntar(nv, pn.grupos[nv]));
    });
    pn.outros.forEach(function (it) { out.push(it.deck); });
    return out;
  };

  /* ---------- Estatísticas ---------- */
  /** Resumo do nível a partir do banco e das estatísticas por questão. */
  S.resumoBanco = function (banco, stats) {
    stats = stats || VL.progress.todasQuestaoStats();
    var qs = S.visiveis(banco), r = { total: qs.length, vistas: 0, respostas: 0, acertos: 0, erradas: 0, ineditas: 0 };
    qs.forEach(function (q) {
      var s = stats[q.id];
      if (!s) { r.ineditas++; return; }
      r.vistas++; r.respostas += s.v || 0; r.acertos += s.a || 0;
      if (s.u === 0) r.erradas++;
    });
    r.frac = r.respostas ? r.acertos / r.respostas : null;
    return r;
  };
  /** Assuntos do banco: [{tema, slug, total, respondidas, v, a, frac}] em ordem alfabética. */
  S.temas = function (banco, stats) {
    stats = stats || VL.progress.todasQuestaoStats();
    var m = {};
    S.visiveis(banco).forEach(function (q) {
      var t = q.tema || 'Geral';
      var x = m[t] = m[t] || { tema: t, slug: VL.slug(t), total: 0, respondidas: 0, v: 0, a: 0 };
      x.total++;
      var s = stats[q.id];
      if (s) { x.respondidas++; x.v += s.v || 0; x.a += s.a || 0; }
    });
    return Object.keys(m).sort(function (a, b) { return a.localeCompare(b, 'pt-BR'); }).map(function (k) {
      var x = m[k]; x.frac = x.v ? x.a / x.v : null; return x;
    });
  };
  /** Assuntos a partir das tentativas, quando o banco não está disponível. */
  S.temasDeTentativas = function (nivel) {
    var m = {};
    VL.progress.tentativas(nivel).forEach(function (t) {
      Object.keys(t.porTema || {}).forEach(function (k) {
        var x = m[k] = m[k] || { tema: k, slug: VL.slug(k), total: 0, respondidas: 0, v: 0, a: 0 };
        x.v += t.porTema[k].t || 0; x.a += t.porTema[k].a || 0;
      });
    });
    return Object.keys(m).map(function (k) { var x = m[k]; x.frac = x.v ? x.a / x.v : null; return x; });
  };
  S.notaDe = function (t) {
    if (t.nota != null) return Number(t.nota);
    return t.total ? Math.round((t.acertos / t.total) * 100) / 10 : 0;
  };
  S.tentativas = function (nivel) {
    return VL.progress.tentativas(nivel).slice().sort(function (a, b) { return String(a.data) < String(b.data) ? -1 : 1; });
  };
  S.melhorNota = function (nivel) {
    var m = null;
    VL.progress.tentativas(nivel).forEach(function (t) { if (t.modo === 'prova' && (m == null || S.notaDe(t) > m)) m = S.notaDe(t); });
    return m;
  };

  /* ---------- Formatação ---------- */
  S.duracao = function (seg) {
    seg = Math.max(0, Math.round(seg || 0));
    if (seg < 60) return seg + ' s';
    var m = Math.round(seg / 60);
    if (m < 60) return m + ' min';
    return Math.floor(m / 60) + ' h ' + String(m % 60).padStart(2, '0') + ' min';
  };
  S.horas = function (min) { return min % 60 === 0 ? (min / 60) + (min === 60 ? ' hora' : ' horas') : min + ' minutos'; };
  S.dataCurta = function (iso) {
    var d = new Date(iso);
    if (isNaN(d)) return '';
    var s = String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0');
    if (d.getFullYear() !== new Date().getFullYear()) s += '/' + d.getFullYear();
    return s;
  };
  S.dataHora = function (iso) {
    var d = new Date(iso);
    if (isNaN(d)) return '';
    return S.dataCurta(iso) + ' às ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  };
  S.resultado = function (t) {
    if (t.modo === 'prova') return 'Nota ' + VL.fmt.num(S.notaDe(t), 1) + (t.aprovado ? ', aprovado' : ', reprovado');
    return t.acertos + ' de ' + t.total + ' (' + VL.fmt.pct(t.total ? t.acertos / t.total : 0) + ')';
  };
  S.plural = function (n, um, varios) { return n + ' ' + (n === 1 ? um : varios); };

  /* ---------- Interface ---------- */
  /** Trilha de navegação: itens [{rotulo, rota?}]; o último é a página atual. */
  S.trilha = function (itens) {
    var ol = h('ol');
    itens.forEach(function (it, i) {
      var ultimo = i === itens.length - 1;
      ol.appendChild(h('li', null, ultimo || !it.rota ? h('span', { 'aria-current': ultimo ? 'page' : null }, it.rotulo) : h('a', { href: VL.link(it.rota) }, it.rotulo)));
    });
    return h('nav', { class: 'sim-trilha', 'aria-label': 'Você está em' }, ol);
  };
  S.titulo = function (txt) { document.title = txt + ' — Veleiro'; };
  /** Segmentado local (não muda a rota). itens: [{id, rotulo}] */
  S.segmentado = function (rotulo, itens, atual, aoMudar) {
    var nav = h('div', { class: 'segmented sim-seg', role: 'group', 'aria-label': rotulo });
    itens.forEach(function (it) {
      var b = h('button', { type: 'button', 'aria-pressed': String(it.id === atual), onclick: function () {
        VL.$$('button', nav).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        aoMudar(it.id);
      } }, it.rotulo);
      nav.appendChild(b);
    });
    return nav;
  };
  /** Estado vazio com ações. */
  S.vazio = function (titulo, texto, acoes) {
    return h('div', { class: 'vazio sim-vazio' },
      titulo ? h('p', { class: 'sim-vazio-t' }, titulo) : null,
      texto ? h('p', { class: 'mb-0', html: texto }) : null,
      acoes && acoes.length ? h('div', { class: 'btn-row sim-vazio-acoes' }, acoes) : null);
  };
  S.botaoLink = function (rotulo, rota, classe, icone) {
    return h('a', { class: 'btn ' + (classe || 'btn-ghost'), href: VL.link(rota) }, icone ? VL.icon(icone, 18) : null, rotulo);
  };
  S.cursoTab = function (n) { return VL.tabs.get(n.curso) ? n.curso : null; };
  S.vazioBanco = function (n) {
    var c = S.cursoTab(n);
    return S.vazio('O banco de ' + n.nome + ' ainda está em preparação',
      'As questões são escritas e revisadas pela comunidade a partir ' + (n.oficial ? 'do programa oficial da prova' : 'do conteúdo do curso') + '. Enquanto isso, estude as lições do curso.',
      c ? [S.botaoLink('Abrir o curso', c, 'btn-primary', 'livro')] : null);
  };
  S.naoEncontrado = function (raiz) {
    S.titulo('Página não encontrada');
    raiz.appendChild(S.trilha([{ rotulo: 'Simulados', rota: 'simulados' }, { rotulo: 'Página não encontrada' }]));
    raiz.appendChild(VL.ui.cabecalho('Página não encontrada'));
    raiz.appendChild(S.vazio('Esta página de simulados não existe', 'Confira o endereço ou volte ao painel. Os níveis são Arrais, Mestre, Capitão, Vela, Travessia e Rádio.', [S.botaoLink('Voltar aos simulados', 'simulados', 'btn-primary')]));
  };
  /** Ficha do formato oficial de um nível: cada afirmação seguida da sua fonte. */
  S.fichaOficial = function (n, comMateriais) {
    var dl = h('dl', { class: 'sim-ficha' });
    function item(rot, val, fonteId) {
      var dd = h('dd', null, val);
      if (fonteId) dd.appendChild(S.fonte(fonteId));
      dl.appendChild(h('div', null, h('dt', null, rot), dd));
    }
    item('Formato', n.formato + '.', n.fQuestoes);
    item('Aprovação', 'Nota mínima ' + VL.fmt.num(n.nota, 1) + ' numa prova que vale 10,0.', n.fNota);
    item('Alternativas', n.alternativas, n.fAlternativas || null);
    if (comMateriais) item('O que levar', S.lista(n.materiais) + '.', n.fMateriais);
    return dl;
  };
})();
