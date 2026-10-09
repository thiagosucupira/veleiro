/* regras-governo — encontros entre duas embarcações vistas de cima (RIPEAM-72, Regras 7, 8 e 12 a 18).
   Nós (magenta) e a outra (tinta), com vetores de 6 minutos. O veredito é calculado ao vivo:
   1) há risco de abalroamento? (critério didático: maior aproximação prevista < 0,5 milha nos próximos 40 min;
      o RIPEAM não fixa número — Regra 7(a) e (d));
   2) ultrapassagem primeiro (Regra 13: vem de mais de 22,5° por ante a ré do través; prevalece sobre a 18);
   3) categorias diferentes: hierarquia da Regra 18 (sem governo / manobra restrita > restrita pelo calado
      ("não impedir", 18(d)) > pesca > vela > propulsão mecânica);
   4) dois veleiros: Regra 12 (bordos diferentes: quem recebe o vento por bombordo manobra; mesmo bordo:
      quem está a barlavento manobra; barlavento = lado oposto ao da retranca, 12(b));
   5) duas de propulsão mecânica: roda a roda (Regra 14; aqui, cada uma vê a outra até 6° da proa; até 11,25°
      é "dúvida", e na dúvida é roda a roda, 14(c)) ou rumos cruzados (Regra 15).
   Ações: Regra 16 (quem manobra: cedo e de forma franca), 17 (quem mantém rumo e velocidade) e 8.

   opts de mount (todos opcionais):
     modo:     'explorar' | 'desafio'                                         padrão 'explorar'
     cenario:  'cruzados' | 'rodaaroda' | 'ultrapassagem' | 'vela-bordos' | 'vela-mesmo' | 'hierarquia'
               (situação inicial do modo explorar, padrão 'cruzados')
     a:        {tipo, rumo, vel}   nós    — tipo: 'pm' | 'vela' | 'pesca' | 'cal' | 'mr' | 'sg'
     b:        {tipo, rumo, vel, marcacao, distancia}   a outra (marcação relativa a partir da nossa proa, em graus;
               distância em milhas). Se 'a' ou 'b' vier, substitui o cenário.
     vento:    direção DE ONDE sopra, em graus verdadeiros (padrão 045)
     proaCima: false   (true: nossa proa para cima, como radar em "head-up"; no desafio o padrão é true)
     setores:  true    (mostra os setores das luzes de bordos e de alcançado)
     desafios: ['rodaaroda','cruzados','ultrapassagem','vela-bordos','vela-mesmo','hierarquia']  sorteados no desafio
     titulo:   texto da legenda do instrumento

   Exemplos de bloco de lição:
     {t:'widget', w:'regras-governo', opts:{cenario:'vela-bordos'}}
     {t:'widget', w:'regras-governo', opts:{modo:'desafio', desafios:['cruzados','rodaaroda','ultrapassagem']}} */
