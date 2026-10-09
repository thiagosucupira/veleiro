/* Aba "Onde estudar e praticar" — parte 1: regras puras (grupos de tipo, categorias de curso, filtros, ordem, URL).
   Não toca no DOM; só usa VL.semAcento e VL.distKm. */
(function () {
  'use strict';
  var D = VL.locais = VL.locais || {};

  /* Tipos do banco de dados (data/locais.js) agrupados nos filtros que o aluno entende.
     cor = classe de cor do marcador (loc-cN em locais.css); icone = nome em VL.icon ou em D.ICONES_EXTRA. */
  D.GRUPOS = [
    { id: 'capitania', rotulo: 'Capitania, Delegacia e Agência', curto: 'Capitania', tipos: ['orgao-maritimo'], cor: 8, icone: 'predio',
      desc: 'Onde se faz a inscrição e a prova do CHA, e onde se tira dúvida oficial. Não dão aula.' },
    { id: 'cha', rotulo: 'Preparatório para a prova CHA', curto: 'Preparatório CHA', tipos: ['preparatorio-cha'], cor: 2, icone: 'prova',
      desc: 'Cursos que preparam para as provas de Arrais, Mestre e Capitão-Amador.' },
    { id: 'escola', rotulo: 'Escola de vela', curto: 'Escola de vela', tipos: ['escola-vela'], cor: 1, icone: 'vela',
      desc: 'Aulas práticas de vela, de iniciação em barcos pequenos à vela oceânica.' },
    { id: 'intl', rotulo: 'Escola RYA ou ASA', curto: 'Escola RYA/ASA', tipos: ['escola-rya', 'escola-asa'], cor: 5, icone: 'globo', intl: true,
      desc: 'Escolas que ensinam pelos programas internacionais RYA (Reino Unido) e ASA (EUA).' },
    { id: 'regata', rotulo: 'Regata', curto: 'Regata', tipos: ['regata'], cor: 3, icone: 'regata',
      desc: 'Regatas e eventos de vela onde dá para competir ou embarcar como tripulante.' },
    { id: 'rally', rotulo: 'Rally oceânico', curto: 'Rally oceânico', tipos: ['rally-oceanico'], cor: 6, icone: 'rally',
      desc: 'Travessias organizadas em grupo, com apoio e segurança combinados.' },
    { id: 'crew', rotulo: 'Vagas de tripulante (crew finder)', curto: 'Crew finder', tipos: ['crew-finder'], cor: 5, icone: 'pessoas',
      desc: 'Quadros onde comandantes e tripulantes se encontram.' },
    { id: 'charter', rotulo: 'Charter e delivery', curto: 'Charter e delivery', tipos: ['charter', 'delivery'], cor: 7, icone: 'leme',
      desc: 'Aluguel de veleiros (charter) e transporte de barcos entre portos (delivery).' },
    { id: 'clube', rotulo: 'Clube e iate clube', curto: 'Clube e iate clube', tipos: ['clube-nautico', 'iate-clube'], cor: 4, icone: 'bandeira',
      desc: 'Clubes náuticos e iate clubes, com escola, regatas e convívio.' },
    { id: 'marina', rotulo: 'Marina', curto: 'Marina', tipos: ['marina'], cor: 7, icone: 'ancora',
      desc: 'Marinas com vagas, rampas e serviços para quem navega.' },
    { id: 'radio', rotulo: 'Rádio (ORR, ORG, SRC e VHF)', curto: 'Rádio', tipos: ['radio-certificacao'], cor: 6, icone: 'radio',
      desc: 'Cursos e exames de operador de rádio.' },
    { id: 'seguranca', rotulo: 'Segurança e sobrevivência no mar', curto: 'Segurança no mar', tipos: ['seguranca-sobrevivencia'], cor: 3, icone: 'seguranca',
      desc: 'Primeiros socorros, sobrevivência no mar, combate a incêndio e segurança em embarcações.' },
  ];
  /* Qual tipo desenha o marcador quando o local tem vários (o primeiro da lista que o local tiver). */
  D.PRIORIDADE = ['capitania', 'cha', 'escola', 'intl', 'regata', 'rally', 'crew', 'charter', 'clube', 'marina', 'radio', 'seguranca'];

  var SO_INTL = { 'escola-rya': 1, 'escola-asa': 1 };

  /* Categorias de curso: o banco tem textos livres ("Arrais-Amador (prática)", "RYA Day Skipper"); aqui viram categorias. */
  D.CURSOS = [
    { id: 'arrais', rotulo: 'Arrais-Amador', re: /arrais/i },
    { id: 'mestre', rotulo: 'Mestre-Amador', re: /mestre.amador|\bMSA\b/i },
    { id: 'capitao', rotulo: 'Capitão-Amador', re: /capit[aã]o.amador|\bCPA\b/i },
    { id: 'veleiro', rotulo: 'Veleiro (CHA-VLA)', re: /CHA-VLA|^veleiro$/i },
    { id: 'motonauta', rotulo: 'Motonauta', re: /motonauta|powerboat/i },
    { id: 'iniciacao', rotulo: 'Iniciação à vela (barcos pequenos)', re: /inicia|optimist|dingue|dinghy|ilca|laser|snipe|monotipo|day ?sailer|escolinha|vela (infantil|jovem|adult|para|em dingue)|aula experimental|aulas? (de vela|avulsas|particulares|na barra|em veleiro)|curso (b[aá]sico )?(pr[aá]tico )?de vela|curso b[aá]sico de vela|velejar\+ monotipo|windsurf|kitesurf|wingfoil|vela adaptada|colônia/i },
    { id: 'oceano', rotulo: 'Vela oceânica e cruzeiro', re: /oce[aâ]n|ocean|cruis|cruzeiro|cabinad|travessia|mile|offshore|mar aberto|flotilha|delivery|vivência a bordo|vivências a bordo|barco escola|navegação (noturna|astron)/i },
    { id: 'radio', rotulo: 'Rádio (ORR, ORG, SRC/VHF)', re: /r[aá]dio|\bVHF\b|\bSRC\b|\bORR\b|\bORG\b|GMDSS|CROG|radiotelef/i },
    { id: 'seguranca', rotulo: 'Segurança e primeiros socorros', re: /survival|socorros|first aid|HUET|CBSN|CBSP|CPSO|STCW|inc[eê]ndio|safety at sea|seguran[cç]a/i },
    { id: 'rya', rotulo: 'RYA (Day Skipper, Yachtmaster…)', re: /\bRYA\b|yachtmaster|day skipper|competent crew|coastal skipper|start yachting|fast ?tra/i, intl: true },
    { id: 'asa', rotulo: 'ASA e NauticEd', re: /\bASA\b|nauticed/i, intl: true },
    { id: 'icc', rotulo: 'ICC (certificado internacional)', re: /\bICC\b/i, intl: true },
  ];

  D.REGIOES = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'];
  D.ESCOPOS = [
    { id: 'brasil', rotulo: 'Brasil' },
    { id: 'exterior', rotulo: 'Exterior', intl: true },
    { id: 'online', rotulo: 'Online' },
    { id: 'todos', rotulo: 'Tudo' },
  ];

  D.grupo = function (id) { for (var i = 0; i < D.GRUPOS.length; i++) if (D.GRUPOS[i].id === id) return D.GRUPOS[i]; return null; };
  D.rotuloTipo = function (tipo) {
    for (var i = 0; i < D.GRUPOS.length; i++) if (D.GRUPOS[i].tipos.indexOf(tipo) >= 0) {
      var g = D.GRUPOS[i];
      if (g.tipos.length === 1) return g.rotulo;
      return { 'escola-rya': 'Escola RYA', 'escola-asa': 'Escola ASA', 'clube-nautico': 'Clube náutico', 'iate-clube': 'Iate clube', charter: 'Charter', delivery: 'Delivery de veleiros' }[tipo] || g.rotulo;
    }
    return tipo;
  };

  /* ---------- Glifos dos marcadores (24×24, traço) ---------- */
  D.ICONES_EXTRA = {
    predio: '<path d="M3 20h18"/><path d="M4 9l8-5 8 5z"/><path d="M6.5 10.5v7M10 10.5v7M14 10.5v7M17.5 10.5v7"/>',
    bandeira: '<path d="M5 3v18"/><path d="M5 5l14 4.5L5 14"/>',
    regata: '<path d="M4 20c3 1.5 6 1.5 8 0s5-1.5 8 0"/><path d="M12 4v12"/><path d="M12.5 5.5l6 9.5h-6z"/><path d="M11 8l-4.5 7H11z"/>',
    rally: '<circle cx="12" cy="12" r="8.5"/><path d="M12 6.5l2.2 5.5-2.2 5.5-2.2-5.5z"/>',
    pessoas: '<circle cx="9" cy="8" r="3"/><path d="M3.5 20c0-3.4 2.4-6 5.5-6s5.5 2.6 5.5 6"/><circle cx="17" cy="9" r="2.4"/><path d="M16 14.2c3 0 5 2 5 5.3"/>',
  };
  /** Glifo como texto SVG (para innerHTML). */
  D.glifo = function (nome, px) {
    var t = px || 18;
    if (D.ICONES_EXTRA[nome]) {
      return '<svg width="' + t + '" height="' + t + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + D.ICONES_EXTRA[nome] + '</svg>';
    }
    return VL.icon(nome, t).outerHTML;
  };

  /* ---------- Preparo dos registros ---------- */
  function norm(s) { return VL.semAcento(s); }

  /** Transforma os itens do banco em registros com tudo calculado uma vez. */
  D.preparar = function (itens) {
    return itens.map(function (d) {
      var grupos = [];
      D.GRUPOS.forEach(function (g) { if (g.tipos.some(function (t) { return d.tipos.indexOf(t) >= 0; })) grupos.push(g.id); });
      var cursosTxt = (d.cursos || []);
      var cursos = [];
      D.CURSOS.forEach(function (c) { if (cursosTxt.some(function (x) { return c.re.test(x); })) cursos.push(c.id); });
      var escopo = d.regiao === 'Exterior' ? 'exterior' : (d.regiao === 'Online' ? 'online' : 'brasil');
      var soIntl = d.tipos.length > 0 && d.tipos.every(function (t) { return SO_INTL[t]; });
      var tem = d.lat != null && d.lon != null && isFinite(d.lat) && isFinite(d.lon);
      var prioridade = null;
      for (var i = 0; i < D.PRIORIDADE.length; i++) if (grupos.indexOf(D.PRIORIDADE[i]) >= 0) { prioridade = D.PRIORIDADE[i]; break; }
      var busca = norm([d.nome, d.cidade, d.uf, d.pais, d.regiao, (d.cursos || []).join(' '), d.pratica, d.tipos.map(D.rotuloTipo).join(' ')].join(' | '));
      return { d: d, id: d.id, grupos: grupos, cursos: cursos, escopo: escopo, soIntl: soIntl, mapa: tem, lat: tem ? d.lat : null, lon: tem ? d.lon : null, prioridade: prioridade, busca: busca, dist: null, nomeOrd: norm(d.nome) };
    });
  };

  /** Rótulo do segundo filtro geográfico do item: UF (Brasil) ou país (exterior). */
  D.geoDe = function (r) { return r.escopo === 'brasil' ? (r.d.uf || '') : (r.escopo === 'exterior' ? (r.d.pais || '') : ''); };

  /**
   * Filtra. f = {q, escopo, regiao, geo, grupos:[ids], curso, intl}. `ignorar` = nome do filtro a pular
   * (para contar quantos itens cada opção daria): 'escopo' | 'regiao' | 'geo' | 'grupos' | 'curso'.
   */
  D.filtrar = function (regs, f, ignorar) {
    var termos = norm(f.q || '').split(/\s+/).filter(Boolean);
    return regs.filter(function (r) {
      if (!f.intl && r.soIntl) return false;
      if (ignorar !== 'escopo' && f.escopo && f.escopo !== 'todos' && r.escopo !== f.escopo) return false;
      if (ignorar !== 'regiao' && f.regiao && r.d.regiao !== f.regiao) return false;
      if (ignorar !== 'geo' && f.geo && D.geoDe(r) !== f.geo) return false;
      if (ignorar !== 'grupos' && f.grupos && f.grupos.length && !f.grupos.some(function (g) { return r.grupos.indexOf(g) >= 0; })) return false;
      if (ignorar !== 'curso' && f.curso && r.cursos.indexOf(f.curso) < 0) return false;
      for (var i = 0; i < termos.length; i++) if (r.busca.indexOf(termos[i]) < 0) return false;
      return true;
    });
  };

  var ORDEM_REG = { Norte: 1, Nordeste: 2, 'Centro-Oeste': 3, Sudeste: 4, Sul: 5, Exterior: 6, Online: 7 };
  D.ordenar = function (lista, ordem) {
    var cmp = function (a, b) { return a.nomeOrd < b.nomeOrd ? -1 : (a.nomeOrd > b.nomeOrd ? 1 : 0); };
    var cp = {
      nome: cmp,
      estado: function (a, b) {
        var ra = ORDEM_REG[a.d.regiao] || 9, rb = ORDEM_REG[b.d.regiao] || 9;
        if (ra !== rb) return ra - rb;
        var ua = norm(D.geoDe(a)), ub = norm(D.geoDe(b));
        if (ua !== ub) return ua < ub ? -1 : 1;
        var ca = norm(a.d.cidade), cb = norm(b.d.cidade);
        if (ca !== cb) return ca < cb ? -1 : 1;
        return cmp(a, b);
      },
      distancia: function (a, b) {
        var da = a.dist == null ? Infinity : a.dist, db = b.dist == null ? Infinity : b.dist;
        if (da !== db) return da < db ? -1 : 1;
        return cmp(a, b);
      },
    }[ordem] || cmp;
    return lista.slice().sort(cp);
  };

  /** Calcula a distância (km, em linha reta) de cada registro até o ponto. */
  D.calcularDistancias = function (regs, pos) {
    regs.forEach(function (r) { r.dist = (pos && r.mapa) ? VL.distKm(pos.lat, pos.lon, r.lat, r.lon) : null; });
  };

  /** Marcador do registro: o grupo escolhido no filtro (se o item o tiver) ou o de maior prioridade. */
  D.grupoDoMarcador = function (r, selecionados) {
    if (selecionados && selecionados.length) {
      for (var i = 0; i < D.PRIORIDADE.length; i++) if (selecionados.indexOf(D.PRIORIDADE[i]) >= 0 && r.grupos.indexOf(D.PRIORIDADE[i]) >= 0) return D.grupo(D.PRIORIDADE[i]);
    }
    return D.grupo(r.prioridade) || D.grupo('escola');
  };

  /* ---------- Estado <-> URL ---------- */
  D.estadoDaRota = function (q) {
    q = q || {};
    var grupos = (q.tipo || '').split(',').filter(function (x) { return D.grupo(x); });
    var escopo = ['brasil', 'exterior', 'online', 'todos'].indexOf(q.escopo) >= 0 ? q.escopo : 'brasil';
    var curso = D.CURSOS.some(function (c) { return c.id === q.curso; }) ? q.curso : '';
    var regiao = D.REGIOES.indexOf(q.regiao) >= 0 ? q.regiao : '';
    return { q: q.q || '', escopo: escopo, regiao: regiao, geo: (q.uf || q.pais || '').toString().slice(0, 60), grupos: grupos, curso: curso };
  };
  D.estadoParaQuery = function (e) {
    var p = [];
    function add(k, v) { if (v) p.push(k + '=' + encodeURIComponent(v)); }
    add('q', e.q); add('escopo', e.escopo !== 'brasil' ? e.escopo : ''); add('regiao', e.regiao);
    add(e.escopo === 'exterior' ? 'pais' : 'uf', e.geo); add('tipo', (e.grupos || []).join(',')); add('curso', e.curso);
    return p.join('&');
  };

  /** Cortar texto longo sem partir palavras. */
  D.resumir = function (s, max) {
    s = String(s || '').trim();
    if (s.length <= max) return s;
    var t = s.slice(0, max);
    var i = t.lastIndexOf(' ');
    return (i > max * 0.6 ? t.slice(0, i) : t).replace(/[\s,;.:–-]+$/, '') + '…';
  };

  /** Só links http(s). */
  D.urlSegura = function (u) { return /^https?:\/\//i.test(String(u || '')) ? u : null; };
})();
