/* quartos — planejador de quartos de serviço (escala de vigia) para travessia.

   Tripulação de 2 a 6 pessoas (nomes editáveis), comandante dentro ou fora da escala (de sobreaviso), quartos
   individuais ou em dupla, e sistemas: 3 em 6 fora, 4 em 8 fora, 4 em 8 com quartos de cão (16–18 e 18–20),
   2 em 4 fora em dupla, sistema sueco (6 h de dia e 4 h à noite: 5 quartos por dia) e escalonado (cada pessoa fica
   4 h e uma pessoa troca a cada 2 h). Gera a grade de 24 h por vários dias (mostra se a escala gira), as horas de
   descanso por pessoa, quem está de quarto em cada hora, dicas de segurança e exporta (imprimir, CSV, copiar texto).

   Os nomes "3 em 6 fora" etc. descrevem o resultado com 3 equipes; com outro número de equipes o widget mostra
   as horas reais de quarto e de folga. O sistema sueco tem variações de horário; aqui: 08–14, 14–20, 20–24, 00–04
   e 04–08 (ajustável em "Horários começam às").

   Referências citadas: RIPEAM-72, Regra 5 (vigilância) e Regra 7 (risco de abalroamento: marcação constante).
   As "ordens do comandante" são exemplos comuns de boa marinharia, para combinar a bordo, não norma.

   opts de mount (todos opcionais):
     pessoas:  4                       2 a 6
     nomes:    ['Ana','Bruno', ...]   nomes iniciais
     sistema:  '3em6' | '4em8' | 'cao' | '2em4' | 'sueco' | 'escalonado'   padrão '4em8'
     dupla:    false                   quartos em dupla (o padrão do sistema '2em4' é true)
     comandanteFora: false             comandante de sobreaviso, fora da escala
     dias:     3                       1 a 7
     inicio:   0                       hora (0–23) em que começa o primeiro quarto do ciclo
     modo:     'planejar' | 'desafio'
     titulo:   texto da legenda do instrumento

   Exemplos de bloco de lição:
     {t:'widget', w:'quartos', opts:{pessoas:3, sistema:'cao'}}
     {t:'widget', w:'quartos', opts:{pessoas:4, sistema:'sueco', dupla:true}}
     {t:'widget', w:'quartos', opts:{modo:'desafio', pessoas:3, sistema:'4em8'}} */