(function () {
  'use strict';
  var h = VL.h;
  var D2R = Math.PI / 180;
  var LIMIAR = 0.5, HORIZ = 40, VET = 6, SPAN = 6.4;

  function n360(a) { return ((a % 360) + 360) % 360; }
  function n180(a) { a = n360(a); return a > 180 ? a - 360 : a; }
  function g3(a) { var v = Math.round(n360(a)) % 360; return ('00' + v).slice(-3) + '°'; }
  function milhas(x) { return VL.fmt.num(x, x < 1 ? 2 : 1) + ' M'; }
  function nos(v) { return VL.fmt.num(v, v % 1 ? 1 : 0) + ' nós'; }
  function minTxt(m) { return m < 1 ? 'menos de 1 min' : Math.round(m) + ' min'; }
  function aleat(a, b) { return a + Math.random() * (b - a); }
  function sortear(a) { return a[Math.floor(Math.random() * a.length)]; }
  function reduzMov() { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function en(txt) { return txt ? '<span class="rg-en" data-intl="on"> (' + VL.esc(txt) + ')</span>' : ''; }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }

  var TIPOS = {
    pm: { rot: 'Propulsão mecânica', curto: 'propulsão mecânica', art: 'a embarcação de propulsão mecânica', nivel: 5, en: 'power-driven vessel', vel: [8, 14] },
    vela: { rot: 'A vela', curto: 'a vela', art: 'a embarcação a vela', nivel: 4, en: 'sailing vessel', vel: [4, 7] },
    pesca: { rot: 'Engajada na pesca', curto: 'pescando', art: 'a embarcação engajada na pesca', nivel: 3, en: 'vessel engaged in fishing', vel: [3, 5] },
    cal: { rot: 'Restrita devido ao seu calado', curto: 'restrita pelo calado', art: 'a embarcação restrita devido ao seu calado', nivel: 2, en: 'vessel constrained by her draught', vel: [8, 12] },
    mr: { rot: 'Com capacidade de manobra restrita', curto: 'manobra restrita', art: 'a embarcação com capacidade de manobra restrita', nivel: 1, en: 'vessel restricted in her ability to manoeuvre', vel: [4, 8] },
    sg: { rot: 'Sem governo', curto: 'sem governo', art: 'a embarcação sem governo', nivel: 1, en: 'vessel not under command', vel: [2, 4] },
  };
  var ORDEM_TIPOS = ['pm', 'vela', 'pesca', 'cal', 'mr', 'sg'];
  var SIT = {
    semrisco: { rot: 'Sem risco de abalroamento', en: 'no risk of collision' },
    rodaaroda: { rot: 'Roda a roda', en: 'head-on situation' },
    duvida: { rot: 'Quase roda a roda: na dúvida, roda a roda', en: 'head-on, when in doubt' },
    cruzados: { rot: 'Rumos cruzados', en: 'crossing situation' },
    bordos: { rot: 'Passagem bordo com bordo', en: 'passing' },
    ultrapassagem: { rot: 'Ultrapassagem', en: 'overtaking' },
    velaBordos: { rot: 'Veleiros com vento em bordos diferentes', en: 'sailing vessels on opposite tacks' },
    velaMesmo: { rot: 'Veleiros com vento no mesmo bordo', en: 'sailing vessels on the same tack' },
    hierarquia: { rot: 'Categorias diferentes', en: 'responsibilities between vessels' },
    naoImpedir: { rot: 'Não impedir a passagem', en: 'not to impede' },
    mesma: { rot: 'Mesma categoria especial', en: 'same category' },
  };

  /* ---------- Geometria ---------- */
  function vel(V) { var r = V.rumo * D2R; return [Math.sin(r) * V.vel / 60, Math.cos(r) * V.vel / 60]; } // milhas por minuto
  function marc(d) { return n360(Math.atan2(d[0], d[1]) / D2R); }
  function nomeMarcacao(rb) {
    var r = n180(rb), a = Math.abs(r), lado = r >= 0 ? 'boreste' : 'bombordo';
    if (a < 5) return 'pela proa';
    if (a > 175) return 'pela popa';
    if (Math.abs(a - 90) < 5) return 'pelo través de ' + lado;
    if (a < 90) return 'pela bochecha de ' + lado;
    return 'pela alheta de ' + lado;
  }
  /* componente da velocidade "dela" no sentido do nosso boreste (milhas/min): < 0 = ela vai para o nosso bombordo */
  function cruza(X, vY) { var r = (X.rumo + 90) * D2R; return vY[0] * Math.sin(r) + vY[1] * Math.cos(r); }

  function luzesVistas(B, rbDeB) {
    var r = n180(rbDeB), a = Math.abs(r), lista = [];
    var mastro = B.tipo === 'pm' || B.tipo === 'cal' || B.tipo === 'mr';
    if (a <= 112.5) {
      if (mastro) lista.push('luz de mastro branca');
      if (a < 1.5) lista.push('as duas luzes de bordos, verde e vermelha');
      else lista.push(r > 0 ? 'luz verde de boreste' : 'luz vermelha de bombordo');
    } else lista.push('só a luz branca de alcançado, na popa');
    var extra = { pesca: 'as circulares de pesca (verde sobre branca no arrasto, vermelha sobre branca nas outras pescas)', sg: 'duas circulares vermelhas na vertical', mr: 'circulares vermelha, branca e vermelha na vertical', cal: 'três circulares vermelhas na vertical (se exibir)' }[B.tipo];
    if (extra) lista.push(extra);
    return lista;
  }

  /* ---------- Análise (o "juiz") ---------- */
  function analisar(A, B, vento) {
    var vA = vel(A), vB = vel(B);
    var d = [B.x - A.x, B.y - A.y], w = [vB[0] - vA[0], vB[1] - vA[1]];
    var dist = Math.hypot(d[0], d[1]), ww = w[0] * w[0] + w[1] * w[1], dw = d[0] * w[0] + d[1] * w[1];
    var tcpa = ww < 1e-10 ? Infinity : -dw / ww;
    var cpa = tcpa > 0 && isFinite(tcpa) ? Math.hypot(d[0] + w[0] * tcpa, d[1] + w[1] * tcpa) : dist;
    var aprox = dw < -1e-9;
    var mAB = marc(d), rbA = n360(mAB - A.rumo), rbB = n360(mAB + 180 - B.rumo);
    var D = { dist: dist, cpa: cpa, tcpa: tcpa, aprox: aprox, risco: aprox && tcpa <= HORIZ && cpa < LIMIAR, rbA: rbA, rbB: rbB, vA: vA, vB: vB };
    var V = { D: D, notas: [], sit: null, manobra: null, regra: '', titulo: '', porque: '', acao: '', curta: '' };
    ['A', 'B'].forEach(function (k) {
      var X = k === 'A' ? A : B;
      if (X.tipo !== 'vela') return;
      var rw = n180(vento - X.rumo);
      D['rw' + k] = rw; D['bordo' + k] = rw >= 0 ? 'boreste' : 'bombordo';
      if (Math.abs(rw) < 40) V.notas.push((k === 'A' ? 'Nosso veleiro' : 'O veleiro dela') + ' está com a proa a ' + Math.round(Math.abs(rw)) + '° do vento: assim um veleiro não anda (zona morta). Ajuste o rumo.');
    });
    var tA = TIPOS[A.tipo], tB = TIPOS[B.tipo];

    if (!D.risco) {
      V.sit = 'semrisco'; V.regra = 'Regra 7';
      V.titulo = SIT.semrisco.rot;
      if (!aprox) V.porque = 'As duas estão se afastando: a distância só aumenta. Nenhuma regra de governo obriga alguém a manobrar agora; continue vigiando (Regra 5).';
      else if (tcpa > HORIZ) V.porque = 'Elas se aproximam, mas a maior aproximação só aconteceria daqui a mais de ' + HORIZ + ' minutos. Acompanhe a marcação: se ela quase não mudar enquanto a distância diminui, há risco (Regra 7(d)).';
      else V.porque = 'A maior aproximação prevista é de ' + milhas(cpa) + ', daqui a ' + minTxt(tcpa) + ': passam safas, se nada mudar. Continue vigiando e confira a marcação de tempos em tempos (Regras 5 e 7).';
      V.acao = 'Manter o rumo e a vigilância.';
      return V;
    }

    var aAlc = Math.abs(n180(rbB)) > 112.5;   // nós no setor de alcançado dela: estamos alcançando
    var bAlc = Math.abs(n180(rbA)) > 112.5;   // ela no nosso setor de alcançado: ela nos alcança
    var perto = function (rb) { return Math.abs(Math.abs(n180(rb)) - 112.5) < 5; };
    function papel(quem, sit, regra, titulo, porque) { V.sit = sit; V.manobra = quem; V.regra = regra; V.titulo = titulo; V.porque = porque; }

    if (aAlc || bAlc) {
      if (aAlc) {
        papel('A', 'ultrapassagem', 'Regra 13', SIT.ultrapassagem.rot + ': nós alcançamos a outra',
          'Estamos a mais de 22,5° por ante a ré do través dela, no setor da luz de alcançado: à noite veríamos só a luz branca da popa dela. Quem alcança outra mantém-se fora do caminho dela, seja qual for o tipo das duas (Regra 13(a) e (b)). A situação continua mesmo que a marcação mude depois, até estarmos bem passados e safos (Regra 13(d)).');
        if (tA.nivel < tB.nivel) V.notas.push('Atenção: mesmo estando ' + tA.curto + ', quem alcança manobra. A Regra 13 vale acima da Regra 18.');
      } else {
        papel('B', 'ultrapassagem', 'Regra 13', SIT.ultrapassagem.rot + ': a outra nos alcança',
          'Ela vem de mais de 22,5° por ante a ré do nosso través: está nos alcançando. Quem alcança manobra (Regra 13); nós mantemos rumo e velocidade (Regra 17(a)(i)).');
        if (tB.nivel < tA.nivel) V.notas.push('Mesmo estando ' + tB.curto + ', é ela quem manobra, porque está nos alcançando: a Regra 13 vale acima da Regra 18.');
      }
      if (perto(aAlc ? rbB : rbA)) V.notas.push('Perto do limite de 22,5° por ante a ré do través. Na dúvida, quem vem atrás deve considerar-se alcançando e manobrar (Regra 13(c)).');
      if (A.tipo === 'sg' || A.tipo === 'mr' || B.tipo === 'sg' || B.tipo === 'mr') V.notas.push('Quem está sem governo ou com manobra restrita pode não conseguir manobrar: a outra deve agir se o abalroamento não puder ser evitado só por ela (Regra 17(b)).');
      V.notas.push('Num canal estreito, se a ultrapassada precisar abrir espaço, use os sinais da Regra 34(c) (Regra 9(e)).');
    } else {
      var esp = { A: tA.nivel === 1, B: tB.nivel === 1 };
      var cal = { A: A.tipo === 'cal', B: B.tipo === 'cal' };
      var nA = tA.nivel, nB = tB.nivel;
      if ((cal.A && !cal.B && !esp.B) || (cal.B && !cal.A && !esp.A)) {
        var quem = cal.A ? 'B' : 'A', X = quem === 'A' ? tA : tB;
        papel(quem, 'naoImpedir', 'Regra 18(d)', SIT.naoImpedir.rot,
          (quem === 'A' ? 'Nós' : 'A outra') + ' (' + X.curto + ') deve evitar impedir a passagem segura da embarcação restrita devido ao seu calado (Regra 18(d)(i)), manobrando cedo para deixar espaço (Regra 8(f)(i)). Ela, por sua vez, navega com extrema precaução (Regra 18(d)(ii)).');
        V.notas.push('Se o risco de abalroamento já existe, as duas continuam obrigadas a cumprir as regras de governo (Regra 8(f)(ii) e (iii)): não espere ficar perto.');
      } else if (nA !== nB && !(cal.A && cal.B)) {
        var nivelA = cal.A ? 5 : nA, nivelB = cal.B ? 5 : nB; // restrita pelo calado é de propulsão mecânica perante sem governo/manobra restrita
        var giver = nivelA > nivelB ? 'A' : 'B', G = giver === 'A' ? tA : tB, O = giver === 'A' ? tB : tA;
        var letra = { pm: 'a', cal: 'a', vela: 'b', pesca: 'c' }[giver === 'A' ? A.tipo : B.tipo];
        papel(giver, 'hierarquia', 'Regra 18(' + letra + ')', SIT.hierarquia.rot,
          'Pela Regra 18, ' + G.art + ' mantém-se fora do caminho d' + O.art + (letra === 'c' ? ', tanto quanto possível' : '') + ' (Regra 18(' + letra + ')). ' + (giver === 'A' ? 'Nós cedemos.' : 'Ela cede.') + ' A prioridade vem do que a embarcação está fazendo e de quanto ela consegue manobrar, não do tamanho.');
        if (giver === 'B' && (A.tipo === 'vela')) V.notas.push('Num canal estreito, um veleiro com menos de 20 m não deve impedir a passagem de quem só pode navegar dentro do canal (Regra 9(b)); o mesmo vale para quem pesca (Regra 9(c)).');
      } else if (esp.A && esp.B) {
        papel(null, 'mesma', 'Regras 2, 8 e 17(b)', SIT.mesma.rot,
          'As duas estão ' + (A.tipo === B.tipo ? tA.curto : 'sem governo ou com manobra restrita') + ': nenhuma consegue manobrar como as regras pedem, e a Regra 18 não diz qual das duas cede. Cada uma faz o que puder, cedo e com boa marinharia, para evitar o abalroamento (Regras 2 e 8).');
      } else if (A.tipo === 'vela' && B.tipo === 'vela') {
        if (D.bordoA !== D.bordoB) {
          var g = D.bordoA === 'bombordo' ? 'A' : 'B';
          papel(g, 'velaBordos', 'Regra 12(a)(i)', SIT.velaBordos.rot,
            'Nós recebemos o vento por ' + D.bordoA + ' e ela por ' + D.bordoB + '. Com o vento em bordos diferentes, quem recebe o vento por bombordo mantém-se fora do caminho da outra (Regra 12(a)(i)).');
        } else {
          var uW = [Math.sin(vento * D2R), Math.cos(vento * D2R)], s = d[0] * uW[0] + d[1] * uW[1];
          var g2 = s > 0 ? 'B' : 'A';
          papel(g2, 'velaMesmo', 'Regra 12(a)(ii)', SIT.velaMesmo.rot,
            'As duas recebem o vento por ' + D.bordoA + '. Com o vento no mesmo bordo, quem está a barlavento (mais perto de onde o vento vem) mantém-se fora do caminho de quem está a sotavento (Regra 12(a)(ii)). ' + (g2 === 'A' ? 'Nós estamos a barlavento.' : 'Ela está a barlavento.'));
          V.notas.push('Barlavento, para esta regra, é o lado oposto àquele em que está a retranca da vela grande (Regra 12(b)).');
        }
        if (D.bordoA === 'bombordo' || D.bordoB === 'bombordo') V.notas.push('Se, com o vento por bombordo, você vê outro veleiro a barlavento e não consegue saber por que bordo ele recebe o vento, manobre você (Regra 12(a)(iii)).');
        if (Math.abs(D.rwA) > 170 || Math.abs(D.rwB) > 170) V.notas.push('Com vento em popa rasa, o bordo depende do lado da retranca, que pode estar em qualquer um dos dois.');
      } else {
        // duas de propulsão mecânica (inclui duas pescando, ou duas restritas pelo calado: tratadas como propulsão mecânica)
        var a1 = Math.abs(n180(rbA)), a2 = Math.abs(n180(rbB));
        if (a1 <= 6 && a2 <= 6) {
          papel('ambas', 'rodaaroda', 'Regra 14', SIT.rodaaroda.rot,
            'As duas se veem pela proa, em rumos opostos ou quase opostos: à noite, cada uma veria as luzes de mastro da outra alinhadas e as duas luzes de bordos. Cada uma guina para boreste, para passarem bombordo com bombordo (Regra 14(a) e (b)).');
        } else if (a1 <= 11.25 && a2 <= 11.25) {
          papel('ambas', 'duvida', 'Regra 14(c)', SIT.duvida.rot,
            'Cada uma vê a outra quase pela proa (até 11,25°). Pode ser roda a roda ou rumos cruzados; quando houver qualquer dúvida, considere roda a roda e guine para boreste (Regra 14(c)).');
        } else {
          var bBE = n180(rbA) > 0, aBE = n180(rbB) > 0;
          if (bBE && !aBE) papel('A', 'cruzados', 'Regra 15', SIT.cruzados.rot,
            'Ela está ' + nomeMarcacao(rbA) + ' (marcação relativa ' + g3(rbA) + '). Em rumos cruzados, quem tem a outra por boreste mantém-se fora do caminho e, se possível, evita cruzar a proa dela (Regra 15).');
          else if (aBE && !bBE) papel('B', 'cruzados', 'Regra 15', SIT.cruzados.rot,
            'Ela está ' + nomeMarcacao(rbA) + ' e nos vê ' + nomeMarcacao(rbB) + ' dela. Quem tem a outra por boreste é ela: ela manobra (Regra 15) e nós mantemos rumo e velocidade (Regra 17).');
          else if (!aBE && !bBE) {
            papel(null, 'bordos', 'Regras 2 e 8', SIT.bordos.rot + ': bombordo com bombordo',
              'Cada uma vê a outra por bombordo: vão passar bombordo com bombordo, mas perto. Não é roda a roda nem rumos cruzados. Se a distância de passagem for pequena, quem manobrar deve guinar para boreste, cedo e de forma franca (Regra 8); uma guinada para bombordo aproximaria as duas.');
          } else {
            papel(null, 'bordos', 'Regras 2 e 8', SIT.bordos.rot + ': boreste com boreste',
              'Cada uma vê a outra por boreste: vão passar boreste com boreste, perto. Nenhuma regra de governo decide sozinha quem manobra; valem a boa marinharia (Regra 2) e manobras cedo, francas e que resultem em passagem a distância segura (Regra 8). Na vida real, combine pelo rádio VHF.');
          }
        }
        if (A.tipo === 'pesca' || A.tipo === 'cal') V.notas.push('As duas estão na mesma categoria; aqui tratadas como embarcações de propulsão mecânica.');
      }
    }
    acoes(V, A, B, vento);
    return V;
  }

  /* Frases de ação (Regras 8, 13 a 17). */
  function acaoManobrar(V, X, Y, vY, vento, nosso) {
    var c = cruza(X, vY), thr = 0.02;
    if (V.sit === 'ultrapassagem') return { longa: 'Ficamos fora do caminho dela até passarmos e ficarmos bem safos. Podemos passar por qualquer bordo, com folga; ao voltar ao rumo, não cortamos a proa dela (Regras 13 e 16).', curta: 'ficamos fora do caminho dela até passar bem safos' };
    if (V.sit === 'naoImpedir') return { longa: 'Manobramos cedo, enquanto ainda há espaço, para não atrapalhar o navio que só pode seguir pelo canal fundo: em geral, saímos do caminho dele e passamos pela popa (Regras 8(f) e 18(d)).', curta: 'manobramos cedo para não impedir a passagem dela' };
    if (X.tipo === 'vela') {
      var turn = c < 0 ? 1 : -1, rw = n180(vento - X.rumo), orca = (turn > 0) === (rw > 0);
      if (orca && Math.abs(rw) < 60) return { longa: 'Para passar pela popa dela teríamos de orçar, mas já estamos bolinando: cambamos cedo ou reduzimos a velocidade folgando as velas, e passamos pela popa dela com folga (Regras 8 e 16).', curta: 'cambamos ou reduzimos o pano e passamos pela popa dela' };
      return orca ? { longa: 'Orçamos cedo e de forma franca (aproximando a proa do vento) e passamos pela popa dela, com folga (Regras 8 e 16).', curta: 'orçamos e passamos pela popa dela' }
        : { longa: 'Arribamos cedo e de forma franca (afastando a proa do vento) e passamos pela popa dela, com folga (Regras 8 e 16).', curta: 'arribamos e passamos pela popa dela' };
    }
    var sinal = X.tipo === 'pm' || X.tipo === 'cal' ? ' À vista, ao guinar para boreste, damos um apito curto (Regra 34(a)).' : '';
    var regs = V.sit === 'cruzados' ? 'Regras 8, 15 e 16' : 'Regras 8 e 16';
    if (c < -thr) return { longa: 'Guinamos para boreste, cedo e de forma franca (a outra precisa perceber), e passamos pela popa dela (' + regs + ').' + sinal, curta: 'guinamos para boreste e passamos pela popa dela' };
    if (c > thr) return { longa: 'Reduzimos a velocidade ou paramos (Regra 8(e)), ou guinamos para bombordo com folga, e passamos pela popa dela. Não cruzamos a proa dela.', curta: 'reduzimos a velocidade e passamos pela popa dela' };
    return { longa: 'Guinamos para boreste, cedo e de forma franca, e passamos com folga (Regras 8 e 16).' + sinal, curta: 'guinamos para boreste, cedo e com folga' };
  }
  function acoes(V, A, B, vento) {
    var D = V.D;
    if (V.manobra === 'A') {
      var m = acaoManobrar(V, A, B, D.vB, vento, true);
      V.acao = m.longa; V.curta = 'Nós manobramos: ' + m.curta;
      V.acaoOutra = 'Mantém rumo e velocidade (Regra 17(a)(i)).';
    } else if (V.manobra === 'B') {
      var c17 = (V.sit === 'cruzados' && n180(D.rbA) < 0) ? ' Como ela está no nosso bombordo, se formos manobrar, não guinamos para bombordo (Regra 17(c)).' : '';
      V.acao = 'Mantemos rumo e velocidade, vigiando (Regra 17(a)(i)). Se ela não manobrar a tempo, damos cinco ou mais apitos curtos e rápidos (Regra 34(d)) e podemos manobrar sozinhos (17(a)(ii)).' + c17 + ' Se o abalroamento não puder mais ser evitado só pela manobra dela, fazemos o que for melhor para evitá-lo (17(b)).';
      V.curta = 'A outra manobra; nós mantemos rumo e velocidade, vigiando';
      V.acaoOutra = 'Manobra: mantém-se fora do nosso caminho (Regra 16).';
      if (A.tipo === 'sg' || A.tipo === 'mr') V.acao = 'Nós (' + TIPOS[A.tipo].curto + ') não conseguimos manobrar como as regras pedem; mantemos o que pudermos e vigiamos. ' + V.acao.replace('Mantemos rumo e velocidade, vigiando (Regra 17(a)(i)). ', '');
      if (V.sit === 'naoImpedir') { V.acao = 'Seguimos com extrema precaução, levando em conta a nossa condição (Regra 18(d)(ii)); a outra deve evitar impedir a nossa passagem. Se o risco já existe, cumprimos também as regras de governo, como qualquer embarcação de propulsão mecânica (Regra 8(f)(iii)).'; V.curta = 'A outra deve evitar impedir a nossa passagem'; V.acaoOutra = 'Evita impedir a nossa passagem (Regra 18(d)(i)).'; }
    } else if (V.manobra === 'ambas') {
      V.acao = 'Guinamos para boreste, cedo e de forma franca, para passarmos bombordo com bombordo (Regra 14(a)). À vista, ao guinar, damos um apito curto (Regra 34(a)).';
      V.curta = 'As duas guinam para boreste e passam bombordo com bombordo';
      V.acaoOutra = 'Guina para boreste (Regra 14(a)).';
    } else {
      V.acao = V.sit === 'bordos' && V.titulo.indexOf('bombordo com bombordo') >= 0 ? 'Se for preciso aumentar a distância, guinamos para boreste, cedo e de forma franca (Regra 8).' : 'Manobramos cedo, de forma franca, e conferimos se a manobra deu certo até estarmos bem safos (Regra 8).';
      V.acaoOutra = 'Também age com boa marinharia (Regra 2).';
    }
  }

  /* ---------- Cenários ---------- */
  function construir(Ab, Bb, tc, desvio) {
    var P = [aleat(-0.5, 0.5), aleat(-0.3, 0.5)];
    var a = vel(Ab), b = vel(Bb);
    var A = Object.assign({}, Ab, { x: P[0] - a[0] * tc, y: P[1] - a[1] * tc });
    var B = Object.assign({}, Bb, { x: P[0] - b[0] * tc, y: P[1] - b[1] * tc });
    var w = [b[0] - a[0], b[1] - a[1]], nw = Math.hypot(w[0], w[1]) || 1;
    var off = desvio * (Math.random() < 0.5 ? -1 : 1);
    B.x += -w[1] / nw * off; B.y += w[0] / nw * off;
    return { A: A, B: B };
  }
  function rnd5(x) { return n360(Math.round(x / 5) * 5); }
  var MOLDES = {
    rodaaroda: function () { var rA = rnd5(aleat(0, 360)); return { A: { tipo: 'pm', rumo: rA, vel: Math.round(aleat(8, 13)) }, B: { tipo: 'pm', rumo: n360(rA + 180 + aleat(-3, 3)), vel: Math.round(aleat(8, 13)) }, tc: aleat(8, 11), dv: aleat(0, 0.08), quer: ['rodaaroda'] }; },
    cruzados: function () { var rA = rnd5(aleat(0, 360)), be = Math.random() < 0.55; return { A: { tipo: 'pm', rumo: rA, vel: Math.round(aleat(8, 14)) }, B: { tipo: 'pm', rumo: rnd5(rA + (be ? aleat(215, 320) : aleat(40, 145))), vel: Math.round(aleat(8, 14)) }, tc: aleat(8, 12), dv: aleat(0.02, 0.15), quer: ['cruzados'] }; },
    ultrapassagem: function () {
      var rA = rnd5(aleat(0, 360)), nosA = Math.random() < 0.5, tp = sortear(['pm', 'pm', 'vela', 'pesca']), to = sortear(['pm', 'vela']);
      var rapido = { tipo: nosA ? to : tp, vel: Math.round(aleat(9, 14)) }, lento = { tipo: nosA ? tp : to, vel: Math.round(aleat(3, 6)) };
      if (rapido.tipo === 'vela') { rapido.vel = 7; lento.vel = 3; }
      var rB = rnd5(rA + aleat(-30, 30));
      var A = Object.assign(nosA ? rapido : lento, { rumo: rA }), B = Object.assign(nosA ? lento : rapido, { rumo: rB });
      return { A: A, B: B, tc: aleat(10, 16), dv: aleat(0.05, 0.15), quer: ['ultrapassagem'] };
    },
    'vela-bordos': function () {
      var W = rnd5(aleat(0, 360)), sA = Math.random() < 0.5 ? 1 : -1;
      return { vento: W, A: { tipo: 'vela', rumo: rnd5(W - sA * aleat(45, 140)), vel: Math.round(aleat(5, 7)) }, B: { tipo: 'vela', rumo: rnd5(W + sA * aleat(45, 140)), vel: Math.round(aleat(5, 7)) }, tc: aleat(10, 14), dv: aleat(0.02, 0.12), quer: ['velaBordos'] };
    },
    'vela-mesmo': function () {
      var W = rnd5(aleat(0, 360)), sA = Math.random() < 0.5 ? 1 : -1;
      return { vento: W, A: { tipo: 'vela', rumo: rnd5(W - sA * aleat(45, 160)), vel: Math.round(aleat(4, 7)) }, B: { tipo: 'vela', rumo: rnd5(W - sA * aleat(45, 160)), vel: Math.round(aleat(4, 7)) }, tc: aleat(10, 16), dv: aleat(0.02, 0.12), quer: ['velaMesmo'] };
    },
    hierarquia: function () {
      var par = sortear([['pm', 'vela'], ['vela', 'pm'], ['pm', 'pesca'], ['pesca', 'pm'], ['vela', 'pesca'], ['pesca', 'vela'], ['pm', 'sg'], ['pm', 'mr'], ['vela', 'mr'], ['vela', 'sg'], ['pesca', 'sg'], ['mr', 'pm']]);
      var rA = rnd5(aleat(0, 360)), tA = TIPOS[par[0]], tB = TIPOS[par[1]];
      return { A: { tipo: par[0], rumo: rA, vel: Math.round(aleat(tA.vel[0], tA.vel[1])) }, B: { tipo: par[1], rumo: rnd5(rA + aleat(40, 320)), vel: Math.round(aleat(tB.vel[0], tB.vel[1])) }, tc: aleat(10, 15), dv: aleat(0.02, 0.15), quer: ['hierarquia'] };
    },
  };
  function gerar(nome) {
    for (var t = 0; t < 400; t++) {
      var m = MOLDES[nome]();
      var vento = m.vento != null ? m.vento : rnd5(aleat(0, 360));
      if (m.A.tipo === 'vela' && Math.abs(n180(vento - m.A.rumo)) < 45) continue;
      if (m.B.tipo === 'vela' && Math.abs(n180(vento - m.B.rumo)) < 45) continue;
      var c = construir(m.A, m.B, m.tc, m.dv);
      var ok = [c.A, c.B].every(function (X) { return Math.abs(X.x) < 2.6 && Math.abs(X.y) < 2.6; });
      if (!ok || Math.hypot(c.B.x - c.A.x, c.B.y - c.A.y) < 1.1) continue;
      var V = analisar(c.A, c.B, vento);
      if (m.quer.indexOf(V.sit) < 0 || !V.manobra) continue;
      if (V.notas.some(function (n) { return /zona morta|limite de 22,5/.test(n); })) continue;
      return { A: c.A, B: c.B, vento: vento, V: V, nome: nome };
    }
    return null;
  }
  function cenarioInicial(nome) {
    var A0 = { tipo: 'pm', rumo: 0, vel: 12 }, B0 = { tipo: 'pm', rumo: 270, vel: 10 }, vento = 45, tc = 10;
    if (nome === 'rodaaroda') B0 = { tipo: 'pm', rumo: 182, vel: 10 };
    else if (nome === 'ultrapassagem') { A0.vel = 12; B0 = { tipo: 'pm', rumo: 10, vel: 5 }; tc = 13; }
    else if (nome === 'vela-bordos') { vento = 30; A0 = { tipo: 'vela', rumo: 340, vel: 6 }; B0 = { tipo: 'vela', rumo: 90, vel: 6 }; tc = 15; }
    else if (nome === 'vela-mesmo') { vento = 90; A0 = { tipo: 'vela', rumo: 25, vel: 6 }; B0 = { tipo: 'vela', rumo: 320, vel: 6 }; tc = 16; }
    else if (nome === 'hierarquia') { B0 = { tipo: 'pesca', rumo: 280, vel: 4 }; A0.vel = 10; tc = 11; }
    var P = nome === 'ultrapassagem' ? [0, 1.0] : [0, 0.4], a = vel(A0), b = vel(B0);
    return { A: Object.assign(A0, { x: P[0] - a[0] * tc, y: P[1] - a[1] * tc }), B: Object.assign(B0, { x: P[0] - b[0] * tc + 0.04, y: P[1] - b[1] * tc }), vento: vento };
  }

  /* ---------- Desenho das embarcações (em pixels, proa para cima) ---------- */
  var CASCO_PM = 'M0,-17 C5.2,-11 6.2,-4 6.2,4 L6.2,14.6 Q6.2,17 3.8,17 L-3.8,17 Q-6.2,17 -6.2,14.6 L-6.2,4 C-6.2,-4 -5.2,-11 0,-17 Z';
  var CASCO_VELA = 'M0,-16 C5,-9 5.6,-1 4.7,8 Q4,15.4 0,16 Q-4,15.4 -4.7,8 C-5.6,-1 -5,-9 0,-16 Z';
  function svgBarco(X, ang, cls, vento, rot) {
    var s = '<g class="rg-barco ' + cls + '" transform="rotate(' + ang.toFixed(1) + ') scale(1.3)">';
    if (X.tipo === 'vela') {
      var rw = n180(vento - X.rumo), lado = rw >= 0 ? -1 : 1, ab = clamp(8 + (Math.abs(rw) - 40) / 140 * 77, 8, 85) * D2R;
      var bx = lado * Math.sin(ab) * 15, by = -4 + Math.cos(ab) * 15;
      var jx = lado * Math.sin(ab * 0.8) * 8, jy = -16 + Math.cos(ab * 0.8) * 9;
      // vela grande vista de cima: crescente a sotavento, entre o mastro e o punho da retranca
      var nx = -(by + 4) / 15, ny = bx / 15, bel = 3.2 * (lado * nx < 0 ? -1 : 1);
      var c1x = bx / 2 + nx * bel, c1y = (by - 4) / 2 + ny * bel;
      s += '<path class="rg-casco" d="' + CASCO_VELA + '"/>';
      s += '<path class="rg-vela" d="M' + jx.toFixed(1) + ',' + jy.toFixed(1) + ' Q' + (jx * 0.5 + lado * 3).toFixed(1) + ',' + ((jy - 16) / 2).toFixed(1) + ' 0,-16"/>';
      s += '<path class="rg-vela-g" d="M0,-4 Q' + c1x.toFixed(1) + ',' + c1y.toFixed(1) + ' ' + bx.toFixed(1) + ',' + by.toFixed(1) + ' Q' + (bx / 2 + nx * bel * 0.25).toFixed(1) + ',' + ((by - 4) / 2 + ny * bel * 0.25).toFixed(1) + ' 0,-4 Z"/>';
      s += '<circle class="rg-mastro" cx="0" cy="-4" r="1.9"/>';
    } else {
      s += '<path class="rg-casco" d="' + CASCO_PM + '"/>';
      s += '<rect class="rg-ponte" x="-4" y="6" width="8" height="5" rx="1"/>';
    }
    return s + '</g>';
  }
  function setor(cx, cy, r, a1, a2, cls) {
    var p1 = [cx + r * Math.sin(a1 * D2R), cy - r * Math.cos(a1 * D2R)], p2 = [cx + r * Math.sin(a2 * D2R), cy - r * Math.cos(a2 * D2R)];
    var grande = n360(a2 - a1) > 180 ? 1 : 0;
    return '<path class="' + cls + '" d="M' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' L' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + grande + ' 1 ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1) + ' Z"/>';
  }

  /* ---------- Widget ---------- */
  VL.widgets.define('regras-governo', {
    css: ['assets/css/widgets/regras-governo.css'],
    mount: function (el, opts) {
      opts = opts || {};
      var est = {
        modo: opts.modo === 'desafio' ? 'desafio' : 'explorar',
        proaCima: opts.proaCima != null ? !!opts.proaCima : opts.modo === 'desafio',
        setores: opts.setores !== false, t: 0,
      };
      var desafios = (Array.isArray(opts.desafios) ? opts.desafios : Object.keys(MOLDES)).filter(function (n) { return MOLDES[n]; });
      if (!desafios.length) desafios = Object.keys(MOLDES);
      var cen = cenarioInicial(opts.cenario);
      if (opts.vento != null) {
        var vNovo = n360(Number(opts.vento)), dv = vNovo - cen.vento;
        // cenário de veleiros com outro vento: gira o encontro inteiro junto, para ele continuar válido (sem ficar contra o vento)
        if (dv && !opts.a && !opts.b && (cen.A.tipo === 'vela' || cen.B.tipo === 'vela')) {
          var cd = Math.cos(dv * D2R), sd = Math.sin(dv * D2R);
          [cen.A, cen.B].forEach(function (X) { var x = X.x, y = X.y; X.x = x * cd + y * sd; X.y = -x * sd + y * cd; X.rumo = n360(X.rumo + dv); });
        }
        cen.vento = vNovo;
      }
      if (opts.a || opts.b) {
        var a = Object.assign({ tipo: 'pm', rumo: 0, vel: 10 }, opts.a || {}), b = Object.assign({ tipo: 'pm', rumo: 270, vel: 10, marcacao: 60, distancia: 2 }, opts.b || {});
        if (!TIPOS[a.tipo]) a.tipo = 'pm'; if (!TIPOS[b.tipo]) b.tipo = 'pm';
        var mg = (a.rumo + b.marcacao) * D2R;
        cen.A = { tipo: a.tipo, rumo: n360(a.rumo), vel: clamp(a.vel, 1, 25), x: 0, y: -0.9 };
        cen.B = { tipo: b.tipo, rumo: n360(b.rumo), vel: clamp(b.vel, 1, 25), x: Math.sin(mg) * b.distancia, y: -0.9 + Math.cos(mg) * b.distancia };
      }
      var exp = { A: cen.A, B: cen.B, vento: cen.vento };
      var des = { n: 0, acertos: 0, total: 0, item: null, etapa: 0 };
      function atual() { return est.modo === 'desafio' && des.item ? des.item : exp; }

      var ins = VL.ui.instrumento({ titulo: opts.titulo || 'Regras de governo: quem manobra?', controlesAntes: true });
      ins.raiz.classList.add('rg-raiz');

      /* Controles gerais */
      var segModo = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Modo' });
      [['explorar', 'Explorar'], ['desafio', 'Desafio']].forEach(function (m) { segModo.appendChild(h('button', { type: 'button', 'data-v': m[0], onclick: function () { trocarModo(m[0]); } }, m[1])); });
      var segOri = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Orientação da cena' });
      [['norte', 'Norte para cima'], ['proa', 'Proa para cima']].forEach(function (m) { segOri.appendChild(h('button', { type: 'button', 'data-v': m[0], onclick: function () { est.proaCima = m[0] === 'proa'; sincronizar(); desenhar(); } }, m[1])); });
      var inpSet = h('input', { type: 'checkbox', role: 'switch' }); inpSet.checked = est.setores;
      inpSet.addEventListener('change', function () { est.setores = inpSet.checked; desenhar(); });
      var btnSortear = h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { var g = gerar(sortear(Object.keys(MOLDES))); if (g) { exp.A = g.A; exp.B = g.B; exp.vento = g.vento; est.t = 0; tudo(); } } }, 'Cenário aleatório');
      ins.controles.appendChild(h('div', { class: 'rg-linha' }, segModo, segOri, h('label', { class: 'switch rg-switch' }, inpSet, h('span', null, 'Setores das luzes')), btnSortear));

      /* Corpo */
      var svg = h('svg', { class: 'rg-cena', role: 'img', 'aria-label': 'Cena vista de cima', xmlns: 'http://www.w3.org/2000/svg' });
      var dica = h('p', { class: 'rg-dica-cena', 'aria-hidden': 'true' }, 'Arraste os barcos; arraste a ponta da seta para mudar rumo e velocidade');
      var cenaWrap = h('div', { class: 'rg-cena-wrap' }, svg, dica);
      var painel = h('div', { class: 'rg-painel' });
      var vivo = h('p', { class: 'visually-hidden', 'aria-live': 'polite' });
      var ajustes = h('div', { class: 'rg-ajustes' });
      var tempo = h('div', { class: 'rg-tempo' });
      ins.corpo.appendChild(h('div', { class: 'rg-grade' }, cenaWrap, tempo, painel, ajustes, vivo));
      ins.legenda.appendChild(h('span', { class: 'rg-fonte' }, 'RIPEAM-72, Regras 7, 8 e 12 a 18 (Decreto 80.068/1977). Barcos fora de escala; vetores de 6 minutos.'));
      el.appendChild(ins.raiz);

      /* ---------- Ajustes (teclado e precisão) ---------- */
      var campos = {};
      function faixa(id, rot, min, max, passo, fmt, aoMudar) {
        var inp = h('input', { type: 'range', min: String(min), max: String(max), step: String(passo), 'aria-label': rot });
        var val = h('output', { class: 'rg-val' });
        inp.addEventListener('input', function () { aoMudar(Number(inp.value)); est.t = 0; desenhar(); });
        campos[id] = { inp: inp, val: val, fmt: fmt };
        return h('label', { class: 'rg-faixa' }, h('span', { class: 'rg-rot' }, rot, val), inp);
      }
      function selTipo(id, rot, aoMudar) {
        var s = h('select', { class: 'rg-sel', 'aria-label': rot });
        ORDEM_TIPOS.forEach(function (k) { s.appendChild(h('option', { value: k }, TIPOS[k].rot)); });
        s.addEventListener('change', function () { aoMudar(s.value); desenhar(); });
        campos[id] = { sel: s };
        return h('label', { class: 'rg-campo' }, h('span', { class: 'rg-rot' }, rot), s);
      }
      function posB(marcRel, distM) {
        var A = exp.A, m = (A.rumo + marcRel) * D2R;
        exp.B.x = clamp(A.x + Math.sin(m) * distM, -lim().x, lim().x); exp.B.y = clamp(A.y + Math.cos(m) * distM, -lim().y, lim().y);
      }
      function relB() { var d = [exp.B.x - exp.A.x, exp.B.y - exp.A.y]; return { m: n360(marc(d) - exp.A.rumo), d: Math.hypot(d[0], d[1]) }; }
      var fsA = h('fieldset', { class: 'rg-fs rg-fs-a' }, h('legend', null, h('span', { class: 'rg-marca-a', 'aria-hidden': 'true' }), 'Nós'),
        selTipo('tA', 'Nós: tipo', function (v) { exp.A.tipo = v; }),
        faixa('rA', 'Rumo', 0, 359, 1, g3, function (v) { var r = relB(); exp.A.rumo = v; posB(r.m, r.d); }),
        faixa('vA', 'Velocidade', 1, 25, 1, nos, function (v) { exp.A.vel = v; }));
      var fsB = h('fieldset', { class: 'rg-fs rg-fs-b' }, h('legend', null, h('span', { class: 'rg-marca-b', 'aria-hidden': 'true' }), 'A outra'),
        selTipo('tB', 'A outra: tipo', function (v) { exp.B.tipo = v; }),
        faixa('rB', 'Rumo', 0, 359, 1, g3, function (v) { exp.B.rumo = v; }),
        faixa('vB', 'Velocidade', 1, 25, 1, nos, function (v) { exp.B.vel = v; }),
        faixa('mB', 'Marcação relativa (de nós)', 0, 359, 1, g3, function (v) { posB(v, relB().d); }),
        faixa('dB', 'Distância', 0.3, 3.5, 0.05, milhas, function (v) { posB(relB().m, v); }));
      var fsV = h('fieldset', { class: 'rg-fs rg-fs-v' }, h('legend', null, 'Vento'),
        faixa('vento', 'Vento de (de onde sopra)', 0, 355, 5, g3, function (v) { exp.vento = v; }));
      var detAj = h('details', { class: 'rg-det-ajustes' }, h('summary', null, 'Ajustar rumos, velocidades e posições'), h('div', { class: 'rg-ajustes-grade' }, fsA, fsB, fsV));
      ajustes.appendChild(detAj);
      function sincronizarAjustes() {
        var r = relB();
        var vals = { rA: exp.A.rumo, vA: exp.A.vel, rB: exp.B.rumo, vB: exp.B.vel, mB: r.m, dB: r.d, vento: exp.vento };
        Object.keys(vals).forEach(function (k) {
          var c = campos[k]; if (document.activeElement !== c.inp) c.inp.value = String(k === 'dB' ? Math.round(vals[k] * 20) / 20 : Math.round(vals[k]));
          c.val.textContent = ' ' + c.fmt(k === 'dB' ? Math.round(vals[k] * 20) / 20 : Math.round(vals[k]));
        });
        campos.tA.sel.value = exp.A.tipo; campos.tB.sel.value = exp.B.tipo;
        fsV.hidden = !(exp.A.tipo === 'vela' || exp.B.tipo === 'vela');
      }

      /* ---------- Tempo (projeção) ---------- */
      var inpT = h('input', { type: 'range', min: '0', max: '30', step: '0.5', value: '0', 'aria-label': 'Ver a situação daqui a quantos minutos' });
      var outT = h('output', { class: 'rg-val' }, ' agora');
      var btnAnim = h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: animar }, 'Ver o que acontece');
      inpT.addEventListener('input', function () { pararAnim(); est.t = Number(inpT.value); desenhar(); });
      tempo.appendChild(h('label', { class: 'rg-faixa rg-faixa-t' }, h('span', { class: 'rg-rot' }, 'Projeção: daqui a', outT), inpT));
      tempo.appendChild(btnAnim);
      var anim = null;
      function pararAnim() { if (anim) { cancelAnimationFrame(anim.id); anim = null; btnAnim.textContent = reduzMov() ? 'Avançar 1 minuto' : 'Ver o que acontece'; } }
      function animar() {
        if (anim) { pararAnim(); return; }
        var V = analisar(atual().A, atual().B, atual().vento);
        var fim = clamp(isFinite(V.D.tcpa) && V.D.tcpa > 0 ? V.D.tcpa + 3 : 12, 4, 30);
        if (reduzMov()) { est.t = est.t >= 30 ? 0 : Math.min(30, est.t + 1); desenhar(); return; }
        if (est.t >= fim - 0.01) est.t = 0;
        var t0 = performance.now(), ini = est.t;
        btnAnim.textContent = 'Parar';
        var passo = function (agora) {
          if (!anim) return;
          if (!visivel) { anim.id = requestAnimationFrame(passo); t0 = agora - (est.t - ini) / 1.6 * 1000; return; }
          est.t = Math.min(fim, ini + (agora - t0) / 1000 * 1.6);
          desenhar();
          if (est.t >= fim) { pararAnim(); return; }
          anim.id = requestAnimationFrame(passo);
        };
        anim = { id: requestAnimationFrame(passo) };
      }

      /* ---------- Cena ---------- */
      var dims = { w: 640, h: 480 }, k = 75;
      /* escala: no desafio, aproxima para caber o encontro; no explorar, área fixa (menor no celular) */
      function escalar() {
        var span = est.modo === 'desafio' && des.item && des.item.span ? des.item.span : (dims.w < 480 ? 5.4 : SPAN);
        k = Math.min(dims.w, dims.h) / span;
      }
      function rotGraus() { if (arr && arr.q === 'Av' && est.proaCima) return arr.rot0; var s = atual(); return est.proaCima ? s.A.rumo : 0; }
      function lim() { var r = rotGraus() ? 0.82 : 1; return { x: (dims.w / 2 - 22) / k * r, y: (dims.h / 2 - 22) / k * r }; }
      function T(p) {
        var x = p[0], y = p[1], r = rotGraus() * D2R;
        if (r) { var c = Math.cos(r), s = Math.sin(r), xx = x * c - y * s; y = x * s + y * c; x = xx; }
        return [dims.w / 2 + x * k, dims.h / 2 - y * k];
      }
      function Tinv(sx, sy) {
        var x = (sx - dims.w / 2) / k, y = (dims.h / 2 - sy) / k, r = rotGraus() * D2R;
        if (r) { var c = Math.cos(r), s = Math.sin(r), xx = x * c + y * s; y = -x * s + y * c; x = xx; }
        return [x, y];
      }
      function posEm(X, t) { var v = vel(X); return [X.x + v[0] * t, X.y + v[1] * t]; }

      function desenhar() {
        var S = atual(), A = S.A, B = S.B, vento = S.vento, rot = rotGraus();
        var V = analisar(A, B, vento), D = V.D;
        var W = dims.w, H = dims.h, s = '';
        var desafioOculto = est.modo === 'desafio' && des.etapa < 3;
        // fundo e grade de 1 milha
        s += '<rect class="rg-mar" x="0" y="0" width="' + W + '" height="' + H + '"/>';
        var gx = Math.ceil(W / k / 2) + 2;
        for (var i = -gx; i <= gx; i++) {
          var p1 = T([i, -gx]), p2 = T([i, gx]), q1 = T([-gx, i]), q2 = T([gx, i]);
          s += '<line class="rg-grade-l" x1="' + p1[0].toFixed(1) + '" y1="' + p1[1].toFixed(1) + '" x2="' + p2[0].toFixed(1) + '" y2="' + p2[1].toFixed(1) + '"/>';
          s += '<line class="rg-grade-l" x1="' + q1[0].toFixed(1) + '" y1="' + q1[1].toFixed(1) + '" x2="' + q2[0].toFixed(1) + '" y2="' + q2[1].toFixed(1) + '"/>';
        }
        var t = est.t;
        var pA = T(posEm(A, t)), pB = T(posEm(B, t));
        var angA = A.rumo - rot, angB = B.rumo - rot;
        // setor de alcançado destacado (ultrapassagem)
        if (V.sit === 'ultrapassagem' && !desafioOculto) {
          var alvo = V.manobra === 'A' ? { p: pB, ang: angB } : { p: pA, ang: angA };
          s += setor(alvo.p[0], alvo.p[1], Math.min(W, H) * 0.42, alvo.ang + 112.5, alvo.ang + 247.5, 'rg-setor-alc');
          var la = (alvo.ang + 180 + 42) * D2R, rr = Math.min(W, H) * 0.34;
          s += '<text class="rg-txt-setor" x="' + (alvo.p[0] + Math.sin(la) * rr).toFixed(1) + '" y="' + (alvo.p[1] - Math.cos(la) * rr).toFixed(1) + '" text-anchor="middle">setor de alcançado</text>';
        }
        if (est.setores) [[pA, angA], [pB, angB]].forEach(function (q) {
          s += setor(q[0][0], q[0][1], 38, q[1], q[1] + 112.5, 'rg-setor rg-setor-be');
          s += setor(q[0][0], q[0][1], 38, q[1] - 112.5, q[1], 'rg-setor rg-setor-bb');
          s += setor(q[0][0], q[0][1], 30, q[1] + 112.5, q[1] + 247.5, 'rg-setor rg-setor-alcs');
        });
        // derrotas e vetores
        [[A, pA, 'a'], [B, pB, 'b']].forEach(function (q) {
          var X = q[0], fim = T(posEm(X, t + 30)), ponta = T(posEm(X, t + VET));
          s += '<line class="rg-derrota rg-derrota-' + q[2] + '" x1="' + q[1][0].toFixed(1) + '" y1="' + q[1][1].toFixed(1) + '" x2="' + fim[0].toFixed(1) + '" y2="' + fim[1].toFixed(1) + '"/>';
          s += '<line class="rg-vetor rg-vetor-' + q[2] + '" x1="' + q[1][0].toFixed(1) + '" y1="' + q[1][1].toFixed(1) + '" x2="' + ponta[0].toFixed(1) + '" y2="' + ponta[1].toFixed(1) + '"/>';
          var ang = Math.atan2(ponta[0] - q[1][0], -(ponta[1] - q[1][1]));
          s += '<path class="rg-ponta rg-ponta-' + q[2] + '" transform="translate(' + ponta[0].toFixed(1) + ' ' + ponta[1].toFixed(1) + ') rotate(' + (ang / D2R).toFixed(1) + ')" d="M0,-6 L5,4 L-5,4 Z"/>';
          if (est.modo === 'explorar' && t === 0) s += '<circle class="rg-alca" data-alvo="' + q[2].toUpperCase() + 'v" cx="' + ponta[0].toFixed(1) + '" cy="' + ponta[1].toFixed(1) + '" r="18"/>';
        });
        // linha de marcação
        s += '<line class="rg-marcacao" x1="' + pA[0].toFixed(1) + '" y1="' + pA[1].toFixed(1) + '" x2="' + pB[0].toFixed(1) + '" y2="' + pB[1].toFixed(1) + '"/>';
        // maior aproximação
        if (D.aprox && isFinite(D.tcpa) && D.tcpa < HORIZ && D.tcpa > t && !desafioOculto) {
          var cA = T(posEm(A, D.tcpa)), cB = T(posEm(B, D.tcpa));
          s += '<g class="rg-cpa' + (D.risco ? ' rg-cpa-risco' : '') + '">';
          s += '<g transform="translate(' + cA[0].toFixed(1) + ' ' + cA[1].toFixed(1) + ')">' + svgBarco(A, angA, 'rg-fant', vento, rot) + '</g>';
          s += '<g transform="translate(' + cB[0].toFixed(1) + ' ' + cB[1].toFixed(1) + ')">' + svgBarco(B, angB, 'rg-fant', vento, rot) + '</g>';
          s += '<line class="rg-cpa-l" x1="' + cA[0].toFixed(1) + '" y1="' + cA[1].toFixed(1) + '" x2="' + cB[0].toFixed(1) + '" y2="' + cB[1].toFixed(1) + '"/>';
          var mx = (cA[0] + cB[0]) / 2, my = (cA[1] + cB[1]) / 2;
          var lbl = D.cpa < 0.05 ? 'rumo de colisão: encontro em ' + minTxt(D.tcpa - t) : 'maior aproximação ' + milhas(D.cpa) + ' em ' + minTxt(D.tcpa - t);
          var lw = lbl.length * 6.3 + 10;
          // escolhe, entre quatro posições em volta do ponto, a mais longe dos dois barcos
          var cands = [[mx + 16, my - 22], [mx + 16, my + 30], [mx - lw - 16, my - 22], [mx - lw - 16, my + 30]], melhor = null, dm = -1;
          cands.forEach(function (c) {
            var x0 = clamp(c[0], 4, W - lw - 4), y0 = clamp(c[1], 16, H - 8), cx0 = x0 + lw / 2, cy0 = y0 - 4;
            var dd = Math.min(Math.hypot(cx0 - pA[0], cy0 - pA[1]), Math.hypot(cx0 - pB[0], cy0 - pB[1]));
            if (dd > dm) { dm = dd; melhor = [x0, y0]; }
          });
          var lx = melhor[0], ly = melhor[1];
          s += '<rect class="rg-cpa-fundo" x="' + (lx - 4).toFixed(1) + '" y="' + (ly - 13).toFixed(1) + '" width="' + lw.toFixed(1) + '" height="18" rx="3"/>';
          s += '<text class="rg-cpa-txt" x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '">' + lbl + '</text></g>';
        }
        // posições iniciais quando a projeção avança
        if (t > 0) { var iA = T([A.x, A.y]), iB = T([B.x, B.y]); s += '<g transform="translate(' + iA[0].toFixed(1) + ' ' + iA[1].toFixed(1) + ')">' + svgBarco(A, angA, 'rg-inicio', vento, rot) + '</g><g transform="translate(' + iB[0].toFixed(1) + ' ' + iB[1].toFixed(1) + ')">' + svgBarco(B, angB, 'rg-inicio', vento, rot) + '</g>'; }
        // barcos
        s += '<g transform="translate(' + pB[0].toFixed(1) + ' ' + pB[1].toFixed(1) + ')">' + svgBarco(B, angB, 'rg-b', vento, rot) + '</g>';
        s += '<g transform="translate(' + pA[0].toFixed(1) + ' ' + pA[1].toFixed(1) + ')">' + svgBarco(A, angA, 'rg-a', vento, rot) + '</g>';
        // rótulos
        function rotulo(p, ang, txt, sub, cls) {
          // do lado oposto ao vetor (para onde a proa aponta na tela); sem espaço, embaixo do barco
          var sn = Math.sin(ang * D2R), lado = sn > 0.3 ? 'esq' : 'dir';
          if (lado === 'dir' && p[0] > W - 110) lado = sn < -0.3 ? 'baixo' : 'esq';
          if (lado === 'esq' && p[0] < 110) lado = sn > 0.3 ? 'baixo' : 'dir';
          var x = lado === 'dir' ? p[0] + 26 : lado === 'esq' ? p[0] - 26 : p[0], anc = lado === 'dir' ? 'start' : lado === 'esq' ? 'end' : 'middle';
          var y = lado === 'baixo' ? (p[1] + 40 < H - 30 ? p[1] + 36 : p[1] - 48) : clamp(p[1] - 4, 14, H - 30);
          var r = '<text class="rg-rotulo ' + cls + '" x="' + x.toFixed(1) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="' + anc + '">' + txt + '</text>';
          if (sub) r += '<text class="rg-rotulo-sub" x="' + x.toFixed(1) + '" y="' + (y + 18).toFixed(1) + '" text-anchor="' + anc + '">' + VL.esc(sub) + '</text>';
          return r;
        }
        s += rotulo(pA, angA, 'nós', A.tipo !== 'pm' ? TIPOS[A.tipo].curto : '', 'rg-rotulo-a');
        s += rotulo(pB, angB, 'outra', B.tipo !== 'pm' ? TIPOS[B.tipo].curto : '', 'rg-rotulo-b');
        // alças de arrasto do casco
        if (est.modo === 'explorar' && t === 0) {
          s += '<circle class="rg-alca" data-alvo="B" cx="' + pB[0].toFixed(1) + '" cy="' + pB[1].toFixed(1) + '" r="22"/>';
          s += '<circle class="rg-alca" data-alvo="A" cx="' + pA[0].toFixed(1) + '" cy="' + pA[1].toFixed(1) + '" r="22"/>';
        }
        // norte
        var nAng = -rot;
        s += '<g class="rg-norte" transform="translate(28 30) rotate(' + nAng.toFixed(1) + ')"><path d="M0,-15 L6,8 L0,4 L-6,8 Z"/><text x="0" y="-19" text-anchor="middle" transform="rotate(' + (-nAng).toFixed(1) + ' 0 -23)">N</text></g>';
        // escala
        s += '<g class="rg-escala"><line x1="14" y1="' + (H - 16) + '" x2="' + (14 + k).toFixed(1) + '" y2="' + (H - 16) + '"/><line x1="14" y1="' + (H - 21) + '" x2="14" y2="' + (H - 11) + '"/><line x1="' + (14 + k).toFixed(1) + '" y1="' + (H - 21) + '" x2="' + (14 + k).toFixed(1) + '" y2="' + (H - 11) + '"/><text x="' + (14 + k / 2).toFixed(1) + '" y="' + (H - 24) + '" text-anchor="middle">1 milha</text></g>';
        // vento
        if (A.tipo === 'vela' || B.tipo === 'vela') {
          var cx = W - 46, cy = 46, wa = (vento - rot) * D2R;
          var ux = Math.sin(wa), uy = -Math.cos(wa);
          s += '<g class="rg-vento"><circle cx="' + cx + '" cy="' + cy + '" r="32" class="rg-vento-c"/>';
          s += '<line x1="' + (cx + ux * 26).toFixed(1) + '" y1="' + (cy + uy * 26).toFixed(1) + '" x2="' + (cx - ux * 20).toFixed(1) + '" y2="' + (cy - uy * 20).toFixed(1) + '" class="rg-vento-l"/>';
          s += '<path transform="translate(' + (cx - ux * 22).toFixed(1) + ' ' + (cy - uy * 22).toFixed(1) + ') rotate(' + (vento - rot + 180).toFixed(1) + ')" d="M0,-7 L5.5,3 L-5.5,3 Z" class="rg-vento-p"/>';
          s += '<text x="' + cx + '" y="' + (cy + 48) + '" text-anchor="middle" class="rg-vento-t">vento de ' + g3(vento) + '</text>';
          if (est.modo === 'explorar') s += '<circle class="rg-alca" data-alvo="vento" cx="' + cx + '" cy="' + cy + '" r="34"/>';
          s += '</g>';
        }
        svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
        svg.innerHTML = s;
        svg.setAttribute('aria-label', descreverCena(A, B, vento, V));
        outT.textContent = est.t ? ' ' + VL.fmt.num(est.t, est.t % 1 ? 1 : 0) + ' min' : ' agora';
        if (document.activeElement !== inpT) inpT.value = String(est.t);
        if (est.modo === 'explorar') { sincronizarAjustes(); painelExplorar(V, A, B, vento); }
        return V;
      }
      function descreverCena(A, B, vento, V) {
        var D = V.D;
        var t = 'Vista de cima, ' + (est.proaCima ? 'nossa proa para cima' : 'norte para cima') + '. Nós: ' + TIPOS[A.tipo].curto + ', rumo ' + g3(A.rumo) + ', ' + nos(A.vel) + '. A outra: ' + TIPOS[B.tipo].curto + ', rumo ' + g3(B.rumo) + ', ' + nos(B.vel) +
          ', ' + nomeMarcacao(D.rbA) + ', marcação relativa ' + g3(D.rbA) + ', a ' + milhas(D.dist) + '.';
        if (A.tipo === 'vela' || B.tipo === 'vela') t += ' Vento de ' + g3(vento) + '.';
        return t;
      }

      /* ---------- Painel ---------- */
      function blocoPapeis(V, A, B) {
        var pA = V.manobra === 'A' || V.manobra === 'ambas' ? 'manobra' : V.manobra === 'B' ? 'mantém rumo e velocidade' : V.sit === 'semrisco' ? 'sem obrigação agora' : 'boa marinharia';
        var pB = V.manobra === 'B' || V.manobra === 'ambas' ? 'manobra' : V.manobra === 'A' ? 'mantém rumo e velocidade' : V.sit === 'semrisco' ? 'sem obrigação agora' : 'boa marinharia';
        function linha(cls, quem, X, papel) {
          return '<li class="rg-papel"><span class="' + cls + '" aria-hidden="true"></span><span class="rg-papel-txt"><strong>' + quem + '</strong> · ' + VL.esc(TIPOS[X.tipo].curto) + ' · ' + g3(X.rumo) + ', ' + nos(X.vel) + '</span><span class="rg-chip-papel" data-p="' + (papel === 'manobra' ? 'm' : papel.indexOf('mantém') === 0 ? 'k' : 'n') + '">' + papel + '</span></li>';
        }
        return '<ul class="rg-papeis">' + linha('rg-marca-a', 'Nós', A, pA) + linha('rg-marca-b', 'A outra', B, pB) + '</ul>';
      }
      function escada(A, B) {
        var deg = [['sg', 'Sem governo · Manobra restrita', '18(a)(i)–(ii)'], ['cal', 'Restrita devido ao seu calado: os outros evitam impedir a passagem', '18(d)'], ['pesca', 'Engajada na pesca', '18(a)(iii) e (b)(iii)'], ['vela', 'A vela', '18(a)(iv)'], ['pm', 'Propulsão mecânica', '18(a)']];
        var ul = '<ol class="rg-escada">';
        deg.forEach(function (d) {
          var marcas = '';
          var temA = A.tipo === d[0] || (d[0] === 'sg' && A.tipo === 'mr'), temB = B.tipo === d[0] || (d[0] === 'sg' && B.tipo === 'mr');
          if (temA) marcas += '<span class="rg-esc-m rg-esc-a">nós</span>';
          if (temB) marcas += '<span class="rg-esc-m rg-esc-b">outra</span>';
          ul += '<li' + (temA || temB ? ' data-on="1"' : '') + '><span>' + d[1] + '</span>' + marcas + '</li>';
        });
        ul += '</ol>';
        return ul + '<p class="rg-miudo">Quem está mais abaixo mantém-se fora do caminho de quem está acima (Regra 18). Valem antes: a ultrapassagem (Regra 13) e as regras de canais estreitos e esquemas de separação de tráfego (Regras 9 e 10). Hidroaviões e embarcações WIG também cedem (Regra 18(e) e (f)).</p>';
      }
      function painelExplorar(V, A, B, vento) {
        var D = V.D, s = '';
        s += '<h3 class="rg-titulo">' + VL.esc(V.titulo) + en(SIT[V.sit] && SIT[V.sit].en) + '</h3>';
        s += '<p class="rg-regra"><span class="chip">RIPEAM, ' + VL.esc(V.regra) + '</span>' + (D.risco ? ' <span class="rg-risco">há risco de abalroamento</span>' : '') + '</p>';
        s += blocoPapeis(V, A, B);
        s += '<div class="rg-acao"><p class="rg-acao-t">O que fazemos</p><p>' + VL.esc(V.acao) + '</p></div>';
        s += '<p class="rg-porque">' + VL.esc(V.porque) + '</p>';
        s += '<p class="rg-dados">Ela está ' + nomeMarcacao(D.rbA) + ', marcação relativa ' + g3(D.rbA) + ', a ' + milhas(D.dist) + '. ' +
          (D.aprox && isFinite(D.tcpa) ? 'Maior aproximação prevista: ' + milhas(D.cpa) + ' daqui a ' + minTxt(D.tcpa) + '.' : 'A distância está aumentando.') + '</p>';
        s += '<p class="rg-dados">À noite veríamos dela: ' + VL.esc(luzesVistas(B, D.rbB).join('; ')) + '.</p>';
        V.notas.forEach(function (n) { s += '<p class="rg-nota">' + VL.esc(n) + '</p>'; });
        painel.innerHTML = s;
        var det1 = h('details', { class: 'rg-det', open: V.sit === 'hierarquia' || V.sit === 'naoImpedir' || V.sit === 'mesma' ? true : null }, h('summary', null, 'Hierarquia da Regra 18'), h('div', { html: escada(A, B) }));
        var det2 = h('details', { class: 'rg-det' }, h('summary', null, 'Como o simulador decide'),
          h('p', null, 'Há risco quando a maior aproximação prevista fica abaixo de 0,5 milha nos próximos 40 minutos. O RIPEAM não fixa esse número: se a marcação da outra quase não muda enquanto a distância diminui, há risco, e na dúvida considere que há (Regra 7(a) e (d)). A distância segura depende do tamanho dos barcos, do mar e da visibilidade.'),
          h('p', null, 'Ordem das perguntas: 1) alguém está alcançando a outra (vindo de mais de 22,5° por ante a ré do través)? Regra 13. 2) São de categorias diferentes? Regra 18. 3) Dois veleiros? Regra 12. 4) Duas de propulsão mecânica? Regra 14 (cada uma vê a outra até cerca de 6° da proa; até 11,25° tratamos como dúvida) ou Regra 15.'),
          h('p', null, 'Tudo isto vale com as embarcações à vista uma da outra (Regra 11). Na visibilidade restrita, vale a Regra 19, que é diferente.'));
        painel.appendChild(det1); painel.appendChild(det2);
        var anun = V.titulo + '. ' + (V.manobra === 'A' ? 'Nós manobramos.' : V.manobra === 'B' ? 'A outra manobra.' : V.manobra === 'ambas' ? 'As duas guinam para boreste.' : '');
        if (anun !== vivo.textContent) { clearTimeout(anunTm); anunTm = setTimeout(function () { vivo.textContent = anun; }, 600); }
      }
      var anunTm = null;

      /* ---------- Arrastar (pointer events) ---------- */
      var arr = null, rafArr = null, visivel = true;
      function svgPt(ev) { var r = svg.getBoundingClientRect(); return [(ev.clientX - r.left) / r.width * dims.w, (ev.clientY - r.top) / r.height * dims.h]; }
      svg.addEventListener('pointerdown', function (ev) {
        if (est.modo !== 'explorar') return;
        var alvo = ev.target.closest && ev.target.closest('[data-alvo]');
        if (!alvo) return;
        pararAnim(); est.t = 0;
        var p = svgPt(ev), w = Tinv(p[0], p[1]), q = alvo.getAttribute('data-alvo');
        var X = q.charAt(0) === 'A' ? exp.A : exp.B;
        arr = { q: q, id: ev.pointerId, dx: q === 'A' || q === 'B' ? X.x - w[0] : 0, dy: q === 'A' || q === 'B' ? X.y - w[1] : 0, rot0: rotGraus() };
        try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* ok */ }
        ev.preventDefault();
      });
      svg.addEventListener('pointermove', function (ev) {
        if (!arr || arr.id !== ev.pointerId) return;
        var p = svgPt(ev);
        arr.ult = p;
        if (!rafArr) rafArr = requestAnimationFrame(aplicarArrasto);
      });
      function aplicarArrasto() {
        rafArr = null;
        if (!arr || !arr.ult) return;
        var p = arr.ult, L = lim();
        if (arr.q === 'vento') {
          var cx = dims.w - 46, cy = 46, ang = Math.atan2(p[0] - cx, -(p[1] - cy)) / D2R;
          exp.vento = rnd5(ang + rotGraus());
        } else {
          var w = Tinv(p[0], p[1]);
          var X = arr.q.charAt(0) === 'A' ? exp.A : exp.B;
          if (arr.q.length === 1) { X.x = clamp(w[0] + arr.dx, -L.x, L.x); X.y = clamp(w[1] + arr.dy, -L.y, L.y); }
          else {
            var dx = w[0] - X.x, dy = w[1] - X.y, len = Math.hypot(dx, dy);
            if (len > 0.03) { X.rumo = Math.round(n360(Math.atan2(dx, dy) / D2R)); X.vel = clamp(Math.round(len / (VET / 60)), 1, 25); }
          }
        }
        desenhar();
      }
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (tp) { svg.addEventListener(tp, function () { if (arr) { arr = null; desenhar(); } }); });

      /* ---------- Desafio ---------- */
      var OP_SIT = ['rodaaroda', 'cruzados', 'ultrapassagem', 'velaBordos', 'velaMesmo', 'hierarquia'];
      var ROT_Q1 = { rodaaroda: 'Roda a roda', cruzados: 'Rumos cruzados', ultrapassagem: 'Ultrapassagem', velaBordos: 'Dois veleiros, vento em bordos diferentes', velaMesmo: 'Dois veleiros, vento no mesmo bordo', hierarquia: 'Categorias diferentes (responsabilidades entre embarcações)' };
      function opcoesQ2(V, A) {
        var certa = V.curta, ops = [certa];
        var ELA = 'A outra manobra; nós mantemos rumo e velocidade, vigiando', AMB = 'As duas guinam para boreste e passam bombordo com bombordo';
        var nosAcao = A.tipo === 'vela' ? 'Nós manobramos: orçamos e cruzamos a proa dela' : 'Nós manobramos: guinamos para bombordo e cruzamos a proa dela';
        var cand = V.manobra === 'A' ? [ELA, AMB, nosAcao] : V.manobra === 'B' ? [A.tipo === 'vela' ? 'Nós manobramos: arribamos e passamos pela popa dela' : 'Nós manobramos: guinamos para boreste e passamos pela popa dela', AMB, 'Nós guinamos para bombordo, para abrir espaço'] : ['Nós manobramos: guinamos para boreste e passamos pela popa dela', ELA, 'As duas guinam para bombordo'];
        if (V.sit === 'ultrapassagem' && V.manobra === 'A') cand = [ELA + ': ela está na nossa frente', AMB, 'Quem for de menor prioridade pela Regra 18 manobra'];
        if (V.sit === 'ultrapassagem' && V.manobra === 'B') cand = ['Nós manobramos: ficamos fora do caminho dela até ela passar', AMB, 'Nós guinamos para bombordo, para abrir espaço'];
        cand.forEach(function (c) { if (ops.indexOf(c) < 0 && ops.length < 4) ops.push(c); });
        return { certa: certa, ops: VL.embaralhar(ops) };
      }
      function novoDesafio() {
        pararAnim();
        var g = null, t = 0, ant = des.item && des.item.nome;
        while (!g && t++ < 12) { var nome = sortear(desafios); if (desafios.length > 1 && nome === ant && t < 6) continue; g = gerar(nome); }
        if (!g) g = gerar('cruzados');
        des.item = g; des.n++; des.etapa = 1; est.t = 0;
        var r = 0;
        [[g.A, 0], [g.B, 0], [g.A, g.V.D.tcpa], [g.B, g.V.D.tcpa]].forEach(function (q) { var v = vel(q[0]); r = Math.max(r, Math.hypot(q[0].x + v[0] * q[1], q[0].y + v[1] * q[1])); });
        g.span = clamp(2 * r + 1.1, 3.4, SPAN);
        escalar();
        var q1 = [g.V.sit === 'duvida' ? 'rodaaroda' : g.V.sit];
        VL.embaralhar(OP_SIT.filter(function (x) { return x !== q1[0] && !((g.A.tipo !== 'vela' || g.B.tipo !== 'vela') && /^vela/.test(x) && Math.random() < 0.5); })).forEach(function (x) { if (q1.length < 4) q1.push(x); });
        des.q1 = VL.embaralhar(q1);
        des.q2 = opcoesQ2(g.V, g.A);
        sincronizar(); desenhar(); painelDesafio();
      }
      function placarTxt() { return 'Situação ' + des.n + ' · acertos: ' + des.acertos + ' de ' + des.total; }
      function painelDesafio() {
        var it = des.item, V = it.V, A = it.A, B = it.B;
        painel.innerHTML = '';
        painel.appendChild(h('p', { class: 'rg-placar' }, placarTxt()));
        var resumo = h('p', { class: 'rg-des-resumo' }, 'Nós: ' + TIPOS[A.tipo].curto + ', ' + nos(A.vel) + '. A outra: ' + TIPOS[B.tipo].curto + ', ' + nos(B.vel) + ', ' + nomeMarcacao(V.D.rbA) + '.' + (A.tipo === 'vela' || B.tipo === 'vela' ? ' Vento de ' + g3(it.vento) + '.' : '') + ' Há risco de abalroamento.');
        painel.appendChild(resumo);
        if (des.etapa === 1) {
          painel.appendChild(h('h3', { class: 'rg-titulo' }, 'Que situação é esta?'));
          var g1 = h('div', { class: 'rg-opcs', role: 'group', 'aria-label': 'Alternativas' });
          des.q1.forEach(function (x) { g1.appendChild(h('button', { type: 'button', class: 'rg-opc', 'data-k': x, onclick: function () { resp1(x, g1); } }, ROT_Q1[x])); });
          painel.appendChild(g1);
        } else if (des.etapa === 2) {
          painel.appendChild(h('h3', { class: 'rg-titulo' }, 'Quem manobra, e como?'));
          var g2 = h('div', { class: 'rg-opcs', role: 'group', 'aria-label': 'Alternativas' });
          des.q2.ops.forEach(function (x) { g2.appendChild(h('button', { type: 'button', class: 'rg-opc', 'data-k': x, onclick: function () { resp2(x, g2); } }, x)); });
          painel.appendChild(g2);
        }
      }
      function marcar(g, certa, escolhida) {
        VL.$$('.rg-opc', g).forEach(function (b) { b.disabled = true; var k2 = b.getAttribute('data-k'); if (k2 === certa) b.setAttribute('data-res', 'certa'); else if (k2 === escolhida) b.setAttribute('data-res', 'errada'); });
      }
      function resp1(x, g) {
        var V = des.item.V, certa = V.sit === 'duvida' ? 'rodaaroda' : V.sit, ok = x === certa;
        des.total++; if (ok) des.acertos++;
        marcar(g, certa, x);
        VL.$('.rg-placar', painel).textContent = placarTxt();
        var exp1 = {
          rodaaroda: 'As duas se veem pela proa, em rumos opostos (Regra 14).', cruzados: 'Duas de propulsão mecânica se cruzando, sem uma estar alcançando a outra (Regra 15).',
          ultrapassagem: 'Uma vem de mais de 22,5° por ante a ré do través da outra, mais rápida (Regra 13). Isso vale acima de qualquer outra regra de governo.',
          velaBordos: 'Dois veleiros, cada um recebendo o vento por um bordo (Regra 12(a)(i)).', velaMesmo: 'Dois veleiros recebendo o vento pelo mesmo bordo (Regra 12(a)(ii)).',
          hierarquia: 'As duas fazem coisas diferentes: ' + TIPOS[des.item.A.tipo].curto + ' e ' + TIPOS[des.item.B.tipo].curto + '. Decide a Regra 18.',
        }[certa];
        var fb = h('div', { class: 'rg-fb' }, h('p', { class: 'rg-res', 'data-ok': ok ? '1' : '0' }, ok ? 'Certo.' : 'Não. É: ' + ROT_Q1[certa] + '.'), h('p', null, exp1),
          h('div', { class: 'btn-row' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { des.etapa = 2; painelDesafio(); } }, 'Continuar')));
        painel.appendChild(fb);
        VL.$('.btn-primary', fb).focus({ preventScroll: true });
      }
      function resp2(x, g) {
        var it = des.item, V = it.V, ok = x === des.q2.certa;
        des.total++; if (ok) des.acertos++;
        marcar(g, des.q2.certa, x);
        des.etapa = 3;
        desenhar();
        var fb = h('div', { class: 'rg-fb' });
        fb.appendChild(h('p', { class: 'rg-res', 'data-ok': ok ? '1' : '0' }, ok ? 'Certo.' : 'Não. ' + des.q2.certa + '.'));
        fb.appendChild(h('p', { html: '<span class="chip">RIPEAM, ' + VL.esc(V.regra) + '</span>' }));
        fb.appendChild(h('p', null, V.porque));
        fb.appendChild(h('p', { class: 'rg-acao-inline' }, h('strong', null, 'O que fazemos: '), V.acao));
        V.notas.forEach(function (n) { fb.appendChild(h('p', { class: 'rg-nota' }, n)); });
        var prox = h('button', { type: 'button', class: 'btn btn-primary', onclick: novoDesafio }, 'Próxima situação');
        fb.appendChild(h('div', { class: 'btn-row' }, prox));
        painel.appendChild(fb);
        VL.$('.rg-placar', painel).textContent = placarTxt();
        tempo.hidden = false;
        prox.focus({ preventScroll: true });
      }

      /* ---------- Orquestração ---------- */
      function sincronizar() {
        VL.$$('button', segModo).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === est.modo)); });
        VL.$$('button', segOri).forEach(function (b) { b.setAttribute('aria-pressed', String((b.getAttribute('data-v') === 'proa') === est.proaCima)); });
        var e = est.modo === 'explorar';
        ajustes.hidden = !e; btnSortear.hidden = !e; dica.hidden = !e;
        tempo.hidden = !e && des.etapa < 3;
        ins.raiz.setAttribute('data-modo', est.modo);
        btnAnim.textContent = anim ? 'Parar' : (reduzMov() ? 'Avançar 1 minuto' : 'Ver o que acontece');
      }
      function tudo() { sincronizar(); desenhar(); }
      function trocarModo(m) {
        if (m === est.modo) return;
        pararAnim(); est.modo = m; est.t = 0;
        if (m === 'desafio') { est.proaExp = est.proaCima; est.proaCima = opts.proaCima != null ? !!opts.proaCima : true; des.n = 0; des.acertos = 0; des.total = 0; sincronizar(); novoDesafio(); }
        else { if (est.proaExp != null) est.proaCima = est.proaExp; des.item = null; des.etapa = 0; escalar(); tudo(); }
        sincronizar();
      }

      var ro = new ResizeObserver(function () {
        var w = Math.round(svg.clientWidth), hh = Math.round(svg.clientHeight);
        if (w < 50 || hh < 50 || (w === dims.w && hh === dims.h)) return;
        dims.w = w; dims.h = hh; escalar();
        desenhar();
      });
      ro.observe(svg);
      var io = null;
      if ('IntersectionObserver' in window) { io = new IntersectionObserver(function (es) { visivel = es[es.length - 1].isIntersecting; }, { threshold: 0 }); io.observe(svg); }

      detAj.open = (ins.corpo.clientWidth || 0) > 700;
      sincronizar();
      if (est.modo === 'desafio') novoDesafio(); else desenhar();
      sincronizar();

      return function limpar() {
        pararAnim(); if (rafArr) cancelAnimationFrame(rafArr); clearTimeout(anunTm);
        ro.disconnect(); if (io) io.disconnect();
      };
    },
  });

  VL.regrasGoverno = { analisar: analisar, gerar: gerar, cenarioInicial: cenarioInicial, MOLDES: MOLDES, TIPOS: TIPOS };
})();
