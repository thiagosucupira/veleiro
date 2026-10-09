/* provisoes — calculadora de provisões e autonomia para uma travessia (tudo é ESTIMATIVA de planejamento).

   Entradas: distância (mn), velocidade média estimada (nós), margem de segurança (%), tripulação, água por pessoa/dia,
   refeições e lanches por dia, motor (consumo em L/h, parte da distância a motor, velocidade a motor, horas por dia
   para carregar baterias, reserva %), gás de cozinha (horas de fogo por dia, consumo por boca, tamanho do botijão),
   capacidades dos tanques do barco. Saída: dias de viagem, tabela por dia / viagem / com margem, comparação com os
   tanques e uma lista de verificação (kit médico, pirotécnicos, sobressalentes etc.).

   Fórmulas mostradas na interface:
     dias = distância ÷ (velocidade × 24);  dias com margem = dias × (1 + margem)
     horas de motor = (distância × parte a motor ÷ velocidade a motor) + horas de bateria por dia × dias com margem
     gás (kg) = horas de fogo por dia × consumo por boca (kg/h) × dias com margem
     (consumo padrão de 0,12 kg/h ≈ boca de 1,5 kW, com GLP de cerca de 46 MJ/kg = 12,8 kWh/kg)

   Itens obrigatórios citados (com selo "a confirmar" — confira a versão vigente e a classificação do seu TIE):
     NORMAM-211/DPC (2026), 4.13 balsa salva-vidas; 4.14 coletes; 4.17 pirotécnicos; 4.18.3 refletor radar;
     4.22 medicamentos (recomendação); 4.24.2 radiocomunicações; 4.35 tabela da navegação oceânica (GPS 02 unidades).

   opts de mount (todos opcionais):
     distancia: 1200     milhas náuticas
     velocidade: 5       nós (média estimada da travessia)
     margem: 25          % sobre o tempo de viagem
     tripulacao: 4
     agua: 4             litros por pessoa por dia
     navegacao: 'oceanica' | 'costeira'   lista de itens obrigatórios exibida
     modo: 'calcular' | 'exercicio'       padrão 'calcular'
     lembrar: true       guarda os valores digitados neste navegador
     titulo: texto da legenda do instrumento

   Exemplos de bloco de lição:
     {t:'widget', w:'provisoes', opts:{distancia:1650, velocidade:5, tripulacao:4}}
     {t:'widget', w:'provisoes', opts:{modo:'exercicio'}}
     {t:'widget', w:'provisoes', opts:{distancia:180, navegacao:'costeira', lembrar:false}} */