(function () {
  'use strict';
  var h = VL.h;
  function hh(x) { x = ((x % 24) + 24) % 24; return (x < 10 ? '0' : '') + x + ':00'; }
  function h2(x) { x = ((x % 24) + 24) % 24; return (x < 10 ? '0' : '') + x; }
  function sortear(a) { return a[Math.floor(Math.random() * a.length)]; }
  function clamp(x, a, b) { return x < a ? a : (x > b ? b : x); }
  var NOMES = ['Ana', 'Bruno', 'Carla', 'Davi', 'Elisa', 'Fábio'];

  var SISTEMAS = {
    '3em6': { nome: '3 em 6 fora', curto: 'Quartos de 3 h', desc: 'Quartos de 3 h. Com 3 equipes: 3 h de quarto e 6 h de folga. Oito quartos por dia: a escala gira sozinha.', dur: 3, ideal: 3 },
    '4em8': { nome: '4 em 8 fora', curto: 'Quartos de 4 h', desc: 'O clássico dos navios: quartos de 4 h. Com 3 equipes: 4 h de quarto e 8 h de folga. Seis quartos por dia: sem rodízio, cada equipe pega sempre os mesmos horários.', dur: 4, ideal: 3 },
    cao: { nome: '4 em 8 com quartos de cão', curto: 'Com quartos de cão', desc: 'Igual ao 4 em 8, mas o quarto das 16–20 é dividido em dois "quartos de cão" de 2 h. Ficam sete quartos por dia (número ímpar) e a escala gira: ninguém pega a madrugada todo dia.', ciclo: [4, 4, 4, 4, 2, 2, 4], ideal: 3 },
    '2em4': { nome: '2 em 4 fora em dupla', curto: '2 em 4 em dupla', desc: 'Quartos curtos de 2 h, com duas pessoas no convés. Com 3 duplas: 2 h de quarto e 4 h de folga. Bom no frio, com mau tempo ou com tripulação inexperiente.', dur: 2, dupla: true, ideal: 3 },
    sueco: { nome: 'Sistema sueco', curto: 'Sueco', desc: 'Quartos de 6 h de dia e de 4 h à noite: cinco quartos por dia (número ímpar), então a escala gira. Bom para 2 equipes: folgas longas de dia para dormir de verdade.', ciclo: [6, 6, 4, 4, 4], inicio: 8, ideal: 2 },
    escalonado: { nome: 'Escalonado', curto: 'Escalonado', desc: 'Cada pessoa fica 4 h, mas uma pessoa troca a cada 2 h: sempre há duas no convés e uma delas já está acostumada ao escuro e ao mar. Ideal para 4 a 6 pessoas.', escal: { passo: 2, dur: 4 }, ideal: 4 },
  };
  var ORDEM = ['3em6', '4em8', 'cao', '2em4', 'sueco', 'escalonado'];

  /* ---------- Motor da escala (puro, testável) ----------
     cfg: {pessoas:[nomes], sistema, dupla, comandante (índice), comandanteFora, dias, inicio}
     devolve {equipes:[[i..]], T, quem:[ [índices de equipe] por hora ], blocos:[{ini, fim, eq}], porPessoa:[...] } */
  function gerar(cfg) {
    var sis = SISTEMAS[cfg.sistema] || SISTEMAS['4em8'];
    var nomes = cfg.pessoas;
    var escala = [];
    for (var i = 0; i < nomes.length; i++) if (!(cfg.comandanteFora && i === cfg.comandante)) escala.push(i);
    var T = cfg.dias * 24, A = ((cfg.inicio % 24) + 24) % 24;
    var r = { T: T, quem: [], blocos: [], avisos: [], escala: escala, sis: sis };
    for (var t = 0; t < T; t++) r.quem.push([]);
    if (escala.length < 1) { r.equipes = []; r.avisos.push('Não há ninguém na escala.'); return finalizar(r, cfg); }
    if (sis.escal) {
      // cada pessoa é uma "equipe"; a pessoa i entra em A + i·passo e fica dur horas, num ciclo de N·passo
      r.equipes = escala.map(function (p) { return [p]; });
      var N = escala.length, P = sis.escal.passo, D = sis.escal.dur, C = N * P;
      for (var tt = 0; tt < T; tt++) {
        for (var e = 0; e < N; e++) {
          var fase = (((tt - A - e * P) % C) + C) % C;
          if (fase < D) r.quem[tt].push(e);
        }
      }
      // blocos de 2 h com a troca
      for (var b0 = A - C; b0 < T; b0 += P) {
        var ini = Math.max(0, b0), fim = Math.min(T, b0 + P);
        if (fim > ini) r.blocos.push({ ini: ini, fim: fim, eq: r.quem[ini].slice() });
      }
      r.gira = (24 % C) !== 0;
      if (N < 4) r.avisos.push('Com ' + N + (N === 1 ? ' pessoa' : ' pessoas') + ', o escalonado deixa só ' + (C - D) + ' h de folga entre quartos de 4 h: cansativo demais para uma travessia.');
      return finalizar(r, cfg);
    }
    var dupla = cfg.dupla;
    var eqs = [];
    if (dupla) {
      for (var k = 0; k < escala.length; k += 2) eqs.push(escala.slice(k, k + 2));
      if (escala.length % 2 === 1) r.avisos.push('Número ímpar em duplas: ' + nomes[escala[escala.length - 1]] + ' fica sozinho(a) no quarto. À noite, combine alguém de sobreaviso.');
    } else eqs = escala.map(function (p) { return [p]; });
    r.equipes = eqs;
    var NE = eqs.length;
    var ciclo = sis.ciclo || [sis.dur];
    var cicloH = ciclo.reduce(function (a, b) { return a + b; }, 0);
    // blocos a partir de um início anterior a 0 (múltiplo do ciclo), para cobrir o começo
    var inicioCiclo = A - Math.ceil((A + 1) / cicloH) * cicloH;
    var lista = [], tb = inicioCiclo, ci = 0;
    while (tb < T) { var d = ciclo[ci % ciclo.length]; lista.push({ ini: tb, fim: tb + d }); tb += d; ci++; }
    var k0 = 0;
    for (var q = 0; q < lista.length; q++) if (lista[q].ini <= 0 && lista[q].fim > 0) { k0 = q; break; }
    lista.forEach(function (bl, idx) {
      var eq = (((idx - k0) % NE) + NE) % NE;
      var ini2 = Math.max(0, bl.ini), fim2 = Math.min(T, bl.fim);
      if (fim2 <= ini2) return;
      r.blocos.push({ ini: ini2, fim: fim2, eq: [eq], dur: bl.fim - bl.ini, ini0: bl.ini });
      for (var x = ini2; x < fim2; x++) r.quem[x].push(eq);
    });
    var blocosDia = cicloH === 24 ? ciclo.length : 24 / (sis.dur || 24);
    r.blocosDia = blocosDia;
    r.gira = (blocosDia % NE) !== 0;
    if (NE === 1) r.avisos.push('Uma equipe só fica de quarto o tempo todo: não há descanso. Use mais pessoas ou quartos individuais.');
    return finalizar(r, cfg);
  }
  function finalizar(r, cfg) {
    var nomes = cfg.pessoas;
    r.porPessoa = nomes.map(function (nm, p) {
      var eq = -1;
      (r.equipes || []).forEach(function (e, ei) { if (e.indexOf(p) >= 0) eq = ei; });
      var on = [], tot = 0, noite = 0;
      for (var t = 0; t < r.T; t++) {
        var esta = eq >= 0 && r.quem[t].indexOf(eq) >= 0;
        on.push(esta);
        if (esta) { tot++; var hd = t % 24; if (hd >= 18 || hd < 6) noite++; }
      }
      // maior descanso contínuo e descanso típico entre quartos (mediana das folgas internas)
      var maior = 0, cur = 0, folgas = [];
      var primeiro = on.indexOf(true);
      for (var u = 0; u < on.length; u++) {
        if (!on[u]) cur++;
        else { if (cur > 0 && u - cur > primeiro && primeiro >= 0) folgas.push(cur); if (cur > maior && u - cur >= 0 && primeiro >= 0 && u - cur > primeiro) maior = cur; cur = 0; }
      }
      if (!folgas.length && eq >= 0) maior = r.T - tot;
      folgas.sort(function (a, b) { return a - b; });
      var tipica = folgas.length ? folgas[Math.floor(folgas.length / 2)] : maior;
      return { nome: nm, eq: eq, fora: eq < 0, horasDia: tot / cfg.dias, noiteDia: noite / cfg.dias, maior: maior, tipica: tipica, on: on };
    });
    return r;
  }

  /* ---------- Perguntas do desafio ---------- */
  function perguntas(cfg, r) {
    var qs = [];
    var nomeEq = function (ei) { return r.equipes[ei].map(function (p) { return cfg.pessoas[p]; }).join(' e '); };
    if (r.equipes.length >= 2) {
      var t = Math.floor(Math.random() * r.T);
      var certa = r.quem[t].map(nomeEq).join(' com ');
      var ops = VL.embaralhar(r.equipes.map(function (e, ei) { return nomeEq(ei); }).filter(function (x) { return x !== certa; })).slice(0, 3);
      if (r.quem[t].length === 1 && ops.length >= 1) {
        var alts = VL.embaralhar([certa].concat(ops));
        qs.push({ enun: 'Na escala acima, quem está de quarto no dia ' + (Math.floor(t / 24) + 1) + ' às ' + hh(t) + '?', alts: alts, certa: alts.indexOf(certa), expl: 'Procure a linha do dia ' + (Math.floor(t / 24) + 1) + ' e a coluna das ' + h2(t) + ' h na grade: lá está ' + certa + '.', ref: 'escala gerada' });
      }
      var pp = r.porPessoa.filter(function (p) { return !p.fora; });
      if (pp.length) {
        var alvo = sortear(pp), val = alvo.tipica;
        var nums = VL.embaralhar([val, val + 2, Math.max(1, val - 2), val + 4].filter(function (x, i, a) { return a.indexOf(x) === i; })).slice(0, 4);
        if (nums.indexOf(val) < 0) nums[0] = val;
        qs.push({ enun: 'Na escala acima, quantas horas de folga ' + alvo.nome + ' costuma ter entre um quarto e o seguinte?', alts: nums.map(function (n) { return n + ' h'; }), certa: nums.indexOf(val), expl: 'Na grade, ' + alvo.nome + ' tem, em geral, ' + val + ' h de folga entre quartos (o maior descanso seguido é de ' + alvo.maior + ' h). Descontando vestir, comer e a passagem de quarto, sobra menos para dormir.', ref: 'escala gerada' });
      }
    }
    var fixas = [
      { enun: 'Para que servem os quartos de cão (16–18 e 18–20)?', alts: ['Para o dia ter um número ímpar de quartos e a escala girar', 'Porque o RIPEAM exige quartos mais curtos ao entardecer', 'Para o comandante ficar de quarto no pôr do sol', 'Para dar mais horas de quarto à equipe mais experiente'], certa: 0, expl: 'Com 6 quartos de 4 h e 3 equipes, cada equipe pega sempre os mesmos horários. Dividindo o quarto das 16–20 em dois, o dia fica com 7 quartos e a escala anda uma posição por dia. O RIPEAM não fixa duração de quarto.' },
      { enun: 'Às 03:00, de quarto, você vê as luzes verde e vermelha de um navio e a marcação dele não muda. O que fazer?', alts: ['Chamar o comandante já e seguir acompanhando a marcação', 'Esperar o fim do quarto para avisar quem entra', 'Acender as luzes do convés e seguir o rumo', 'Desligar o piloto e manobrar sem avisar ninguém'], certa: 0, expl: 'Verde e vermelha juntas: o navio vem de proa para você. Marcação constante com distância diminuindo indica risco de abalroamento (RIPEAM, Regra 7). É exatamente o caso de chamar o comandante na hora.', ref: 'RIPEAM, Regras 5 e 7' },
      { enun: 'Você vai sozinho ao convés à noite para folgar uma escota. O que fazer antes de sair da cabine?', alts: ['Vestir colete, prender o cinto à linha de vida antes de sair e avisar quem está dentro', 'Nada: é rápido e o mar está calmo', 'Levar a lanterna e ir sem colete para se mexer melhor', 'Esperar o próximo quarto para fazer junto'], certa: 0, expl: 'À noite, quem cai no mar quase não é visto. Colete com luz e cinto preso à linha de vida antes de sair, e alguém sabendo que você está lá fora.' },
      { enun: 'O que é importante passar para quem assume o quarto?', alts: ['Rumo, vento, velas, tráfego à vista, posição e o que mudou, anotando no diário de bordo', 'Só a hora em que o próximo deve ser acordado', 'Nada: quem entra lê o diário depois', 'Só a velocidade do barco'], certa: 0, expl: 'Na passagem de quarto, quem entra precisa saber a situação inteira antes de quem sai ir dormir: rumo e regulagem, previsão, embarcações à vista, pontos de perigo próximos e ordens do comandante.' },
      { enun: 'No 4 em 8 fora com 3 pessoas, sem quartos de cão, quem pega o quarto das 00:00 às 04:00 ao longo da viagem?', alts: ['Sempre a mesma pessoa, todos os dias', 'Uma pessoa diferente a cada dia', 'O comandante, por regra', 'Quem estiver menos cansado'], certa: 0, expl: 'Seis quartos por dia divididos por 3 equipes dá exatamente 2 voltas: a escala não gira. Por isso existem os quartos de cão, ou combina-se trocar a ordem de vez em quando.' },
      { enun: 'Quanto tempo antes do quarto convém acordar quem vai entrar?', alts: ['De 10 a 15 minutos antes, para se vestir e acostumar os olhos ao escuro', 'Exatamente na hora da troca', 'Uma hora antes', 'Só se o tempo estiver ruim'], certa: 0, expl: 'É prática comum chamar com alguns minutos de antecedência: a pessoa se veste, toma algo quente e acostuma a visão noturna (use luz vermelha dentro do barco). Assim a troca é no horário.' },
    ];
    return qs.concat(VL.embaralhar(fixas).slice(0, 4)).map(function (q) {
      if (q.certa === 0 && !q.ref) { /* embaralha mantendo a resposta */ }
      var idx = VL.embaralhar(q.alts.map(function (_, i) { return i; }));
      return { enun: q.enun, alts: idx.map(function (i) { return q.alts[i]; }), certa: idx.indexOf(q.certa), expl: q.expl, ref: q.ref };
    });
  }

  /* ---------- Impressão só da escala ---------- */
  function imprimir(conteudo) {
    var raiz = h('div', { class: 'qt-print-root' }, conteudo);
    document.body.appendChild(raiz);
    document.body.classList.add('qt-imprimindo');
    var feito = false;
    function fim() { if (feito) return; feito = true; document.body.classList.remove('qt-imprimindo'); raiz.remove(); window.removeEventListener('afterprint', fim); }
    window.addEventListener('afterprint', fim);
    try { window.print(); } catch (e) { /* sem impressão */ }
    setTimeout(fim, 1500);
    return fim;
  }

  VL.widgets.define('quartos', {
    css: ['assets/css/widgets/quartos.css'],
    mount: function (el, opts) {
      opts = opts || {};
      var nP = clamp(Math.round(Number(opts.pessoas) || 4), 2, 6);
      var nomes = NOMES.slice();
      if (Array.isArray(opts.nomes)) opts.nomes.slice(0, 6).forEach(function (n, i) { if (n) nomes[i] = String(n).slice(0, 18); });
      var sisIni = SISTEMAS[opts.sistema] ? opts.sistema : '4em8';
      var cfg = {
        n: nP, nomes: nomes, sistema: sisIni,
        dupla: opts.dupla != null ? !!opts.dupla : !!SISTEMAS[sisIni].dupla,
        comandante: 0, comandanteFora: !!opts.comandanteFora,
        dias: clamp(Math.round(Number(opts.dias) || 3), 1, 7),
        inicio: opts.inicio != null ? clamp(Math.round(Number(opts.inicio)) || 0, 0, 23) : (SISTEMAS[sisIni].inicio || 0),
      };
      var est = { modo: opts.modo === 'desafio' ? 'desafio' : 'planejar', hora: 0, larga: true };
      var fimImp = null;
      function cfgMotor() { return { pessoas: cfg.nomes.slice(0, cfg.n), sistema: cfg.sistema, dupla: cfg.dupla, comandante: cfg.comandante, comandanteFora: cfg.comandanteFora, dias: cfg.dias, inicio: cfg.inicio }; }

      var ins = VL.ui.instrumento({ titulo: opts.titulo || 'Quartos de serviço: quem vigia, quando e quanto descansa', controlesAntes: true });
      ins.raiz.classList.add('qt-raiz');
      el.appendChild(ins.raiz);
      var segModo = h('div', { class: 'segmented qt-modo', role: 'group', 'aria-label': 'Modo' });
      [['planejar', 'Planejar'], ['desafio', 'Desafio']].forEach(function (m) { segModo.appendChild(h('button', { type: 'button', 'data-v': m[0], onclick: function () { trocarModo(m[0]); } }, m[1])); });
      ins.controles.appendChild(segModo);
      var vPlan = h('div', { class: 'qt-plan' }), vDes = h('div', { class: 'qt-des' });
      ins.corpo.appendChild(h('div', { class: 'qt-corpo' }, vPlan, vDes));
      ins.legenda.appendChild(h('span', null, 'Vigilância permanente: RIPEAM, Regra 5. Noite considerada das 18:00 às 06:00 (aproximação). Horários do sistema sueco variam de barco para barco.'));

      /* ---------- Controles ---------- */
      var segN = h('div', { class: 'segmented qt-n', role: 'group', 'aria-label': 'Número de pessoas na tripulação' });
      [2, 3, 4, 5, 6].forEach(function (n) { segN.appendChild(h('button', { type: 'button', 'data-v': String(n), 'aria-label': n + ' pessoas', onclick: function () { cfg.n = n; if (cfg.comandante >= n) cfg.comandante = 0; montarNomes(); atualizar(); } }, String(n))); });
      var nomesCx = h('div', { class: 'qt-nomes' });
      var selCmd = h('select', { class: 'qt-sel', 'aria-label': 'Quem é o comandante' });
      selCmd.addEventListener('change', function () { cfg.comandante = Number(selCmd.value); atualizar(); });
      var swFora = h('input', { type: 'checkbox', role: 'switch' }); swFora.checked = cfg.comandanteFora;
      swFora.addEventListener('change', function () { cfg.comandanteFora = swFora.checked; atualizar(); });
      var swDupla = h('input', { type: 'checkbox', role: 'switch' }); swDupla.checked = cfg.dupla;
      swDupla.addEventListener('change', function () { cfg.dupla = swDupla.checked; atualizar(); });
      var cartoes = h('div', { class: 'qt-sistemas', role: 'radiogroup', 'aria-label': 'Sistema de quartos' });
      ORDEM.forEach(function (id) {
        var s = SISTEMAS[id];
        cartoes.appendChild(h('button', { type: 'button', role: 'radio', class: 'qt-sis', 'data-v': id, onclick: function () {
          cfg.sistema = id; cfg.dupla = !!s.dupla; swDupla.checked = cfg.dupla; cfg.inicio = s.inicio || 0; selIni.value = String(cfg.inicio);
          if (s.ideal && cfg.n < s.ideal && !s.dupla) { /* mantém: o aviso explica */ }
          if (id === '2em4' && cfg.n < 4) { cfg.n = 6; montarNomes(); }
          atualizar();
        } }, h('strong', null, s.nome), h('span', null, s.desc)));
      });
      var selIni = h('select', { class: 'qt-sel', 'aria-label': 'Hora em que começam os quartos' });
      for (var x = 0; x < 24; x++) selIni.appendChild(h('option', { value: String(x) }, hh(x)));
      selIni.value = String(cfg.inicio);
      selIni.addEventListener('change', function () { cfg.inicio = Number(selIni.value); atualizar(); });
      var segDias = h('div', { class: 'segmented qt-dias', role: 'group', 'aria-label': 'Dias mostrados' });
      [1, 2, 3, 5, 7].forEach(function (d) { segDias.appendChild(h('button', { type: 'button', 'data-v': String(d), 'aria-label': d + (d === 1 ? ' dia' : ' dias'), onclick: function () { cfg.dias = d; atualizar(); } }, String(d))); });
      var descSis = h('p', { class: 'qt-sis-desc' });

      function montarNomes() {
        nomesCx.innerHTML = '';
        for (var i = 0; i < cfg.n; i++) {
          (function (i) {
            var inp = h('input', { type: 'text', class: 'qt-nome', maxlength: '18', 'aria-label': 'Nome da pessoa ' + (i + 1), value: cfg.nomes[i] });
            inp.addEventListener('input', function () { cfg.nomes[i] = inp.value.trim() || NOMES[i]; atualizar(true); });
            nomesCx.appendChild(h('div', { class: 'qt-nome-cx' }, h('span', { class: 'qt-pino qt-p' + i, 'aria-hidden': 'true' }, String(i + 1)), inp));
          })(i);
        }
        selCmd.innerHTML = '';
        for (var j = 0; j < cfg.n; j++) selCmd.appendChild(h('option', { value: String(j) }, cfg.nomes[j]));
        selCmd.value = String(cfg.comandante);
      }

      var avisos = h('div', { class: 'qt-avisos', 'aria-live': 'polite' });
      var resumo = h('p', { class: 'qt-resumo' });
      var gradeCx = h('div', { class: 'qt-grade-cx' });
      var legendaEq = h('div', { class: 'qt-leg' });
      var faixa = h('input', { type: 'range', min: '0', max: '71', step: '1', class: 'qt-faixa', 'aria-label': 'Hora escolhida na escala' });
      faixa.addEventListener('input', function () { est.hora = Number(faixa.value); mostrarAgora(); marcarHora(); });
      var agora = h('div', { class: 'qt-agora', 'aria-live': 'polite' });
      var tabPessoas = h('div', { class: 'table-wrap qt-tab' });
      var listaBlocos = h('details', { class: 'qt-blocos' }, h('summary', null, 'Lista por horário'), h('div', { class: 'qt-blocos-corpo' }));
      var btnImp = h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { fimImp = imprimir(conteudoImpressao()); } }, VL.icon('download', 18), 'Imprimir a escala');
      var btnCsv = h('button', { type: 'button', class: 'btn btn-ghost', onclick: baixarCsv }, 'Baixar planilha (CSV)');
      var btnTxt = h('button', { type: 'button', class: 'btn btn-ghost', onclick: copiarTexto }, 'Copiar texto');

      vPlan.appendChild(h('div', { class: 'qt-config' },
        h('div', { class: 'qt-linha' }, h('span', { class: 'qt-rot' }, 'Tripulação'), segN),
        nomesCx,
        h('div', { class: 'qt-linha' }, h('label', { class: 'qt-campo' }, h('span', { class: 'qt-rot' }, 'Comandante'), selCmd),
          h('label', { class: 'switch qt-sw' }, swFora, h('span', null, 'Fora da escala, de sobreaviso')),
          h('label', { class: 'switch qt-sw' }, swDupla, h('span', null, 'Quartos em dupla'))),
        h('p', { class: 'qt-rot qt-rot-bloco' }, 'Sistema'),
        cartoes, descSis,
        h('div', { class: 'qt-linha' }, h('label', { class: 'qt-campo' }, h('span', { class: 'qt-rot' }, 'Horários começam às'), selIni), h('span', { class: 'qt-campo' }, h('span', { class: 'qt-rot' }, 'Dias'), segDias))));
      vPlan.appendChild(avisos);
      vPlan.appendChild(h('section', { class: 'qt-saida', 'aria-label': 'Escala gerada' }, resumo, legendaEq, gradeCx,
        h('div', { class: 'qt-agora-cx' }, h('label', { class: 'qt-rot', for: null }, 'Quem está de quarto às…'), faixa, agora),
        tabPessoas, listaBlocos, h('div', { class: 'btn-row qt-acoes' }, btnImp, btnCsv, btnTxt)));
      vPlan.appendChild(VL.ui.callout('seguranca', 'Segurança nos quartos', h('ul', { class: 'qt-dicas' },
        h('li', null, h('strong', null, 'À noite, com mau tempo ou sozinho no convés: '), 'colete com luz e cinto preso à linha de vida antes de sair da cabine. Ninguém vai à proa sem avisar quem está no cockpit.'),
        h('li', null, h('strong', null, 'Vigilância o tempo todo: '), 'olhe em volta a cada poucos minutos, 360 graus, e escute (RIPEAM, Regra 5). Piloto automático não vigia.'),
        h('li', null, h('strong', null, 'Chame o comandante '), 'quando: houver embarcação com marcação constante ou qualquer dúvida sobre o rumo dela (RIPEAM, Regra 7); o vento ou o mar aumentarem ou for preciso rizar; a pressão cair rápido ou o tempo mudar; luzes, terra ou profundidade não baterem com o esperado; houver avaria; houver qualquer dúvida. Na dúvida, chame.'),
        h('li', null, h('strong', null, 'Passagem de quarto: '), 'rumo, vento, velas, tráfego à vista, posição e o que mudou. Anote no diário de bordo a cada hora.'),
        h('li', null, h('strong', null, 'Acorde quem entra 10 a 15 minutos antes; '), 'use luz vermelha dentro do barco para não ofuscar quem está de vigia.')),
      ));
      vPlan.appendChild(h('p', { class: 'qt-miudo' }, 'As ordens do comandante acima são exemplos comuns de boa marinharia: combine as suas, por escrito, antes de sair.'));

      var ultimo = null;
      var nomeEq = function (r, ei) { return r.equipes[ei].map(function (p) { return cfg.nomes[p]; }).join(' e '); };
      var inic = function (nm) { return (nm || '?').trim().slice(0, 2); };

      function atualizar(soNomes) {
        var c = cfgMotor(), r = gerar(c); ultimo = r;
        VL.$$('button', segN).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === String(cfg.n))); });
        VL.$$('button', segDias).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === String(cfg.dias))); });
        VL.$$('.qt-sis', cartoes).forEach(function (b) { var on = b.getAttribute('data-v') === cfg.sistema; b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; });
        descSis.textContent = r.sis.desc;
        if (!soNomes) { /* nomes no seletor do comandante */ }
        VL.$$('option', selCmd).forEach(function (o, i) { o.textContent = cfg.nomes[i]; });
        swDupla.disabled = !!r.sis.escal;
        swDupla.parentNode.classList.toggle('qt-desligado', !!r.sis.escal);
        // avisos
        avisos.innerHTML = '';
        r.avisos.forEach(function (a) { avisos.appendChild(h('p', { class: 'qt-aviso' }, a)); });
        if (cfg.n === 2 && !cfg.comandanteFora && !r.sis.escal) avisos.appendChild(h('p', { class: 'qt-aviso qt-aviso-nota' }, 'Com 2 pessoas não há folga de verdade: cada um descansa só enquanto o outro vigia. Planeje cochilos curtos de dia, piloto automático e etapas mais curtas.'));
        // resumo do sistema
        var NE = r.equipes.length;
        resumo.innerHTML = '';
        if (NE) {
          var durTxt;
          if (r.sis.escal) durTxt = 'Cada pessoa fica 4 h de quarto e folga ' + (NE * 2 - 4) + ' h; troca uma pessoa a cada 2 h, sempre duas no convés.';
          else if (r.sis.ciclo) durTxt = r.sis.nome + ' com ' + NE + (NE === 1 ? ' equipe' : ' equipes') + ': quartos de ' + r.sis.ciclo.filter(function (v, i, a) { return a.indexOf(v) === i; }).join(' e ') + ' h.';
          else durTxt = r.sis.dur + ' h de quarto e ' + (r.sis.dur * (NE - 1)) + ' h de folga (' + NE + (NE === 1 ? ' equipe' : ' equipes') + (cfg.dupla ? ' em dupla' : '') + ').';
          resumo.appendChild(h('strong', null, durTxt + ' '));
          resumo.appendChild(document.createTextNode(r.gira ? 'A escala gira: os horários de cada um mudam de um dia para o outro.' : 'Sem rodízio: cada um pega sempre os mesmos horários (compare os dias na grade).'));
        }
        // legenda das equipes
        legendaEq.innerHTML = '';
        r.equipes.forEach(function (e, ei) { legendaEq.appendChild(h('span', { class: 'qt-leg-item' }, h('i', { class: 'qt-e qt-e' + ei }), nomeEq(r, ei))); });
        if (cfg.comandanteFora) legendaEq.appendChild(h('span', { class: 'qt-leg-item qt-leg-fora' }, cfg.nomes[cfg.comandante] + ' (comandante): de sobreaviso'));
        desenharGrade(r);
        faixa.max = String(r.T - 1);
        est.hora = clamp(est.hora, 0, r.T - 1); faixa.value = String(est.hora);
        mostrarAgora(); marcarHora();
        desenharPessoas(r);
        desenharBlocos(r);
      }

      function celula(r, t, tag) {
        var td = h(tag || 'td', { class: 'qt-c' + ((t % 24 >= 18 || t % 24 < 6) ? ' qt-noite' : ''), 'data-t': String(t) });
        var q = r.quem[t];
        if (q.length === 1) td.classList.add('qt-e' + q[0]);
        if (q.length > 1) td.classList.add('qt-multi');
        q.forEach(function (ei) { td.appendChild(h('span', { class: 'qt-ini qt-e' + ei }, r.equipes[ei].map(function (p) { return inic(cfg.nomes[p]); }).join('+'))); });
        td.title = 'Dia ' + (Math.floor(t / 24) + 1) + ', ' + hh(t) + ': ' + (q.length ? q.map(function (ei) { return nomeEq(r, ei); }).join(' e ') : 'ninguém');
        td.addEventListener('click', function () { est.hora = t; faixa.value = String(t); mostrarAgora(); marcarHora(); });
        return td;
      }
      function desenharGrade(r) {
        gradeCx.innerHTML = '';
        var dias = cfg.dias, tab, thead, tbody, tr;
        if (est.larga) {
          tab = h('table', { class: 'qt-grade qt-grade-h' }, h('caption', { class: 'visually-hidden' }, 'Grade de quartos: dias nas linhas, horas nas colunas'));
          thead = h('thead'); tr = h('tr', null, h('th', { scope: 'col', class: 'qt-th-dia' }, 'Dia'));
          for (var x2 = 0; x2 < 24; x2++) tr.appendChild(h('th', { scope: 'col', class: (x2 >= 18 || x2 < 6) ? 'qt-noite' : '' }, h2(x2)));
          thead.appendChild(tr); tab.appendChild(thead);
          tbody = h('tbody');
          for (var d = 0; d < dias; d++) {
            tr = h('tr', null, h('th', { scope: 'row', class: 'qt-th-dia' }, String(d + 1)));
            for (var x3 = 0; x3 < 24; x3++) tr.appendChild(celula(r, d * 24 + x3));
            tbody.appendChild(tr);
          }
          tab.appendChild(tbody);
        } else {
          tab = h('table', { class: 'qt-grade qt-grade-v' }, h('caption', { class: 'visually-hidden' }, 'Grade de quartos: horas nas linhas, dias nas colunas'));
          thead = h('thead'); tr = h('tr', null, h('th', { scope: 'col' }, 'Hora'));
          for (var d2 = 0; d2 < dias; d2++) tr.appendChild(h('th', { scope: 'col' }, 'Dia ' + (d2 + 1)));
          thead.appendChild(tr); tab.appendChild(thead);
          tbody = h('tbody');
          for (var x4 = 0; x4 < 24; x4++) {
            tr = h('tr', null, h('th', { scope: 'row', class: (x4 >= 18 || x4 < 6) ? 'qt-noite' : '' }, h2(x4)));
            for (var d3 = 0; d3 < dias; d3++) tr.appendChild(celula(r, d3 * 24 + x4));
            tbody.appendChild(tr);
          }
          tab.appendChild(tbody);
        }
        gradeCx.appendChild(tab);
        gradeCx.appendChild(h('p', { class: 'qt-miudo' }, 'Toque numa hora para ver quem está de quarto. Faixa escura: noite (18:00 às 06:00).'));
      }
      function marcarHora() {
        VL.$$('.qt-c', gradeCx).forEach(function (c) { c.classList.toggle('qt-sel-h', c.getAttribute('data-t') === String(est.hora)); });
      }
      function mostrarAgora() {
        var r = ultimo; if (!r) return;
        var t = est.hora, q = r.quem[t];
        agora.innerHTML = '';
        var titulo = 'Dia ' + (Math.floor(t / 24) + 1) + ', ' + hh(t);
        faixa.setAttribute('aria-valuetext', titulo);
        var bl = null;
        r.blocos.forEach(function (b) { if (t >= b.ini && t < b.fim && !bl) bl = b; });
        var prox = null;
        r.blocos.forEach(function (b) { if (!prox && b.ini > t && b.eq.join() !== (bl ? bl.eq.join() : '')) prox = b; });
        agora.appendChild(h('p', { class: 'qt-agora-t' }, titulo));
        agora.appendChild(h('p', null, h('strong', null, 'De quarto: '), q.length ? q.map(function (ei) { return nomeEq(r, ei); }).join(' e ') : 'ninguém (escala vazia)', bl && !r.sis.escal ? ' (das ' + hh(bl.ini0 != null ? bl.ini0 : bl.ini) + ' às ' + hh(bl.ini0 != null ? bl.ini0 + bl.dur : bl.fim) + ')' : ''));
        if (prox) {
          var entra = r.sis.escal ? prox.eq.filter(function (e) { return q.indexOf(e) < 0; }) : prox.eq;
          var acorda = (prox.ini - 1);
          agora.appendChild(h('p', null, h('strong', null, 'Próxima troca: '), hh(prox.ini) + ', entra ' + entra.map(function (ei) { return nomeEq(r, ei); }).join(' e ') + '. Chame às ' + h2(acorda) + ':45.'));
        }
        if (cfg.comandanteFora) agora.appendChild(h('p', { class: 'qt-miudo' }, cfg.nomes[cfg.comandante] + ', comandante, fica de sobreaviso: pode ser chamado a qualquer hora.'));
      }
      function desenharPessoas(r) {
        tabPessoas.innerHTML = '';
        var tb = h('tbody');
        r.porPessoa.forEach(function (p, i) {
          tb.appendChild(h('tr', null,
            h('th', { scope: 'row' }, h('i', { class: 'qt-e ' + (p.fora ? 'qt-e-fora' : 'qt-e' + p.eq), 'aria-hidden': 'true' }), ' ', p.nome, i === cfg.comandante ? h('span', { class: 'qt-cmd' }, ' comandante') : null),
            p.fora ? h('td', { colspan: '4', class: 'qt-miudo' }, 'Fora da escala, de sobreaviso. Também precisa dormir: combine quando pode ser chamado.') : [
              h('td', null, VL.fmt.num(p.horasDia, 1) + ' h'),
              h('td', null, VL.fmt.num(p.noiteDia, 1) + ' h'),
              h('td', null, p.tipica + ' h'),
              h('td', null, p.maior + ' h'),
            ]));
        });
        tabPessoas.appendChild(h('table', { class: 'tabela' }, h('caption', { class: 'visually-hidden' }, 'Horas por pessoa'),
          h('thead', null, h('tr', null, h('th', null, 'Pessoa'), h('th', { title: 'Horas de quarto por dia, em média' }, 'Quarto/dia'), h('th', { title: 'Horas de quarto entre 18:00 e 06:00, por dia' }, 'À noite'), h('th', { title: 'Folga mais comum entre um quarto e o seguinte' }, 'Folga típica'), h('th', { title: 'Maior descanso seguido no período mostrado' }, 'Maior folga'))), tb));
      }
      function desenharBlocos(r) {
        var corpo = VL.$('.qt-blocos-corpo', listaBlocos); corpo.innerHTML = '';
        for (var d = 0; d < cfg.dias; d++) {
          var ul = h('ul', { class: 'qt-blocos-lista' });
          r.blocos.forEach(function (b) {
            if (Math.floor(b.ini / 24) !== d) return;
            var fim = r.sis.escal ? b.fim : b.fim;
            ul.appendChild(h('li', null, h('span', { class: 'qt-hora' }, hh(b.ini) + '–' + hh(fim)), ' ', b.eq.map(function (ei) { return nomeEq(r, ei); }).join(' e ')));
          });
          corpo.appendChild(h('div', { class: 'qt-blocos-dia' }, h('h4', null, 'Dia ' + (d + 1)), ul));
        }
      }
      function linhasTexto() {
        var r = ultimo, out = [];
        out.push('Escala de quartos — ' + r.sis.nome + (cfg.dupla && !r.sis.escal ? ' (em dupla)' : ''));
        if (cfg.comandanteFora) out.push('Comandante de sobreaviso: ' + cfg.nomes[cfg.comandante]);
        for (var d = 0; d < cfg.dias; d++) {
          out.push('Dia ' + (d + 1) + ':');
          r.blocos.forEach(function (b) { if (Math.floor(b.ini / 24) === d) out.push('  ' + hh(b.ini) + '–' + hh(b.fim) + '  ' + b.eq.map(function (ei) { return nomeEq(r, ei); }).join(' e ')); });
        }
        out.push('Colete e linha de vida à noite. Na dúvida, chame o comandante.');
        return out;
      }
      function copiarTexto() {
        var t = linhasTexto().join('\n');
        var ok = function () { VL.ui.toast('Escala copiada.'); };
        var falha = function () { VL.ui.dialogo({ titulo: 'Copie a escala', corpo: h('textarea', { class: 'qt-copia', rows: '12', readonly: true }, t) }); };
        try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, falha); else falha(); } catch (e) { falha(); }
      }
      function baixarCsv() {
        var r = ultimo, linhas = [['Dia', 'Hora'].concat(cfg.nomes.slice(0, cfg.n)).join(';')];
        for (var t = 0; t < r.T; t++) {
          var cols = [String(Math.floor(t / 24) + 1), hh(t)];
          r.porPessoa.forEach(function (p) { cols.push(p.fora ? 'sobreaviso' : (p.on[t] ? 'quarto' : '')); });
          linhas.push(cols.join(';'));
        }
        var blob = new Blob(['﻿' + linhas.join('\r\n')], { type: 'text/csv;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = h('a', { href: url, download: 'escala-de-quartos.csv' });
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
      }
      function conteudoImpressao() {
        var r = ultimo;
        var salvo = est.larga; est.larga = true;
        var cx = h('div');
        var g0 = gradeCx; gradeCx = cx; desenharGrade(r); gradeCx = g0; est.larga = salvo;
        return h('div', { class: 'qt-impresso' },
          h('h2', null, 'Escala de quartos: ' + r.sis.nome + (cfg.dupla && !r.sis.escal ? ' (em dupla)' : '')),
          h('p', null, legendaEq.textContent ? Array.prototype.map.call(legendaEq.children, function (c) { return c.textContent; }).join(' · ') : ''),
          cx, tabPessoas.cloneNode(true),
          h('p', null, 'Colete e cinto preso à linha de vida à noite, com mau tempo ou sozinho no convés. Na dúvida, chame o comandante. Vigilância permanente: RIPEAM, Regra 5.'));
      }

      /* ---------- Desafio ---------- */
      var des = { lista: [], i: 0, acertos: 0 };
      function novoDesafio() { des = { lista: perguntas(cfgMotor(), ultimo || gerar(cfgMotor())), i: 0, acertos: 0 }; mostrarPergunta(); }
      function mostrarPergunta() {
        vDes.innerHTML = '';
        if (des.i >= des.lista.length) {
          vDes.appendChild(h('div', { class: 'resultado', 'data-aprovado': des.acertos / des.lista.length >= 0.7 ? '1' : '0' },
            h('p', { class: 'stat-v' }, des.acertos + ' de ' + des.lista.length),
            h('p', null, 'As perguntas sobre a grade usam a escala que está montada no modo planejar. Mude a tripulação ou o sistema e tente de novo.'),
            h('div', { class: 'btn-row' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: novoDesafio }, 'Nova rodada'), h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { trocarModo('planejar'); } }, 'Voltar a planejar'))));
          return;
        }
        var q = des.lista[des.i], resp = false;
        vDes.appendChild(h('div', { class: 'qt-des-cab' }, h('span', null, 'Pergunta ' + (des.i + 1) + ' de ' + des.lista.length), h('strong', null, des.acertos + (des.acertos === 1 ? ' acerto' : ' acertos'))));
        vDes.appendChild(VL.ui.medidor(des.i / des.lista.length));
        if (q.ref === 'escala gerada') {
          var mini = h('div', { class: 'qt-grade-cx qt-grade-des' });
          var g0 = gradeCx; gradeCx = mini; desenharGrade(ultimo); gradeCx = g0;
          vDes.appendChild(mini);
        }
        vDes.appendChild(h('p', { class: 'questao-enunciado qt-enun' }, q.enun));
        var lista = h('div', { class: 'alternativas', role: 'radiogroup', 'aria-label': 'Alternativas' });
        var expl = h('div', { class: 'explicacao', hidden: true, 'aria-live': 'polite' });
        var prox = h('button', { type: 'button', class: 'btn btn-primary', hidden: true, onclick: function () { des.i++; mostrarPergunta(); } }, des.i + 1 < des.lista.length ? 'Próxima pergunta' : 'Ver resultado');
        q.alts.forEach(function (txt, k) {
          lista.appendChild(h('button', { type: 'button', class: 'alternativa', role: 'radio', 'aria-checked': 'false', onclick: function () {
            if (resp) return; resp = true;
            var ok = k === q.certa; if (ok) des.acertos++;
            VL.$$('.alternativa', lista).forEach(function (b, j) { b.disabled = true; if (j === q.certa) b.setAttribute('data-res', 'certa'); else if (j === k) b.setAttribute('data-res', 'errada'); if (j === k) b.setAttribute('aria-checked', 'true'); });
            expl.hidden = false; expl.innerHTML = '';
            expl.appendChild(h('p', { class: 'explicacao-res', 'data-ok': ok ? '1' : '0' }, ok ? 'Certo.' : 'Não é essa.'));
            expl.appendChild(h('p', { class: 'mb-0' }, q.expl));
            if (q.ref && q.ref !== 'escala gerada') expl.appendChild(h('p', { class: 'qt-miudo mb-0' }, q.ref));
            prox.hidden = false; prox.focus();
          } }, h('span', { class: 'alternativa-letra' }, 'ABCD'[k]), h('span', null, txt)));
        });
        vDes.appendChild(lista); vDes.appendChild(expl); vDes.appendChild(h('div', { class: 'btn-row qt-des-rodape' }, prox));
      }

      function trocarModo(m) {
        est.modo = m;
        vPlan.hidden = m !== 'planejar'; vDes.hidden = m !== 'desafio';
        VL.$$('button', segModo).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === m)); });
        if (m === 'desafio') novoDesafio();
      }

      // teclado nos cartões de sistema (setas)
      cartoes.addEventListener('keydown', function (e) {
        if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].indexOf(e.key) < 0) return;
        e.preventDefault();
        var i = ORDEM.indexOf(cfg.sistema) + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1);
        i = (i + ORDEM.length) % ORDEM.length;
        var b = VL.$$('.qt-sis', cartoes)[i]; b.click(); b.focus();
      });

      // largura: grade horizontal (dias nas linhas) ou vertical (horas nas linhas)
      var ro = null;
      function medir() {
        var larga = ins.corpo.clientWidth >= 640;
        if (larga !== est.larga) { est.larga = larga; if (ultimo) desenharGrade(ultimo), marcarHora(); }
      }
      if ('ResizeObserver' in window) { ro = new ResizeObserver(medir); ro.observe(ins.corpo); }
      est.larga = (ins.corpo.clientWidth || 800) >= 640;

      montarNomes();
      atualizar();
      trocarModo(est.modo);

      return function limpar() { if (ro) ro.disconnect(); if (fimImp) fimImp(); };
    },
  });

  VL.quartos = { gerar: gerar, SISTEMAS: SISTEMAS };
})();