(function () {
  'use strict';
  var h = VL.h;
  function n1(x) { return VL.fmt.num(x, Math.abs(x) < 100 && Math.abs(x % 1) >= 0.05 && Math.abs(x % 1) < 0.95 ? 1 : 0); }
  function n0(x) { return VL.fmt.num(Math.round(x), 0); }
  function clamp(x, a, b) { return x < a ? a : (x > b ? b : x); }
  /* Lê "1.200", "1200", "5,5" e "5.5". Com vírgula, os pontos são de milhar; sem vírgula, "1.200" é milhar e "5.5" é decimal. */
  function lerNum(t) {
    var s = String(t == null ? '' : t).trim().replace(/\s/g, '');
    if (!s) return NaN;
    if (s.indexOf(',') >= 0) s = s.replace(/\./g, '').replace(',', '.');
    else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
    var x = Number(s);
    return isFinite(x) ? x : NaN;
  }
  var lerNumSimples = lerNum;

  var PADRAO = {
    distancia: 1200, velocidade: 5, margem: 25, tripulacao: 4,
    agua: 4, tanqueAgua: 200,
    refeicoes: 3, lanches: 2,
    consumo: 2, parteMotor: 15, velMotor: 5.5, bateria: 1, reservaComb: 30, tanqueComb: 100,
    fogo: 1, kgh: 0.12, botijao: 5,
  };
  var BOTIJOES = [[2, 'P2 (2 kg)'], [5, 'P5 (5 kg)'], [13, 'P13 (13 kg)']];

  /* ---------- Cálculo (puro, testável) ---------- */
  function calcular(v) {
    var r = {};
    r.diasBase = v.distancia / (v.velocidade * 24);
    r.dias = r.diasBase * (1 + v.margem / 100);
    r.diasPlan = Math.ceil(r.dias - 1e-9);
    r.mnDia = v.velocidade * 24;
    r.aguaDia = v.agua * v.tripulacao;
    r.aguaBase = r.aguaDia * r.diasBase;
    r.agua = r.aguaDia * r.dias;
    r.refeicoes = v.refeicoes * v.tripulacao * r.diasPlan;
    r.lanches = v.lanches * v.tripulacao * r.diasPlan;
    r.hMotorProp = (v.distancia * v.parteMotor / 100) / Math.max(0.1, v.velMotor);
    r.hMotorBat = v.bateria * r.dias;
    r.hMotor = r.hMotorProp + r.hMotorBat;
    r.combBase = r.hMotor * v.consumo;
    r.comb = r.combBase * (1 + v.reservaComb / 100);
    r.autonomiaMn = v.consumo > 0 ? v.tanqueComb / v.consumo * v.velMotor : Infinity;
    r.autonomiaH = v.consumo > 0 ? v.tanqueComb / v.consumo : Infinity;
    r.gasDia = v.fogo * v.kgh;
    r.gasBase = r.gasDia * r.diasBase;
    r.gas = r.gasDia * r.dias;
    r.botijoes = Math.ceil(r.gas / v.botijao - 1e-9);
    r.faltaAgua = Math.max(0, r.agua - v.tanqueAgua);
    r.faltaComb = Math.max(0, r.comb - v.tanqueComb);
    return r;
  }

  /* ---------- Lista de verificação ---------- */
  // ref: texto da norma; q: true = mostra selo "a confirmar"; nav: só para 'oceanica' ou 'costeira'
  function listaItens(nav) {
    var oc = nav === 'oceanica';
    return [
      { g: 'Segurança exigida pela Marinha', itens: [
        { id: 'piro', t: oc ? 'Pirotécnicos: 4 foguetes manuais estrela vermelha com paraquedas, 4 fachos manuais luz vermelha e 4 sinais fumígenos flutuantes laranja, dentro da validade' : 'Pirotécnicos: 2 foguetes manuais estrela vermelha com paraquedas, 2 fachos manuais luz vermelha e 2 sinais fumígenos flutuantes laranja, dentro da validade', ref: 'NORMAM-211/DPC, 4.17', q: true },
        { id: 'colete', t: oc ? 'Coletes salva-vidas classe I (SOLAS), um por pessoa a bordo (tamanho infantil se houver criança)' : 'Coletes salva-vidas classe II, um por pessoa a bordo (tamanho infantil se houver criança)', ref: 'NORMAM-211/DPC, 4.14', q: true },
        oc ? { id: 'balsa', t: 'Balsa salva-vidas inflável para 100% das pessoas a bordo (pode ser classe II), com a revisão em dia', ref: 'NORMAM-211/DPC, 4.13', q: true } : null,
        oc ? { id: 'epirb', t: 'EPIRB 406 MHz com bateria na validade e registro atualizado', ref: 'NORMAM-211/DPC, 4.24.2 e 4.35', q: true } : null,
        { id: 'radio', t: oc ? 'VHF com DSC e HF com DSC (ou telefone ou comunicador satelital que envie mensagem de socorro); antena de emergência se a do VHF fica no tope do mastro' : 'VHF com DSC; antena de emergência se a do VHF fica no tope do mastro', ref: 'NORMAM-211/DPC, 4.24.2', q: true },
        oc ? { id: 'gps', t: 'Dois GPS (um pode ser portátil, com pilhas)', ref: 'NORMAM-211/DPC, 4.35', q: true } : null,
        { id: 'radar', t: 'Refletor radar', ref: 'NORMAM-211/DPC, 4.18.3', q: true },
        { id: 'lanterna', t: 'Lanterna portátil com pilhas ou bateria de reserva', ref: 'NORMAM-211/DPC, 4.18.2', q: true },
      ].filter(Boolean) },
      { g: 'Pessoas e convés', itens: [
        { id: 'arnes', t: 'Cinto (arnês) para cada pessoa, linhas de vida instaladas de proa a popa e pontos de engate no cockpit' },
        { id: 'mob', t: 'Boia de homem ao mar com luz, retinida flutuante e plano de resgate ensaiado com a tripulação' },
        { id: 'luzcol', t: 'Luz e apito em cada colete; lanterna de cabeça com luz vermelha para a noite' },
        { id: 'abandono', t: 'Bolsa de abandono pronta: água, sinalizadores portáteis, VHF portátil, rádio-baliza pessoal, documentos, remédios' },
      ] },
      { g: 'Saúde', itens: [
        { id: 'medico', t: 'Kit de primeiros socorros e caixa de medicamentos compatíveis com a área e a tripulação (a Marinha recomenda a "caixa de medicamentos" do anexo 4-C para mar aberto com menos de 15 pessoas)', ref: 'NORMAM-211/DPC, 4.22', q: true },
        { id: 'enjoo', t: 'Remédio para enjoo para todos, testado antes da viagem; protetor solar, chapéu e óculos' },
        { id: 'pessoais', t: 'Remédios de uso contínuo de cada tripulante, com sobra para a margem de dias' },
        { id: 'manual', t: 'Guia de primeiros socorros a bordo e contato de orientação médica por rádio ou satélite' },
      ] },
      { g: 'Motor, peças e ferramentas', itens: [
        { id: 'impelidor', t: 'Rotores (impelidores) da bomba de água salgada do motor' },
        { id: 'filtros', t: 'Filtros de diesel (separador e fino), filtro de óleo e óleo para uma troca' },
        { id: 'correia', t: 'Correia do alternador, fusíveis e lâmpadas das luzes de navegação' },
        { id: 'bujoes', t: 'Bujões de madeira (cone) presos junto a cada passagem de casco' },
        { id: 'bomba', t: 'Bomba de porão manual operável do cockpit e baldes' },
        { id: 'ferramentas', t: 'Ferramentas, fita de reparo de vela, agulha e linha, cabos e manilhas de reserva, epóxi de cura na água' },
        { id: 'corte', t: 'Alicate ou serra de corte para cabos de aço (em caso de mastro quebrado)' },
      ] },
      { g: 'Navegação e tempo', itens: [
        { id: 'cartas', t: 'Cartas náuticas de papel da rota e dos portos de abrigo, régua paralela e compasso' },
        { id: 'agulha', t: 'Agulha magnética de governo com curva de desvio em dia; agulha de marcação' },
        { id: 'previsao', t: 'Forma de receber previsão do tempo no mar (rádio, satélite) e os boletins da Marinha antes de sair' },
        { id: 'diario', t: 'Diário de bordo com plano de quartos e procedimentos de emergência afixados' },
      ] },
      { g: 'Água, comida e cozinha', itens: [
        { id: 'galoes', t: 'Parte da água em galões separados do tanque (se o tanque contaminar ou vazar, você não perde tudo)' },
        { id: 'primeiros', t: 'Refeições prontas para os primeiros dias (até a tripulação se adaptar ao mar)' },
        { id: 'gasseg', t: 'Gás: registro fechado quando não usa, detector de gás e botijão em local ventilado' },
        { id: 'extintor', t: 'Extintores na validade, perto do motor, no comando e na cozinha' },
      ] },
      { g: 'Documentos', itens: [
        { id: 'docs', t: 'Habilitação compatível com a área de navegação, TIE da embarcação e documentos da tripulação' },
        { id: 'plano', t: 'Plano de viagem e rota deixados com alguém em terra, com horário previsto de chegada' },
      ] },
    ];
  }

  /* ---------- Exercícios ---------- */
  function sortear(a) { return a[Math.floor(Math.random() * a.length)]; }
  function exercicio() {
    var tipo = sortear(['dias', 'agua', 'comb', 'gas', 'agua', 'dias']);
    var v = Object.assign({}, PADRAO, {
      distancia: sortear([600, 900, 1200, 1500, 1800, 2400, 3000]),
      velocidade: sortear([4, 4.5, 5, 5.5, 6]),
      margem: sortear([20, 25, 30, 50]),
      tripulacao: sortear([2, 3, 4, 5, 6]),
      agua: sortear([3, 3.5, 4, 5]),
      consumo: sortear([1.5, 2, 2.5, 3]),
      parteMotor: sortear([10, 15, 20]),
      velMotor: sortear([5, 5.5, 6]),
      bateria: sortear([0.5, 1, 1.5]),
      reservaComb: sortear([20, 30]),
      fogo: sortear([0.75, 1, 1.5]),
    });
    var r = calcular(v), q;
    var base = 'Travessia de ' + n0(v.distancia) + ' mn a ' + n1(v.velocidade) + ' nós de média, margem de ' + v.margem + '%. ';
    if (tipo === 'dias') q = { enun: base + 'Quantos dias de viagem você deve planejar, já com a margem?', un: 'dias', valor: r.dias, tol: 0.06,
      passos: ['Por dia: ' + n1(v.velocidade) + ' nós × 24 h = ' + n0(r.mnDia) + ' mn.', 'Sem margem: ' + n0(v.distancia) + ' ÷ ' + n0(r.mnDia) + ' = ' + n1(r.diasBase) + ' dias.', 'Com ' + v.margem + '%: ' + n1(r.diasBase) + ' × ' + n1(1 + v.margem / 100) + ' = ' + n1(r.dias) + ' dias (planeje ' + r.diasPlan + ').'] };
    if (tipo === 'agua') q = { enun: base + v.tripulacao + ' pessoas, ' + n1(v.agua) + ' L por pessoa por dia. Quantos litros de água, com a margem?', un: 'L', valor: r.agua, tol: 0.06,
      passos: ['Dias com margem: ' + n0(v.distancia) + ' ÷ (' + n1(v.velocidade) + ' × 24) × ' + n1(1 + v.margem / 100) + ' = ' + n1(r.dias) + ' dias.', 'Por dia: ' + v.tripulacao + ' × ' + n1(v.agua) + ' = ' + n1(r.aguaDia) + ' L.', 'Total: ' + n1(r.aguaDia) + ' × ' + n1(r.dias) + ' = ' + n0(r.agua) + ' L.'] };
    if (tipo === 'comb') q = { enun: base + 'Você prevê ' + v.parteMotor + '% da distância a motor, a ' + n1(v.velMotor) + ' nós, mais ' + n1(v.bateria) + ' h por dia para carregar baterias. O motor gasta ' + n1(v.consumo) + ' L/h. Quantos litros de diesel levar, com ' + v.reservaComb + '% de reserva?', un: 'L', valor: r.comb, tol: 0.07,
      passos: ['Motor para andar: ' + n0(v.distancia) + ' × ' + v.parteMotor + '% ÷ ' + n1(v.velMotor) + ' = ' + n1(r.hMotorProp) + ' h.', 'Baterias: ' + n1(v.bateria) + ' h × ' + n1(r.dias) + ' dias (com margem) = ' + n1(r.hMotorBat) + ' h.', 'Diesel: ' + n1(r.hMotor) + ' h × ' + n1(v.consumo) + ' L/h = ' + n0(r.combBase) + ' L; com ' + v.reservaComb + '% de reserva: ' + n0(r.comb) + ' L.'] };
    if (tipo === 'gas') q = { enun: base + 'O fogão fica aceso ' + n1(v.fogo) + ' h por dia no total, e cada boca gasta 0,12 kg de gás por hora. Quantos kg de gás, com a margem?', un: 'kg', valor: r.gas, tol: 0.08,
      passos: ['Dias com margem: ' + n1(r.dias) + '.', 'Por dia: ' + n1(v.fogo) + ' h × 0,12 kg/h = ' + VL.fmt.num(r.gasDia, 2) + ' kg.', 'Total: ' + VL.fmt.num(r.gasDia, 2) + ' × ' + n1(r.dias) + ' = ' + n1(r.gas) + ' kg (' + Math.ceil(r.gas / 5) + ' botijão(ões) P5, ou ' + Math.ceil(r.gas / 13) + ' P13).'] };
    q.tipo = tipo;
    return q;
  }

  /* ---------- Impressão só deste resultado ---------- */
  function imprimir(conteudo) {
    var raiz = h('div', { class: 'pv-print-root' }, conteudo);
    document.body.appendChild(raiz);
    document.body.classList.add('pv-imprimindo');
    var feito = false;
    function fim() {
      if (feito) return; feito = true;
      document.body.classList.remove('pv-imprimindo');
      raiz.remove();
      window.removeEventListener('afterprint', fim);
    }
    window.addEventListener('afterprint', fim);
    try { window.print(); } catch (e) { /* sem impressão */ }
    setTimeout(fim, 1500);
    return fim;
  }

  VL.widgets.define('provisoes', {
    css: ['assets/css/widgets/provisoes.css'],
    mount: function (el, opts) {
      opts = opts || {};
      var lembrar = opts.lembrar !== false;
      var guardado = lembrar ? (VL.store.get('provisoes.valores', null) || {}) : {};
      var v = Object.assign({}, PADRAO);
      // limites iguais aos dos campos do formulário (valor fora da faixa vira o limite, nunca divisão por zero)
      var LIM = { distancia: [1, 30000], velocidade: [0.5, 20], margem: [0, 300], tripulacao: [1, 20], agua: [0.5, 30] };
      ['distancia', 'velocidade', 'margem', 'tripulacao', 'agua'].forEach(function (k) {
        if (opts[k] != null && opts[k] !== '' && isFinite(Number(opts[k]))) v[k] = Math.min(LIM[k][1], Math.max(LIM[k][0], Number(opts[k])));
      });
      // valores guardados só valem se a lição não fixou o cenário
      var temOpts = ['distancia', 'velocidade', 'margem', 'tripulacao', 'agua'].some(function (k) { return opts[k] != null; });
      if (!temOpts) Object.keys(PADRAO).forEach(function (k) { if (typeof guardado[k] === 'number' && isFinite(guardado[k])) v[k] = guardado[k]; });
      var est = { modo: opts.modo === 'exercicio' ? 'exercicio' : 'calcular', nav: opts.navegacao === 'costeira' ? 'costeira' : 'oceanica' };
      var marcados = VL.store.get('provisoes.lista', {}) || {};
      var fimImpressao = null;

      var ins = VL.ui.instrumento({ titulo: opts.titulo || 'Provisões e autonomia: estimativa para a travessia', controlesAntes: true });
      ins.raiz.classList.add('pv-raiz');
      el.appendChild(ins.raiz);
      var segModo = h('div', { class: 'segmented pv-modo', role: 'group', 'aria-label': 'Modo' });
      [['calcular', 'Calcular'], ['exercicio', 'Exercício']].forEach(function (m) {
        segModo.appendChild(h('button', { type: 'button', 'data-v': m[0], onclick: function () { trocarModo(m[0]); } }, m[1]));
      });
      ins.controles.appendChild(segModo);
      var vCalc = h('div', { class: 'pv-calc' });
      var vEx = h('div', { class: 'pv-ex' });
      ins.corpo.appendChild(h('div', { class: 'pv-corpo' }, vCalc, vEx));
      ins.legenda.appendChild(h('span', null, 'Estimativas para planejamento, não garantia. Itens obrigatórios: NORMAM-211/DPC (2026); confira a versão vigente.'));

      /* ---------- Campos ---------- */
      var campos = {};
      function campo(k, rotulo, un, o) {
        o = o || {};
        var id = 'pv-' + k + '-' + Math.random().toString(36).slice(2, 7);
        var inp = h('input', { type: 'text', inputmode: 'decimal', id: id, class: 'pv-inp', autocomplete: 'off', 'aria-describedby': o.dica ? id + '-d' : null });
        inp.value = VL.fmt.num(v[k], o.casas == null ? 2 : o.casas).replace(/\./g, '');
        inp.addEventListener('input', function () {
          var x = lerNumSimples(inp.value);
          var ok = isFinite(x) && x >= (o.min != null ? o.min : 0) && x <= (o.max != null ? o.max : 1e7);
          inp.setAttribute('aria-invalid', ok ? 'false' : 'true');
          if (!ok) return;
          v[k] = x; atualizar();
        });
        inp.addEventListener('blur', function () { if (inp.getAttribute('aria-invalid') === 'true') { inp.value = VL.fmt.num(v[k], 2).replace(/\./g, ''); inp.setAttribute('aria-invalid', 'false'); } });
        campos[k] = inp;
        return h('div', { class: 'pv-campo' + (o.largo ? ' pv-campo-largo' : '') },
          h('label', { for: id }, rotulo),
          h('div', { class: 'pv-inp-linha' }, inp, un ? h('span', { class: 'pv-un' }, un) : null),
          o.dica ? h('p', { class: 'pv-dica', id: id + '-d' }, o.dica) : null);
      }
      var selBot = h('select', { class: 'pv-sel', 'aria-label': 'Tamanho do botijão' });
      BOTIJOES.forEach(function (b) { selBot.appendChild(h('option', { value: String(b[0]) }, b[1])); });
      selBot.value = String(v.botijao);
      selBot.addEventListener('change', function () { v.botijao = Number(selBot.value); atualizar(); });

      function grupo(titulo, filhos, aberto) {
        return h('details', { class: 'pv-grupo', open: aberto ? true : null }, h('summary', null, titulo), h('div', { class: 'pv-grupo-corpo' }, filhos));
      }
      var form = h('div', { class: 'pv-form' },
        grupo('Viagem e tripulação', [
          campo('distancia', 'Distância', 'mn', { casas: 0, min: 1, max: 30000, dica: 'Milhas náuticas pela rota que você vai seguir, não em linha reta.' }),
          campo('velocidade', 'Velocidade média estimada', 'nós', { casas: 1, min: 0.5, max: 20, dica: 'Média do dia todo, contando calmarias e mar contra. Por exemplo, num cruzeiro de 32 pés (≈ 9,75 m), 4 a 6 nós (cerca de 100 a 140 mn por dia) é um ponto de partida comum; barcos maiores costumam fazer mais, os menores menos. Use a do seu barco.' }),
          campo('margem', 'Margem de segurança', '%', { casas: 0, min: 0, max: 300, dica: 'Para calmarias, avarias e desvios. Em travessia oceânica, quanto mais longe do socorro, maior a margem.' }),
          campo('tripulacao', 'Tripulação', 'pessoas', { casas: 0, min: 1, max: 20 }),
        ], true),
        grupo('Água e comida', [
          campo('agua', 'Água por pessoa por dia', 'L', { casas: 1, min: 0.5, max: 30, dica: 'Valor padrão 4 L: beber (2 a 3 L, mais no calor), cozinhar e higiene mínima, sem banho de água doce. É uma estimativa: ajuste para o clima e seus hábitos.' }),
          campo('tanqueAgua', 'Tanque de água do barco', 'L', { casas: 0, min: 0, max: 5000 }),
          campo('refeicoes', 'Refeições por pessoa por dia', '', { casas: 0, min: 0, max: 8 }),
          campo('lanches', 'Lanches por pessoa por dia', '', { casas: 0, min: 0, max: 8 }),
        ], true),
        grupo('Motor e combustível', [
          campo('consumo', 'Consumo do motor', 'L/h', { casas: 1, min: 0.1, max: 50, dica: 'Veja o manual do motor na rotação de cruzeiro. Valor padrão 2 L/h é só um exemplo.' }),
          campo('parteMotor', 'Parte da distância a motor', '%', { casas: 0, min: 0, max: 100 }),
          campo('velMotor', 'Velocidade a motor', 'nós', { casas: 1, min: 0.5, max: 20 }),
          campo('bateria', 'Motor para carregar baterias', 'h/dia', { casas: 1, min: 0, max: 24, dica: 'Se houver painel solar ou gerador eólico, pode ser menos.' }),
          campo('reservaComb', 'Reserva de combustível', '%', { casas: 0, min: 0, max: 300 }),
          campo('tanqueComb', 'Tanque de combustível', 'L', { casas: 0, min: 0, max: 5000 }),
        ], false),
        grupo('Gás de cozinha', [
          campo('fogo', 'Fogo aceso por dia (somando as bocas)', 'h', { casas: 1, min: 0, max: 24 }),
          campo('kgh', 'Consumo por boca', 'kg/h', { casas: 2, min: 0.01, max: 2, dica: '0,12 kg/h corresponde a uma boca de cerca de 1,5 kW (o GLP tem cerca de 46 MJ, ou 12,8 kWh, por kg). Confira a potência do seu fogão.' }),
          h('div', { class: 'pv-campo' }, h('span', { class: 'pv-rot' }, 'Botijão'), selBot),
        ], false));

      /* ---------- Resultado ---------- */
      var resumo = h('div', { class: 'pv-resumo', 'aria-live': 'polite' });
      var barraDias = h('div', { class: 'pv-dias' });
      var tabelaRes = h('div', { class: 'table-wrap pv-tabela' });
      var tanques = h('div', { class: 'pv-tanques' });
      var formulas = h('details', { class: 'pv-formulas' }, h('summary', null, 'Como foi calculado'), h('div', { class: 'pv-formulas-corpo' }));
      var aviso = VL.ui.callout('nota', 'Tudo aqui é estimativa', 'Os números servem para planejar e conversar com a tripulação. O consumo real depende do barco, do tempo e dos hábitos de cada um. Leve sempre a margem e confira os níveis durante a viagem.');
      var segNav = h('div', { class: 'segmented pv-nav', role: 'group', 'aria-label': 'Classificação da embarcação' });
      [['oceanica', 'Oceânica'], ['costeira', 'Costeira']].forEach(function (m) {
        segNav.appendChild(h('button', { type: 'button', 'data-v': m[0], onclick: function () { est.nav = m[0]; montarLista(); } }, m[1]));
      });
      var lista = h('div', { class: 'pv-lista' });
      var contagem = h('span', { class: 'pv-contagem' });
      var btnImp = h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { fimImpressao = imprimir(conteudoImpressao()); } }, VL.icon('download', 18), 'Imprimir');
      var btnCopiar = h('button', { type: 'button', class: 'btn btn-ghost', onclick: copiar }, 'Copiar resumo');
      var btnLimpar = h('button', { type: 'button', class: 'btn btn-quiet btn-sm', onclick: function () { marcados = {}; VL.store.set('provisoes.lista', marcados); montarLista(); } }, 'Desmarcar tudo');
      var btnPadrao = h('button', { type: 'button', class: 'btn btn-quiet btn-sm', onclick: function () {
        Object.keys(PADRAO).forEach(function (k) { v[k] = PADRAO[k]; if (campos[k]) { campos[k].value = VL.fmt.num(v[k], 2).replace(/\./g, ''); campos[k].setAttribute('aria-invalid', 'false'); } });
        selBot.value = String(v.botijao); atualizar();
      } }, 'Voltar aos valores padrão');

      vCalc.appendChild(h('div', { class: 'pv-cols' },
        h('div', { class: 'pv-col-form' }, form, h('div', { class: 'btn-row' }, btnPadrao)),
        h('div', { class: 'pv-col-res' }, resumo, barraDias, tabelaRes, tanques, formulas, h('div', { class: 'btn-row pv-acoes' }, btnImp, btnCopiar))));
      vCalc.appendChild(aviso);
      vCalc.appendChild(h('section', { class: 'pv-sec-lista', 'aria-label': 'Lista de verificação' },
        h('div', { class: 'pv-lista-cab' }, h('h3', null, 'Lista de verificação'), contagem),
        h('p', { class: 'pv-dica' }, 'Itens marcados ficam guardados só neste navegador. Os obrigatórios dependem da classificação da embarcação no TIE.'),
        h('div', { class: 'pv-lista-ctl' }, h('span', { class: 'pv-rot' }, 'Navegação'), segNav, btnLimpar),
        lista));

      var ultimo = null;
      function atualizar() {
        var r = calcular(v); ultimo = r;
        if (lembrar) VL.store.set('provisoes.valores', v);
        resumo.innerHTML = '';
        resumo.appendChild(h('div', { class: 'pv-stat pv-stat-forte' }, h('span', { class: 'pv-stat-v' }, n1(r.dias)), h('span', { class: 'pv-stat-l' }, 'dias com margem (planeje ' + r.diasPlan + ')')));
        resumo.appendChild(h('div', { class: 'pv-stat' }, h('span', { class: 'pv-stat-v' }, n1(r.diasBase)), h('span', { class: 'pv-stat-l' }, 'dias sem margem')));
        resumo.appendChild(h('div', { class: 'pv-stat' }, h('span', { class: 'pv-stat-v' }, n0(r.mnDia)), h('span', { class: 'pv-stat-l' }, 'mn por dia')));
        // barra de dias: base + margem
        barraDias.innerHTML = '';
        var fr = r.diasBase / Math.max(r.dias, 1e-9);
        barraDias.appendChild(h('div', { class: 'pv-barra', role: 'img', 'aria-label': n1(r.diasBase) + ' dias de viagem mais ' + n1(r.dias - r.diasBase) + ' dias de margem' },
          h('span', { class: 'pv-barra-base', style: { width: (fr * 100) + '%' } }),
          h('span', { class: 'pv-barra-margem', style: { width: ((1 - fr) * 100) + '%' } })));
        barraDias.appendChild(h('div', { class: 'pv-barra-leg' }, h('span', null, h('i', { class: 'pv-q pv-q-base' }), 'viagem'), h('span', null, h('i', { class: 'pv-q pv-q-margem' }), 'margem de ' + n0(v.margem) + '%')));
        // tabela
        tabelaRes.innerHTML = '';
        var linhas = [
          ['Água', n1(r.aguaDia) + ' L', n0(r.aguaBase) + ' L', n0(r.agua) + ' L'],
          ['Refeições', n0(v.refeicoes * v.tripulacao), n0(v.refeicoes * v.tripulacao * Math.ceil(r.diasBase - 1e-9)), n0(r.refeicoes)],
          ['Lanches', n0(v.lanches * v.tripulacao), n0(v.lanches * v.tripulacao * Math.ceil(r.diasBase - 1e-9)), n0(r.lanches)],
          ['Horas de motor', n1(v.bateria) + ' h + trechos', n1(r.hMotorProp + v.bateria * r.diasBase) + ' h', n1(r.hMotor) + ' h'],
          ['Diesel', '–', n0(r.combBase) + ' L', n0(r.comb) + ' L (+' + n0(v.reservaComb) + '%)'],
          ['Gás', VL.fmt.num(r.gasDia, 2) + ' kg', n1(r.gasBase) + ' kg', n1(r.gas) + ' kg · ' + r.botijoes + ' × P' + v.botijao],
        ];
        var tb = h('tbody');
        linhas.forEach(function (l) { tb.appendChild(h('tr', null, h('th', { scope: 'row' }, l[0]), h('td', null, l[1]), h('td', null, l[2]), h('td', { class: 'pv-forte' }, l[3]))); });
        tabelaRes.appendChild(h('table', { class: 'tabela' },
          h('caption', { class: 'visually-hidden' }, 'Provisões estimadas'),
          h('thead', null, h('tr', null, h('th', null, 'Item'), h('th', null, 'Por dia'), h('th', null, 'Viagem'), h('th', null, 'Com margem'))), tb));
        // tanques
        tanques.innerHTML = '';
        tanques.appendChild(medidorTanque('Água', r.agua, v.tanqueAgua, 'L', r.faltaAgua > 0 ? 'Faltam ' + n0(r.faltaAgua) + ' L no tanque: leve em galões (' + Math.ceil(r.faltaAgua / 20) + ' de 20 L) ou produza com dessalinizador.' : 'O tanque comporta a água estimada. Mesmo assim, leve parte em galões separados.'));
        tanques.appendChild(medidorTanque('Diesel', r.comb, v.tanqueComb, 'L', (r.faltaComb > 0 ? 'Faltam ' + n0(r.faltaComb) + ' L no tanque: ' + Math.ceil(r.faltaComb / 20) + ' bombona(s) de 20 L bem peadas. ' : '') + 'Com o tanque cheio, o motor roda cerca de ' + n0(r.autonomiaH) + ' h, ou ' + n0(r.autonomiaMn) + ' mn a ' + n1(v.velMotor) + ' nós.'));
        // fórmulas
        var fc = VL.$('.pv-formulas-corpo', formulas); fc.innerHTML = '';
        [
          'Dias = ' + n0(v.distancia) + ' mn ÷ (' + n1(v.velocidade) + ' nós × 24 h) = ' + n1(r.diasBase) + '; com margem: × ' + n1(1 + v.margem / 100) + ' = ' + n1(r.dias) + '.',
          'Água = ' + v.tripulacao + ' pessoas × ' + n1(v.agua) + ' L × ' + n1(r.dias) + ' dias = ' + n0(r.agua) + ' L.',
          'Motor = ' + n0(v.distancia) + ' × ' + n0(v.parteMotor) + '% ÷ ' + n1(v.velMotor) + ' nós = ' + n1(r.hMotorProp) + ' h, mais ' + n1(v.bateria) + ' h × ' + n1(r.dias) + ' dias = ' + n1(r.hMotorBat) + ' h.',
          'Diesel = ' + n1(r.hMotor) + ' h × ' + n1(v.consumo) + ' L/h × ' + n1(1 + v.reservaComb / 100) + ' = ' + n0(r.comb) + ' L.',
          'Gás = ' + n1(v.fogo) + ' h × ' + VL.fmt.num(v.kgh, 2) + ' kg/h × ' + n1(r.dias) + ' dias = ' + n1(r.gas) + ' kg.',
          'Refeições e lanches contam dias inteiros (' + r.diasPlan + ' com margem).',
        ].forEach(function (t) { fc.appendChild(h('p', null, t)); });
      }
      function medidorTanque(nome, precisa, tem, un, txt) {
        var max = Math.max(precisa, tem, 1), falta = precisa > tem;
        return h('div', { class: 'pv-tanque' + (falta ? ' pv-tanque-falta' : '') },
          h('div', { class: 'pv-tanque-cab' }, h('strong', null, nome), h('span', null, n0(precisa) + ' ' + un + ' estimados · tanque de ' + n0(tem) + ' ' + un)),
          h('div', { class: 'pv-tanque-barra', role: 'img', 'aria-label': nome + ': ' + n0(precisa) + ' ' + un + ' estimados, tanque de ' + n0(tem) + ' ' + un },
            h('span', { class: 'pv-tanque-cap', style: { width: (tem / max * 100) + '%' } }),
            h('span', { class: 'pv-tanque-prec', style: { width: (precisa / max * 100) + '%' } })),
          h('p', { class: 'pv-dica' }, txt));
      }

      var gruposAbertos = { 0: true };
      function montarLista() {
        VL.$$('button', segNav).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === est.nav)); });
        lista.innerHTML = '';
        var resumos = [];
        listaItens(est.nav).forEach(function (gr, gi) {
          var ul = h('ul', { class: 'pv-itens' });
          var cont = h('span', { class: 'pv-grupo-cont' });
          gr.itens.forEach(function (it) {
            var cb = h('input', { type: 'checkbox' }); cb.checked = !!marcados[it.id];
            cb.addEventListener('change', function () { marcados[it.id] = cb.checked; VL.store.set('provisoes.lista', marcados); contar(); });
            ul.appendChild(h('li', null, h('label', { class: 'pv-item' }, cb, h('span', null, it.t,
              it.ref ? h('span', { class: 'pv-ref' }, ' ', it.ref, ' ', it.q ? VL.ui.seloQ('a confirmar', 'Conferido no texto da NORMAM-211/DPC (2026) do acervo do projeto, ainda sem a dupla verificação. A dotação depende da classificação no TIE: confirme na Capitania.') : null) : null))));
          });
          var det = h('details', { class: 'pv-lista-grupo', open: gruposAbertos[gi] ? true : null }, h('summary', null, h('span', null, gr.g), cont), ul);
          det.addEventListener('toggle', function () { gruposAbertos[gi] = det.open; });
          resumos.push({ gr: gr, cont: cont });
          lista.appendChild(det);
        });
        function contar() {
          var t2 = 0, o2 = 0;
          resumos.forEach(function (r) {
            var t = r.gr.itens.length, o = r.gr.itens.filter(function (it) { return marcados[it.id]; }).length;
            t2 += t; o2 += o;
            r.cont.textContent = o + '/' + t;
            r.cont.classList.toggle('pv-grupo-ok', o === t);
          });
          contagem.textContent = o2 + ' de ' + t2 + ' prontos';
        }
        contar();
      }

      function textoResumo() {
        var r = ultimo || calcular(v);
        return [
          'Provisões estimadas (Veleiro)',
          'Travessia: ' + n0(v.distancia) + ' mn a ' + n1(v.velocidade) + ' nós de média, ' + v.tripulacao + ' pessoas.',
          'Dias: ' + n1(r.diasBase) + ' sem margem; ' + n1(r.dias) + ' com margem de ' + n0(v.margem) + '% (planejar ' + r.diasPlan + ').',
          'Água: ' + n0(r.agua) + ' L (' + n1(v.agua) + ' L/pessoa/dia).',
          'Refeições: ' + n0(r.refeicoes) + '; lanches: ' + n0(r.lanches) + '.',
          'Diesel: ' + n0(r.comb) + ' L (' + n1(r.hMotor) + ' h de motor a ' + n1(v.consumo) + ' L/h, reserva de ' + n0(v.reservaComb) + '%).',
          'Gás: ' + n1(r.gas) + ' kg (' + r.botijoes + ' botijão(ões) P' + v.botijao + ').',
          'Estimativa para planejamento; não substitui a verificação a bordo.',
        ].join('\n');
      }
      function copiar() {
        var t = textoResumo();
        var ok = function () { VL.ui.toast('Resumo copiado.'); };
        var falha = function () { VL.ui.dialogo({ titulo: 'Copie o resumo', corpo: h('textarea', { class: 'pv-copia', rows: '9', readonly: true }, t) }); };
        try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, falha); else falha(); } catch (e) { falha(); }
      }
      function conteudoImpressao() {
        var r = ultimo || calcular(v);
        var tab = tabelaRes.cloneNode(true);
        var lis = h('div');
        listaItens(est.nav).forEach(function (gr) {
          lis.appendChild(h('h3', null, gr.g));
          var ul = h('ul');
          gr.itens.forEach(function (it) { ul.appendChild(h('li', null, (marcados[it.id] ? '[x] ' : '[  ] ') + it.t + (it.ref ? ' (' + it.ref + ', a confirmar)' : ''))); });
          lis.appendChild(ul);
        });
        return h('div', { class: 'pv-impresso' },
          h('h2', null, 'Provisões estimadas'),
          h('p', null, n0(v.distancia) + ' mn a ' + n1(v.velocidade) + ' nós · ' + v.tripulacao + ' pessoas · ' + n1(r.dias) + ' dias com margem de ' + n0(v.margem) + '%'),
          tab, h('h2', null, 'Lista de verificação (' + (est.nav === 'oceanica' ? 'navegação oceânica' : 'navegação costeira') + ')'), lis,
          h('p', { class: 'pv-dica' }, 'Estimativas para planejamento. Itens obrigatórios conforme NORMAM-211/DPC (2026): confirme a versão vigente na Capitania.'));
      }

      /* ---------- Exercício ---------- */
      var ex = { q: null, acertos: 0, total: 0 };
      function novoExercicio() {
        ex.q = exercicio();
        vEx.innerHTML = '';
        var inp = h('input', { type: 'text', inputmode: 'decimal', class: 'pv-inp pv-resp', 'aria-label': 'Sua resposta em ' + ex.q.un, autocomplete: 'off' });
        var fb = h('div', { class: 'explicacao', hidden: true, 'aria-live': 'polite' });
        var btnOk = h('button', { type: 'submit', class: 'btn btn-primary' }, 'Conferir');
        var btnProx = h('button', { type: 'button', class: 'btn btn-ghost', onclick: novoExercicio }, 'Outro problema');
        var formEx = h('form', { class: 'pv-ex-form', onsubmit: function (e) {
          e.preventDefault();
          var x = lerNum(inp.value);
          if (!isFinite(x)) { inp.setAttribute('aria-invalid', 'true'); inp.focus(); return; }
          inp.setAttribute('aria-invalid', 'false');
          var erro = Math.abs(x - ex.q.valor) / Math.max(ex.q.valor, 1e-9);
          var certo = erro <= ex.q.tol;
          if (!fb.hidden && fb.getAttribute('data-resp') === '1') return;
          ex.total++; if (certo) ex.acertos++;
          fb.hidden = false; fb.setAttribute('data-resp', '1'); fb.innerHTML = '';
          fb.appendChild(h('p', { class: 'explicacao-res', 'data-ok': certo ? '1' : '0' }, certo ? 'Certo. A conta dá cerca de ' + n1(ex.q.valor) + ' ' + ex.q.un + '.' : 'Ainda não. A conta dá cerca de ' + n1(ex.q.valor) + ' ' + ex.q.un + ' (você respondeu ' + n1(x) + ').'));
          var ol = h('ol', { class: 'pv-passos' });
          ex.q.passos.forEach(function (p) { ol.appendChild(h('li', null, p)); });
          fb.appendChild(ol);
          fb.appendChild(h('p', { class: 'pv-dica mb-0' }, 'Aceitamos diferença de até ' + Math.round(ex.q.tol * 100) + '% por causa de arredondamentos.'));
          placar.textContent = ex.acertos + ' de ' + ex.total + ' certos';
          btnProx.focus();
        } },
          h('p', { class: 'questao-enunciado' }, ex.q.enun),
          h('div', { class: 'pv-inp-linha pv-resp-linha' }, inp, h('span', { class: 'pv-un' }, ex.q.un), btnOk));
        var placar = h('span', { class: 'pv-placar' }, ex.total ? ex.acertos + ' de ' + ex.total + ' certos' : 'Faça a conta no papel ou na calculadora.');
        vEx.appendChild(h('div', { class: 'pv-ex-cab' }, h('h3', null, 'Problema de planejamento'), placar));
        vEx.appendChild(formEx);
        vEx.appendChild(fb);
        vEx.appendChild(h('div', { class: 'btn-row pv-ex-acoes' }, btnProx));
      }

      function trocarModo(m) {
        est.modo = m;
        vCalc.hidden = m !== 'calcular'; vEx.hidden = m !== 'exercicio';
        VL.$$('button', segModo).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === m)); });
        if (m === 'exercicio' && !ex.q) novoExercicio();
      }

      atualizar();
      montarLista();
      trocarModo(est.modo);

      return function limpar() { if (fimImpressao) fimImpressao(); };
    },
  });

  VL.provisoes = { calcular: calcular, PADRAO: PADRAO, listaItens: listaItens };
})();
