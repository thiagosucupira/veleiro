/* Curso Rádio, segurança e certificados — parte 1 (módulos m1 a m5).
   Programa de referência: NORMAM-211/DPC, Anexo 5-A (VHF no ARA, VHF/RENEC/EPIRB/AIS no MSA, comunicações oceânicas/EPIRB/SART no CPA),
   Regulamento de Radiocomunicações da UIT (Arts. 32 e 33, Apêndices 14, 15, 18 e 43), Recomendações UIT-R M.493, M.541, M.585 e M.1171,
   material de apoio do exame de Radiotelefonista da Anatel (versão 2026-03) e documentos da Cospas-Sarsat e do DECEA.
   Fatos regulatórios só com {t:'fato', ref} (ids de research/claims_verified.json ou research/_work/research_extra_radio-1.json).
   Para contribuir: mantenha os ids de módulos e lições (o progresso dos alunos é salvo por eles). */
(function () {
  'use strict';
  var NORMAM = 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf';
  var ANATEL = 'https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/26d83dbe3d877aa49974f414d3fa75b6';
  var MMAR = 'https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/9835bc212b5ea723ca4918a8986dd33a';
  var ATO3449 = 'https://sei.anatel.gov.br/sei/modulos/pesquisa/md_pesq_documento_consulta_externa.php?8-74Kn1tDR89f1Q7RjX8EYU46IzCFD26Q9Xx5QNDbqZN6xPXfARLSUcWx4TnWTzH5A3neB6Oso1z0PtvCqNhP-nGZXXh0VeIuY-RIs04JpAv5qBlqcDBwhMXlVozb1f0';
  var RGST = 'https://informacoes.anatel.gov.br/legislacao/component/content/article/170-resolucoes/2025/2022-resolucao-777';
  var RR = 'https://www.itu.int/pub/R-REG-RR';
  var M493 = 'https://www.itu.int/rec/R-REC-M.493';
  var M541 = 'https://www.itu.int/rec/R-REC-M.541';
  var M585 = 'https://www.itu.int/rec/R-REC-M.585';
  var M1171 = 'https://www.itu.int/rec/R-REC-M.1171';
  var P834 = 'https://www.itu.int/rec/R-REC-P.834';
  var COSPAS = 'https://www.cospas-sarsat.int/';
  var IMOG = 'https://www.imo.org/en/OurWork/Safety/Pages/GMDSS.aspx';
  var INFOSAR = 'https://infosar.decea.mil.br/';
  var RES349 = 'https://itu.int/en/ITU-R/terrestrial/fmd/Documents/WRC_23_Resolutions/E/RES_349(REV.WRC-23)-E.pdf';
  var MOBRYA = 'https://www.rya.org.uk/water-safety/cold-water-shock-safety/man-overboard/';
  var MOBUSS = 'https://www.ussailing.org/news/man-overboard-rescue-procedure/';
  var RIPEAM = 'https://www.ccaimo.marinha.mil.br/drupal/sites/default/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf';

  /* ---------- Atalhos de blocos e de questões ---------- */
  function P(html) { return { t: 'p', html: html }; }
  function H(txt) { return { t: 'h', txt: txt }; }
  function L(itens, ord) { return { t: 'lista', itens: itens, ordenada: !!ord }; }
  function C(tipo, titulo, html) { return { t: 'callout', tipo: tipo, titulo: titulo, html: html }; }
  function F(ref, html) { return { t: 'fato', ref: ref, html: html }; }
  function TERMOS(ids) { return { t: 'termos', ids: ids }; }
  function W(w, opts, legenda) { return { t: 'widget', w: w, opts: opts || {}, legenda: legenda }; }
  function FIG(svg, legenda) { return { t: 'figura', svg: svg, legenda: legenda }; }
  function TAB(cab, linhas, legenda) { return { t: 'tabela', cab: cab, linhas: linhas, legenda: legenda }; }
  function FONTES(itens) { return { t: 'fontes', itens: itens }; }
  /* Questão: Q(id, tema, dificuldade, enunciado, [alternativas], correta, explicação, referência, url) */
  function Q(id, tema, dif, enun, alts, correta, expl, ref, url) {
    var q = { id: 'radio1-' + id, nivel: 'radio', tema: tema, dificuldade: dif, enunciado: enun, alternativas: alts, correta: correta, explicacao: expl, referencia: ref };
    if (url) q.fonte_url = url;
    return q;
  }
  function CHECK(qs, titulo) { return { t: 'check', questoes: qs, titulo: titulo }; }

  /* ---------- Figuras SVG (só tokens de cor; texto a partir de 16 unidades em viewBox de ~480) ---------- */
  function svg(vb, titulo, corpo, maxw) {
    return '<svg viewBox="' + vb + '" width="100%" style="max-width:' + (maxw || 480) + 'px;display:block;margin:0 auto;overflow:visible" role="img" aria-label="' + titulo + '" xmlns="http://www.w3.org/2000/svg" font-family="inherit" fill="var(--ink)"><title>' + titulo + '</title>' + corpo + '</svg>';
  }
  function t(x, y, s, fs, anc, ext) {
    var cor = ext && /fill=/.test(ext) ? '' : ' fill="var(--ink)"';
    return '<text x="' + x + '" y="' + y + '" font-size="' + (fs || 16) + '" text-anchor="' + (anc || 'middle') + '"' + cor + (ext ? ' ' + ext : '') + '>' + s + '</text>';
  }
  function defs(id, cor) {
    return '<defs><marker id="' + id + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="' + (cor || 'var(--ink)') + '"/></marker></defs>';
  }
  /* Caixa com texto de uma ou duas linhas: caixa(x, y, w, h, linha1, linha2?, estilo?) ; estilo: 'mg' (magenta) | 'sea' */
  function caixa(x, y, w, h, l1, l2, est) {
    var fill = est === 'mg' ? 'var(--sea-1)' : (est === 'sea' ? 'var(--sea-2)' : 'var(--land)');
    var str = est === 'mg' ? 'var(--magenta)' : 'var(--ink)';
    var cy = y + h / 2;
    var corpo = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="8" fill="' + fill + '" stroke="' + str + '" stroke-width="' + (est === 'mg' ? 2.5 : 1.8) + '"/>';
    if (l2) corpo += t(x + w / 2, cy - 4, l1, 16, 'middle', 'font-weight="700"') + t(x + w / 2, cy + 16, l2, 14);
    else corpo += t(x + w / 2, cy + 6, l1, 16, 'middle', 'font-weight="700"');
    return corpo;
  }

  var FIG_HORIZONTE = svg('0 0 480 250', 'Dois barcos no mar: a antena alta de um enxerga a antena baixa do outro até o horizonte de rádio; a curvatura da Terra limita o alcance do VHF',
    '<path d="M10,197.5 20,190.2 30,183.3 40,176.9 50,170.9 60,165.3 70,160.1 80,155.3 90,150.9 100,146.7 110,142.9 120,139.4 130,136.3 140,133.4 150,130.8 160,128.5 170,126.5 180,124.8 190,123.3 200,122.1 210,121.2 220,120.5 230,120.1 240,120 250,120.1 260,120.5 270,121.2 280,122.1 290,123.3 300,124.8 310,126.5 320,128.5 330,130.8 340,133.4 350,136.3 360,139.4 370,142.9 380,146.7 390,150.9 400,155.3 410,160.1 420,165.3 430,170.9 440,176.9 450,183.3 460,190.2 470,197.5 L470,250 L10,250 Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2"/>' +
    '<line x1="62" y1="164.3" x2="62" y2="112.3" stroke="var(--ink)" stroke-width="3"/><circle cx="62" cy="112.3" r="5" fill="var(--magenta)"/>' +
    '<line x1="376.5" y1="145.3" x2="376.5" y2="125.3" stroke="var(--ink)" stroke-width="3"/><circle cx="376.5" cy="125.3" r="5" fill="var(--magenta)"/>' +
    '<line x1="62" y1="112.3" x2="376.5" y2="125.3" stroke="var(--magenta)" stroke-width="2.5" stroke-dasharray="7 5"/>' +
    '<circle cx="255.8" cy="120.3" r="4" fill="var(--ink)"/>' +
    t(62, 96, 'antena no tope do mastro', 16) + t(376, 108, 'rádio portátil na mão', 16) +
    t(256, 90, 'horizonte de rádio', 16, 'middle', 'font-weight="700"') + '<line x1="256" y1="96" x2="256" y2="114" stroke="var(--ink)" stroke-width="1.5"/>' +
    t(150, 226, 'd₁ ≈ 2,2 × √h₁', 17, 'middle', 'fill="var(--magenta)" font-weight="700"') + t(340, 226, 'd₂ ≈ 2,2 × √h₂', 17, 'middle', 'fill="var(--magenta)" font-weight="700"') +
    '<line x1="256" y1="200" x2="256" y2="238" stroke="var(--ink)" stroke-width="1.2" stroke-dasharray="3 4"/>', 500);

  VL.dado('cursos/radio-1', {
  modulos: [
{
      id: 'm1',
      titulo: 'VHF e DSC na prática',
      resumo: 'O rádio que todo barco precisa saber usar: como o VHF alcança, que potência usar, o que cada canal faz, a escuta obrigatória, como o DSC e o MMSI chamam por você e como instalar e cuidar do equipamento.',
      licoes: [
        {
          id: 'l1',
          titulo: 'O rádio VHF: o que é e até onde alcança',
          minutos: 10,
          objetivos: [
            'Explicar por que o alcance do VHF depende da altura das antenas e não só da potência',
            'Estimar o alcance entre duas estações com a regra da raiz quadrada',
            'Distinguir o rádio fixo (25 W) do portátil e saber quando usar potência baixa',
          ],
          blocos: [
            P('O <b>VHF</b> (sigla de <i>very high frequency</i>, “frequência muito alta”) é o telefone do mar. Com ele você fala com outros barcos, com marinas, com estações costeiras e, no pior dia da sua vida, com quem vai socorrer você. A faixa marítima fica entre 156 e 174 MHz.'),
            TERMOS(['vhf', 'canal-16', 'dsc', 'mmsi']),
            H('Alcance é visada, não potência'),
            P('As ondas de VHF andam em linha reta, como a luz. Elas não contornam a curvatura da Terra: o que está abaixo do <b>horizonte de rádio</b> fica “escondido”. Por isso o alcance depende sobretudo da <b>altura das duas antenas</b>, não de quantos watts o rádio tem.'),
            FIG(FIG_HORIZONTE, 'O alcance entre duas antenas é a soma das distâncias de cada uma até o horizonte de rádio. A figura exagera a curvatura e a altura dos mastros.'),
            P('A regra prática, com a altura h em metros e o alcance em milhas náuticas, é: <b>alcance ≈ 2,2 × (√h₁ + √h₂)</b>. O fator 2,2 já inclui a pequena curvatura que o ar dá às ondas de rádio, que alcançam um pouco além do horizonte visual.'),
            TAB(['Quem fala com quem', 'Cálculo', 'Alcance teórico'], [
              ['Dois portáteis na mão (1,5 m)', '2,2 × (1,2 + 1,2)', 'cerca de 5 milhas'],
              ['Antena no tope (14 m) e portátil (1,5 m)', '2,2 × (3,7 + 1,2)', 'cerca de 11 milhas'],
              ['Dois veleiros com antena no tope (14 m)', '2,2 × (3,7 + 3,7)', 'cerca de 16 milhas'],
              ['Veleiro (14 m) e estação costeira (antena a 60 m)', '2,2 × (3,7 + 7,7)', 'cerca de 25 milhas'],
              ['Veleiro (14 m) e antena num morro (200 m)', '2,2 × (3,7 + 14,1)', 'cerca de 39 milhas'],
            ], 'Valores teóricos, em condição normal e sem obstáculos. Cabo ruim, antena torta, prédios e morros no caminho reduzem o alcance real.'),
            C('dica', 'Como ganhar alcance', 'Suba a antena. Dobrar a potência quase não muda o horizonte; subir de 5 m para 20 m dobra o termo da raiz. É por isso que a antena do veleiro fica no tope do mastro e que as costeiras têm torres altas.'),
            H('Potência: 25 W e 1 W'),
            P('O rádio fixo de bordo transmite com <b>no máximo 25 W</b> (potência alta) e tem a opção de <b>1 W</b> (potência baixa). Os portáteis costumam ter 5 W e 1 W. Use <b>a menor potência que dê o serviço</b>: falar com o barco ao lado a 25 W só faz barulho para quem está longe.'),
            F('normas-149', 'A NORMAM-211 exige que o transceptor VHF fixo tenha potência mínima de 25 W.'),
            F('extra-radio-1-23', 'O material de apoio da Anatel diz que toda estação deve limitar a potência irradiada ao mínimo necessário para um serviço satisfatório.'),
            P('Alguns canais são, por regra internacional, só de baixa potência: os canais <b>15 e 17</b> servem para falar dentro do próprio barco (por exemplo, do cockpit à proa) com até 1 W, e os <b>75 e 76</b> ficam limitados a 1 W para proteger o canal 16. Quase todo rádio faz essa redução sozinho.'),
            H('O portátil também é obrigação'),
            P('O VHF portátil é a reserva do rádio fixo e acompanha a tripulação se for preciso abandonar o barco. A norma recomenda revestimento emborrachado, à prova d’água; na prática, escolha um portátil estanque (ou proteja-o com capa) e mantenha a bateria sempre carregada.'),
            F('extra-radio-1-02', 'A NORMAM-211 define o VHF portátil como equipamento para uso em caso de abandono da embarcação ou de falha do rádio fixo, e manda manter a bateria sempre a plena carga.'),
            F('normas-173', 'A bateria do portátil deve operar por pelo menos quatro horas, com ciclo de 1:9 (um minuto transmitindo para nove escutando).'),
            C('seguranca', 'Portátil na bolsa de abandono', 'Guarde o portátil carregado na bolsa de abandono ou perto do companheiro de saída, com a bateria de reserva e um carregador a 12 V. Rádio sem bateria é só um peso de papel. Teste o conjunto uma vez por mês.'),
            W('vhf-sim', { modo: 'explorar', canal: '16' }, 'Gire o seletor de canais, troque a potência entre 25 W e 1 W e veja o uso de cada canal. A costeira, os barcos e o tráfego do simulador são fictícios.'),
            CHECK([
              Q('m1l1-q1', 'Rádio: VHF e DSC', 1, 'Qual fator mais aumenta o alcance de uma conversa em VHF entre dois barcos?',
                ['A altura das antenas acima do mar.', 'A potência do rádio, sempre no máximo de 25 W.', 'A cor do cabo coaxial.', 'A hora do dia, porque à noite o VHF alcança o dobro.'], 0,
                'O VHF viaja em linha de visada e o alcance é a soma das distâncias das duas antenas até o horizonte de rádio: quanto mais altas, mais longe. Potência maior melhora a qualidade do sinal, mas não faz a onda passar por baixo do horizonte. A cor do cabo não influi (a qualidade e o comprimento do cabo, sim). A hora do dia pode causar variações pequenas, mas não dobra o alcance do VHF.',
                'Regra de alcance em linha de visada; Rec. UIT-R P.834 (refração troposférica)', P834),
              Q('m1l1-q2', 'Rádio: VHF e DSC', 2, 'A antena do seu veleiro está a 16 m acima da água e a antena de uma costeira está a 36 m. Pela regra 2,2 × (√h₁ + √h₂), qual é o alcance teórico?',
                ['Cerca de 22 milhas.', 'Cerca de 114 milhas.', 'Cerca de 16 milhas.', 'Cerca de 25 milhas, porque o rádio tem 25 W.'], 0,
                '√16 = 4 e √36 = 6; 2,2 × (4 + 6) = 22 milhas. 114 resulta de somar as alturas sem tirar a raiz (2,2 × 52), erro comum. 16 milhas seria o resultado de 2,2 × √52, que também não é a regra. Os 25 W são potência elétrica, não distância: não têm relação com milhas.',
                'Rec. UIT-R P.834; cálculo de alcance geográfico', P834),
              Q('m1l1-q3', 'Rádio: VHF e DSC', 1, 'Qual é a potência mínima que a NORMAM-211 exige do transceptor VHF fixo?',
                ['25 W.', '5 W.', '1 W.', '50 W.'], 0,
                'O artigo 4.23.2 da NORMAM-211 pede potência mínima de 25 W para o VHF fixo. 5 W é típico de portátil, e 1 W é a potência baixa usada em canais específicos. 50 W passa do máximo internacional para o VHF marítimo, que é 25 W.',
                'NORMAM-211/DPC, art. 4.23.2; UIT-R M.489-2 (até 25 W)', NORMAM),
            ]),
            FONTES([
              { txt: 'NORMAM-211/DPC, art. 4.23.2 e 4.23.3', url: NORMAM, ref: 'normas-149' },
              { txt: 'Anatel, material de apoio ao exame de Radiotelefonista (2026-03), itens 1.4.2 e 2.1.9.5', url: ANATEL },
              { txt: 'UIT, Regulamento de Radiocomunicações, Apêndice 18 (canais 15, 17, 75 e 76; notas g e n)', url: RR },
              { txt: 'UIT-R P.834, efeitos da refração troposférica na propagação de ondas de rádio (raio da Terra equivalente 4/3)', url: P834 },
            ]),
          ],
        },
        {
          id: 'l2',
          titulo: 'Os canais do VHF e para que serve cada um',
          minutos: 12,
          objetivos: [
            'Saber o uso do 16, do 70, do 06, do 13 e dos canais de iatismo',
            'Distinguir canal simplex de canal duplex',
            'Escolher o canal certo para cada tipo de conversa',
          ],
          blocos: [
            P('Um rádio VHF marítimo tem dezenas de canais, mas você usa uns poucos no dia a dia. Os canais seguem a <b>tabela internacional da UIT</b> (União Internacional de Telecomunicações, o órgão da ONU que cuida de rádio). Cada canal é uma frequência combinada: canal 16 é 156,800 MHz, canal 70 é 156,525 MHz, e assim por diante.'),
            H('Canal simplex e canal duplex'),
            L([
              '<b>Simplex</b>: uma só frequência. Quem fala aperta o botão de transmitir (PTT, <i>push to talk</i>) e quem está ouvindo só escuta. Os dois lados alternam. É o canal de barco para barco.',
              '<b>Duplex</b>: duas frequências, uma para falar e outra para ouvir, como num telefone. Serve para a ligação com uma estação costeira que conecta você à rede telefônica pública. Os canais duplex têm números como 1 a 5, 7, 18 a 28 e 60 a 66, 78 a 88.',
            ]),
            C('dica', 'Rádio comprado fora do país', 'Muitos rádios vendidos nos Estados Unidos vêm com a tabela americana de canais. Aqui vale a tabela internacional: confira no menu se o rádio está em <b>INT</b> (internacional) e não em USA. Na tabela errada, o canal 16 é o mesmo, mas vários outros mudam de frequência.'),
            H('Os canais que você precisa decorar'),
            TAB(['Canal', 'Frequência (MHz)', 'Uso', 'Detalhe que cai na prova'], [
              ['<b>16</b>', '156,800', 'Socorro, segurança e chamada, por voz', 'Escuta permanente enquanto navega. Chamada de até 1 minuto.'],
              ['<b>70</b>', '156,525', 'Somente DSC (chamada digital)', 'Nunca se fala por voz no 70.'],
              ['<b>06</b>', '156,300', 'Entre navios; busca e salvamento coordenado com aeronaves', 'Um dos canais entre navios (06, 08, 72, 77) que os rádios DSC costumam propor para a conversa depois da chamada; confira no manual do seu rádio.'],
              ['<b>13</b>', '156,650', 'Segurança da navegação, “ponte a ponte”', 'Para combinar manobras com navios no canal de acesso.'],
              ['<b>68</b>', '156,425', 'Iatismo (iates clubes e marinas no Brasil)', 'Obrigatório no transceptor, com o 16 e o 69.'],
              ['<b>69</b> e <b>71</b>', '156,475 e 156,575', 'Embarcações de pequeno porte; 69 também entre navios', 'O 69 é obrigatório no transceptor.'],
              ['<b>08</b>, <b>72</b>, <b>77</b>', '156,400; 156,625; 156,875', 'Conversa entre navios (sem costeira)', 'Canais típicos para “vamos para o canal 72”.'],
              ['<b>15</b> e <b>17</b>', '156,750 e 156,850', 'Comunicação a bordo, até 1 W', 'Do cockpit à proa, por exemplo.'],
              ['<b>75</b> e <b>76</b>', '156,775 e 156,825', 'Só navegação, 1 W', 'Protegem o canal 16 (que fica ao lado).'],
            ], 'Frequências do navio no Apêndice 18 do Regulamento de Radiocomunicações (UIT). O AIS não usa canais de voz: transmite em 161,975 e 162,025 MHz (AIS 1 e AIS 2).'),
            F('normas-150', 'Navegando, o VHF deve ficar ligado e em escuta no canal 16 (156,8 MHz), ou no canal 70 (156,525 MHz) se for DSC.'),
            F('extra-mestre-3-12', 'A NORMAM-211 lista como frequências obrigatórias do transceptor VHF os canais 16 (chamada e socorro), 68 e 69; no equipamento DSC, o canal 70 pode substituir o 16 para a chamada digital.'),
            F('extra-mestre-3-18', 'No Brasil, a Rede Costeira de Apoio ao Iatismo é formada pelas estações dos iates clubes, normalmente com escuta do nascer ao pôr do sol. No VHF, o canal 68 é exclusivo para iatismo e os canais 69 e 71 são para embarcações de pequeno porte.'),
            F('extra-radio-1-11', 'É proibido usar as frequências de chamada e socorro (como o canal 16) para tráfego de mensagens comuns.'),
            C('aconfirmar', 'Canal 9 no Brasil', 'Em alguns países o canal 9 é o canal de chamada para barcos de recreio. O Apêndice 18 da UIT o lista como canal entre navios e operações portuárias. Não encontramos regra brasileira que o designe como canal de chamada: use o 16 (ou a chamada DSC) e combine o canal de conversa.'),
            H('Como escolher, na prática'),
            L([
              'Quer <b>chamar alguém</b> ou ser chamado: canal 16, ou DSC no canal 70.',
              'Quer <b>conversar com outro barco</b>: chame no 16, combine um canal entre navios (06, 08, 72 ou 77) e <b>saia do 16</b>.',
              'Quer <b>falar com uma marina ou iate clube</b>: o canal que ela informar, em geral o 68. Muitas marinas anunciam o canal na carta e nos guias de porto.',
              'Quer <b>avisar um navio grande</b> que vai cruzar o canal de acesso: canal 13, se o navio estiver em escuta nele.',
              'Quer <b>ouvir avisos</b>: o 16 informa para qual canal mudar; avisos de mau tempo e de navegação vêm por esse caminho (módulo 3).',
            ]),
            W('vhf-sim', { modo: 'explorar', modos: ['explorar', 'desafio'], desafio: 'canal', n: 6 }, 'Em “Explorar”, selecione os canais da tabela e leia o uso de cada um. Em “Desafio”, escolha o canal certo para cada situação.'),
            CHECK([
              Q('m1l2-q1', 'Rádio: VHF e DSC', 1, 'Em qual canal do VHF nunca se fala por voz?',
                ['Canal 70, reservado à chamada seletiva digital.', 'Canal 16.', 'Canal 13.', 'Canal 06.'], 0,
                'O canal 70 (156,525 MHz) é exclusivo para chamadas digitais DSC: o rádio “conversa” com o outro rádio em dados. O 16 é, ao contrário, o canal de voz de socorro, segurança e chamada. O 13 e o 06 são canais de voz entre navios (13 para segurança da navegação).',
                'RR, Apêndice 18, nota j; NORMAM-211, art. 4.23.4 a', RR),
              Q('m1l2-q2', 'Rádio: VHF e DSC', 2, 'Você quer combinar com um barco amigo onde fundear à noite. Qual é o procedimento correto?',
                ['Chamá-lo no 16 (ou por DSC), propor um canal entre navios como o 72 e continuar a conversa nele.', 'Conversar todo o tempo no 16, que é o canal de todo mundo.', 'Conversar no 70, porque a potência é menor.', 'Conversar no 13, porque é o canal de iatismo.'], 0,
                'O 16 é só para chamar e para emergências: a chamada leva até um minuto e o assunto segue em outro canal entre navios. Conversar no 16 bloqueia o canal de socorro. O 70 é só DSC, sem voz. O 13 é para segurança da navegação (ponte a ponte), e o canal de iatismo no Brasil é o 68.',
                'Anatel, material de apoio, item 2.1.9.2; UIT-R M.1171, §20', ANATEL),
              Q('m1l2-q3', 'Rádio: VHF e DSC', 2, 'Qual é a diferença entre canal simplex e canal duplex?',
                ['O simplex usa uma só frequência (um fala, o outro escuta); o duplex usa duas, uma para cada sentido.', 'O simplex só funciona de dia; o duplex só de noite.', 'O simplex é digital; o duplex é analógico.', 'O simplex tem 1 W; o duplex tem 25 W.'], 0,
                'Em canal simplex, os dois lados dividem uma frequência e alternam no PTT. Em canal duplex há uma frequência de ida e outra de volta, como num telefone, usada em ligações com a costeira. O dia e a noite não definem o tipo de canal; a potência é escolha separada; e analógico ou digital não distingue simplex de duplex.',
                'RR, Apêndice 18 (canais de uma e de duas frequências)', RR),
            ]),
            FONTES([
              { txt: 'NORMAM-211/DPC, art. 4.23.4 a (frequências obrigatórias do VHF)', url: NORMAM, ref: 'normas-150' },
              { txt: 'UIT, Regulamento de Radiocomunicações, Apêndice 15 (tabela 15-2) e Apêndice 18 (tabela de canais e notas a, f, g, i, j, k, m, n, q)', url: RR },
              { txt: 'UIT-R M.1171, procedimentos de radiotelefonia no serviço móvel marítimo', url: M1171 },
              { txt: 'Anatel, material de apoio ao exame de Radiotelefonista (2026-03), item 2.1.9.2', url: ANATEL, ref: 'extra-radio-1-10' },
            ]),
          ],
        },
        {
          id: 'l3',
          titulo: 'Escuta, disciplina e chamada de rotina',
          minutos: 12,
          objetivos: [
            'Cumprir a escuta obrigatória e entender o que ela exige do rádio',
            'Seguir as regras de ouro do uso do canal 16',
            'Fazer uma chamada de rotina completa, da chamada à despedida',
          ],
          blocos: [
            P('Conversar bem no VHF é uma questão de método. As regras são poucas, internacionais e valem para quem chama um amigo ou uma marina. Quem as domina na rotina não se perde quando o assunto é grave.'),
            H('A escuta obrigatória'),
            F('normas-150', 'Enquanto navega, o barco mantém o VHF ligado e em escuta permanente no canal 16, ou no 70 se o rádio for DSC.'),
            P('Na prática, isso quer dizer: <b>rádio ligado, volume audível no cockpit e squelch (silenciador) ajustado</b> para você ouvir o canal sem o chiado constante. O rádio DSC tem um receptor próprio que fica “de ouvido” no canal 70 mesmo quando você está conversando em outro canal, e dá um alarme se chegar um alerta de socorro. Por isso o rádio DSC não pode ser desligado enquanto o barco navega.'),
            C('dica', 'Escuta dupla (dual watch)', 'A maioria dos rádios tem a função de escuta dupla: ele varre o 16 e um segundo canal à sua escolha. É útil quando você espera uma resposta de uma marina no 68 e quer continuar ouvindo o 16. Confirme no manual se, durante a escuta dupla, o receptor do canal 70 continua ativo (nos rádios DSC ele deve continuar).'),
            H('As regras de ouro do canal 16'),
            L([
              '<b>Escute antes de falar.</b> Se alguém estiver em socorro ou em outra conversa, espere acabar. Interferir em um pedido de socorro pode custar uma vida.',
              '<b>Chamada curta: até 1 minuto.</b> No 16 você só chama; o assunto vai para outro canal.',
              '<b>Não use o 16 para papo.</b> Frequências de chamada e socorro não se prestam a tráfego comum.',
              '<b>Use a menor potência que resolva.</b> Quanto menos barulho, mais pessoas conseguem ouvir um socorro de verdade.',
              '<b>Diga o seu indicativo</b> no início e no fim da comunicação, e pelo menos uma vez por hora se a conversa for longa.',
              'Ao ouvir <b>MAYDAY</b>, pare qualquer transmissão que possa atrapalhar e fique na escuta.',
            ]),
            F('extra-radio-1-10', 'O material de apoio da Anatel diz que a chamada e os sinais preparatórios de tráfego em 156,8 MHz não devem exceder um minuto, exceto em socorro, urgência ou segurança.'),
            F('extra-radio-1-19', 'O indicativo de chamada deve ser transmitido no início e no fim de cada comunicado e, nas estações do Serviço Móvel Marítimo, pelo menos uma vez a cada hora.'),
            F('extra-radio-1-12', 'Toda estação que ouvir uma chamada de socorro deve cessar imediatamente qualquer transmissão que possa perturbar o tráfego de socorro e permanecer na escuta da frequência usada.'),
            C('nota', 'Prioridade absoluta', 'As comunicações de socorro vêm antes de tudo, depois as de urgência e as de segurança, e só então as de rotina. É a ordem que decide o que você deve interromper quando o rádio fala.'),
            H('Uma chamada de rotina, passo a passo'),
            L([
              '<b>Escute</b> o canal para ver se está livre.',
              '<b>Chame no 16</b> (ou por DSC individual): nome da estação chamada, até três vezes; “aqui é”; o nome do seu barco, até três vezes; o canal proposto; “câmbio”.',
              '<b>A outra estação responde</b> e confirma o canal. Os dois mudam.',
              '<b>No novo canal</b>, chame de novo (agora uma vez basta), diga o assunto e passe a vez.',
              '<b>Ao terminar</b>, despeça-se com seu indicativo e volte ao 16 (ou à escuta DSC).',
            ], true),
            TAB(['Palavra de procedimento (em inglês)', 'Em português', 'O que significa'], [
              ['THIS IS', 'Aqui é', 'Quem fala está se identificando'],
              ['OVER', 'Câmbio', 'Terminei de falar; é a sua vez'],
              ['OUT', 'Desligo', 'Encerrei a conversa; não espero resposta'],
              ['SAY AGAIN', 'Repita', 'Não entendi; fale de novo'],
              ['RECEIVED', 'Recebido', 'Ouvi e entendi a mensagem'],
            ], 'O material de apoio da Anatel indica “Terminado” (ou o código VA) como fim de trabalho. “Over” e “out” não aparecem no texto do Regulamento de Radiocomunicações para a chamada de rotina, mas são o uso corrente. Nunca use “OVER AND OUT”: são palavras contraditórias.'),
            C('aconfirmar', 'Português ou inglês?', 'As palavras de socorro (MAYDAY, PAN PAN, SÉCURITÉ) são sempre ditas assim, em qualquer idioma. Para o resto, entre barcos brasileiros, o uso em português é comum no litoral; ao falar com estrangeiros ou navios mercantes, use inglês, de preferência as frases-padrão da IMO (SMCP). Não encontramos regra brasileira que fixe o idioma da chamada de rotina.'),
            H('Falar para ser entendido'),
            L([
              'Segure o microfone a uns 5 cm da boca e fale em voz normal, sem gritar.',
              'Aperte o PTT, <b>espere um instante</b> e então fale, para não cortar a primeira sílaba.',
              'Fale devagar, com frases curtas, uma ideia por vez. Soletre nomes e indicativos com o alfabeto fonético (módulo 2).',
              'Solte o PTT para ouvir. Enquanto você aperta o botão, não escuta nada.',
            ]),
            W('vhf-sim', { modo: 'montar', modos: ['montar'], mensagem: 'rotina' }, 'Monte uma chamada de rotina escolhendo quem chamar e o canal de conversa. Os barcos e a marina do exemplo são fictícios.'),
            CHECK([
              Q('m1l3-q1', 'Rádio: VHF e DSC', 1, 'Segundo a NORMAM-211, enquanto o barco navega, o VHF deve estar:',
                ['Ligado e em escuta permanente no canal 16, ou no 70 se for DSC.', 'Ligado só à noite, no canal 68.', 'Desligado, para poupar bateria, e religado em caso de emergência.', 'Em escuta somente no canal 13.'], 0,
                'A norma pede escuta permanente no 16, ou no 70 quando o equipamento é DSC (art. 4.23.4 a). Ligar só à noite ou em emergência é descumprir a regra: o socorro pode vir a qualquer hora. O 68 é canal de iatismo e o 13 é para ponte a ponte; nenhum deles substitui o 16.',
                'NORMAM-211/DPC, art. 4.23.4 a', NORMAM),
              Q('m1l3-q2', 'Rádio: VHF e DSC', 2, 'Quanto tempo, no máximo, uma chamada de rotina deve ocupar o canal 16?',
                ['Até 1 minuto; depois a conversa segue em outro canal.', 'Até 10 minutos, se o canal estiver livre.', 'O tempo que for preciso, porque o 16 é o canal de chamada.', 'Até 30 segundos no total do dia.'], 0,
                'O material de apoio da Anatel limita a chamada e os sinais preparatórios no 156,8 MHz a um minuto, para deixar o canal livre a pedidos de socorro. “O tempo que precisar” e “10 minutos” desrespeitam o limite. O limite de 30 segundos por dia não existe.',
                'Anatel, material de apoio, item 2.1.9.2', ANATEL),
              Q('m1l3-q3', 'Rádio: VHF e DSC', 2, 'Você está falando com outro veleiro no canal 72 e ouve “MAYDAY” no canal 16 pelo rádio DSC. O que fazer?',
                ['Parar de transmitir o que possa atrapalhar e ficar na escuta do canal de socorro.', 'Terminar a conversa antes, porque está no meio da frase.', 'Pedir à outra estação que repita o MAYDAY.', 'Ligar para os amigos no 72 e contar o que ouviu.'], 0,
                'Quem ouve uma chamada de socorro deve cessar na hora qualquer transmissão que possa atrapalhar e acompanhar o tráfego de socorro. Terminar a frase, pedir repetição ou espalhar a notícia ocupa canais e pode abafar quem precisa de ajuda. Se ninguém atender o socorro, aí você aprende no módulo 2 como agir (MAYDAY RELAY).',
                'Anatel, material de apoio, item 1.4.4', ANATEL),
            ]),
            FONTES([
              { txt: 'NORMAM-211/DPC, art. 4.23.4 a (escuta obrigatória)', url: NORMAM, ref: 'normas-150' },
              { txt: 'Anatel, material de apoio ao exame de Radiotelefonista (2026-03), itens 1.4.2, 1.4.4, 2.1.9.2, 2.1.9.5 e 2.1.9.8', url: ANATEL },
              { txt: 'UIT-R M.1171-1, procedimentos de radiotelefonia no serviço móvel marítimo (§8 chamada, §20 e §21 mudança de canal)', url: M1171 },
              { txt: 'IMO, Standard Marine Communication Phrases (SMCP)', url: 'https://www.imo.org/en/OurWork/Safety/Pages/StandardMarineCommunicationPhrases.aspx' },
            ]),
          ],
        },
        {
          id: 'l4',
          titulo: 'DSC e MMSI: o rádio que chama sozinho',
          minutos: 12,
          objetivos: [
            'Explicar o que é a chamada seletiva digital e o que faz o canal 70',
            'Reconhecer a estrutura do MMSI e saber quando ele é exigido',
            'Descrever o que o alerta de socorro DSC leva e por que o rádio precisa de GPS',
          ],
          blocos: [
            P('A voz tem um problema: alguém precisa estar ouvindo, e entender, e anotar a posição. O <b>DSC</b> (<i>digital selective calling</i>, chamada seletiva digital) resolve isso mandando uma <b>mensagem de dados</b> que o rádio da outra ponta lê sozinho. Ela dura poucos segundos, toca um alarme e mostra na tela quem chamou.'),
            TERMOS(['dsc', 'canal-70', 'mmsi', 'gmdss']),
            H('Como o DSC funciona'),
            L([
              'Toda chamada DSC viaja no <b>canal 70</b> (156,525 MHz), que é só de dados.',
              'Cada rádio DSC tem um número de identificação, o <b>MMSI</b>, programado nele. É o “telefone” da estação.',
              'A chamada pode ser <b>individual</b> (para o MMSI de um barco ou de uma costeira), <b>de grupo</b> ou <b>para todos os barcos</b> (o alerta de socorro é do último tipo).',
              'As categorias são <b>socorro, urgência, segurança e rotina</b>, na ordem de prioridade.',
            ]),
            P('O DSC existe em VHF (alcance de visada), em MF e em HF (alcance de uma centena de milhas no MF e de milhares no HF, assunto do módulo 3). O princípio é o mesmo.'),
            H('O MMSI: o número que identifica a estação'),
            P('O <b>MMSI</b> (<i>Maritime Mobile Service Identity</i>) tem <b>9 dígitos</b>. Os três primeiros são o <b>MID</b> (<i>maritime identification digits</i>), o código do país. O do Brasil é <b>710</b>. Os seis seguintes identificam a estação.'),
            TAB(['Tipo de estação', 'Formato', 'Exemplo (fictício)'], [
              ['Barco (estação de navio)', 'MID + 6 dígitos', '710 123456'],
              ['Estação costeira', '00 + MID + 4 dígitos', '00 710 9990'],
              ['Grupo de navios', '0 + MID + 5 dígitos', '0 710 12345'],
              ['AIS-SART (baliza de sobrevivência)', '970 + 6 dígitos', '970 123456'],
              ['AIS de homem ao mar (AIS-MOB)', '972 + 6 dígitos', '972 123456'],
              ['EPIRB com transmissor AIS', '974 + 6 dígitos', '974 123456'],
            ], 'Formatos da Rec. UIT-R M.585 e do Apêndice 43 do Regulamento de Radiocomunicações. Os números dos exemplos são fictícios.'),
            F('radio-37', 'O MMSI brasileiro começa com 710, seguido de seis dígitos da estação; a NORMAM-211 usa esse código para a EPIRB (art. 4.23.6 d).'),
            F('radio-35', 'O Regulamento Geral dos Serviços de Telecomunicações exige MMSI para as estações do Serviço Limitado Móvel Marítimo que participam do GMDSS, e o número deve ser programado em todos os equipamentos da estação que tenham essa função.'),
            P('Veja no módulo 4 como pedir o MMSI à Anatel. O número do seu rádio precisa ser o <b>mesmo</b> que a Anatel cadastrou, porque é com ele que a busca e salvamento sabe de quem é o barco, quantas pessoas estão a bordo e quem avisar.'),
            C('seguranca', 'Rádio sem MMSI não chama', 'Muitos rádios novos vêm sem MMSI. Nesse caso o botão de socorro não envia alerta útil, e as chamadas individuais não funcionam. Programe o MMSI antes da primeira saída: o fabricante costuma limitar a gravação a uma ou duas vezes, então confira o número antes de gravar.'),
            H('O alerta de socorro DSC'),
            P('O <b>botão DISTRESS</b> fica sob uma tampa articulada, para ninguém apertar sem querer. Você levanta a tampa e <b>segura o botão cerca de 5 segundos</b> (o tempo exato depende do modelo). O rádio então envia, no canal 70, um alerta que leva:'),
            L([
              'o <b>MMSI</b> do seu barco;',
              'a <b>natureza do perigo</b>, se você a escolheu (incêndio, alagamento, homem ao mar, abandono, e outras; sem escolha, vai “não especificado”);',
              'a <b>posição e a hora em UTC</b>, vindas do GPS ligado ao rádio;',
              'o aviso de que a conversa de socorro seguirá <b>por voz no canal 16</b>.',
            ]),
            P('O alerta se <b>repete sozinho</b>, em intervalos aleatórios de poucos minutos (a Rec. UIT-R M.541 fala em 3,5 a 4,5 minutos), até algum receptor confirmar por DSC. Quem recebe vê seu nome (MMSI), a posição e o tipo de perigo no visor.'),
            C('seguranca', 'Ligue o rádio ao GPS', 'Sem o GPS conectado, o rádio envia o alerta sem posição ou com a última posição que recebeu (que pode estar velha). Ligue o VHF DSC ao GNSS do barco por NMEA e confira, ao menos uma vez por temporada, se a posição aparece na tela do rádio. Se o GPS falhar, digite a posição e a hora à mão no rádio, quando ele permitir.'),
            F('radio-34', 'No licenciamento da estação, quando o sistema identifica que a embarcação precisa de MMSI, entra a etapa “UIT/GMDSS” com o número de MMSI, o contato de emergência enviado à UIT e a capacidade de pessoas a bordo.'),
            W('vhf-sim', { modo: 'montar', modos: ['montar'], mensagem: 'dsc', segurar: 5 }, 'Monte uma chamada DSC e levante a tampa do DISTRESS para ver o que acontece. O alerta é só uma simulação: nada é transmitido.'),
            CHECK([
              Q('m1l4-q1', 'Rádio: VHF e DSC', 1, 'Que número identifica o Brasil nos primeiros dígitos do MMSI de um barco brasileiro?',
                ['710', '716', '070', '161'], 0,
                'O MID (código do país) do Brasil é 710, e é com ele que começa o MMSI das estações de navio brasileiras e o código da EPIRB. Os demais números não são o MID do Brasil; “161” lembra a frequência do AIS (161,975 MHz), que nada tem a ver com o MMSI.',
                'NORMAM-211, art. 4.23.6 d; RR, Apêndice 43', NORMAM),
              Q('m1l4-q2', 'Rádio: VHF e DSC', 2, 'O que precisa estar ligado ao rádio VHF com DSC para o alerta de socorro levar a posição do barco automaticamente?',
                ['Um receptor GPS/GNSS, por conexão NMEA.', 'O AIS, que envia a posição no lugar do GPS.', 'Uma bateria extra de 24 V.', 'Um segundo rádio VHF em escuta no 16.'], 0,
                'O rádio não sabe onde está: ele lê a posição e a hora (UTC) do GNSS. O AIS é outro equipamento e não alimenta o alerta DSC. Uma bateria maior ou um segundo rádio não dão posição.',
                'UIT-R M.493 (informação de posição e hora no alerta de socorro)', M493),
              Q('m1l4-q3', 'Rádio: VHF e DSC', 2, 'Para que serve o canal 70?',
                ['Somente para chamadas digitais DSC, nunca para voz.', 'Para conversas de rotina entre barcos de recreio.', 'Para a escuta meteorológica.', 'Para falar com o prático do porto.'], 0,
                'O canal 70 é exclusivo de DSC, e o receptor do rádio fica em escuta nele o tempo todo. Voz de rotina vai nos canais entre navios; avisos de tempo vêm pelo 16 e por outros meios; e a praticagem usa canais de operações portuárias.',
                'RR, Apêndice 18, nota j; NORMAM-211, art. 4.23.4 a', RR),
            ]),
            FONTES([
              { txt: 'UIT-R M.493, equipamento de chamada seletiva digital (categorias de chamada, informação do alerta de socorro)', url: M493 },
              { txt: 'UIT-R M.541, procedimentos operacionais para o DSC (alerta no 70 e repetição automática; botão de socorro)', url: M541 },
              { txt: 'UIT-R M.585, atribuição e uso de identidades do serviço móvel marítimo (formatos de MMSI)', url: M585 },
              { txt: 'UIT, Regulamento de Radiocomunicações, Apêndice 43 (códigos de país, MID)', url: RR },
              { txt: 'Anatel, material de apoio ao exame de Radiotelefonista (2026-03), item 2.2.6', url: ANATEL },
            ]),
          ],
        },
        {
          id: 'l5',
          titulo: 'Instalação, antena e manutenção do rádio',
          minutos: 10,
          objetivos: [
            'Escolher e posicionar a antena de VHF, incluindo a de emergência',
            'Reconhecer os erros de instalação que mais derrubam o alcance',
            'Montar uma rotina de teste e manutenção do rádio',
          ],
          blocos: [
            P('O melhor rádio do mercado fala mal se a antena for ruim, o cabo for fino ou o conector estiver oxidado. A boa notícia: quase tudo se resolve com cuidados simples, antes de zarpar.'),
            H('A antena'),
            L([
              '<b>Posição:</b> no tope do mastro, a mais alta possível e livre de metal ao redor (a antena irradia em todas as direções ao redor dela).',
              '<b>Ganho:</b> antenas de maior ganho concentram o sinal na horizontal e alcançam mais em mar calmo, mas perdem rendimento quando o barco adorna. Em veleiro, as de ganho baixo ou médio (cerca de 3 dB) são a escolha comum.',
              '<b>Compartilhamento:</b> a antena do VHF pode ser dividida com o AIS por um divisor próprio, de baixa perda, ou se instala uma antena à parte para o AIS. Nunca ligue dois rádios na mesma antena sem o divisor adequado.',
              '<b>Verificação:</b> peça a quem instalou para medir o <b>ROE</b> (relação de ondas estacionárias, SWR). Valores baixos mostram que a energia sai pela antena, e não volta ao rádio. ROE alto é antena ou conector com defeito.',
            ]),
            C('dica', 'O cabo conta', 'Quanto mais longo e fino o cabo coaxial, mais sinal se perde. Em veleiro de 10 m, o cabo sobe cerca de 14 m; use um cabo grosso e de boa qualidade (tipo RG-213 ou equivalente) e conectores bem soldados e protegidos com fita autofusão contra a água. Troque o cabo inteiro se o isolamento estiver craquelado: a maresia entra e oxida a malha.'),
            FIG(svg('0 0 480 270', 'Diagrama de ligações do rádio VHF com DSC: GPS, bateria com fusível, antena do tope e antena de emergência',
              defs('m1l5a') +
              caixa(170, 100, 140, 70, 'Rádio VHF', 'com DSC', 'mg') +
              caixa(8, 14, 130, 48, 'GPS', 'dados NMEA') +
              caixa(8, 208, 140, 50, 'Bateria 12 V', 'com fusível') +
              caixa(340, 14, 132, 48, 'Antena do tope', 'cabo coaxial') +
              caixa(332, 208, 140, 50, 'Antena de', 'emergência', 'sea') +
              '<line x1="100" y1="62" x2="190" y2="100" stroke="var(--ink)" stroke-width="2.2" marker-end="url(#m1l5a)"/>' +
              '<line x1="78" y1="208" x2="190" y2="170" stroke="var(--ink)" stroke-width="2.2" marker-end="url(#m1l5a)"/>' +
              '<line x1="406" y1="62" x2="296" y2="100" stroke="var(--magenta)" stroke-width="3"/>' +
              '<line x1="400" y1="208" x2="296" y2="170" stroke="var(--ink)" stroke-width="2.2" stroke-dasharray="7 5"/>' +
              t(240, 196, 'só se o mastro cair', 16, 'middle', 'font-style="italic"'), 480),
              'Ligações essenciais: o GPS dá posição e hora ao DSC, a bateria alimenta por circuito próprio com fusível, e a antena de emergência (tracejada) fica guardada com o cabo pronto.'),
            H('A antena de emergência é obrigatória'),
            F('normas-157', 'Os veleiros com antena de VHF no tope do mastro devem ter antena de emergência para uso em caso de quebra do mastro.'),
            P('Se o mastro cair, a antena do tope vai junto, e o rádio fica mudo. A antena de emergência é curta e fica guardada com seu cabo, pronta para ser ligada ao rádio fixo. Guarde também o conector de adaptação, se a antena do portátil for de outro tipo. Teste o conjunto quando comprar, e não só no dia do problema.'),
            H('Energia e proteção'),
            F('extra-radio-1-06', 'A NORMAM-211 manda que, com a embarcação navegando, haja suprimento permanente de energia elétrica suficiente para operar as instalações de rádio e carregar as baterias de reserva.'),
            L([
              'Ligue o rádio por um circuito <b>próprio</b>, com fusível de proteção, e com fios na seção correta (queda de tensão derruba a potência).',
              'Se possível, ligue o rádio ao banco de baterias de serviço <b>e</b> tenha como alimentá-lo pelo banco do motor. Em travessia, alimentação de reserva é parte da segurança.',
              'Mantenha terminais limpos e apertados. Bateria mal cuidada pode impedir o socorro.',
              'Evite trajetos de cabo de rádio junto de cabos de força, para reduzir ruído.',
            ]),
            H('Rotina de teste e manutenção'),
            TAB(['Quando', 'O que fazer'], [
              ['Antes de cada saída', 'Ligar, conferir o volume e o squelch, o canal 16 e o canal 70 em escuta, o visor do DSC e a posição do GPS na tela'],
              ['Uma vez por mês', 'Fazer uma chamada de teste a uma marina ou a um barco amigo em canal de trabalho (nunca no 16); carregar e testar o portátil; olhar o cabo e o conector da antena'],
              ['Uma vez por ano', 'Medir o ROE; limpar os conectores e passar protetor de contatos; conferir o MMSI programado e o cadastro na Anatel'],
              ['Antes de uma travessia', 'Trocar bateria do portátil se tiver mais de 2 ou 3 anos; testar a antena de emergência; conferir a alimentação reserva'],
            ]),
            C('seguranca', 'Teste sem gerar alarme', 'Nunca aperte o DISTRESS para “ver se funciona”. Para testar o rádio, use uma chamada individual DSC a um amigo ou fale numa marina em canal de trabalho. Um alerta de socorro de verdade, mesmo disparado sem querer, pode mobilizar a busca e salvamento. Se isso acontecer, cancele (módulo 2).'),
            CHECK([
              Q('m1l5-q1', 'Rádio: VHF e DSC', 1, 'Por que o veleiro com antena no tope do mastro precisa de uma antena de emergência?',
                ['Se o mastro quebrar, a antena do tope se perde e o rádio fica sem antena.', 'Porque a antena do tope só funciona de dia.', 'Porque o rádio DSC exige duas antenas ligadas ao mesmo tempo.', 'Para ampliar o alcance do VHF em 25 milhas.'], 0,
                'A NORMAM-211 exige a antena de emergência para o caso de quebra do mastro, em que a antena principal vai embora e, sem outra, não há como transmitir. Antena de topo funciona de dia e de noite, o rádio DSC usa só uma antena, e a de emergência é curta, de alcance menor, não de maior.',
                'NORMAM-211/DPC, art. 4.24.2', NORMAM),
              Q('m1l5-q2', 'Rádio: VHF e DSC', 2, 'Qual destes cuidados mais ajuda o alcance do VHF de um veleiro?',
                ['Antena alta e livre de obstáculos, com cabo grosso e conectores sem oxidação.', 'Trocar o rádio por outro com mais botões.', 'Enrolar o cabo da antena em um rolo atrás do rádio.', 'Fixar a antena no balcão de popa, bem perto da água.'], 0,
                'Altura da antena e perdas no cabo e nos conectores decidem o alcance. Mais botões não aumentam o sinal; enrolar cabo excedente pode causar perdas e interferência; e antena baixa reduz o horizonte de rádio.',
                'Rec. UIT-R P.834; boas práticas de instalação', P834),
              Q('m1l5-q3', 'Rádio: VHF e DSC', 1, 'Como testar o rádio de bordo sem acionar um alerta falso de socorro?',
                ['Chamar um amigo ou uma marina em canal de trabalho; nunca apertar o DISTRESS para testar.', 'Apertar o DISTRESS por menos de 5 segundos, para ver o visor.', 'Transmitir no canal 16 até alguém responder.', 'Desligar o rádio e ligar de novo.'], 0,
                'Um teste de comunicação se faz em canal de trabalho, com quem concorda em participar. O botão DISTRESS, mesmo por pouco tempo, pode disparar o alerta e mobilizar a busca e salvamento; o canal 16 não é para teste; e desligar e ligar não prova nada sobre transmissão.',
                'UIT-R M.541; UIT, Resolução 349 (Rev.CMR-23), Anexo (alertas de socorro falsos)', RES349),
            ]),
            FONTES([
              { txt: 'NORMAM-211/DPC, art. 4.23.5 e 4.24.2 (energia e antena de emergência)', url: NORMAM, ref: 'normas-157' },
              { txt: 'Anatel, material de apoio ao exame de Radiotelefonista (2026-03), itens 2.1.4 a 2.1.6 (antena, alimentação, baterias)', url: ANATEL },
              { txt: 'UIT-R M.541, procedimentos operacionais do DSC', url: M541 },
            ]),
          ],
        },
      ],
    },
{
      id: 'm2',
      titulo: 'MAYDAY, PAN-PAN e SÉCURITÉ',
      resumo: 'As três mensagens que o mar reconhece em qualquer idioma: quando usar cada uma, como falar sem errar, o formato exato do MAYDAY, o que fazer depois (recibo, retransmissão, silêncio e cancelamento de alarme falso) e como lidar com urgência e segurança.',
      licoes: [
        {
          id: 'l1',
          titulo: 'Três níveis: MAYDAY, PAN-PAN e SÉCURITÉ',
          minutos: 10,
          objetivos: [
            'Escolher entre MAYDAY, PAN-PAN e SÉCURITÉ diante de uma situação real',
            'Dizer de onde vêm as palavras e como se pronunciam',
            'Reconhecer a escalada de uma mensagem para outra',
          ],
          blocos: [
            P('No rádio, as palavras valem prioridade. Existem <b>três sinais</b>, e cada um diz às outras estações, em meio segundo, o quão grave é o que vem depois. Escolher o sinal certo faz a diferença entre receber ajuda no tempo certo e atrapalhar quem precisa mais.'),
            TERMOS(['mayday', 'pan-pan', 'securite', 'sinais-de-perigo']),
            FIG(svg('0 0 480 230', 'Escada de prioridade das mensagens de rádio: SÉCURITÉ (segurança da navegação), PAN PAN (urgência) e MAYDAY (socorro)',
              defs('m2l1a') +
              caixa(8, 168, 200, 54, 'SÉCURITÉ', 'segurança da navegação', 'sea') +
              caixa(130, 96, 210, 54, 'PAN PAN', 'urgência, sem perigo iminente') +
              caixa(262, 24, 210, 54, 'MAYDAY', 'perigo grave e iminente', 'mg') +
              t(8, 56, 'quanto mais acima,', 16, 'start', 'font-style="italic"') + t(8, 78, 'mais prioridade', 16, 'start', 'font-style="italic"'), 480),
              'A escada mostra a ordem de prioridade: socorro passa na frente de urgência, e urgência passa na frente de segurança. Qualquer uma passa na frente da conversa de rotina.'),
            H('MAYDAY: socorro'),
            F('extra-radio-1-13', 'MAYDAY é o sinal de socorro, para perigo grave e iminente que exija auxílio imediato, como navio afundando ou incêndio descontrolado.'),
            P('A palavra vem do francês <i>m’aider</i> (“ajudem-me”). O material da Anatel a descreve como a expressão francesa (algo como “mê-dê”); no mar, o uso corrente é a pronúncia inglesa de <i>May Day</i>, “mêi-dêi”. Qualquer das duas é entendida, o que importa é dizê-la devagar e <b>três vezes</b> na chamada. Em radiotelefonia, a palavra falada “Mayday” é um dos sinais de perigo reconhecidos pelo RIPEAM (Anexo IV), junto com o alerta DSC e o sinal da EPIRB.'),
            F('tecnico-84', 'O Anexo IV do RIPEAM lista como sinais de perigo o SOS em Morse, a palavra “Mayday” em radiotelefonia e o sinal N.C. do Código Internacional de Sinais.'),
            F('tecnico-87', 'O alerta DSC no VHF canal 70 (ou nas frequências MF/HF listadas) também é sinal de perigo no Anexo IV do RIPEAM.'),
            H('PAN-PAN: urgência'),
            F('extra-radio-1-14', 'PAN PAN é o sinal de urgência, repetido três vezes antes da chamada, para situação urgente relativa à segurança, mas sem perigo grave iminente.'),
            P('A palavra vem do francês <i>panne</i> (“pane”) e se fala “pã pã”. Use quando o barco ou uma pessoa precisa de ajuda com urgência, mas há tempo: motor parado e sem vento, mastro quebrado longe da costa, tripulante ferido que precisa de orientação médica.'),
            H('SÉCURITÉ: segurança da navegação'),
            F('extra-radio-1-15', 'SÉCURITÉ é o sinal de segurança, repetido três vezes antes da chamada, para aviso importante à segurança da navegação, como objetos à deriva, gelo ou condições meteorológicas.'),
            P('Do francês <i>sécurité</i> (“segurança”), fala-se “sê-cu-ri-tê”. É um aviso <b>para os outros</b>: tronco enorme à deriva, boia apagada, contêiner flutuando, mau tempo chegando. Ninguém precisa responder.'),
            H('Qual usar? Exemplos de bordo'),
            TAB(['Situação', 'Sinal', 'Por quê'], [
              ['Incêndio na casa de máquinas, fora de controle', '<b>MAYDAY</b>', 'Perigo grave e iminente; precisa de auxílio imediato'],
              ['Homem ao mar, de noite, já perdido de vista', '<b>MAYDAY</b>', 'Vida em perigo grave e iminente'],
              ['Rombo no casco e a água entra mais rápido que a bomba tira', '<b>MAYDAY</b>', 'O barco pode afundar'],
              ['Motor parado, sem vento, deriva lenta a 2 milhas das pedras', '<b>PAN PAN</b>', 'Urgente, mas ainda dá tempo; se piorar, vira MAYDAY'],
              ['Tripulante com corte profundo, sangramento controlado, quer orientação médica', '<b>PAN PAN</b>', 'Urgente para a segurança de uma pessoa, sem perigo imediato de vida'],
              ['Mastro quebrado a 10 milhas da costa, sem propulsão, ninguém ferido', '<b>PAN PAN</b>', 'Sem governo, mas sem risco iminente'],
              ['Tronco grande à deriva no canal de acesso', '<b>SÉCURITÉ</b>', 'Aviso aos outros navegantes'],
              ['Boia de balizamento apagada', '<b>SÉCURITÉ</b>', 'Perigo para a navegação dos outros'],
            ]),
            C('seguranca', 'Em dúvida, peça ajuda cedo', 'Não espere o perigo ser “grave e iminente” para falar. Um PAN-PAN dado a tempo costuma evitar o MAYDAY. E, se o perigo já é grave, não perca minutos pensando em qual sinal usar: peça socorro. É fácil cancelar um alerta que não era necessário (veja a lição 4); é impossível recuperar o tempo perdido.'),
            C('nota', 'Homem ao mar: MAYDAY ou PAN-PAN?', 'As fontes divergem no tom do primeiro aviso. O RYA manda, com a pessoa na água, dar o alarme à tripulação, marcar o ponto no plotter e emitir um <b>MAYDAY ou um alerta DSC</b>. O texto de Peter Isler no US Sailing fala em <b>MAYDAY ou, no mínimo, PAN-PAN</b> no VHF. Se a pessoa já foi perdida de vista, está sem colete, ferida ou a água é fria, vale a regra desta lição: na dúvida, MAYDAY. Fontes: <a href="' + MOBRYA + '">RYA, Man overboard</a>; <a href="' + MOBUSS + '">US Sailing, Man Overboard Rescue Procedure</a>.'),
            C('nota', 'Escalada', 'As mensagens podem mudar de nível no meio do caminho. Se o PAN-PAN virou perigo grave e iminente, passe a <b>MAYDAY</b> e avise quem estava em escuta. O inverso também vale: se o socorro pode ser cancelado, avise todos.'),
            W('vhf-sim', { modo: 'desafio', modos: ['desafio'], desafio: 'situacao', n: 8 }, 'Em cada rodada o simulador apresenta uma situação, e você escolhe o sinal certo. A correção cita o artigo do Regulamento de Radiocomunicações.'),
            CHECK([
              Q('m2l1-q1', 'Rádio: socorro, urgência e segurança', 1, 'Você vê um incêndio na casa de máquinas que não consegue apagar. Que sinal usar?',
                ['MAYDAY, porque há perigo grave e iminente.', 'PAN PAN, porque ainda ninguém se feriu.', 'SÉCURITÉ, para avisar os outros barcos.', 'Nenhum: apenas fale no canal 16 normalmente.'], 0,
                'Incêndio fora de controle ameaça a vida e o barco imediatamente: é perigo grave e iminente, caso de MAYDAY. PAN PAN é para urgência sem perigo imediato. SÉCURITÉ é aviso de segurança da navegação, sem pedido de ajuda. Falar “normalmente” no 16 sem o sinal de socorro não tem a prioridade de uma mensagem de socorro.',
                'RR, Art. 32 (32.9); Anatel, material de apoio, item 2.1.9.3', RR),
              Q('m2l1-q2', 'Rádio: socorro, urgência e segurança', 2, 'Motor parado e sem vento. O barco deriva devagar e as pedras mais próximas estão a 2 milhas. Ninguém corre perigo agora, mas vocês vão precisar de reboque. Qual é a mensagem adequada?',
                ['PAN PAN, repetido três vezes antes da chamada.', 'MAYDAY, para chamar mais atenção.', 'SÉCURITÉ, porque o barco é um perigo à navegação.', 'Nenhuma mensagem: só se pede ajuda quando as pedras estiverem a 50 metros.'], 0,
                'A situação é urgente para a segurança do barco, mas sem perigo grave e iminente: PAN PAN. MAYDAY só vale se houver perigo grave e iminente (usá-lo sem necessidade gasta recursos de salvamento). SÉCURITÉ avisa os outros e não pede ajuda. E esperar até o perigo ser imediato é tarde: se a situação piorar, passe a MAYDAY.',
                'RR, Art. 33 (33.11); Anatel, material de apoio, item 2.1.9.3', RR),
              Q('m2l1-q3', 'Rádio: socorro, urgência e segurança', 1, 'Você passa por um tronco enorme à deriva no meio do canal de navegação. Que sinal usar para avisar os outros navegantes?',
                ['SÉCURITÉ, repetido três vezes antes do aviso.', 'MAYDAY, porque é perigoso.', 'PAN PAN, porque é urgente.', 'Nenhum sinal: é só uma curiosidade.'], 0,
                'Objetos flutuantes que ameaçam a navegação são o caso clássico de aviso de segurança, SÉCURITÉ. Não há pedido de socorro nem urgência do seu barco, então MAYDAY e PAN PAN não se aplicam. Calar não ajuda quem vem atrás de você à noite.',
                'RR, Art. 33 (33.34); Anatel, material de apoio, item 2.1.9.3', RR),
            ]),
            FONTES([
              { txt: 'UIT, Regulamento de Radiocomunicações, Art. 32 (socorro, 32.9) e Art. 33 (urgência 33.11 e segurança 33.34)', url: RR },
              { txt: 'RIPEAM (COLREG-72), Regra 37 e Anexo IV (sinais de perigo)', url: RIPEAM, ref: 'tecnico-84' },
              { txt: 'Anatel, material de apoio ao exame de Radiotelefonista (2026-03), item 2.1.9.3', url: ANATEL },
              { txt: 'RYA, Man overboard (alarme à tripulação, vigia, botão MOB, MAYDAY ou alerta DSC)', url: MOBRYA },
              { txt: 'US Sailing, Peter Isler, Man Overboard Rescue Procedure (MAYDAY ou, no mínimo, Pan-Pan)', url: MOBUSS },
            ]),
          ],
        },
        {
          id: 'l2',
          titulo: 'Falar com clareza: alfabeto fonético, números e hora',
          minutos: 10,
          objetivos: [
            'Soletrar o nome do barco, o indicativo e o MMSI com o alfabeto fonético da UIT',
            'Dizer números e coordenadas sem ambiguidade',
            'Usar a hora UTC nas mensagens de rádio',
          ],
          blocos: [
            P('Um rádio de má qualidade, um motor ao fundo e uma onda no microfone bastam para “B” soar como “D” ou “P”. O <b>alfabeto fonético</b> resolve: cada letra vira uma palavra que ninguém confunde. É a ferramenta que você vai usar para dizer o nome do barco, o indicativo e o MMSI, e ela cai na prova de Radiotelefonista.'),
            TERMOS(['alfabeto-fonetico', 'indicativo-de-chamada', 'mmsi']),
            W('alfabeto-fonetico', { modo: 'tabela' }, 'Tabela oficial da UIT (Apêndice 14 do Regulamento de Radiocomunicações) com a pronúncia, o conversor para soletrar e os treinos de soletrar e de ouvir.'),
            H('Como usar'),
            L([
              'Fale a palavra inteira, devagar. Não corte nem invente (nada de “Papai” ou “Zebra”).',
              'Quando soletrar, diga antes a palavra e depois a soletração: “Albatroz, soletrando: Alfa, Lima, Bravo, Alfa, Tango, Romeo, Oscar, Zulu”.',
              'Na dúvida do outro lado, ofereça: “Repito: ...”.',
              'Use o fonético para <b>nome do barco, indicativo de chamada, MMSI, nome de lugar</b> e qualquer sigla.',
            ]),
            H('Números: um por vez'),
            P('Diga os algarismos <b>um a um</b>. “Mil duzentos e trinta e quatro” vira “um, dois, três, quatro”. É assim que o MMSI, a latitude e a longitude devem ser lidos. O Regulamento de Radiocomunicações traz uma pronúncia própria para os algarismos, em que cada palavra tem sílabas de ênfase igual:'),
            TAB(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], [
              ['Nadazero', 'Unaone', 'Bissotwo', 'Terrathree', 'Kartefour', 'Pantafive', 'Soxisix', 'Setteseven', 'Oktoeight', 'Novenine'],
            ], 'Código de algarismos da UIT (Apêndice 14). O material da Anatel grafa “Pentafive”; o Regulamento grafa “Pantafive”. O ponto decimal é “Decimal” e o ponto final, “Stop”.'),
            C('nota', 'O que se usa na vida real', 'Na prova, esse código aparece. No mar, a maioria dos barcos diz os algarismos simples, em inglês ou em português (“um, dois, três”), e é entendida sem problema. O essencial é um algarismo por vez, com pausa entre os grupos. Treine as duas formas.'),
            H('Coordenadas'),
            P('A posição se diz em graus e minutos, com o hemisfério: “latitude, dois, três graus, quatro, cinco vírgula zero minutos, sul; longitude, zero, quatro, quatro graus, um, zero vírgula zero minutos, oeste” (23°45,0′ S, 044°10,0′ W), sempre um algarismo por vez. Outra forma, às vezes melhor para quem escuta, é dizer a posição em relação a um ponto conhecido: “a oito milhas ao sul da Ilha Rasa”.'),
            H('Hora: sempre UTC'),
            P('Em radiocomunicação, quando se informa uma hora, <b>salvo indicação contrária, usa-se o UTC</b> (Tempo Universal Coordenado, o horário de Greenwich), em quatro algarismos de 0000 a 2359. “Quatorze e trinta UTC” é “um, quatro, três, zero UTC”. O horário de Brasília (UTC−3) está três horas atrás do UTC: 11h30 em Brasília é 1430 UTC. Em outros fusos do país a conta muda (Amazonas é UTC−4 e Acre, UTC−5), então confira qual fuso o seu relógio usa. O alerta DSC e o cancelamento de um alarme falso usam UTC.'),
            H('Erros comuns'),
            L([
              '<b>Falar depressa demais</b>: o dobro da pressa, o dobro do ruído. Em socorro, devagar e claro.',
              '<b>Misturar sistemas</b>: “Alfa” com “Bravo” e depois “A de avião”. Escolha o fonético da UIT e fique nele.',
              '<b>Dizer números em grupos</b>: “cento e vinte” se perde. “Um, dois, zero” não.',
              '<b>Esquecer o hemisfério</b>: posição sem “sul” ou “oeste” aponta para o outro lado do mundo.',
              '<b>Não pedir confirmação</b>: depois de passar o MMSI ou a posição, peça que o outro repita. Quem confirma não erra.',
            ]),
            C('dica', 'Cartão ao lado do rádio', 'Plastifique um cartão com o nome do barco, o indicativo, o MMSI soletrados e a posição para ler em graus e minutos, e cole ao lado do rádio. Em uma emergência, ninguém lembra de números bem soletrados: o cartão lembra.'),
            W('alfabeto-fonetico', { modo: 'soletrar', modos: ['soletrar', 'ouvir'], texto: 'Albatroz PQ4821', ouvir: { n: 6, tipo: 'indicativos' } }, 'Digite o nome do seu barco e o indicativo para ver a soletração. Use a aba “Ouvir” para treinar a escuta.'),
            CHECK([
              Q('m2l2-q1', 'Rádio: socorro, urgência e segurança', 1, 'Qual palavra do alfabeto fonético da UIT representa a letra Q?',
                ['Quebec', 'Quito', 'Queen', 'Quarter'], 0,
                'No Apêndice 14 do Regulamento de Radiocomunicações, Q é “Quebec”, pronunciada “kê-béc”. “Quito”, “Queen” e “Quarter” não fazem parte da tabela e podem ser confundidas por quem ouve no rádio.',
                'RR, Apêndice 14; Anatel, material de apoio, item 2.1.9.1', RR),
              Q('m2l2-q2', 'Rádio: socorro, urgência e segurança', 2, 'Como se deve dizer o MMSI 710123456 ao rádio?',
                ['Algarismo por algarismo: sete, um, zero, um, dois, três, quatro, cinco, seis.', 'Em grupos de centenas: setecentos e dez, cento e vinte e três, quatrocentos e cinquenta e seis.', 'Como um número só: setecentos e dez milhões...', 'Só as três primeiras casas, porque o resto é ruído.'], 0,
                'Os algarismos são ditos um a um, para que um dígito perdido não mude o número. Centenas e milhares tornam mais difícil anotar e confirmar; “setecentos e dez milhões” é pior ainda. Cortar o número apaga a identidade do barco.',
                'RR, Apêndice 14 (algarismos); Anatel, material de apoio, item 2.1.9.1', RR),
              Q('m2l2-q3', 'Rádio: socorro, urgência e segurança', 1, 'Salvo indicação em contrário, que hora se usa nas mensagens de radiocomunicação marítima?',
                ['UTC, em quatro algarismos (0000 a 2359).', 'O horário de Brasília.', 'O horário de verão local do porto.', 'A hora do relógio do barco, qualquer que seja.'], 0,
                'A norma pede que, sem indicação em contrário, a hora seja UTC, em quatro algarismos. Assim, quem recebe a mensagem de qualquer lugar do mundo sabe exatamente quando algo ocorreu. Hora de Brasília, horário local e “relógio do barco” levam a confusões, principalmente em travessia e nos alertas DSC.',
                'Anatel, material de apoio, item 1.5', ANATEL),
            ]),
            FONTES([
              { txt: 'UIT, Regulamento de Radiocomunicações, Apêndice 14 (alfabeto fonético e código de algarismos) e Art. 32, nota 32.7.1', url: RR },
              { txt: 'Anatel, material de apoio ao exame de Radiotelefonista (2026-03), itens 1.5 (UTC) e 2.1.9.1 (alfabeto)', url: ANATEL },
              { txt: 'IMO, Standard Marine Communication Phrases (SMCP)', url: 'https://www.imo.org/en/OurWork/Safety/Pages/StandardMarineCommunicationPhrases.aspx' },
            ]),
          ],
        },
        {
          id: 'l3',
          titulo: 'O MAYDAY passo a passo',
          minutos: 14,
          objetivos: [
            'Seguir a ordem correta: alerta DSC, canal 16, chamada e mensagem de socorro',
            'Compor a mensagem de socorro sem esquecer nenhum item',
            'Saber o que fazer enquanto aguarda a resposta',
          ],
          blocos: [
            P('Em uma emergência, a mão treme, a cabeça acelera e o barco mexe. É por isso que o MAYDAY tem um <b>formato fixo</b>: você não precisa pensar no que dizer, só preencher. Estude este formato até conseguir dizê-lo de olhos fechados.'),
            C('seguranca', 'Antes do rádio', 'Se há <b>fogo ou rombo</b>, primeiro coloque a tripulação em ação: coletes e combate ao fogo. No <b>homem ao mar</b>, os primeiros segundos são de quem está no convés: gritar o lado em que a pessoa caiu, lançar boia e tudo que flutue, manter alguém apontando para ela sem desviar o olhar e marcar o ponto no GPS (botão MOB). O alerta DSC leva poucos segundos e deve sair assim que alguém tiver a mão livre, sem esperar a pessoa ser recolhida; quem está no comando da manobra não precisa largá-la para isso. Distribua tarefas: uma pessoa fica com o rádio. Fontes: US Sailing, <i>Results and Recommendations from our MOB Studies</i> (v7.1), passos 1 a 3; RYA, <i>Man overboard</i>.'),
            H('A ordem das ações'),
            FIG(svg('0 0 480 300', 'Ordem das ações num pedido de socorro por rádio: alerta DSC no canal 70, mudança para o canal 16, chamada de MAYDAY, mensagem de socorro e escuta da resposta',
              defs('m2l3a') +
              caixa(20, 10, 440, 46, '1. Alerta DSC (botão DISTRESS)', 'canal 70, em dados', 'mg') +
              caixa(20, 72, 440, 46, '2. Mudar para o canal 16', 'potência alta, 25 W') +
              caixa(20, 134, 440, 46, '3. Chamada: MAYDAY três vezes', 'aqui é, nome do barco três vezes, indicativo e MMSI') +
              caixa(20, 196, 440, 46, '4. Mensagem de socorro', 'posição, perigo, auxílio, pessoas, informações') +
              caixa(20, 258, 440, 38, '5. Escutar a resposta; repetir se ninguém responder', null, 'sea') +
              '<line x1="240" y1="56" x2="240" y2="72" stroke="var(--ink)" stroke-width="2.2" marker-end="url(#m2l3a)"/>' +
              '<line x1="240" y1="118" x2="240" y2="134" stroke="var(--ink)" stroke-width="2.2" marker-end="url(#m2l3a)"/>' +
              '<line x1="240" y1="180" x2="240" y2="196" stroke="var(--ink)" stroke-width="2.2" marker-end="url(#m2l3a)"/>' +
              '<line x1="240" y1="242" x2="240" y2="258" stroke="var(--ink)" stroke-width="2.2" marker-end="url(#m2l3a)"/>', 480),
              'Sem DSC, comece direto no passo 2. O alerta DSC é repetido sozinho pelo rádio, a poucos minutos de intervalo, até alguém confirmar.'),
            H('1. O alerta DSC'),
            P('Levante a tampa do <b>DISTRESS</b>. Se o seu rádio deixa escolher, selecione a <b>natureza do perigo</b> (incêndio, alagamento, homem ao mar, e outras) antes de apertar. Segure o botão cerca de 5 segundos até o rádio confirmar. Se não houver tempo para escolher a natureza do perigo (num homem ao mar, por exemplo), aperte direto: o alerta sai como “não especificado” e você diz o problema por voz logo em seguida. O alerta vai ao canal 70 com seu MMSI, posição e hora UTC.'),
            H('2. Canal 16 e potência alta'),
            P('O rádio costuma mudar sozinho para o 16 após o alerta. Confirme e ponha a <b>potência em 25 W</b>.'),
            H('3. A chamada de socorro'),
            F('extra-radio-1-16', 'A mensagem radiotelefônica de socorro traz o sinal MAYDAY, a identificação da estação, a posição, a natureza do perigo, o tipo de auxílio necessário e as informações que facilitem o socorro.'),
            TAB(['Passo', 'Em inglês (forma internacional)', 'Em português'], [
              ['Sinal de socorro, 3 vezes', 'MAYDAY, MAYDAY, MAYDAY', 'MAYDAY, MAYDAY, MAYDAY'],
              ['“Aqui é” e o barco, 3 vezes', 'THIS IS ALBATROZ, ALBATROZ, ALBATROZ', 'AQUI É ALBATROZ, ALBATROZ, ALBATROZ'],
              ['Indicativo e MMSI', 'CALL SIGN PAPA QUEBEC FOUR EIGHT TWO ONE, MMSI SEVEN ONE ZERO ONE TWO THREE FOUR FIVE SIX', 'INDICATIVO PAPA QUEBEC QUATRO OITO DOIS UM, MMSI SETE UM ZERO UM DOIS TRÊS QUATRO CINCO SEIS'],
            ], 'Dados do exemplo fictícios (barco “Albatroz”). O formato vem do RR 32.13C.'),
            H('4. A mensagem de socorro'),
            P('Logo em seguida ao alerta, <b>sem esperar resposta</b>, faça a chamada e diga a mensagem: o Regulamento permite que o barco com DSC mande a chamada e a mensagem de voz imediatamente após o alerta, para atrair o maior número de barcos possível. Pela regra dos oito itens, <b>MIPDANIO</b>:'),
            L([
              '<b>M</b> – MAYDAY (uma vez)',
              '<b>I</b> – Identificação: nome, indicativo e MMSI',
              '<b>P</b> – Posição (latitude e longitude, ou distância e rumo de um ponto conhecido)',
              '<b>D</b> – Natureza do perigo (<i>distress</i>): incêndio, alagamento, abalroamento, homem ao mar...',
              '<b>A</b> – Auxílio desejado',
              '<b>N</b> – Número de pessoas a bordo',
              '<b>I</b> – Informações úteis: balsa, cor do casco, tipo de barco, tempo, plano de abandono',
              '<b>O</b> – <i>Over</i> (câmbio): a vez da outra estação',
            ]),
            P('<b>Exemplo (fictício):</b> “MAYDAY. Albatroz, indicativo Papa Quebec quatro oito dois um, MMSI sete um zero um dois três quatro cinco seis. Posição: dois três graus quatro cinco vírgula zero minutos sul, zero quatro quatro graus um zero vírgula zero minutos oeste. Estamos com incêndio a bordo. Precisamos de auxílio imediato. Quatro pessoas a bordo, balsa salva-vidas para seis. Veleiro de dez metros, casco branco. Câmbio.”'),
            C('dica', 'O que ajuda quem vai socorrer', 'Diga também o <b>rumo e a velocidade</b> se o barco está à deriva, e o <b>número de feridos</b>. Se vai abandonar, diga que vai e que levará a EPIRB e a bolsa. Cada informação diminui a área de busca.'),
            H('5. Escutar a resposta'),
            P('Pare de falar e <b>escute</b>. A resposta (o <i>recibo</i>) tem a forma “MAYDAY, Albatroz, aqui é a Costeira Treino, recebido MAYDAY”. Se ninguém responder em poucos instantes, <b>repita a mensagem</b> (sem repetir o DSC, que o rádio repete sozinho) e, se tiver DSC em outras frequências ou satelital, use também. Siga as instruções de quem coordenar o socorro e avise qualquer mudança de situação.'),
            H('E se o rádio não tem DSC?'),
            P('Comece no passo 2: canal 16, potência alta, chamada, mensagem. Repita a cada poucos minutos até alguém responder. Para o médio porte em navegação costeira ou oceânica, a NORMAM-211 pede VHF com DSC; em navegação interior, o VHF fixo ou portátil é só recomendado.'),
            F('normas-156', 'Para embarcação de médio porte em navegação costeira, a NORMAM-211 exige VHF com DSC; em navegação interior, o VHF fixo ou portátil é recomendado.'),
            C('seguranca', 'Treine e plastifique', 'Faça um ensaio de MAYDAY com a tripulação, usando um rádio desligado, ao menos uma vez por temporada. Deixe o roteiro plastificado ao lado do rádio. A tripulação precisa saber que também pode (e deve) fazer o alerta, caso o comandante esteja ocupado ou ferido.'),
            W('vhf-sim', { modo: 'montar', modos: ['montar'], mensagem: 'mayday', algarismos: 'simples' }, 'Preencha a posição, a natureza do perigo e o auxílio. O simulador monta o roteiro fala por fala, com a referência do Regulamento. Os barcos e a costeira são fictícios.'),
            CHECK([
              Q('m2l3-q1', 'Rádio: socorro, urgência e segurança', 2, 'Num barco com VHF DSC e um incêndio a bordo, qual é a ordem correta das ações de rádio?',
                ['Alerta DSC com o botão DISTRESS; depois canal 16; depois chamada e mensagem de socorro por voz.', 'Mensagem por voz no canal 70; depois alerta DSC no 16.', 'Esperar alguém passar e então chamar no 16.', 'Chamar por voz no 16 e só depois ligar o rádio para o DSC.'], 0,
                'O alerta DSC é o primeiro: leva poucos segundos, notifica a todos e informa a posição; a voz no 16 vem em seguida. No canal 70 não se usa voz, e o DSC não se faz no 16. Esperar passar alguém é perder tempo. O rádio precisa estar ligado antes.',
                'UIT-R M.541; RR, Art. 32', M541),
              Q('m2l3-q2', 'Rádio: socorro, urgência e segurança', 2, 'Quais itens a mensagem de socorro deve conter?',
                ['Sinal MAYDAY, identificação do barco, posição, natureza do perigo, auxílio necessário e outras informações úteis.', 'Só o nome do barco e a palavra “socorro”.', 'Apenas a posição, sem identificação, para não gastar tempo.', 'O nome do comandante, o destino da viagem e a carga.'], 0,
                'A mensagem de socorro leva o sinal, quem é, onde está, o que ocorre, de que ajuda precisa e qualquer informação que facilite o socorro. Só o nome sem posição não permite o resgate; só a posição sem identificação não diz quem chama; destino e carga são informações secundárias.',
                'Anatel, material de apoio, item 2.1.9.3; RR 32.13D', ANATEL),
              Q('m2l3-q3', 'Rádio: socorro, urgência e segurança', 1, 'Quantas vezes se diz MAYDAY na chamada de socorro inicial?',
                ['Três vezes: MAYDAY, MAYDAY, MAYDAY.', 'Uma vez, para ser rápido.', 'Duas vezes.', 'Dez vezes, para ter certeza.'], 0,
                'A chamada de socorro começa com o sinal dito três vezes, depois “aqui é” e o nome do barco três vezes. Na mensagem que vem logo depois, diz-se MAYDAY apenas uma vez. Uma ou duas vezes pode passar despercebido num canal com ruído; repetir dez vezes tira tempo da informação útil.',
                'RR 32.13C', RR),
            ]),
            FONTES([
              { txt: 'UIT, Regulamento de Radiocomunicações, Art. 32 (32.13A a 32.13E: alerta, chamada e mensagem de socorro)', url: RR },
              { txt: 'UIT-R M.541, procedimentos operacionais do DSC (alerta no 70 e voz no 16; repetição automática)', url: M541 },
              { txt: 'Anatel, material de apoio ao exame de Radiotelefonista (2026-03), item 2.1.9.3', url: ANATEL, ref: 'extra-radio-1-16' },
            ]),
          ],
        },
        {
          id: 'l4',
          titulo: 'Depois do MAYDAY: recibo, retransmissão, silêncio e alarme falso',
          minutos: 14,
          objetivos: [
            'Responder a um MAYDAY que você ouviu e retransmitir quando ninguém responde',
            'Entender quando e por quem o silêncio de rádio pode ser imposto',
            'Cancelar corretamente um alerta de socorro enviado por engano',
          ],
          blocos: [
            P('O MAYDAY dá o primeiro passo: tudo o que vem depois é trabalho em equipe. Você também pode ser o <b>outro lado</b>: o barco que ouve o pedido de socorro. Esta lição trata do que fazer nos dois lados e do que fazer quando o alerta foi um engano.'),
            H('Se você ouvir um MAYDAY'),
            L([
              '<b>Pare de transmitir</b> o que atrapalhe e fique na escuta do canal.',
              '<b>Anote</b>: quem chama, a posição, a natureza do perigo, o auxílio pedido. Use papel e lápis.',
              '<b>Dê um tempo curto</b> para que uma estação costeira confirme primeiro, onde houver comunicação confiável com a costa.',
              'Se você está perto e pode ajudar, avise e vá. Se não, mantenha a escuta e não ocupe o canal.',
              'Se uma chamada de socorro no canal 16 <b>não for confirmada em 5 minutos</b> nem por costeira nem por outro barco, confirme você ao barco em perigo (recibo) e <b>retransmita o socorro</b> a uma estação costeira, por qualquer meio de que disponha.',
              'Avise o comandante (ou quem responde pelo barco) do que ouviu, assim que possível.',
            ], true),
            F('extra-fechamento-cvtr-17', 'Pelo Regulamento de Radiocomunicações da UIT (edição 2024, Vol. 1, Art. 32, Nos. 32.16, 32.17 e 32.29A), a estação de navio que receba uma chamada de socorro por radiotelefonia no canal 16 do VHF (156,8 MHz) e não a veja confirmada por uma estação costeira ou por outro navio em cinco minutos deve confirmar o recebimento ao navio em perigo e usar qualquer meio disponível para retransmitir a chamada a uma estação costeira (ou estação terrena costeira) apropriada.'),
            F('extra-radio-1-12', 'Toda estação que ouvir uma chamada de socorro deve cessar imediatamente qualquer transmissão que possa perturbar o tráfego de socorro e permanecer na escuta da frequência usada.'),
            H('O recibo por voz'),
            P('Quando você é o primeiro a ouvir e vai atender, diga: “<b>MAYDAY</b>, nome e indicativo de quem pediu socorro (ou MMSI), <b>aqui é</b>, seu nome e indicativo, <b>recebido</b> (<i>received</i>), <b>MAYDAY</b>”. Depois, informe sua posição, a velocidade com que pode chegar e o que pode oferecer.'),
            C('nota', 'Quem confirma o alerta DSC', 'A confirmação <b>por DSC</b> de um alerta de socorro é tarefa das estações costeiras e dos centros de salvamento. Um barco de recreio que recebe o alerta e vai ajudar confirma <b>por voz</b> no canal 16, como no modelo acima, e segue as instruções de quem coordena o socorro.'),
            H('MAYDAY RELAY: retransmitir o socorro'),
            P('O <b>MAYDAY RELAY</b> é usado quando você precisa <b>pedir socorro por outro barco</b>:'),
            L([
              'você presenciou um barco ou uma pessoa em perigo e eles <b>não têm como pedir socorro</b> (sem rádio, sem energia);',
              'você ouviu um MAYDAY que <b>ninguém confirmou em 5 minutos</b>;',
              'você sabe que o barco em perigo está sem condições de participar das comunicações e, como responsável pelo seu próprio barco, acha que mais ajuda é necessária.',
            ]),
            FIG(svg('0 0 480 270', 'Retransmissão de socorro: o barco em perigo sem resposta, o barco vizinho que ouve e retransmite o MAYDAY RELAY à estação costeira, que aciona o salvamento',
              defs('m2l4a') +
              caixa(8, 10, 150, 52, 'Barco em perigo', 'MAYDAY sem resposta', 'mg') +
              caixa(8, 108, 150, 52, 'Seu barco', 'ouve o MAYDAY') +
              caixa(8, 206, 150, 52, 'Seu barco', 'confirma por voz') +
              caixa(300, 108, 172, 52, 'Estação costeira', 'ou Salvamar', 'sea') +
              caixa(300, 206, 172, 52, 'Busca e salvamento', 'é acionada') +
              '<line x1="83" y1="62" x2="83" y2="108" stroke="var(--ink)" stroke-width="2.2" stroke-dasharray="6 5" marker-end="url(#m2l4a)"/>' +
              '<line x1="83" y1="160" x2="83" y2="206" stroke="var(--ink)" stroke-width="2.2" marker-end="url(#m2l4a)"/>' +
              '<line x1="158" y1="232" x2="300" y2="140" stroke="var(--magenta)" stroke-width="3" marker-end="url(#m2l4a)"/>' +
              '<line x1="386" y1="160" x2="386" y2="206" stroke="var(--ink)" stroke-width="2.2" marker-end="url(#m2l4a)"/>' +
              t(246, 168, 'MAYDAY RELAY', 16, 'middle', 'fill="var(--magenta)" font-weight="700"'), 480),
              'Quem retransmite não declara estar em perigo: ele repete, para uma costeira ou para todos os barcos, o socorro de outro.'),
            P('O formato, na chamada, é: <b>MAYDAY RELAY</b> (três vezes), <b>a todas as estações</b> ou o nome da costeira (três vezes), <b>aqui é</b>, seu barco (três vezes), seu indicativo e MMSI. Em seguida, a mensagem: <b>MAYDAY</b>, o nome ou descrição do barco em perigo, a posição <i>dele</i>, a natureza do perigo, o auxílio e o número de pessoas, e “câmbio”.'),
            W('vhf-sim', { modo: 'montar', modos: ['montar'], mensagem: 'relay' }, 'Monte o MAYDAY RELAY: você escolhe se o barco em perigo tem nome (e MMSI) ou se precisa ser descrito. Os barcos e a costeira são fictícios.'),
            H('Silêncio de rádio'),
            F('extra-radio-1-17', 'O material de apoio da Anatel diz que, em radiotelefonia, a estação em perigo ou a que dirige o tráfego de socorro pede silêncio com a expressão SILENCE MAYDAY.'),
            L([
              '<b>SEELONCE MAYDAY</b> (do francês <i>silence, m’aider</i>) é a forma que o Regulamento de Radiocomunicações usa para a expressão que a Anatel escreve como SILENCE MAYDAY. Ela manda calar as estações que interferem no tráfego de socorro e pode ser dirigida a todas ou a uma só.',
              'Pelo Regulamento de Radiocomunicações em vigor (edição de 2024), quem pode impor o silêncio é o <b>centro de coordenação de salvamento</b>, a <b>unidade que coordena a busca e salvamento no local</b> ou a <b>estação costeira</b> envolvida. Um barco que apenas ouve não tem esse poder.',
              'Enquanto o tráfego de socorro durar, as estações que o conhecem e não participam <b>não podem transmitir</b> nas frequências em uso (RR 32.49).',
              'Quando o socorro termina, quem controla a operação manda uma mensagem final com <b>SEELONCE FEENEE</b> (<i>silence fini</i>, “silêncio terminado”), com a hora e a identificação do barco que estava em perigo. O canal volta ao uso normal.',
            ]),
            C('nota', 'Edições diferentes', 'O material de apoio da Anatel (versão 2026-03) ainda diz que a ordem pode vir da estação em perigo. O Regulamento de Radiocomunicações de 2024 (CMR-23, nº 32.46) deixou a ordem a cargo de quem coordena o socorro. Para a prática, siga o texto mais novo; para a prova, conheça os dois.'),
            H('Alarme falso: cancele na hora'),
            P('Acontece com todo mundo: tampa levantada sem querer, EPIRB que dispara na bagagem, criança que mexe no rádio. O que importa é <b>cancelar rápido e com clareza</b>, para que ninguém se mobilize à toa.'),
            F('extra-radio-1-18', 'Se um alerta de socorro for transmitido por engano, o navio deve cancelá-lo imediatamente, informando claramente às estações costeiras ou ao RCC/MRCC que foi alarme falso.'),
            L([
              '<b>Siga a tela do rádio.</b> Se ele não mostrar instruções, o procedimento da UIT manda desligar e ligar de novo depois de 10 segundos e seguir o que a tela pedir.',
              '<b>Cancele pelo DSC</b>, se o seu rádio tiver a função de cancelamento de alerta (<i>distress self-cancel</i>, Rec. UIT-R M.493).',
              '<b>Cancele por voz no canal 16</b> (este passo é sempre necessário): “A todas as estações, a todas as estações, a todas as estações. Aqui é Albatroz, Albatroz, Albatroz, indicativo Papa Quebec quatro oito dois um, MMSI sete um zero um dois três quatro cinco seis. Favor cancelar meu alerta de socorro das <b>[hora UTC]</b>. Câmbio.” O modelo da UIT termina na hora do alerta; o “câmbio” é só para quem quiser confirmar que foi ouvido.',
              'Se o alerta veio de uma <b>EPIRB</b>, desligue-a e avise o Salvamar pelo telefone 185 ou pelo rádio, dizendo o código da baliza e que foi um engano.',
              'Escute a resposta da costeira. Se ela perguntar, explique em poucas palavras.',
            ], true),
            F('radio-48', 'O SALVAMAR atende 24 horas pedidos de socorro vindos do mar pelos sistemas de comunicações e pelo telefone 185.'),
            P('A Resolução 349 da UIT (Rev.CMR-23), que traz o procedimento acima, diz que <b>normalmente nenhuma providência é tomada contra o navio ou o navegante que comunica e cancela</b> um alerta falso. Mas, pela gravidade das consequências e pela proibição estrita de transmitir alertas falsos, as autoridades podem agir em caso de violação repetida. Cancelar sempre vale mais do que calar.'),
            C('dica', 'Desligar sozinho não cancela', 'Desligar e religar depois de 10 segundos é só o primeiro passo do procedimento da UIT. Sozinho, não desfaz nada nem avisa ninguém: o alerta já saiu e as estações vão tentar contato. Cancele pelo DSC, se o rádio permitir, e sempre por voz no canal 16.'),
            CHECK([
              Q('m2l4-q1', 'Rádio: socorro, urgência e segurança', 2, 'Você ouve um MAYDAY por voz no 16. Passam 5 minutos e nem uma costeira nem outro barco responde. O que fazer?',
                ['Confirmar o recebimento ao barco em perigo e retransmitir o socorro a uma costeira com MAYDAY RELAY.', 'Esperar mais uma hora, porque alguém certamente responderá.', 'Apagar o rádio para não ouvir.', 'Mandar PAN PAN ao barco em perigo.'], 0,
                'Sem resposta a um socorro, quem o ouviu retransmite com MAYDAY RELAY e avisa o barco em perigo de que foi ouvido. Esperar uma hora pode custar vidas; calar o rádio abandona o barco; PAN PAN é mensagem de urgência e não se usa para repassar socorro.',
                'RR 32.16, 32.17 e 32.29A', RR),
              Q('m2l4-q2', 'Rádio: socorro, urgência e segurança', 2, 'Seu veleiro está apenas ouvindo um socorro no canal 16, sem participar dele. Você pode mandar “SEELONCE MAYDAY” para calar quem atrapalha?',
                ['Não: o silêncio é imposto por quem coordena o socorro (centro de salvamento, unidade coordenadora ou costeira envolvida).', 'Sim, qualquer barco que ouça o socorro pode mandar silêncio.', 'Sim, mas só depois das 22 h.', 'Sim, se o seu rádio tiver potência de 25 W.'], 0,
                'O silêncio de rádio é uma ordem de quem tem a responsabilidade pelo socorro. Um barco que apenas ouve não tem esse papel, e uma ordem sem autoridade confunde o canal. Horário e potência do rádio não dão a ninguém o direito de impor silêncio. O que o barco ouvinte deve fazer é não transmitir nas frequências em uso e escutar.',
                'RR 32.46, 32.47 e 32.49', RR),
              Q('m2l4-q3', 'Rádio: socorro, urgência e segurança', 1, 'Você apertou o DISTRESS sem querer e o alerta saiu. O que fazer?',
                ['Cancelar o alerta por voz no canal 16 com a hora UTC do alerta (e pelo DSC, se o rádio permitir).', 'Desligar o rádio e fingir que nada aconteceu.', 'Esperar alguém ligar para perguntar.', 'Mandar outro alerta DSC, para compensar.'], 0,
                'O correto é cancelar imediatamente e dizer claramente que foi alarme falso. Desligar não desfaz o alerta já recebido, esperar pode deslocar recursos de salvamento sem necessidade, e mandar outro alerta só piora a situação.',
                'UIT, Resolução 349 (Rev.CMR-23), Anexo, item 1; Anatel, material de apoio, item 2.2.15', RES349),
            ]),
            FONTES([
              { txt: 'UIT, Regulamento de Radiocomunicações (edição 2024, CMR-23), Art. 32: recibo 32.23 e 32.29 a 32.29A; retransmissão 32.16 a 32.19H; silêncio 32.46 a 32.52; alerta falso 32.53A a 32.53E', url: RR },
              { txt: 'UIT, Resolução 349 (Rev.CMR-23): procedimentos operacionais para cancelar alertas de socorro falsos no GMDSS (VHF DSC, MF/HF DSC, EPIRB; nenhuma providência normal contra quem cancela)', url: RES349 },
              { txt: 'Cospas-Sarsat, orientações sobre ativação inadvertida de radiobalizas', url: COSPAS },
              { txt: 'UIT-R M.541, procedimentos do DSC (recibo e cancelamento)', url: M541 },
              { txt: 'Anatel, material de apoio ao exame de Radiotelefonista (2026-03), itens 1.4.4, 2.1.9.5 e 2.2.15', url: ANATEL },
            ]),
          ],
        },
        {
          id: 'l5',
          titulo: 'PAN-PAN e SÉCURITÉ na prática',
          minutos: 12,
          objetivos: [
            'Montar uma chamada de urgência e levar a mensagem longa para um canal de trabalho',
            'Dar um aviso de segurança à navegação e saber quando ele é curto ou longo',
            'Lidar com a mensagem recebida e saber quando escalar para MAYDAY',
          ],
          blocos: [
            P('O MAYDAY é raro. O PAN-PAN e o SÉCURITÉ são os dois que você mais vai usar na vida real, e dominá-los evita que o mar escale uma pane até um socorro grave.'),
            H('PAN-PAN: urgência'),
            P('A chamada de urgência tem o mesmo desenho da de socorro, com o sinal trocado e com o destinatário dito:'),
            L([
              '<b>PAN PAN</b>, PAN PAN, PAN PAN (três vezes)',
              '<b>A todas as estações</b> (ou o nome da costeira), três vezes',
              '<b>Aqui é</b> nome do barco (três vezes), indicativo e MMSI',
              'Posição, problema, auxílio desejado, pessoas a bordo, <b>câmbio</b>',
            ]),
            P('<b>Exemplo (fictício):</b> “PAN PAN, PAN PAN, PAN PAN. A todas as estações, a todas as estações, a todas as estações. Aqui é Albatroz, Albatroz, Albatroz, indicativo Papa Quebec quatro oito dois um, MMSI sete um zero um dois três quatro cinco seis. Posição: oito milhas ao sul da Ilha Rasa. Mastro quebrado, sem propulsão. Precisamos de reboque. Quatro pessoas a bordo. Câmbio.”'),
            C('dica', 'DSC de urgência', 'No rádio DSC, você pode antes mandar uma chamada digital de categoria <b>urgência</b> a todos os barcos no canal 70, e depois falar por voz. O rádio em escuta toca um alarme e o resto da conversa vai ao 16 (ou a um canal de trabalho).'),
            H('Mensagem médica ou longa: mude de canal'),
            P('Uma mensagem demorada, como a descrição de um ferimento, não fica no 16. Na chamada, diga “<b>mensagem no canal [número]</b>” e vá para um canal de trabalho; se a costeira responder, quem escolhe o canal é ela. O Regulamento de Radiocomunicações manda que a mensagem de urgência vá para um canal de trabalho quando for longa ou for chamada médica, e que isso seja dito já no anúncio (RR 33.9A). Comunicações sobre aconselhamento médico podem ser precedidas do sinal de urgência, e o navio pode obter o aconselhamento por qualquer das estações em terra da Lista de Estações Costeiras e de Serviços Especiais da UIT (RR 33.11A).'),
            C('seguranca', 'Ferimento sério ou perda de consciência', 'Não demore. Se a pessoa corre risco de vida (parada cardíaca, hemorragia que não para, afogamento), é caso de <b>MAYDAY</b>, não de PAN-PAN. Quando houver dúvida, trate como grave.'),
            H('SÉCURITÉ: avisos à navegação'),
            L([
              '<b>SÉCURITÉ</b>, SÉCURITÉ, SÉCURITÉ (três vezes)',
              '<b>A todas as estações</b>, três vezes',
              '<b>Aqui é</b> nome do barco (três vezes) e indicativo',
              'O aviso: o que é, onde está, para onde vai',
              'Ninguém precisa responder: termine com “<b>desligo</b>” (<i>out</i>)',
            ]),
            P('<b>Exemplo curto (fictício):</b> “SÉCURITÉ, SÉCURITÉ, SÉCURITÉ. A todas as estações, a todas as estações, a todas as estações. Aqui é Albatroz, Albatroz, Albatroz. Tronco grande à deriva, perigoso para a navegação, uma milha a leste da Ilha Rasa. Desligo.”'),
            P('O Regulamento pede que a mensagem de segurança vá, <b>sempre que possível, para um canal de trabalho</b>: no 16 você anuncia “mensagem no canal 13” (ou outro) e fala lá. Só quando não houver outra opção prática a mensagem segue no próprio 16 (RR 33.32). Um aviso muito curto, que interessa só a quem está por perto, é anunciado por voz e costuma ser dado todo ali (RR 33.31A).'),
            C('nota', 'Avisar é obrigação', 'Mensagens de navio sobre a presença de <b>ciclones</b>, de <b>gelo ou destroços perigosos</b> ou de qualquer outro perigo iminente à navegação devem ser transmitidas o mais depressa possível aos barcos próximos e às autoridades (RR 33.34A e 33.34B). Se você viu algo que pode custar um navio, avise.'),
            H('E quando é você que ouve?'),
            L([
              '<b>SÉCURITÉ</b> de outra estação: escute, anote, e se for no seu caminho, ajuste a rota. Não responda.',
              '<b>PAN-PAN</b> de outro barco: escute; se está perto e pode ajudar, ofereça ajuda por voz, de forma curta; se uma costeira respondeu, deixe com ela.',
              '<b>Previsão e aviso da Marinha</b>: o Serviço Meteorológico Marinho do Brasil e a RENEC transmitem boletins e avisos por VHF e HF, e o 16 informa para qual canal mudar.',
            ]),
            F('extra-mestre-3-14', 'O tráfego de segurança da RENEC é gratuito: recebe sinais e chamadas de perigo e segurança no canal 16 (156,8 MHz) e em 4.125 kHz e transmite boletins meteorológicos, previsões (METEOROMARINHA), Avisos-Rádio Náuticos e Avisos SAR do CHM em VHF e HF.'),
            C('nota', 'Quando encerrar uma urgência', 'Quando o problema acabar (o motor voltou, o reboque chegou), avise as estações que o ouviram: “a todas as estações, aqui é Albatroz, a urgência terminou, desligo”. Assim ninguém continua à sua procura ou em escuta por você.'),
            W('vhf-sim', { modo: 'montar', modos: ['montar', 'desafio'], mensagem: 'panpan', desafio: 'ordem', n: 5 }, 'Monte um PAN-PAN com mensagem em canal de trabalho e depois treine, em “Desafio”, a ordem das falas. Os barcos e a costeira são fictícios.'),
            CHECK([
              Q('m2l5-q1', 'Rádio: socorro, urgência e segurança', 2, 'Que vantagem tem, num PAN-PAN com mensagem longa, passar a mensagem para um canal de trabalho?',
                ['Deixa o canal 16 livre para chamadas de socorro e de urgência de outros barcos.', 'O canal de trabalho tem mais potência.', 'O PAN-PAN só vale em canal de trabalho.', 'As mensagens médicas não podem ser ouvidas por mais ninguém, em nenhum canal.'], 0,
                'O 16 é o canal de chamada, socorro, urgência e segurança, e mensagens longas ocupariam o canal que todos precisam ter livre. A potência é a mesma. O PAN-PAN pode ser dito no 16, e a mensagem vai ao canal de trabalho. E a conversa em canal de trabalho pode ser ouvida por quem estiver em escuta nele: o rádio não é canal privado.',
                'RR, Art. 33 (33.9A, 33.12); UIT-R M.1171', RR),
              Q('m2l5-q2', 'Rádio: socorro, urgência e segurança', 1, 'Como termina, normalmente, um aviso de SÉCURITÉ?',
                ['Com “desligo” (out), porque ninguém precisa responder.', 'Com “câmbio” (over), aguardando todos responderem.', 'Com MAYDAY.', 'Sem terminar: deixa-se o microfone aberto.'], 0,
                'O aviso de segurança é um recado para todas as estações, sem resposta esperada, então se encerra com “desligo”. “Câmbio” pede a vez do outro lado. MAYDAY é socorro e o microfone aberto trava o canal.',
                'RR, Art. 33 (33.34 a 33.38B)', RR),
              Q('m2l5-q3', 'Rádio: socorro, urgência e segurança', 2, 'Um tripulante teve parada cardíaca a bordo. Que mensagem usar?',
                ['MAYDAY, porque há risco de vida grave e iminente.', 'PAN PAN, porque é questão médica.', 'SÉCURITÉ, para avisar os barcos próximos.', 'Nenhuma: pedir socorro pode ser exagero.'], 0,
                'Risco imediato de vida pede MAYDAY, mesmo sendo problema médico. PAN-PAN serve para pedidos de orientação médica sem risco imediato. SÉCURITÉ avisa os outros e não pede ajuda. Pedir socorro nunca é exagero quando há risco de morte.',
                'RR 32.9 e 33.11A', RR),
            ]),
            FONTES([
              { txt: 'UIT, Regulamento de Radiocomunicações (edição 2024, CMR-23), Art. 33: urgência 33.9 a 33.12; segurança 33.31 a 33.34B', url: RR },
              { txt: 'UIT-R M.1171, procedimentos de radiotelefonia (mudança para canal de trabalho)', url: M1171 },
              { txt: 'Anatel, material de apoio ao exame de Radiotelefonista (2026-03), item 2.1.9.3', url: ANATEL },
              { txt: 'NORMAM-211/DPC e Anexo 5-A (comunicações no programa do Mestre-Amador; RENEC)', url: NORMAM, ref: 'extra-mestre-3-14' },
            ]),
          ],
        },
      ],
    },
{
      id: 'm3',
      titulo: 'HF/SSB, satélite e GMDSS',
      resumo: 'Como falar e receber informação quando o VHF não alcança: o GMDSS e suas áreas A1 a A4, o rádio HF/SSB com DSC, os telefones e comunicadores por satélite, o NAVTEX e o SafetyNET, e como montar o conjunto de comunicações de uma travessia.',
      licoes: [
        {
          id: 'l1',
          titulo: 'O GMDSS e as áreas marítimas A1 a A4',
          minutos: 10,
          objetivos: [
            'Explicar o que é o GMDSS e para quem ele é obrigatório',
            'Descrever as quatro áreas marítimas e o meio de comunicação que cobre cada uma',
            'Relacionar as áreas com as navegações costeira e oceânica da NORMAM-211',
          ],
          blocos: [
            P('Até os anos 1990, o socorro no mar dependia de alguém ouvir um sinal de rádio. O <b>GMDSS</b> (<i>Global Maritime Distress and Safety System</i>, Sistema Global de Socorro e Segurança Marítima) trocou isso por uma rede automática: o barco em perigo manda um alerta digital, por rádio ou satélite, e <b>os centros de salvamento em terra</b> são avisados sem depender de ouvido humano.'),
            TERMOS(['gmdss', 'dsc', 'cospas-sarsat', 'estacao-costeira']),
            H('Quem é obrigado'),
            P('O GMDSS faz parte da <b>Convenção SOLAS</b> (Salvaguarda da Vida Humana no Mar, da IMO, capítulo IV) e é obrigatório para os <b>navios sujeitos a ela</b>: mercantes grandes e de passageiros. Um veleiro de recreio, seja de 26, de 32 ou de 50 pés, <b>não é navio SOLAS</b>. Aqui quem manda é a <b>NORMAM-211</b>, que pede equipamentos inspirados nele (VHF com DSC, HF com DSC ou satélite, EPIRB). A boa notícia é que, usando o mesmo sistema, seu veleiro é ouvido pelos mesmos centros de salvamento.'),
            H('Para que serve: as funções'),
            L([
              'Alertar o socorro (ao menos por dois meios independentes) e receber alertas retransmitidos.',
              'Alertar os barcos vizinhos (alerta DSC barco a barco).',
              'Coordenar a busca e salvamento e as comunicações no local.',
              'Mandar e receber sinais de localização (EPIRB, SART).',
              'Receber informação de segurança marítima: avisos de navegação e previsões do tempo.',
              'Comunicações gerais e comunicações entre pontes de comando.',
            ]),
            H('As quatro áreas marítimas'),
            P('O mundo é dividido em áreas pelo <b>meio que alcança o barco</b>:'),
            FIG(svg('0 0 480 270', 'Quatro áreas marítimas do GMDSS a partir da costa: A1 coberta por VHF costeiro com DSC, A2 por MF costeiro com DSC, A3 por satélite Inmarsat e A4 as regiões polares',
              '<defs><clipPath id="gmdssclip"><rect x="30" y="0" width="450" height="270"/></clipPath></defs><g clip-path="url(#gmdssclip)">' +
              '<circle cx="30" cy="125" r="230" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="1.8" stroke-dasharray="6 5" opacity="0.55"/>' +
              '<circle cx="30" cy="125" r="140" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="1.8" stroke-dasharray="6 5" opacity="0.8"/>' +
              '<circle cx="30" cy="125" r="70" fill="var(--sea-1)" stroke="var(--magenta)" stroke-width="2.5"/>' +
              '</g>' +
              '<rect x="0" y="0" width="30" height="270" fill="var(--land)" stroke="var(--ink)" stroke-width="2"/>' +
              t(66, 120, 'A1', 22, 'middle', 'font-weight="700"') + t(66, 142, 'VHF', 16) +
              t(136, 112, 'A2', 22, 'middle', 'font-weight="700"') + t(136, 134, 'MF', 16) +
              t(212, 112, 'A3', 22, 'middle', 'font-weight="700"') + t(212, 134, 'satélite', 16) +
              t(38, 22, 'costa', 16, 'start', 'font-style="italic"') +
              t(330, 70, 'A1: VHF costeiro com DSC', 16, 'start') + t(330, 94, 'A2: MF costeiro com DSC', 16, 'start') +
              t(330, 118, 'A3: satélite Inmarsat', 16, 'start') + t(330, 142, 'A4: polos, acima de', 16, 'start') + t(330, 162, 'cerca de 70° de latitude', 16, 'start'), 480),
              'Esquema fora de escala. Cada área vai além da anterior; o tamanho real depende das estações de terra e do satélite.'),
            F('extra-radio-1-07', 'O material de apoio da Anatel define as áreas do GMDSS pela cobertura: A1 (VHF costeiro com DSC), A2 (MF costeiro com DSC), A3 (satélite Inmarsat, exceto polos) e A4 (regiões polares, sem cobertura Inmarsat). Como ordem de grandeza, esse material cita cerca de 30 a 50 milhas para a A1 e de 100 a 150 para a A2; a página da Anatel sobre o GMDSS dá cerca de 20 e de 100 a 300, então as milhas não são uma definição oficial única (veja a nota abaixo).'),
            F('extra-radio-1-09', 'Segundo o material de apoio da Anatel, o Inmarsat tem cobertura global, exceto nas regiões polares (aproximadamente acima de 70° N e abaixo de 70° S).'),
            C('nota', 'Números diferem entre fontes', 'Os alcances nominais de A1 e A2 variam: o material da Anatel cita 30 a 50 e 100 a 150 milhas; outras fontes falam em 20 a 30 milhas para A1 e cerca de 100 milhas para A2, e a própria página institucional da Anatel sobre o GMDSS dá cerca de 20 milhas para A1 e 100 a 300 milhas para A2. Quem define a área real é cada país, conforme a cobertura das suas estações costeiras. Trate os números como ordem de grandeza.'),
            H('E no seu barco?'),
            P('A NORMAM-211 não usa os nomes A1 a A4. Ela classifica a navegação em <b>interior, costeira e oceânica</b>. Dá para traduzir para efeito de estudo:'),
            TAB(['Navegação (NORMAM-211)', 'Equivalente aproximado', 'Dotação de rádio, médio porte'], [
              ['Interior', 'fora das áreas do GMDSS', 'VHF fixo ou portátil recomendado'],
              ['Costeira', 'A1 (VHF costeiro)', 'VHF com DSC'],
              ['Oceânica', 'A2, A3 e além', 'VHF com DSC, HF com DSC (ou satélite) e EPIRB 406 MHz'],
            ], 'A segunda coluna é um recurso didático, não uma regra da norma.'),
            F('radio-24', 'No Glossário da NORMAM-211, embarcação de médio porte é a de comprimento inferior a 24 m, exceto as miúdas (até 6 m); um veleiro de cruzeiro com mais de 6 m e menos de 24 m (um de 32 pés, cerca de 9,75 m, por exemplo) cai nas colunas “médio porte” das tabelas de rádio. As tabelas só têm as colunas miúdas, médio porte e grande porte ou iates; o art. 1.7 usa outra divisão (pequeno porte de 6 a 12 m e médio de 12 a 24 m).'),
            F('normas-155', 'A embarcação de médio porte em navegação oceânica deve ter VHF com DSC, HF com DSC e EPIRB 406 MHz (esta exigível desde 01/07/2006).'),
            CHECK([
              Q('m3l1-q1', 'Rádio: HF, satélite e GMDSS', 1, 'Qual meio principal cobre a área marítima A1 do GMDSS?',
                ['VHF costeiro com DSC.', 'Satélite Inmarsat.', 'HF de longa distância.', 'NAVTEX.'], 0,
                'A1 é a área dentro do alcance de pelo menos uma estação costeira de VHF com escuta DSC contínua. O satélite Inmarsat é a base da A3, o HF aparece nas áreas mais afastadas e o NAVTEX só difunde avisos, não é meio de alerta de socorro.',
                'SOLAS IV, regra 2; Anatel, material de apoio, item 2.2.12', ANATEL),
              Q('m3l1-q2', 'Rádio: HF, satélite e GMDSS', 2, 'Em qual área do GMDSS o meio básico de cobertura é um satélite geoestacionário, fora de A1 e A2?',
                ['A3.', 'A4.', 'A1.', 'Em nenhuma: o satélite não faz parte do GMDSS.'], 0,
                'A3 é a área coberta pelos satélites geoestacionários do Inmarsat, entre aproximadamente 70° N e 70° S, fora de A1 e A2. A4 é o que sobra: as regiões polares. A1 é VHF. E os satélites são parte essencial do GMDSS.',
                'SOLAS IV, regra 2; Anatel, material de apoio, itens 2.2.4 e 2.2.12', ANATEL),
              Q('m3l1-q3', 'Rádio: HF, satélite e GMDSS', 2, 'Para um veleiro de recreio de médio porte (mais de 6 m e menos de 24 m), quem define a dotação de rádio obrigatória no Brasil?',
                ['A NORMAM-211, que o enquadra como médio porte em navegação costeira ou oceânica.', 'Apenas a Convenção SOLAS, por ser a base do GMDSS.', 'O fabricante do rádio.', 'A decisão do comandante, sem norma.'], 0,
                'O GMDSS é obrigatório para navios SOLAS, mas o veleiro de recreio segue a NORMAM-211, que traz as tabelas de dotação por tipo de navegação. O fabricante e o comandante não substituem a norma, embora o comandante possa ter mais equipamento do que o mínimo.',
                'NORMAM-211/DPC, arts. 4.24 e 4.33 a 4.35', NORMAM),
            ]),
            FONTES([
              { txt: 'IMO, GMDSS (Convenção SOLAS, capítulo IV, regras 2 e 4)', url: IMOG },
              { txt: 'Anatel, material de apoio ao exame de Radiotelefonista (2026-03), itens 2.2.1 a 2.2.4 e 2.2.12', url: ANATEL, ref: 'extra-radio-1-07' },
              { txt: 'NORMAM-211/DPC, arts. 4.24 e 4.33 a 4.35', url: NORMAM, ref: 'normas-155' },
            ]),
          ],
        },
        {
          id: 'l2',
          titulo: 'HF/SSB: falar através do oceano',
          minutos: 14,
          objetivos: [
            'Explicar como o sinal de HF volta à Terra pela ionosfera e por que a frequência muda com a hora',
            'Citar as frequências internacionais de socorro de HF (voz e DSC)',
            'Descrever os cuidados de instalação: antena, sintonizador e terra',
          ],
          blocos: [
            P('O VHF acaba no horizonte. O <b>HF</b> (frequências de 3 a 30 MHz) não. Ele sobe, bate na <b>ionosfera</b> e volta para a Terra a milhares de milhas de distância. É o rádio que fala com o outro lado do Atlântico e o que sustenta o GMDSS longe da costa.'),
            TERMOS(['hf-ssb', 'dsc', 'gmdss']),
            H('Como o sinal viaja'),
            FIG(svg('0 0 480 250', 'Três formas de propagação: o VHF vai em linha reta e some no horizonte, o MF acompanha a superfície e o HF reflete na ionosfera e volta a milhares de milhas',
              defs('m3l2a', 'var(--magenta)') +
              '<path d="M10,60 Q240,0 470,60" fill="none" stroke="var(--ink)" stroke-width="2" stroke-dasharray="7 5"/>' +
              t(240, 22, 'ionosfera', 16, 'middle', 'font-style="italic"') +
              '<path d="M10,200 Q240,170 470,200 L470,250 L10,250 Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2"/>' +
              '<line x1="60" y1="190" x2="190" y2="30" stroke="var(--magenta)" stroke-width="3" marker-end="url(#m3l2a)"/>' +
              '<path d="M190,30 L420,191" fill="none" stroke="var(--magenta)" stroke-width="3" marker-end="url(#m3l2a)"/>' +
              t(310, 92, 'HF: reflexão na ionosfera', 16, 'start', 'fill="var(--magenta)" font-weight="700"') +
              '<path d="M60,190 Q150,176 226,190" fill="none" stroke="var(--ink)" stroke-width="3" marker-end="url(#m3l2a)"/>' +
              t(70, 232, 'MF: onda de superfície', 16, 'start') +
              t(300, 232, 'VHF: linha de visada', 16, 'start'), 480),
              'O HF vai ao céu e volta; por isso alcança distâncias que o VHF e o MF não alcançam. A figura não está em escala.'),
            L([
              '<b>Ondas diretas (VHF)</b>: linha de visada, limitadas pela curvatura da Terra.',
              '<b>Ondas de superfície (MF)</b>: seguem o mar e passam do horizonte, na faixa de uma centena de milhas.',
              '<b>Ondas ionosféricas (HF)</b>: refletem nas camadas da ionosfera e permitem comunicação a longas distâncias.',
            ]),
            P('A ionosfera muda com a <b>hora do dia</b>, a <b>estação do ano</b> e o <b>ciclo solar</b>. Por isso, no HF, <b>não existe frequência boa para todo o tempo</b>. Regra prática: de dia, as frequências mais altas (12 a 22 MHz) funcionam melhor para longa distância; à noite, as mais baixas (4 e 6 MHz). Escolha, tente, troque.'),
            H('SSB: a voz do HF'),
            P('O rádio de bordo em HF usa <b>SSB</b> (<i>single side band</i>, banda lateral única), um jeito de transmitir a voz que gasta menos potência e cabe em canais estreitos. No mar, a banda lateral usada é a <b>superior (USB)</b>. A NORMAM-211 exige o HF com <b>potência suficiente para operar a pelo menos 75 milhas da costa</b>.'),
            F('extra-radio-1-01', 'A NORMAM-211 exige que o transceptor fixo HF tenha potência suficiente para operar a uma distância de pelo menos 75 milhas da costa.'),
            H('As frequências de socorro'),
            TAB(['Banda (kHz)', 'Voz (SSB)', 'DSC', 'Observação'], [
              ['MF', '2.182', '2.187,5', 'Frequência clássica de socorro em MF'],
              ['4 MHz', '<b>4.125</b>', '4.207,5', 'Chamada e escuta no Atlântico Sul, pela NORMAM-211'],
              ['6 MHz', '6.215', '6.312', ''],
              ['8 MHz', '8.291', '8.414,5', ''],
              ['12 MHz', '12.290', '12.577', ''],
              ['16 MHz', '16.420', '16.804,5', ''],
            ], 'Frequências de socorro e segurança do GMDSS, Apêndice 15 do Regulamento de Radiocomunicações (tabela 15-1).'),
            F('normas-151', 'Para o HF, a norma indica a frequência internacional de socorro ou 4.125 kHz para chamada e escuta no Atlântico Sul, entre outras.'),
            F('radio-20', 'A NORMAM-211 lista ainda 6.215, 8.255, 12.290 e 22.060 kHz, conforme a propagação, e 4.431,8 e 8.291,1 kHz, das estações costeiras de iates clubes e marinas.'),
            C('aconfirmar', 'Uma diferença na norma: 8.255 x 8.291 kHz', 'A NORMAM-211 (art. 4.23.4 b) lista 8.255 kHz entre as frequências em que o HF “poderá operar”, conforme a propagação; já a tabela da UIT acima dá 8.291 kHz como a voz de socorro da banda de 8 MHz. Pode ser grafia da norma, mas isso não foi confirmado. Para socorro, use as frequências da tabela da UIT e a 4.125 kHz que a norma manda usar no Atlântico Sul; para as demais, pergunte à Capitania do seu porto e confira a Lista de Auxílios-Rádio da DHN.'),
            P('Num alerta DSC em HF, o rádio pode mandar o alerta <b>em várias frequências em menos de um minuto</b> (até seis), porque ninguém sabe qual está “aberta” naquele momento. Depois do alerta, a conversa de socorro segue <b>por voz na frequência de socorro da mesma banda</b>.'),
            H('Instalação: antena, sintonizador e terra'),
            L([
              '<b>Antena</b>: costuma-se usar o <b>estai de popa isolado</b> (com isoladores em cima e embaixo) ou um fio longo. O comprimento e a posição importam mais do que a marca.',
              '<b>Sintonizador automático</b>: ajusta a antena à frequência em uso, junto ao rádio ou ao pé da antena.',
              '<b>Terra de rádio</b>: o HF precisa de um “plano de terra” grande, feito com fita de cobre (ou tela) ligada a partes metálicas e ao mar. Terra pobre é a causa nº 1 de HF fraco.',
              '<b>Energia</b>: o HF consome bastante ao transmitir. Fio grosso, fusível e baterias em dia.',
              '<b>Distância das outras antenas</b>: afaste o estai do GPS e do AIS, para evitar interferência.',
            ]),
            C('seguranca', 'Cuidado com a antena em transmissão', 'Estai e fio de HF carregam radiofrequência de potência alta. Não encoste na antena, nem em porta-lemes, enquanto o rádio transmite: a queimadura por RF é séria. Instale a antena fora do alcance do cockpit ou proteja-a com uma cobertura isolante.'),
            C('dica', 'HF com dados', 'Com um <b>modem</b> (o mais usado é o Pactor) o HF manda e recebe <b>e-mail e arquivos meteorológicos</b> por rádio. Exige uma estação de terra, e licença apropriada à estação (módulo 4). É uma das opções aceitas pelos rallies transatlânticos (veja a lição 5).'),
            CHECK([
              Q('m3l2-q1', 'Rádio: HF, satélite e GMDSS', 1, 'Por que o HF alcança milhares de milhas, e o VHF não?',
                ['O HF reflete na ionosfera e volta à Terra; o VHF segue em linha reta e acaba no horizonte.', 'O HF tem mais potência do que o VHF em qualquer rádio.', 'O VHF só funciona de dia.', 'O HF viaja pelo fundo do mar.'], 0,
                'Ondas de HF refletem nas camadas da ionosfera e retornam muito além do horizonte. O VHF é de visada: a curvatura da Terra o limita. Potência não é o motivo; o VHF funciona dia e noite; e o HF não percorre o fundo do mar.',
                'Anatel, material de apoio, item 2.1.2', ANATEL),
              Q('m3l2-q2', 'Rádio: HF, satélite e GMDSS', 2, 'Qual frequência a NORMAM-211 indica para chamada e escuta em HF no Atlântico Sul, além da frequência internacional de socorro?',
                ['4.125 kHz.', '156,8 MHz.', '518 kHz.', '121,5 MHz.'], 0,
                'A norma indica a frequência internacional de socorro ou 4.125 kHz para chamada e escuta no Atlântico Sul. 156,8 MHz é o canal 16 do VHF; 518 kHz é o NAVTEX (avisos de segurança); 121,5 MHz foi a frequência das balizas antigas e não é mais processada pelo Cospas-Sarsat.',
                'NORMAM-211/DPC, art. 4.23.4 b', NORMAM),
              Q('m3l2-q3', 'Rádio: HF, satélite e GMDSS', 2, 'Para uma comunicação de longa distância em HF à noite, qual faixa costuma funcionar melhor?',
                ['As mais baixas (por exemplo, 4 e 6 MHz).', 'As mais altas (por exemplo, 22 MHz), sempre.', 'Não há diferença entre dia e noite.', 'Somente o VHF funciona à noite.'], 0,
                'A ionosfera muda ao longo do dia: à noite, as frequências mais baixas costumam refletir melhor, enquanto de dia as mais altas atingem longas distâncias. Por isso o rádio HF tem várias bandas. Dizer que não há diferença ignora a ionosfera, e o VHF independe da noite mas é de visada.',
                'Anatel, material de apoio, item 2.1.2 (variações de propagação)', ANATEL),
            ]),
            FONTES([
              { txt: 'NORMAM-211/DPC, art. 4.23.1, 4.23.4 b e 4.24.2', url: NORMAM, ref: 'normas-151' },
              { txt: 'UIT, Regulamento de Radiocomunicações, Apêndice 15 (tabela 15-1: frequências de socorro e segurança abaixo de 30 MHz) e Art. 32, n.º 32.13E (alerta DSC em várias frequências)', url: RR },
              { txt: 'Anatel, material de apoio ao exame de Radiotelefonista (2026-03), itens 2.1.2 e 2.1.4', url: ANATEL },
            ]),
          ],
        },
        {
          id: 'l3',
          titulo: 'Satélite: Inmarsat, Iridium e comunicadores',
          minutos: 12,
          objetivos: [
            'Distinguir os sistemas por satélite pela órbita e pela cobertura',
            'Saber o que a NORMAM-211 aceita no lugar do HF com DSC',
            'Escolher um meio de comunicação por satélite para uma travessia',
          ],
          blocos: [
            P('O satélite é a alternativa moderna ao HF para quem sai da costa: não depende da ionosfera, não exige antena de 10 metros e permite voz, mensagens, e-mail e previsões do tempo. Mas cada sistema tem cobertura própria e uma função diferente no GMDSS.'),
            H('Os principais sistemas'),
            TAB(['Sistema', 'Órbita e cobertura', 'O que oferece', 'Papel no GMDSS'], [
              ['<b>Inmarsat</b>', 'Satélites geoestacionários; cobertura global exceto polos (cerca de 70° N a 70° S)', 'Voz, dados, e-mail; SafetyNET (avisos); terminais Inmarsat-C e Fleet', 'Base da área A3'],
              ['<b>Iridium</b>', '66 satélites em órbita baixa; cobre todo o globo, incluindo os polos', 'Voz, mensagens curtas, dados lentos; aparelhos portáteis e fixos', 'Reconhecido como segundo provedor de satélite do GMDSS (certificação em 2020)'],
              ['<b>Globalstar</b> (SPOT X e semelhantes)', 'Órbita baixa; cobertura limitada, junto às regiões com estação de terra', 'Mensagens de texto e botão de SOS', 'Não é do GMDSS'],
              ['<b>Banda larga</b> (ex.: Starlink)', 'Órbita baixa; planos marítimos separados', 'Internet de alta velocidade', 'Não é do GMDSS: não conte com ela para socorro'],
            ], 'Quadro de síntese para estudo. Confira o mapa de cobertura e o plano do fornecedor antes de comprar.'),
            F('extra-radio-1-09', 'O Inmarsat tem cobertura global exceto nas regiões polares (aproximadamente acima de 70° N e abaixo de 70° S).'),
            P('Na prática, o <b>Iridium</b> e o <b>Inmarsat</b> cobrem o Atlântico inteiro, e os dois podem levar um pedido de socorro a um centro de salvamento. Já o <b>Globalstar</b> usa estações de terra e sua cobertura no meio do oceano pode falhar: confira o mapa antes de contar com ele numa travessia.'),
            FIG(svg('0 0 480 270', 'Cobertura por latitude: o Iridium cobre de polo a polo; o Inmarsat, de cerca de 70 graus norte a 70 graus sul',
              '<line x1="140" y1="20" x2="140" y2="240" stroke="var(--ink)" stroke-width="1.5"/>' +
              '<rect x="190" y="44" width="90" height="172" rx="6" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2"/>' +
              '<rect x="330" y="20" width="90" height="220" rx="6" fill="var(--sea-1)" stroke="var(--magenta)" stroke-width="2.5"/>' +
              '<line x1="140" y1="130" x2="440" y2="130" stroke="var(--ink)" stroke-width="1.2" stroke-dasharray="5 5"/>' +
              t(130, 26, '90° N', 16, 'end') + t(130, 50, '70° N', 16, 'end') + t(130, 136, 'Equador', 16, 'end') + t(130, 222, '70° S', 16, 'end') + t(130, 246, '90° S', 16, 'end') +
              t(235, 134, 'Inmarsat', 16, 'middle', 'font-weight="700"') + t(375, 134, 'Iridium', 16, 'middle', 'font-weight="700"') +
              t(235, 262, 'geoestacionário', 15) + t(375, 262, 'órbita baixa', 15), 480),
              'O Inmarsat fica parado sobre o Equador e não “enxerga” os polos; o Iridium usa muitos satélites em órbita baixa e cobre tudo.'),
            H('O que a NORMAM-211 aceita'),
            F('normas-176', 'Na dotação de rádio, o HF com DSC pode ser substituído por telefone satelital (Iridium, Inmarsat) ou comunicador satelital (SPOT X, Iridium GO etc.) que envie mensagens de socorro.'),
            P('Isso vale para o <b>cumprimento da dotação</b>. Mas fique atento a duas coisas:'),
            L([
              'Telefones e comunicadores por satélite de recreio <b>não são, em geral, equipamentos certificados do GMDSS</b>. Eles falam com um centro de resposta do fabricante ou com o número que você configurou, e não necessariamente com o centro de salvamento da região SAR em que você está.',
              'O alerta pelo comunicador só vale se o <b>cartão ou o plano estiverem ativos</b>, a bateria carregada e o aparelho com visão livre do céu.',
            ]),
            C('seguranca', 'Configure antes de sair', 'Cadastre no serviço do aparelho um contato de emergência que atenda de verdade, e escreva nele o nome do barco, o número de pessoas e o telefone do Salvamar (185). Teste o SOS apenas no modo de teste que o fabricante oferece. Verifique o plano e o saldo de minutos antes de cada travessia.'),
            H('Escolhendo: três perguntas'),
            L([
              '<b>Quero falar ou só mandar mensagem?</b> Voz exige Iridium ou Inmarsat; mensagens de texto curtas podem ser feitas por comunicadores simples.',
              '<b>Vou a que latitudes?</b> Entre os trópicos, Iridium e Inmarsat servem (confira o mapa de cobertura dos outros); só o Iridium cobre os polos.',
              '<b>Preciso receber previsão do tempo e e-mail?</b> Dados de arquivos meteorológicos exigem um terminal de dados (Iridium GO, Inmarsat) ou o HF com modem.',
            ]),
            P('Para redundância, muitos navegantes levam <b>dois meios independentes</b>: por exemplo, um HF com modem e um Iridium portátil. Se um falhar (ou o mastro cair), o outro segue funcionando.'),
            CHECK([
              Q('m3l3-q1', 'Rádio: HF, satélite e GMDSS', 1, 'Qual sistema por satélite cobre também as regiões polares?',
                ['Iridium, com satélites em órbita baixa.', 'Inmarsat, com satélites geoestacionários.', 'Os dois cobrem igualmente os polos.', 'Nenhum satélite chega aos polos.'], 0,
                'O Iridium usa 66 satélites em órbita baixa, que cobrem o globo inteiro, inclusive os polos. Os geoestacionários do Inmarsat ficam sobre o Equador e perdem cobertura acima de cerca de 70° de latitude. Por isso é falso que os dois sejam iguais, ou que nenhum cubra os polos.',
                'Anatel, material de apoio, item 2.2.4; IMSO (reconhecimento do Iridium)', 'https://imso.org/visit-by-iridium/'),
              Q('m3l3-q2', 'Rádio: HF, satélite e GMDSS', 2, 'Um veleiro de médio porte em navegação oceânica tem VHF com DSC e EPIRB. O que a NORMAM-211 aceita no lugar do HF com DSC?',
                ['Telefone satelital (Iridium ou Inmarsat) ou comunicador satelital que envie mensagens de socorro.', 'Um segundo VHF portátil.', 'Um receptor NAVTEX.', 'Nada: o HF é sempre obrigatório.'], 0,
                'O artigo 4.24.2 permite substituir o HF com DSC por telefone ou comunicador satelital capaz de enviar mensagem de socorro. VHF portátil tem alcance de visada, e o NAVTEX só recebe avisos. A tabela 4.35 ainda lista o HF SSB como item da navegação oceânica: confirme na inspeção naval como a Capitania interpreta a substituição.',
                'NORMAM-211/DPC, art. 4.24.2 a (*)', NORMAM),
              Q('m3l3-q3', 'Rádio: HF, satélite e GMDSS', 2, 'Por que um comunicador satelital de recreio não substitui o contato com o centro de salvamento nem torna o barco “GMDSS”?',
                ['Porque, em geral, ele fala com o centro do fabricante e não é equipamento certificado do GMDSS.', 'Porque só funciona de dia.', 'Porque a Marinha proíbe o uso.', 'Porque só envia mensagens para outros comunicadores.'], 0,
                'Os comunicadores de recreio costumam enviar o SOS a um centro de resposta do fornecedor, que repassa à autoridade de busca e salvamento, e não são equipamentos do GMDSS certificados pela IMO. Não há proibição da Marinha, e funcionam à noite e para telefones comuns.',
                'NORMAM-211/DPC, art. 4.24.2; SOLAS IV', NORMAM),
            ]),
            FONTES([
              { txt: 'NORMAM-211/DPC, art. 4.24.1 e 4.24.2 (substituição do HF com DSC)', url: NORMAM, ref: 'normas-176' },
              { txt: 'Anatel, material de apoio ao exame de Radiotelefonista (2026-03), item 2.2.4 (Inmarsat)', url: ANATEL, ref: 'extra-radio-1-09' },
              { txt: 'Iridium recebe autorização para prestar o serviço GMDSS (Satellite Today, 14/01/2020; carta de conformidade do IMSO)', url: 'https://www.satellitetoday.com/mobility/2020/01/14/iridium-receives-authorization-to-provide-gmdss-service/' },
              { txt: 'IMSO, visita da Iridium (reconhecimento como provedora GMDSS)', url: 'https://imso.org/visit-by-iridium/' },
            ]),
          ],
        },
        {
          id: 'l4',
          titulo: 'Avisos e previsões: NAVTEX, SafetyNET e a Marinha',
          minutos: 12,
          objetivos: [
            'Explicar o que é a informação de segurança marítima (MSI) e quem a emite',
            'Distinguir NAVTEX e SafetyNET e dizer onde cada um alcança',
            'Saber de onde vêm os avisos e a previsão do tempo no Brasil, em especial a NAVAREA V',
          ],
          blocos: [
            P('Parte do GMDSS não é socorro: é <b>informação para evitar o socorro</b>. A <b>MSI</b> (<i>maritime safety information</i>) leva ao barco avisos de navegação (boia apagada, exercício de tiro, destroços) e previsões do tempo, de graça, e sem você precisar pedir.'),
            TERMOS(['navtex', 'gmdss', 'renec', 'salvamar']),
            H('NAVTEX'),
            F('extra-radio-1-08', 'O material de apoio da Anatel descreve o NAVTEX como sistema em 518 kHz (MF), entre outras frequências, que transmite mensagens de segurança em texto, com cobertura típica de até cerca de 300 milhas náuticas da costa.'),
            L([
              'Um receptor pequeno, que <b>imprime ou mostra na tela</b> as mensagens que chegam sozinhas.',
              'Frequências: <b>518 kHz</b> (internacional, em inglês), <b>490 kHz</b> (língua nacional) e <b>4.209,5 kHz</b> (tropical, usada em alguns países).',
              'Cada estação tem uma letra e transmite em horários fixos; o receptor filtra por estação e por tipo de mensagem.',
              'Alcance de algumas centenas de milhas da costa.',
            ]),
            C('aconfirmar', 'NAVTEX no Brasil', 'Segundo o relatório de 2024 sobre a NAVAREA V, não há serviço NAVTEX na NAVAREA V. Isso quer dizer que um receptor NAVTEX, que funciona bem na Europa, pode não receber avisos brasileiros. Confira na Lista de Auxílios-Rádio da DHN e no site do CHM se o serviço foi implantado depois. O mesmo relatório diz que o Brasil previa começar a transmitir avisos também pelo serviço EGC da Iridium em 1º de janeiro de 2025, se os trâmites terminassem em 2024; não confirmamos se isso aconteceu.'),
            F('extra-fechamento-cvtr-16', 'No relatório de 2024 sobre a NAVAREA V, o Brasil informa que concluía os trâmites internos para aderir ao serviço EGC da Iridium e que, se tudo ficasse pronto até o fim de 2024, as transmissões operacionais de avisos começariam em 1º de janeiro de 2025.'),
            H('SafetyNET: avisos por satélite'),
            P('O <b>SafetyNET</b> usa o serviço de chamada de grupo ampliada (<i>EGC</i>, <i>enhanced group call</i>) do Inmarsat-C para levar avisos a toda uma região do oceano, onde o NAVTEX não chega. O receptor filtra por área e por tipo, e guarda as mensagens.'),
            F('travessia-101', 'No relatório de 2024 (ano-base 2023), a NAVAREA V transmite os avisos náuticos via Inmarsat (EGC/SafetyNET, AOR-E) às 00:30 e 12:30 UTC; não há serviço NAVTEX; os avisos também ficam na internet e saem em HF às 0400Z e 2130Z.'),
            F('travessia-102', 'Em 2024 o Brasil se preparava para transmitir MSI também pelo EGC da Iridium, com início previsto para 01/01/2025 se concluídos os trâmites administrativos.'),
            FIG(svg('0 0 480 200', 'Quem leva a informação de segurança até o barco conforme a distância da costa: VHF perto, NAVTEX até cerca de 300 milhas e SafetyNET e HF em todo o oceano',
              '<rect x="0" y="20" width="26" height="150" fill="var(--land)" stroke="var(--ink)" stroke-width="2"/>' +
              caixa(34, 28, 80, 60, 'VHF', 'visada') +
              caixa(122, 28, 170, 60, 'NAVTEX', 'até ~300 milhas', 'mg') +
              caixa(300, 28, 172, 60, 'SafetyNET', 'e HF: oceano todo', 'sea') +
              '<line x1="34" y1="110" x2="472" y2="110" stroke="var(--ink)" stroke-width="2"/>' +
              t(34, 136, 'costa', 16, 'start') + t(472, 136, 'alto-mar', 16, 'end') +
              t(240, 170, 'distância da costa', 16, 'middle', 'font-style="italic"'), 480),
              'Cada serviço alcança até onde a sua tecnologia chega. No Brasil, segundo o relatório da NAVAREA V, não há NAVTEX: os avisos saem por SafetyNET, por HF e pela internet.'),
            H('NAVAREA e METAREA'),
            P('O mundo é dividido em <b>21 áreas</b>, numeradas, e em cada uma um país coordena os avisos de navegação (<b>NAVAREA</b>) e os de meteorologia (<b>METAREA</b>). A costa brasileira e o Atlântico Sul fazem parte da <b>NAVAREA V</b> e da <b>METAREA V</b>, sob coordenação do Brasil, por meio da Marinha (DHN e CHM). Quando você cruzar o Atlântico, vai passar por outras áreas, como a NAVAREA IV (Atlântico Norte oeste), cada uma com seus horários e estações.'),
            F('travessia-99', 'O METEOROMARINHA é o boletim meteorológico do Serviço Meteorológico Marinho (CHM), emitido duas vezes por dia (referentes a 0000Z e 1200Z). Segundo a NORMAM-701/DHN (art. 2.3, redação da Portaria DHN/DGN/MB nº 31, de 22/06/2026), é transmitido por satélite duas vezes ao dia (Inmarsat SafetyNET II e Iridium SafetyCAST, GMDSS); também por radiotelefone, mediante solicitação, às estações da RENEC (VHF e HF, conforme a Lista de Auxílios-Rádio), por radiodados em HF e pela internet (página do CHM). Os horários 0730Z/1930Z, o satélite AOR-E e o INMARSAT-C do antigo DH8-14 não constam da redação atual.'),
            H('Outras fontes de informação'),
            L([
              '<b>Previsão e avisos do CHM</b> no site, nos aplicativos “Previsão Ambiental Marinha (PAM)” e “Boletim ao Mar” e pelas frequências de VHF e HF da Lista de Auxílios-Rádio.',
              '<b>RENEC</b> (rede costeira): transmite boletins meteorológicos, previsões (METEOROMARINHA), Avisos-Rádio Náuticos e avisos SAR em VHF e HF.',
              '<b>Avisos aos Navegantes</b> (publicação da DHN), que corrigem cartas e publicações.',
              '<b>O próprio canal 16</b>: a costeira chama “SÉCURITÉ” e manda mudar de canal para o aviso.',
            ]),
            F('extra-mestre-3-22', 'Os avisos de mau tempo e demais produtos do Serviço Meteorológico Marinho podem ser vistos no site do CHM, nos aplicativos “Previsão Ambiental Marinha (PAM)” e “Boletim ao Mar”, na página do serviço no Facebook e pelas frequências de VHF e HF da Lista de Auxílios-Rádio.'),
            F('extra-mestre-3-21', 'Os boletins e cartas meteorológicas do CHM são divulgados pela Estação Rádio da Marinha no Rio de Janeiro e, a pedido, pelas estações da RENEC (Embratel).'),
            C('dica', 'Rotina de um comandante', 'Antes de zarpar, leia o aviso de mau tempo e os avisos de navegação da sua região. Durante a travessia, olhe a previsão ao menos duas vezes por dia, nos horários em que ela é emitida. Anote os horários no diário de bordo.'),
            CHECK([
              Q('m3l4-q1', 'Rádio: HF, satélite e GMDSS', 1, 'Em qual frequência opera o NAVTEX internacional?',
                ['518 kHz.', '156,8 MHz.', '406 MHz.', '2.182 kHz.'], 0,
                'O NAVTEX internacional usa 518 kHz, exclusivamente, para mensagens de segurança em texto. 156,8 MHz é o canal 16 do VHF; 406 MHz é a frequência das radiobalizas de emergência (EPIRB); 2.182 kHz é a frequência de socorro por voz em MF.',
                'RR, Apêndice 15 (tabela 15-1); Anatel, material de apoio, item 2.2.10', RR),
              Q('m3l4-q2', 'Rádio: HF, satélite e GMDSS', 2, 'No oceano, longe do alcance do NAVTEX, que serviço do GMDSS entrega avisos por satélite?',
                ['SafetyNET (EGC), pelo Inmarsat-C.', 'EPIRB.', 'Canal 70 do VHF.', 'O AIS.'], 0,
                'O SafetyNET usa a chamada de grupo ampliada do Inmarsat para levar avisos de navegação e do tempo a áreas oceânicas. A EPIRB envia alerta, não recebe avisos; o canal 70 é DSC de VHF e só alcança a visada; o AIS troca dados entre embarcações.',
                'Anatel, material de apoio, item 2.2.10; NAVAREA V, relatório de 2024', ANATEL),
              Q('m3l4-q3', 'Rádio: HF, satélite e GMDSS', 2, 'Que área coordena os avisos de navegação para a costa brasileira e o Atlântico Sul?',
                ['NAVAREA V, coordenada pelo Brasil.', 'NAVAREA I, coordenada pelo Reino Unido.', 'NAVAREA XII, coordenada pelos Estados Unidos.', 'Não há coordenação: cada porto emite os seus.'], 0,
                'A NAVAREA V cobre a costa brasileira e parte do Atlântico Sul, sob coordenação do Brasil (DHN). As outras áreas citadas ficam em outros oceanos e a coordenação existe, para dar um padrão aos avisos.',
                'NAVAREA V; Miguens, vol. III (cap. 47: GMDSS)', 'https://www.marinha.mil.br/chm/'),
            ]),
            FONTES([
              { txt: 'Anatel, material de apoio ao exame de Radiotelefonista (2026-03), item 2.2.10 (MSI, NAVTEX, SafetyNET)', url: ANATEL, ref: 'extra-radio-1-08' },
              { txt: 'UIT, Regulamento de Radiocomunicações, Apêndice 15 (frequências 490, 518 e 4.209,5 kHz)', url: RR },
              { txt: 'Relatório da NAVAREA V (2024) e NORMAM-701/DHN (METEOROMARINHA), citados em travessia-101 e travessia-99', url: 'https://www.marinha.mil.br/chm/', ref: 'travessia-101' },
              { txt: 'Miguens, Navegação: a Ciência e a Arte, vol. III (DHN), cap. 47 (GMDSS)', url: 'https://www.marinha.mil.br/dhn/' },
            ]),
          ],
        },
        {
          id: 'l5',
          titulo: 'Montando as comunicações de uma travessia',
          minutos: 12,
          objetivos: [
            'Listar a dotação mínima de rádio da NORMAM-211 para cada tipo de navegação',
            'Montar um conjunto redundante de comunicações para a travessia',
            'Planejar o recebimento de previsões e e-mail em alto-mar',
          ],
          blocos: [
            P('Cruzar um oceano exige mais do que o mínimo da norma. Esta lição junta o que você viu para montar um conjunto de comunicações com <b>duas camadas</b>: o que a lei pede e o que a prudência acrescenta.'),
            H('O que a norma pede (médio porte)'),
            TAB(['Navegação', 'Rádios', 'Baliza'], [
              ['Interior', 'VHF fixo ou portátil (recomendado)', 'Não exige'],
              ['Costeira', 'VHF com DSC (fixo obrigatório na tabela 4.34); HF dispensado', 'EPIRB dispensada para médio porte'],
              ['Oceânica', 'VHF com DSC; HF com DSC (ou satelital); HF SSB e VHF fixo na tabela 4.35; antena de emergência se o VHF for no tope', 'EPIRB 406 MHz obrigatória'],
            ], 'Resumo do art. 4.24 e das tabelas 4.33 a 4.35 da NORMAM-211. Para outros portes de embarcação, veja a norma.'),
            F('radio-21', 'Pela NORMAM-211, a embarcação de médio porte em navegação oceânica deve ter VHF com DSC, HF com DSC (substituível por telefone ou comunicador satelital como Iridium, Inmarsat, SPOT X ou Iridium GO) e EPIRB 406 MHz.'),
            F('radio-27', 'Na tabela da NORMAM-211 para navegação costeira, o rádio HF é dispensado para médio porte e o VHF fixo é obrigatório.'),
            F('radio-25', 'Na tabela da NORMAM-211 para embarcações classificadas para navegação oceânica, rádio HF SSB e rádio VHF fixo são obrigatórios para médio porte.'),
            F('extra-mestre-3-04', 'Na tabela de equipamentos para navegação costeira, a EPIRB 406 MHz é dispensada para embarcações de médio porte e obrigatória para as de grande porte ou iates.'),
            C('aconfirmar', 'HF ou satélite?', 'O texto do art. 4.24.2 aceita o satélite no lugar do HF com DSC, mas a tabela 4.35 lista o “rádio HF SSB” como obrigatório. Pergunte à Capitania como a inspeção naval aplica as duas regras antes de comprar o equipamento.'),
            FIG(svg('0 0 480 260', 'Duas camadas de comunicações: a exigida pela norma, com VHF DSC, HF ou satélite e EPIRB, e a da prudência, com um segundo meio, portátil, balizas pessoais e energia de reserva',
              caixa(10, 10, 460, 34, 'Camada da prudência (acrescente)', null, 'sea') +
              caixa(10, 52, 146, 58, 'Segundo meio', 'longo alcance') +
              caixa(167, 52, 146, 58, 'VHF portátil', 'na bolsa') +
              caixa(324, 52, 146, 58, 'PLB e AIS-MOB', 'no colete') +
              caixa(10, 128, 460, 34, 'Camada da norma (NORMAM-211, oceânica)', null, 'mg') +
              caixa(10, 170, 146, 58, 'VHF com DSC', 'antena de emergência') +
              caixa(167, 170, 146, 58, 'HF com DSC', 'ou satélite') +
              caixa(324, 170, 146, 58, 'EPIRB 406 MHz', 'registrada') +
              t(240, 252, 'energia de reserva sustenta as duas camadas', 15, 'middle', 'font-style="italic"'), 480),
              'A camada de baixo é o mínimo que a norma pede de um veleiro de médio porte em navegação oceânica; a de cima é o que torna a travessia mais segura.'),
            H('O que a prudência acrescenta'),
            L([
              '<b>Dois meios de longo alcance independentes</b>: por exemplo, HF e um Iridium portátil.',
              '<b>Um VHF portátil por bolsa de abandono</b>, com bateria de reserva.',
              '<b>Energia de reserva</b> para o rádio: banco separado ou ligação com o do motor.',
              '<b>Uma EPIRB 406 MHz</b> mais uma ou mais PLBs e balizas AIS pessoais (módulo 5).',
              '<b>Papel e lápis</b> ao lado do rádio, com cartão de MAYDAY e fonético.',
            ]),
            H('Previsão e e-mail no meio do oceano'),
            P('Em alto-mar, o recurso mais valioso é a <b>previsão do tempo em arquivo (GRIB)</b>, com vento e onda em poucos quilobytes, que se baixa por satélite ou por HF com modem e se abre num programa de navegação. Combine com os boletins do CHM e com as cartas meteorológicas por fax em HF (<i>weatherfax</i>).'),
            L([
              '<b>Iridium GO</b> e semelhantes: baixam GRIB e e-mail em baixa velocidade; consomem minutos do plano.',
              '<b>HF com modem</b>: sem custo por minuto depois de instalado; depende da propagação do dia.',
              '<b>Banda larga</b>: confortável, mas cai com mau tempo e não é meio de segurança.',
            ]),
            C('dica', 'Compacte antes de baixar', 'Peça áreas pequenas e poucos parâmetros (vento, rajada, pressão e onda). Um GRIB de poucos quilobytes baixa em um minuto até no Iridium, e é suficiente para decidir a rota por vários dias.'),
            C('intl', 'Rallies transatlânticos', 'Nos rallies como o ARC, o World ARC e outros, as regras de inscrição exigem comunicação por satélite (ou HF com modem) capaz de mandar e receber e-mail no mar, além de transponder AIS e de um localizador AIS pessoal de homem ao mar para cada tripulante nos rallies da World Cruising Club.'),
            F('travessia-63', 'Para ARC, ARC+, ARC Europe e World ARC é obrigatório sistema satelital (ou SSB com modem Pactor) capaz de enviar e receber e-mail no mar.'),
            F('travessia-64', 'Rallies WCC: transponder AIS obrigatório e um localizador AIS pessoal de homem ao mar para cada tripulante.'),
            F('travessia-117', 'Rádio em navegação oceânica (médio porte): VHF com DSC, HF com DSC (substituível por telefone satelital Iridium/Inmarsat ou comunicador satelital tipo SPOT X/Iridium GO) e EPIRB 406 MHz.'),
            CHECK([
              Q('m3l5-q1', 'Rádio: HF, satélite e GMDSS', 2, 'Qual é a dotação de rádio e baliza que a NORMAM-211 pede de um veleiro de médio porte em navegação oceânica?',
                ['VHF com DSC, HF com DSC (ou satélite) e EPIRB 406 MHz.', 'Só um VHF portátil.', 'VHF sem DSC e uma EPIRB de 121,5 MHz.', 'Apenas um telefone celular.'], 0,
                'O art. 4.24.2 a) pede VHF com DSC, HF com DSC (que pode ser substituído por telefone ou comunicador satelital capaz de enviar socorro) e EPIRB 406 MHz. O portátil é reserva; a EPIRB de 121,5 MHz não é mais processada pelo Cospas-Sarsat; o celular não funciona longe da costa.',
                'NORMAM-211/DPC, art. 4.24.2 a', NORMAM),
              Q('m3l5-q2', 'Rádio: HF, satélite e GMDSS', 1, 'Para a navegação costeira de uma embarcação de médio porte, que rádio a NORMAM-211 pede?',
                ['VHF com DSC; o HF é dispensado.', 'HF com DSC e Inmarsat.', 'Somente um rádio portátil.', 'Nenhum rádio.'], 0,
                'Na navegação costeira, o médio porte leva VHF com DSC e o HF é dispensado na tabela 4.34. As demais opções pedem mais do que a norma ou menos do que ela exige.',
                'NORMAM-211/DPC, art. 4.24.2 b e tabela 4.34', NORMAM),
              Q('m3l5-q3', 'Rádio: HF, satélite e GMDSS', 2, 'Por que levar dois meios independentes de comunicação de longo alcance numa travessia?',
                ['Porque, se um falhar ou o mastro cair, o outro continua funcionando.', 'Porque a lei proíbe usar um só.', 'Porque dois sistemas dobram o alcance do VHF.', 'Porque o segundo recebe a previsão e o primeiro, não.'], 0,
                'A redundância é a lógica do próprio GMDSS: alertar por dois meios independentes. A lei não proíbe um só meio (a dotação mínima é um conjunto), os sistemas de longo alcance não aumentam o alcance do VHF, e ambos podem receber previsões.',
                'SOLAS IV, regra 4 (alerta por pelo menos dois meios independentes); boas práticas de travessia', IMOG),
            ]),
            FONTES([
              { txt: 'NORMAM-211/DPC, arts. 4.24 e 4.33 a 4.35 (tabelas de dotação)', url: NORMAM, ref: 'radio-21' },
              { txt: 'World Sailing, Offshore Special Regulations e regulamentos dos rallies (ARC, World ARC)', url: 'https://www.sailing.org/offshore-special-regulations/', ref: 'travessia-63' },
              { txt: 'IMO, GMDSS: funções (SOLAS IV, regra 4)', url: IMOG },
            ]),
          ],
        },
      ],
    },
{
      id: 'm4',
      titulo: 'Licenças e certificados de rádio no Brasil',
      resumo: 'O que a lei brasileira pede para ter e usar rádio a bordo: a licença da estação de navio na Anatel, o certificado de operador radiotelefonista, o MMSI e o indicativo de chamada, os equipamentos homologados e as equivalências internacionais (RYA SRC e LRC).',
      licoes: [
        {
          id: 'l1',
          titulo: 'Estação, operador e equipamento: o mapa das exigências',
          minutos: 10,
          objetivos: [
            'Distinguir licença da estação, certificado do operador e homologação do equipamento',
            'Dizer quem cuida de cada uma: a Anatel, a Marinha e o DECEA',
            'Saber o que ainda precisa ser confirmado com a Anatel',
          ],
          blocos: [
            P('Quem monta um rádio no barco descobre, cedo ou tarde, que há <b>várias burocracias diferentes</b> ao mesmo tempo, e que elas se misturam. Para não se perder, separe em três perguntas: <b>o barco</b> pode transmitir? <b>A pessoa</b> pode operar? <b>O aparelho</b> é aceito?'),
            TERMOS(['licenca-de-estacao', 'mmsi', 'indicativo-de-chamada', 'infosar']),
            FIG(svg('0 0 480 250', 'Três pilares das exigências de rádio no Brasil: a licença da estação de navio, o certificado de operador e o equipamento homologado, todos ligados à Anatel',
              caixa(10, 10, 460, 46, 'Anatel: licencia, habilita e homologa', null, 'sea') +
              caixa(10, 90, 146, 90, 'Estação', 'o barco pode', 'mg') +
              caixa(167, 90, 146, 90, 'Operador', 'a pessoa pode') +
              caixa(324, 90, 146, 90, 'Equipamento', 'o aparelho serve') +
              '<line x1="83" y1="56" x2="83" y2="90" stroke="var(--ink)" stroke-width="2.2"/><line x1="240" y1="56" x2="240" y2="90" stroke="var(--ink)" stroke-width="2.2"/><line x1="397" y1="56" x2="397" y2="90" stroke="var(--ink)" stroke-width="2.2"/>' +
              t(83, 152, 'Licença de', 15) + t(83, 170, 'Estação de Navio', 15) +
              t(240, 152, 'Certificado de', 15) + t(240, 170, 'Operador', 15) +
              t(397, 152, 'Homologação', 15) + t(397, 170, 'do aparelho', 15) +
              caixa(10, 196, 460, 46, 'Marinha (NORMAM-211): define a dotação e inspeciona', null), 480),
              'Quem autoriza e habilita o rádio é a Anatel; a Marinha define quais rádios o barco precisa levar e confere na inspeção naval.'),
            H('1. A estação: a licença do barco'),
            F('normas-152', 'Pela NORMAM-211, as embarcações com equipamento de radiocomunicação devem obter a Licença de Estação de Navio na Anatel.'),
            P('É a autorização para o <b>barco</b> ter e usar o rádio. Sai em nome do barco e do proprietário, e leva o indicativo de chamada e, se for o caso, o MMSI (lições 2 e 4).'),
            H('2. O operador: o certificado'),
            F('radio-12', 'O Regulamento Geral dos Serviços de Telecomunicações (Resolução Anatel nº 777/2025) exige Certificado de Radiotelegrafista ou Radiotelefonista, emitido ou reconhecido pela Anatel, para operar estações do Serviço Limitado Móvel Marítimo quando associado ao GMDSS.'),
            F('radio-15', 'A NORMAM-211 não traz exigência de certificado de operador de rádio para o condutor amador; o conhecimento de VHF é cobrado dentro dos programas da CHA.'),
            P('Os dois textos não se contradizem, mas deixam uma dúvida (veja o quadro abaixo). Na prática, os navegantes que vão sair da costa com VHF/HF com DSC fazem o certificado: ele é <b>gratuito, não vence</b> e a matéria é exatamente a que um comandante precisa saber (lição 3).'),
            H('3. O equipamento: homologado'),
            F('normas-153', 'Os equipamentos de comunicações devem seguir as normas da Anatel (ou ser homologados no país de origem, se estrangeiros) e o Regulamento de Radiocomunicações do serviço móvel marítimo.'),
            H('E o que cai na prova da CHA?'),
            L([
              '<b>Arrais-Amador</b>: VHF fixo e portátil, procedimentos e frequências de rotina, socorro, urgência, segurança e trânsito.',
              '<b>Mestre-Amador</b>: VHF na navegação costeira, a RENEC, e noções de EPIRB e AIS.',
              '<b>Capitão-Amador</b>: comunicações na navegação oceânica (equipamentos, frequências de socorro, estações de terra), EPIRB e SART.',
            ]),
            F('radio-50', 'O programa do exame de Arrais-Amador cobra o sistema móvel marítimo em VHF (fixo e portátil): equipamentos, procedimentos e frequências de chamada, socorro, urgência, segurança e trânsito.'),
            F('radio-51', 'O programa do exame de Mestre-Amador cobra comunicações em navegação costeira (VHF, frequências e chamadas de emergência, RENEC) e conhecimento básico de EPIRB e AIS.'),
            F('radio-52', 'O programa do exame de Capitão-Amador cobra comunicações na navegação oceânica (equipamentos, frequências de socorro, estações de terra, EPIRB e SART) e sobrevivência no mar.'),
            C('aconfirmar', 'O que ainda não está claro', 'Falta a Anatel dizer, por escrito, se um VHF/DSC ou HF/DSC de <b>recreio</b> entra na regra do RGST que exige certificado de operador. Outras dúvidas: se uma pessoa de 16 anos pode fazer o exame (a página da Anatel diz “maior de idade”, o regulamento diz “maiores de 16 anos”), e se o VHF portátil com DSC precisa de licença própria. Antes de agir, confirme na Anatel (central 1331 ou pelo SEI).'),
            CHECK([
              Q('m4l1-q1', 'Rádio: licenças e certificados', 1, 'Que órgão emite a Licença de Estação de Navio de um veleiro de recreio no Brasil?',
                ['A Anatel.', 'A Capitania dos Portos.', 'O DECEA.', 'A Receita Federal.'], 0,
                'A NORMAM-211 manda obter a Licença de Estação de Navio na Anatel, que cuida das telecomunicações. A Capitania registra a embarcação e inspeciona, o DECEA cuida do INFOSAR (registro de balizas) e a Receita não tem relação com o rádio.',
                'NORMAM-211/DPC, art. 4.23.8', NORMAM),
              Q('m4l1-q2', 'Rádio: licenças e certificados', 2, 'O que a NORMAM-211 traz sobre certificado de operador de rádio para o condutor amador?',
                ['Não traz essa exigência; o conhecimento de VHF é cobrado nos programas da CHA.', 'Exige o certificado de radioperador geral para qualquer amador.', 'Exige o RYA SRC.', 'Exige um curso de 88 horas (CROG).'], 0,
                'Os artigos 4.23 e 4.24 da NORMAM tratam de equipamento e licença da estação, e não exigem certificado do condutor amador; o VHF aparece no conteúdo das provas de Arrais, Mestre e Capitão. A exigência do RGST (art. 271) é um assunto à parte. O RYA SRC é britânico e o CROG é um curso profissional da DPC, nenhum dos dois exigido pela norma.',
                'NORMAM-211/DPC, arts. 4.23 e 4.24; RGST, art. 271', NORMAM),
              Q('m4l1-q3', 'Rádio: licenças e certificados', 1, 'Qual é a diferença entre a licença da estação e o certificado de operador?',
                ['A licença é do barco (equipamento instalado a bordo); o certificado é da pessoa que opera o rádio.', 'São o mesmo documento com dois nomes.', 'A licença é da Marinha e o certificado é da Receita.', 'A licença vale para qualquer barco; o certificado só para um.'], 0,
                'A licença da estação autoriza o barco e seus equipamentos; o certificado habilita a pessoa que opera o rádio e é intransferível. Não são o mesmo documento, nem são emitidos pela Marinha e pela Receita, e a licença é específica do barco, não de qualquer um.',
                'NORMAM-211/DPC, art. 4.23.8; Anatel, Operador Radiotelefonista', NORMAM),
            ]),
            FONTES([
              { txt: 'NORMAM-211/DPC, arts. 4.23.7, 4.23.8 e Anexo 5-A', url: NORMAM, ref: 'normas-152' },
              { txt: 'Anatel, Resolução nº 777/2025 (RGST), art. 271', url: RGST, ref: 'radio-12' },
              { txt: 'Pesquisa do projeto: research/radio_seguranca.md, seções 1 e 2 e lacunas', ref: 'radio-15' },
            ]),
          ],
        },
        {
          id: 'l2',
          titulo: 'Licença de Estação de Navio na Anatel, passo a passo',
          minutos: 12,
          objetivos: [
            'Seguir as etapas do pedido de licença no sistema da Anatel',
            'Saber que dados da embarcação o pedido pede',
            'Entender o que ainda é incerto: custo e atualizações',
          ],
          blocos: [
            P('O pedido de licença da estação é hoje todo <b>online</b>. A NORMAM-211 ainda fala em ir às “sedes regionais da Anatel”, mas é o procedimento da Anatel que vale na prática.'),
            F('radio-16', 'A NORMAM-211 manda que embarcações com equipamento de radiocomunicação obtenham a Licença de Estação de Navio junto à Anatel.'),
            H('As etapas'),
            FIG(svg('0 0 480 300', 'Cinco etapas do licenciamento da estação de navio na Anatel: cadastro no SEI, procuração se houver representante, acesso ao Mosaico, autorização do serviço e licenciamento no módulo MMAR',
              defs('m4l2a') +
              caixa(20, 8, 440, 44, '1. Cadastro no SEI da Anatel', 'termo de concordância, RG e CPF') +
              caixa(20, 66, 440, 44, '2. Procuração eletrônica', 'se houver representante') +
              caixa(20, 124, 440, 44, '3. Acesso ao Mosaico', 'com a conta gov.br') +
              caixa(20, 182, 440, 44, '4. Autorização do serviço', 'Serviço de Interesse Restrito (ou notificação)') +
              caixa(20, 240, 440, 50, '5. Licenciamento da estação', 'módulo MMAR', 'mg') +
              '<line x1="240" y1="52" x2="240" y2="66" stroke="var(--ink)" stroke-width="2.2" marker-end="url(#m4l2a)"/>' +
              '<line x1="240" y1="110" x2="240" y2="124" stroke="var(--ink)" stroke-width="2.2" marker-end="url(#m4l2a)"/>' +
              '<line x1="240" y1="168" x2="240" y2="182" stroke="var(--ink)" stroke-width="2.2" marker-end="url(#m4l2a)"/>' +
              '<line x1="240" y1="226" x2="240" y2="240" stroke="var(--ink)" stroke-width="2.2" marker-end="url(#m4l2a)"/>', 480),
              'Etapas do serviço móvel marítimo da Anatel. Confira sempre o passo a passo atual no portal da Anatel.'),
            F('radio-28', 'Pela Anatel, licenciar estação do Serviço Móvel Marítimo envolve: cadastro no SEI, procuração eletrônica (se houver representante), acesso ao Mosaico com gov.br, autorização do Serviço de Interesse Restrito e licenciamento da estação no módulo MMAR.'),
            H('O que o pedido pergunta'),
            F('radio-29', 'O módulo MMAR licencia, entre outros, os tipos de estação “Embarcação” (equipamentos instalados a bordo) e “Estação Móvel” (equipamentos portáteis ou transportáveis não fixados à embarcação).'),
            F('radio-33', 'No pedido de licença de estação “Embarcação” no MMAR, informam-se a Capitania onde a embarcação foi registrada, o número de inscrição e se ela faz viagem internacional ou opera em mar aberto.'),
            L([
              'Tenha à mão o <b>título de inscrição da embarcação</b> (TIE) ou a PRPM, para o número de inscrição e a Capitania de registro.',
              'Separe o <b>número do certificado de homologação</b> de cada rádio (VHF, HF, EPIRB, AIS): o sistema cadastra os equipamentos por esse número ou pelo modelo.',
              'Informe se o barco fará <b>viagem internacional</b> ou navegará em mar aberto: isso muda a necessidade de MMSI.',
              'Para o MMSI, veja a etapa “UIT/GMDSS” na lição 4.',
            ]),
            F('extra-radio-1-25', 'No tutorial MMAR, os equipamentos da estação são cadastrados pesquisando-se o número do certificado de homologação ou parte da descrição do modelo, e selecionando-se o equipamento na lista exibida pelo sistema.'),
            F('extra-radio-1-27', 'Segundo o tutorial MMAR, os documentos do pedido são enviados em PDF de no máximo 150 MB, e a solicitação segue para análise da Agência da Anatel depois que o requerente marca as caixas de ciência dos termos e condições.'),
            H('Validade, custo e prazo'),
            F('radio-32', 'Segundo o tutorial MMAR, as licenças geradas pelo módulo têm prazo indeterminado, exceto as de “Embarcação em Teste”.'),
            F('radio-30', 'Segundo o tutorial MMAR, o licenciamento da estação é oneroso: incide a Taxa de Fiscalização de Instalação (TFI) e, se o interessado não tiver Autorização de Uso de Radiofrequência, também o Preço Público pelo Direito de Uso de Radiofrequência.'),
            F('radio-31', 'A página gov.br do serviço estima até 30 dias corridos e diz que o serviço é gratuito para o cidadão, o que diverge da cobrança de TFI descrita no tutorial MMAR.'),
            C('aconfirmar', 'Quanto custa?', 'As duas fontes oficiais divergem (taxa de instalação no tutorial; “gratuito” na página do serviço), e não confirmamos os valores. Consulte o valor atual na Anatel antes de pedir e guarde o comprovante de pagamento.'),
            C('dica', 'Antes de comprar o rádio', 'Peça ao vendedor o <b>número de homologação</b> da Anatel e o modelo exato: o pedido de licença e a inspeção naval conferem. Rádio comprado fora do país deve ser homologado pela autoridade do país de origem (lição 5).'),
            C('seguranca', 'Guarde a licença a bordo', 'A inspeção naval e uma fiscalização podem pedir a licença da estação. Leve uma cópia impressa ou salva no celular, e mude os dados no sistema quando vender o barco ou trocar de equipamento de rádio: confirme na Anatel o procedimento para atualização.'),
            CHECK([
              Q('m4l2-q1', 'Rádio: licenças e certificados', 1, 'Em que sistema da Anatel se licencia a estação de um barco?',
                ['No módulo MMAR do Mosaico, com a conta gov.br.', 'Na Capitania dos Portos, em papel.', 'No portal do DECEA.', 'No site da Receita Federal.'], 0,
                'O licenciamento do Serviço Móvel Marítimo é feito no módulo MMAR do Mosaico, acessado com a conta gov.br. A Capitania registra a embarcação, o DECEA cuida do INFOSAR (balizas) e a Receita trata de tributos.',
                'Anatel, Serviço Móvel Marítimo; Tutorial MMAR', MMAR),
              Q('m4l2-q2', 'Rádio: licenças e certificados', 2, 'Qual é a validade da licença de estação gerada no módulo MMAR?',
                ['Prazo indeterminado, exceto a de “Embarcação em Teste”.', '1 ano, renovável.', '5 anos.', '30 dias.'], 0,
                'Segundo o tutorial do MMAR, as licenças geradas pelo módulo não têm prazo de validade, exceto as de embarcação em teste. Os 30 dias são o prazo estimado de análise do pedido na página gov.br, e não a validade.',
                'Tutorial MMAR (Anatel), campo “Validade da Licença”', MMAR),
              Q('m4l2-q3', 'Rádio: licenças e certificados', 2, 'Que informações o pedido de licença de uma “Embarcação” pede no MMAR?',
                ['Capitania de registro, número de inscrição e se há viagem internacional ou mar aberto.', 'Somente o nome do comandante.', 'A cor do casco e o ano de fabricação.', 'O resultado do exame de radiotelefonista.'], 0,
                'O tutorial lista a Capitania em que a embarcação foi registrada, o número de inscrição e se ela faz viagem internacional ou opera em mar aberto. Nome do comandante, cor do casco e prova de radiotelefonista não são dados do pedido de licença da estação.',
                'Tutorial MMAR (Anatel), passo 7-A', MMAR),
            ]),
            FONTES([
              { txt: 'Anatel, Serviço Móvel Marítimo (passo a passo do licenciamento)', url: 'https://www.gov.br/anatel/pt-br/regulado/outorga/servico-movel-maritimo', ref: 'radio-28' },
              { txt: 'Anatel, Tutorial do módulo MMAR (junho/2026)', url: MMAR, ref: 'radio-29' },
              { txt: 'gov.br, Obter autorização para Serviço Limitado Móvel Aeronáutico ou Marítimo', url: 'https://www.gov.br/pt-br/servicos/obter-autorizacao-para-servico-limitado-movel-aeronautico-ou-maritimo', ref: 'radio-31' },
              { txt: 'NORMAM-211/DPC, art. 4.23.8', url: NORMAM, ref: 'radio-16' },
            ]),
          ],
        },
        {
          id: 'l3',
          titulo: 'Certificado de Operador Radiotelefonista (ORR e ORG)',
          minutos: 14,
          objetivos: [
            'Diferenciar o ORR do ORG e dizer qual convém a quem vai atravessar o oceano',
            'Descrever a prova: matérias, número de questões, mínimo e prazos',
            'Seguir as etapas de inscrição e preparar-se com o material da Anatel',
          ],
          blocos: [
            P('O <b>Certificado de Operador Radiotelefonista</b> prova que você sabe operar um rádio marítimo e conhece as regras. A prova é aplicada pela Anatel, <b>online</b>, e o certificado é <b>gratuito</b>.'),
            F('radio-01', 'No Brasil, a Anatel aplica, por convênio com a Marinha do Brasil, as provas para Operador Radiotelefonista nas categorias Geral e Restrito; as categorias de Radiotelegrafista ficam a cargo da Marinha.'),
            F('radio-02', 'Segundo a página da Anatel, o Certificado de Operador Radiotelefonista pode ser obtido por qualquer pessoa física maior de idade residente no Brasil, é gratuito, intransferível e tem validade indeterminada.'),
            H('Duas categorias'),
            F('radio-04', 'O Ato Anatel nº 3449, de 11/03/2026, define duas categorias: Operador de Rádio Geral (ORG) e Operador de Rádio Restrito (ORR); o ORR só pode operar estações no território, águas e espaço aéreo nacionais.'),
            P('Para quem vai <b>sair do país</b> (ou até a travessia do Atlântico), o ORR não serve, porque ele só vale em águas nacionais. O adequado é o <b>ORG</b> (inferência a partir do texto do Ato; confirme com a Anatel).'),
            F('radio-07', 'A ementa de Operação de rádio II (ORG) cobre a operação de todos os subsistemas e equipamentos do GMDSS, e a Legislação II inclui as regras da SOLAS aplicáveis ao rádio.'),
            H('A prova'),
            TAB(['Categoria', 'Matérias', 'Questões', 'Mínimo', 'Tempo'], [
              ['<b>ORR</b>', 'Operação de rádio I; Legislação de radiocomunicações I; Idioma', '10 por matéria', '5 por matéria', '30 min por matéria'],
              ['<b>ORG</b>', 'Idioma; Operação de rádio II; Legislação de radiocomunicações II', '10 por matéria', '5 por matéria', '30 min por matéria'],
            ], 'Ato Anatel nº 3449/2026. Ainda não está claro se o ORG também faz as matérias “I”.'),
            F('radio-06', 'Pelo Ato nº 3449/2026, a categoria ORR exige Operação de rádio I, Legislação de radiocomunicações I e Idioma; a categoria ORG exige Idioma, Operação de rádio II e Legislação de radiocomunicações II; cada matéria tem 10 questões, mínimo de 5 acertos e 30 minutos.'),
            F('radio-05', 'Pelo Ato nº 3449/2026, o certificado é expedido gratuitamente após aprovação em testes de questões objetivas do tipo “certo” ou “errado”.'),
            F('radio-08', 'Pelo Ato nº 3449/2026, aprovações em matérias valem por 12 meses, nova tentativa exige carência mínima de 8 dias, e a ausência sem justificativa impede nova inscrição por 30 dias.'),
            F('radio-11', 'A prova de Idioma do exame de radiotelefonista cobra apenas termos e frases náuticas básicas, com as traduções para inglês, espanhol e francês avaliadas em conjunto em cada questão.'),
            P('Em Idioma, uma questão traz uma frase em português e as traduções para inglês, espanhol e francês. As três estão <b>certas ou erradas juntas</b>: se uma só tiver erro, a questão é “errada”. Estude os termos náuticos básicos e as frases de rádio nos três idiomas.'),
            H('Como se inscrever'),
            L([
              'Entre no <b>Sistema SEC</b> da Anatel com a conta gov.br e registre a prova (gratuito).',
              'Esteja cadastrado como <b>usuário externo no SEI</b> da Anatel.',
              'No dia, faça a prova <b>online por videoconferência</b>: computador com navegador, câmera móvel, microfone e Microsoft Teams. <b>Fones de ouvido não são permitidos.</b>',
              'Estude pelo <b>Material de Apoio</b> da Anatel (versão 2026-03): legislação, operação, GMDSS, COSPAS-SARSAT, DSC e o SAR brasileiro.',
            ], true),
            F('radio-03', 'A inscrição para a prova de radiotelefonista é feita gratuitamente no Sistema SEC da Anatel, com login gov.br, e a Anatel aplica provas online conforme calendário publicado no SEC.'),
            F('radio-10', 'A prova online da Anatel para o CORTF exige computador com navegador, câmera móvel, microfone, Microsoft Teams instalado, cadastro prévio no SEI e inscrição no SEC; fones de ouvido não são permitidos.'),
            H('Isenção'),
            F('radio-09', 'O Ato nº 3449/2026 isenta de todos os testes quem comprova certos cursos da Marinha, entre eles o Curso Especial de Radioperador Geral (EROG) emitido pela Capitania dos Portos.'),
            C('nota', 'O CROG não está na lista', 'O CROG (Curso de Radioperador em GMDSS, de 88 horas, da DPC) não aparece na lista de isenções do Ato 3449. Não encontramos se o EROG ainda é oferecido nem se aceita amador: pergunte à Capitania.'),
            H('Como estudar com este curso'),
            TAB(['Assunto da prova', 'Onde estudar neste curso'], [
              ['VHF, canais, escuta e procedimentos', 'Módulo 1'],
              ['MAYDAY, PAN-PAN, SÉCURITÉ, alfabeto fonético, UTC', 'Módulo 2'],
              ['GMDSS, HF, satélite, NAVTEX, SafetyNET', 'Módulo 3'],
              ['EPIRB, SART, COSPAS-SARSAT, SAR brasileiro', 'Módulo 5'],
              ['Idioma (inglês, espanhol, francês)', 'Frases de rádio e termos náuticos; Standard Marine Communication Phrases'],
            ]),
            W('alfabeto-fonetico', { modo: 'relogio', modos: ['tabela', 'relogio'], relogio: { segundos: 60 } }, 'Treino contra o relógio do alfabeto fonético, que cai na parte de operação de rádio.'),
            CHECK([
              Q('m4l3-q1', 'Rádio: licenças e certificados', 2, 'Segundo o Ato nº 3449/2026, o Operador de Rádio Restrito (ORR) pode operar estações:',
                ['Apenas no território, nas águas e no espaço aéreo nacionais.', 'Em qualquer lugar do mundo.', 'Somente no Mediterrâneo.', 'Apenas em terra.'], 0,
                'O ORR é a categoria que só vale dentro do espaço nacional. Quem pretende operar rádio em travessia internacional precisa do ORG. As outras alternativas exageram ou inventam a abrangência da categoria.',
                'Ato Anatel nº 3449/2026, Anexo (categorias de operadores)', ATO3449),
              Q('m4l3-q2', 'Rádio: licenças e certificados', 1, 'Quantas questões tem cada matéria da prova, e quantos acertos mínimos são exigidos?',
                ['10 questões por matéria, com mínimo de 5 acertos.', '40 questões, com mínimo de 20 acertos no total.', '20 questões por matéria, com mínimo de 18 acertos.', '5 questões por matéria, com 5 acertos.'], 0,
                'O Ato prevê 10 questões por matéria, mínimo de 5 acertos em cada uma e 30 minutos por matéria. Os formatos com 40 questões ou com mínimo no total não são os do Ato, que fixa o mínimo por matéria.',
                'Ato Anatel nº 3449/2026 (tabela de matérias)', ATO3449),
              Q('m4l3-q3', 'Rádio: licenças e certificados', 1, 'Como se inscreve no exame de radiotelefonista e quanto custa?',
                ['No Sistema SEC da Anatel, com a conta gov.br, e é gratuito.', 'Na Capitania, com taxa em GRU.', 'Por correspondência, com taxa de R$ 300.', 'Direto no consultório do examinador.'], 0,
                'A inscrição é feita no Sistema SEC, e o exame e o certificado são gratuitos. A GRU é a guia usada em taxas da Marinha para a CHA, e não para este exame.',
                'Anatel, Operador Radiotelefonista; Ato nº 3449/2026', 'https://www.gov.br/anatel/pt-br/regulado/outorga/radioamador-e-radio-cidadao/operador-radiotelefonista'),
            ]),
            FONTES([
              { txt: 'Anatel, Operador Radiotelefonista (página do serviço)', url: 'https://www.gov.br/anatel/pt-br/regulado/outorga/radioamador-e-radio-cidadao/operador-radiotelefonista', ref: 'radio-01' },
              { txt: 'Anatel, Ato nº 3449, de 11/03/2026 (requisitos operacionais para emissão do Certificado de Operador Radiotelefonista)', url: ATO3449, ref: 'radio-04' },
              { txt: 'Anatel, Material de apoio ao exame de Radiotelefonista (versão 2026-03)', url: ANATEL, ref: 'radio-11' },
              { txt: 'Anatel, Manual do Candidato (2026-04.1)', url: 'https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/0a5f21136202dc8e4135caab170cfb45', ref: 'radio-10' },
            ]),
          ],
        },
        {
          id: 'l4',
          titulo: 'MMSI e indicativo de chamada: como obter e programar',
          minutos: 10,
          objetivos: [
            'Dizer quando o MMSI é exigido e em que etapa do licenciamento ele aparece',
            'Programar o mesmo MMSI em todos os equipamentos que o usam',
            'Diferenciar MMSI de indicativo de chamada',
          ],
          blocos: [
            P('O barco tem <b>dois nomes de rádio</b>: o <b>indicativo de chamada</b> (letras e números; o exemplo “PP1234” é fictício) e o <b>MMSI</b> (nove dígitos). O primeiro é a identidade por voz; o segundo é a identidade nos equipamentos digitais (DSC, AIS, EPIRB).'),
            TERMOS(['mmsi', 'indicativo-de-chamada', 'dsc', 'epirb']),
            H('Indicativo de chamada'),
            F('radio-36', 'Pelo RGST, a estação do Serviço Limitado Móvel Marítimo recebe um indicativo de chamada quando é licenciada pela primeira vez.'),
            F('extra-radio-1-24', 'Os indicativos de chamada das estações dos diversos serviços no Brasil são formados nas séries PPA a PYZ e ZVA a ZZZ.'),
            P('Ou seja, o seu indicativo vem junto com a licença, e você o diz no início e no fim das comunicações. Um indicativo brasileiro começa com PP, PQ, PR, PS, PT, PU, PV, PW, PX, PY ou ZV, ZW, ZX, ZY, ZZ.'),
            H('MMSI'),
            F('radio-35', 'O RGST exige MMSI para as estações do SLMM que participam do GMDSS, e o MMSI deve ser programado em todos os equipamentos da estação que tenham essa função.'),
            F('radio-34', 'Segundo o tutorial MMAR, quando o sistema identifica que a embarcação precisa de MMSI, o pedido passa por uma etapa “UIT/GMDSS” com o número de MMSI, contato de emergência enviado à UIT e capacidade de pessoas a bordo.'),
            P('Nessa etapa o sistema pede o número do MMSI, um <b>contato de emergência</b> (que será enviado à UIT), a capacidade de pessoas a bordo e o número de botes salva-vidas. É por isso que o MMSI tem valor de segurança: quem coordena um salvamento vê seu nome, seu contato e o número de pessoas.'),
            F('extra-radio-1-26', 'Segundo o tutorial MMAR, na etapa UIT/GMDSS do pedido de licença de embarcação informam-se também a capacidade de pessoas a bordo e a quantidade de botes salva-vidas.'),
            C('aconfirmar', 'Quem gera o número?', 'O formulário tem um campo “Número de MMSI”, mas os documentos que consultamos não dizem se o número é gerado pela Anatel ou escolhido pelo requerente, nem se ele aparece na licença impressa. Peça confirmação à Anatel e anote o número que constar do sistema.'),
            FIG(svg('0 0 480 260', 'O mesmo MMSI programado em todos os equipamentos do barco: VHF com DSC, HF com DSC, EPIRB, AIS e licença da Anatel',
              caixa(160, 100, 160, 60, 'MMSI', '710 xxxxxx', 'mg') +
              caixa(10, 10, 140, 50, 'VHF com DSC', null) +
              caixa(330, 10, 140, 50, 'HF com DSC', null) +
              caixa(10, 200, 140, 50, 'EPIRB', null) +
              caixa(330, 200, 140, 50, 'AIS', null) +
              caixa(170, 200, 140, 50, 'Licença Anatel', null, 'sea') +
              '<line x1="150" y1="50" x2="190" y2="100" stroke="var(--ink)" stroke-width="2.2"/><line x1="330" y1="50" x2="290" y2="100" stroke="var(--ink)" stroke-width="2.2"/>' +
              '<line x1="100" y1="200" x2="170" y2="160" stroke="var(--ink)" stroke-width="2.2"/><line x1="400" y1="200" x2="310" y2="160" stroke="var(--ink)" stroke-width="2.2"/>' +
              '<line x1="240" y1="160" x2="240" y2="200" stroke="var(--magenta)" stroke-width="3"/>', 480),
              'O número tem de ser o mesmo em todo lugar. Se estiver diferente, o salvamento pode ligar o alerta a outro barco.'),
            F('radio-37', 'O código de identificação da EPIRB é o dígito 710 (Brasil) seguido de seis dígitos da estação, conforme o apêndice 43 do Regulamento Rádio da UIT, e esse código é o MMSI.'),
            F('radio-47', 'Segundo o BRMCC, a EPIRB de embarcação não SOLAS pode ser codificada com o MMSI ou com o número de série; o PLB usa número de série; normalmente a codificação é feita pelo fabricante ou revendedor.'),
            H('Programando o rádio'),
            L([
              '<b>VHF e HF com DSC</b>: entre no menu de configuração e digite o MMSI de nove dígitos. Muitos rádios aceitam a gravação só uma ou duas vezes: confira antes de confirmar.',
              '<b>AIS</b>: grave o MMSI do barco no transponder (a configuração é feita por quem instala).',
              '<b>EPIRB</b>: a codificação com o MMSI normalmente é feita pelo fabricante ou revendedor (módulo 5).',
              '<b>Portátil com DSC</b>: confira se pode usar o MMSI do barco ou se precisa de outro (pergunte à Anatel; a questão do MMSI do portátil não está confirmada).',
            ]),
            F('radio-38', 'A NORMAM-211 exige que toda EPIRB seja cadastrada no INFOSAR, serviço do DECEA, e que mudanças de propriedade, endereço e telefones sejam atualizadas nele.'),
            C('seguranca', 'Mudou de dono? Mude os dados', 'Se vender o barco, atualize os dados do MMSI na Anatel e o cadastro da EPIRB no INFOSAR logo que possível. Dados do antigo dono atrasam o salvamento, porque a busca liga para o contato errado.'),
            CHECK([
              Q('m4l4-q1', 'Rádio: licenças e certificados', 1, 'Que número identifica o Brasil no começo do MMSI de uma embarcação brasileira e da codificação da EPIRB?',
                ['710.', '666.', '100.', '406.'], 0,
                'O código do país, o MID, é 710 para o Brasil, seguido de seis dígitos da estação. O 406 é a frequência da EPIRB em MHz, não um código de país. Os outros números não identificam o Brasil.',
                'NORMAM-211/DPC, art. 4.23.6 d; RR, Apêndice 43', NORMAM),
              Q('m4l4-q2', 'Rádio: licenças e certificados', 2, 'Em quais equipamentos o MMSI deve ser programado, segundo o RGST?',
                ['Em todos os equipamentos da estação que tenham essa função (como VHF DSC, HF DSC e EPIRB).', 'Apenas no VHF fixo.', 'Somente na EPIRB.', 'Em nenhum: o MMSI é só um número da licença.'], 0,
                'O regulamento manda programar o MMSI em todos os equipamentos que usem a identificação. Se só um tiver o número, os outros alertas saem sem identificação ou com outra, o que atrapalha o salvamento.',
                'RGST (Res. Anatel 777/2025), art. 270', RGST),
              Q('m4l4-q3', 'Rádio: licenças e certificados', 2, 'Qual é a diferença entre indicativo de chamada e MMSI?',
                ['O indicativo é a identidade por voz (letras e números); o MMSI são nove dígitos usados nos equipamentos digitais.', 'São nomes diferentes do mesmo número.', 'O MMSI só vale para barcos grandes.', 'O indicativo é para o rádio HF e o MMSI para o VHF.'], 0,
                'O indicativo (como PP1234) é a identidade falada; o MMSI (nove dígitos, começando por 710 no Brasil) é a identidade digital do DSC, do AIS e da EPIRB. Não são o mesmo número nem se dividem por tipo de rádio.',
                'RGST, arts. 269 e 270; Anatel, material de apoio, item 2.2.6', RGST),
            ]),
            FONTES([
              { txt: 'Anatel, Resolução nº 777/2025 (RGST), arts. 269 e 270', url: RGST, ref: 'radio-35' },
              { txt: 'Anatel, Tutorial do módulo MMAR, passos 10 e 11', url: MMAR, ref: 'radio-34' },
              { txt: 'NORMAM-211/DPC, art. 4.23.6 d, e e f', url: NORMAM, ref: 'radio-37' },
              { txt: 'BRMCC, Codificação de balizas', url: 'https://www2.fab.mil.br/brmcc/index.php/codificacao', ref: 'radio-47' },
              { txt: 'Rec. UIT-R M.585 e Apêndice 43 do Regulamento de Radiocomunicações (estrutura do MMSI)', url: M585 },
            ]),
          ],
        },
        {
          id: 'l5',
          titulo: 'Equipamento homologado, inspeção naval e certificados internacionais',
          minutos: 12,
          objetivos: [
            'Explicar o que é equipamento homologado e como se trata o rádio comprado no exterior',
            'Saber o que a inspeção naval confere no rádio e na EPIRB',
            'Comparar o certificado brasileiro com o RYA SRC e o LRC',
          ],
          blocos: [
            H('Equipamento homologado'),
            F('normas-153', 'Os equipamentos de comunicações devem seguir as normas da Anatel (ou ser homologados no país de origem, se estrangeiros) e o Regulamento de Radiocomunicações do serviço móvel marítimo.'),
            F('radio-17', 'A NORMAM-211 exige que os equipamentos de comunicações sejam registrados no órgão federal competente e cumpram o Regulamento de Radiocomunicações do serviço móvel marítimo.'),
            L([
              '<b>Homologar</b> é a Anatel (ou a autoridade equivalente de outro país) conferir que o aparelho segue as regras técnicas: faixa de frequência, potência, emissões fora da faixa.',
              'O material de apoio da Anatel diz que, nas estações de radiocomunicações, só podem ser usados equipamentos <b>homologados, certificados ou registrados</b> na Anatel.',
              'Para o <b>rádio importado</b>, a NORMAM aceita equipamento estrangeiro homologado pela autoridade do país de origem. Guarde o certificado de conformidade e o número de homologação do país de origem.',
              'Desconfie de rádios “desbloqueados”, com faixa ampliada ou potência acima do permitido: eles saem do que foi homologado.',
            ]),
            C('dica', 'Conferência simples', 'Ao comprar, peça nota fiscal, modelo, número de série e o número de homologação. Fotografe a etiqueta do aparelho depois de instalado: ela vai ser pedida no licenciamento e na vistoria.'),
            H('Inspeção naval: o que olham no rádio'),
            F('radio-26', 'Na tabela de navegação oceânica da NORMAM-211, a EPIRB 406 MHz é obrigatória, e na inspeção naval se verificam o funcionamento, a validade das baterias e o registro atualizado no INFOSAR.'),
            P('A norma detalha o que se confere na EPIRB. Para o resto, o inspetor verifica se o equipamento da tabela está a bordo e funcionando; use a lista abaixo como roteiro da sua própria conferência.'),
            L([
              'Presença e <b>funcionamento</b> do VHF fixo (com DSC, quando for o caso) e do HF, se exigido.',
              'Antena de emergência, no caso de antena de VHF no tope do mastro.',
              '<b>EPIRB</b>: funciona (autoteste), bateria dentro da validade e <b>registro atualizado no INFOSAR</b>.',
              'Licença da estação e MMSI coerentes com o que está programado.',
            ]),
            FIG(svg('0 0 480 250', 'Lista de verificação do rádio e da baliza na inspeção naval: VHF, HF, antena de emergência, EPIRB com bateria e registro, licença e MMSI',
              caixa(10, 10, 220, 52, 'VHF e HF', 'funcionando') +
              caixa(250, 10, 220, 52, 'Antena de emergência', 'guardada') +
              caixa(10, 76, 220, 52, 'EPIRB', 'autoteste e bateria') +
              caixa(250, 76, 220, 52, 'Registro INFOSAR', 'atualizado', 'mg') +
              caixa(10, 142, 220, 52, 'Licença da estação', 'a bordo') +
              caixa(250, 142, 220, 52, 'MMSI', 'igual em todos') +
              t(240, 226, 'Confira tudo antes de agendar a inspeção', 16, 'middle', 'font-style="italic"'), 480),
              'Itens de rádio que costumam ser conferidos. Faça sua própria inspeção antes.'),
            H('Curso de radioperador GMDSS (CROG)'),
            F('radio-54', 'O CROG (Curso de Radioperador em GMDSS) da DPC tem 3 semanas e 88 horas e qualifica o aluno não aquaviário como Radioperador Geral pela Regra IV/2 da STCW.'),
            F('radio-59', 'A lista da DPC de instituições credenciadas (atualizada em 30/09/2026) traz CROG em Rio de Janeiro e Macaé; no Nordeste há CBSN e CBSP em Recife, Salvador, Aracaju e Fortaleza.'),
            P('O CROG é um curso profissional, para marítimos. Para a maioria dos amadores, o exame gratuito da Anatel (lição 3) é o caminho; o CROG só faz sentido se você quer também a qualificação STCW.'),
            { t: 'h', txt: 'Equivalentes internacionais: RYA SRC e LRC', intl: true },
            { t: 'p', intl: true, html: 'Se você vai alugar barcos no exterior ou cursar o RYA Yachtmaster, vai ouvir falar em <b>SRC</b> (<i>Short Range Certificate</i>, VHF e VHF/DSC) e <b>LRC</b> (<i>Long Range Certificate</i>, MF, HF e satélite).' },
            { t: 'fato', ref: 'radio-60', intl: true, html: 'O SRC do RYA é o certificado mínimo exigido por lei para operar VHF e VHF/DSC em embarcação de bandeira britânica.' },
            { t: 'fato', ref: 'radio-61', intl: true, html: 'O curso do SRC tem cerca de 10 horas mais o tempo de exame, pode ser feito online ou em sala (exame em sala), não exige experiência e tem idade mínima de 16 anos.' },
            { t: 'fato', ref: 'radio-62', intl: true, html: 'O exame SRC tem prova escrita e prática de VHF, é feito num RYA Recognised Training Centre e custa £76, pagos ao RYA, à parte do curso.' },
            { t: 'fato', ref: 'radio-64', intl: true, html: 'Segundo o RYA, o SRC segue o procedimento harmonizado da CEPT, mas a “Authority to Operate” britânica restringe a validade do certificado a embarcações do Reino Unido.' },
            { t: 'fato', ref: 'radio-66', intl: true, html: 'Segundo o RYA, o LRC é exigido quando a embarcação de recreio tem equipamento MF, HF e/ou satelital; SRC e LRC não são certificados STCW.' },
            { t: 'fato', ref: 'internacional-37', intl: true, html: 'Para o Yachtmaster Offshore são exigidos certificado de rádio compatível com o GMDSS (ex.: RYA SRC ou superior), certificado de primeiros socorros válido e documento de identidade com foto.' },
            { t: 'callout', intl: true, tipo: 'intl', titulo: 'SRC não substitui o certificado brasileiro', html: 'Para um barco de bandeira brasileira, a regra aponta para o certificado da Anatel: o próprio RYA diz que o SRC vale em barco britânico e que o MMSI e o indicativo são do país que os emite. Faça o SRC se precisa dele para um curso RYA ou um charter, mas não conte com ele para operar o rádio do seu barco.' },
            CHECK([
              Q('m4l5-q1', 'Rádio: licenças e certificados', 2, 'O que a NORMAM-211 pede de um equipamento de comunicação estrangeiro instalado em barco brasileiro?',
                ['Ser homologado pela autoridade competente do país de origem (e seguir o Regulamento de Radiocomunicações).', 'Nada: equipamento estrangeiro está dispensado.', 'Ser fabricado no Brasil.', 'Ter sido aprovado na Capitania.'], 0,
                'A norma aceita equipamento estrangeiro homologado pela autoridade do país de origem. Dispensa total não existe, a produção nacional não é exigida, e a aprovação do aparelho é técnica (Anatel ou autoridade de origem), e não da Capitania.',
                'NORMAM-211/DPC, art. 4.23.7', NORMAM),
              Q('m4l5-q2', 'Rádio: licenças e certificados', 1, 'Na inspeção naval, o que se verifica na EPIRB 406 MHz?',
                ['O funcionamento, a validade das baterias e o registro atualizado no INFOSAR.', 'Apenas a cor da baliza.', 'Só o certificado do fabricante.', 'Nada: a EPIRB não é inspecionada.'], 0,
                'A nota da tabela 4.35 manda observar o correto funcionamento, a validade das baterias e o registro atualizado no INFOSAR. Cor e certificado de fabricante não são os critérios.',
                'NORMAM-211/DPC, tabela 4.35, nota (*)', NORMAM),
              { id: 'radio1-m4l5-q3', nivel: 'radio', tema: 'Rádio: licenças e certificados', dificuldade: 2, intl: true,
                enunciado: 'Segundo o RYA, em que embarcações o certificado SRC é válido como autorização de operar o rádio?',
                alternativas: ['Embarcações de bandeira britânica.', 'Qualquer embarcação do mundo.', 'Somente em embarcações brasileiras.', 'Apenas em embarcações de comércio.'], correta: 0,
                explicacao: 'O RYA explica que o SRC segue o padrão harmonizado da CEPT, mas a Authority to Operate britânica restringe a validade a embarcações do Reino Unido. Por isso o SRC não vale, por si, em barco de bandeira brasileira ou em qualquer barco do mundo. E o SRC é feito justamente para embarcações de recreio, não só de comércio.',
                referencia: 'RYA, Licensing onboard electronics: Using the SRC abroad', fonte_url: 'https://www.rya.org.uk/regulations/licensing-onboard-electronics/' },
            ]),
            FONTES([
              { txt: 'NORMAM-211/DPC, arts. 4.23.3, 4.23.7 e tabela 4.35', url: NORMAM, ref: 'normas-153' },
              { txt: 'DPC, cursos de Ensino Complementar (offshore): CROG, CBSN, CBSP e CPSO', url: 'https://www.marinha.mil.br/dpc/offshore-cursos', ref: 'radio-54' },
              { txt: 'RYA, Marine Radio SRC course and exam', url: 'https://www.rya.org.uk/course-finder/marine-radio-src-course-and-exam/', ref: 'radio-60', intl: true },
              { txt: 'RYA, Licensing onboard electronics', url: 'https://www.rya.org.uk/regulations/licensing-onboard-electronics/', ref: 'radio-64', intl: true },
            ]),
          ],
        },
      ],
    },
{
      id: 'm5',
      titulo: 'EPIRB, PLB, SART e AIS-MOB',
      resumo: 'Os aparelhos que gritam por você quando não dá mais para falar: o que cada um faz e quem o escuta, como o sinal de 406 MHz vira resgate, como instalar, registrar no INFOSAR e testar a EPIRB, e onde levar PLB, AIS de homem ao mar e SART.',
      licoes: [
        {
          id: 'l1',
          titulo: 'Quatro aparelhos, quatro funções',
          minutos: 12,
          objetivos: [
            'Distinguir EPIRB, PLB, SART e AIS de homem ao mar pela função e por quem recebe o sinal',
            'Explicar por que a EPIRB transmite em 406 MHz',
            'Escolher o aparelho certo para cada situação: barco, colete e balsa',
          ],
          blocos: [
            P('No módulo anterior você viu como pedir socorro <b>falando</b>. Quando o barco afunda em segundos, o comandante está na água ou ninguém alcança o rádio, quem avisa são os <b>aparelhos de localização</b>. Eles parecem parecidos, mas servem para coisas diferentes, e saber a diferença faz parte da prova do Mestre e do Capitão.'),
            TERMOS(['epirb', 'plb', 'sart', 'ais-mob', 'cospas-sarsat']),
            FIG(svg('0 0 480 270', 'Quem escuta cada aparelho: a EPIRB e a PLB são ouvidas por satélites e chegam ao centro de salvamento; o SART é visto no radar dos navios; o AIS-SART e o AIS de homem ao mar aparecem no AIS e no plotter dos barcos por perto',
              defs('m5l1a', 'var(--magenta)') +
              caixa(8, 10, 180, 62, 'EPIRB e PLB', '406 MHz') +
              caixa(8, 104, 180, 62, 'SART', 'radar de 9 GHz') +
              caixa(8, 198, 180, 62, 'AIS-SART e AIS-MOB', 'rádio AIS') +
              caixa(270, 10, 202, 62, 'Satélites e centro', 'de salvamento', 'mg') +
              caixa(270, 104, 202, 62, 'Radar dos navios', 'e aeronaves') +
              caixa(270, 198, 202, 62, 'AIS e plotter', 'de barcos por perto') +
              '<line x1="188" y1="41" x2="270" y2="41" stroke="var(--magenta)" stroke-width="3" marker-end="url(#m5l1a)"/>' +
              '<line x1="188" y1="135" x2="270" y2="135" stroke="var(--magenta)" stroke-width="3" marker-end="url(#m5l1a)"/>' +
              '<line x1="188" y1="229" x2="270" y2="229" stroke="var(--magenta)" stroke-width="3" marker-end="url(#m5l1a)"/>', 480),
              'O alcance muda: a EPIRB e a PLB chegam ao mundo; o SART e o AIS chegam a quem está por perto, em linha de visada.'),
            H('EPIRB: a baliza do barco'),
            P('A <b>EPIRB</b> (<i>emergency position-indicating radio beacon</i>, radiobaliza indicadora de posição de emergência) é a baliza do <b>barco</b>. Fica presa a um suporte; ao se soltar na água ou ao ser acionada à mão, transmite um sinal de socorro em <b>406 MHz</b>, que satélites recebem e repassam ao centro de salvamento.'),
            F('normas-174', 'A EPIRB deve transmitir o sinal de socorro via satélite na faixa de 406 MHz.'),
            F('radio-39', 'Pela NORMAM-211, a EPIRB deve transmitir em 406 MHz via satélite, e o sistema COSPAS-SARSAT não processa mais 121,5 MHz desde fevereiro de 2009.'),
            P('Atenção: balizas antigas de <b>121,5 MHz</b> não são mais ouvidas pelos satélites. Se você comprou um barco usado com uma baliza antiga, troque-a.'),
            H('PLB: a baliza da pessoa'),
            P('A <b>PLB</b> (<i>personal locator beacon</i>) é a versão pessoal: menor, ativada à mão, presa ao colete. Funciona como a EPIRB (406 MHz, satélites, centro de salvamento), mas transmite por menos tempo e é ligada à <b>pessoa</b> e não ao barco.'),
            F('radio-43', 'O Cospas-Sarsat usa três tipos de baliza: ELT (aviação), EPIRB (marítima) e PLB (uso pessoal), todos registráveis no INFOSAR.'),
            H('SART: o transponder de radar'),
            P('O <b>SART</b> (<i>search and rescue radar transponder</i>) é levado para a <b>balsa</b> ou para a água. Ele só responde quando um radar de 9 GHz (banda X, a dos radares marítimos) o ilumina; a resposta aparece na tela do radar da unidade de busca como uma <b>linha de 12 pontos</b> que aponta para o SART.'),
            F('extra-radio-1-20', 'O material de apoio da Anatel descreve o SART como dispositivo que responde quando iluminado por um radar de 9 GHz (banda X) e faz aparecer marcações na tela do radar da unidade de busca.'),
            H('AIS-SART e AIS de homem ao mar'),
            P('O <b>AIS-SART</b> é a versão do SART que transmite pelo <b>AIS</b> (o sistema de identificação automática, em VHF): a posição dele aparece no plotter e no AIS dos navios por perto. O <b>AIS de homem ao mar</b> (AIS-MOB) é um pequeno transmissor pessoal que dispara quando o colete infla ou à mão, e mostra o náufrago no AIS e no plotter do próprio barco e dos barcos vizinhos.'),
            F('extra-radio-1-21', 'O material de apoio da Anatel diz que o AIS-SART transmite sua posição pelo AIS e aparece diretamente nas telas de AIS e ECDIS dos navios próximos.'),
            TAB(['Aparelho', 'Quem recebe', 'Sinal', 'Onde fica', 'MMSI/ID'], [
              ['<b>EPIRB</b>', 'Satélites e centro de salvamento', '406 MHz', 'No barco, em suporte com liberação automática', 'Código 710 + 6 dígitos (MMSI) ou número de série'],
              ['<b>PLB</b>', 'Satélites e centro de salvamento', '406 MHz', 'No colete ou na bolsa de abandono', 'Número de série'],
              ['<b>SART</b> (radar)', 'Radar de 9 GHz de navios e aeronaves', 'Resposta ao radar', 'Na balsa ou na bolsa de abandono', 'Não tem'],
              ['<b>AIS-SART</b>', 'AIS dos navios próximos', 'AIS (VHF)', 'Na balsa ou na bolsa de abandono', '970 + 6 dígitos'],
              ['<b>AIS-MOB</b>', 'AIS e plotter dos barcos próximos', 'AIS (VHF) e, em alguns, DSC', 'No colete de cada tripulante', '972 + 6 dígitos'],
            ], 'Os prefixos 970 e 972 de MMSI são da Rec. UIT-R M.585 (AIS-SART e dispositivos de homem ao mar); o 974 é de EPIRB com transmissor AIS.'),
            F('tecnico-88', 'O Anexo IV do RIPEAM também define como sinais de perigo os sinais de radiobalizas indicadoras de posição (EPIRB) e os de sistemas aprovados de radiocomunicação, incluindo respondedores radar de embarcações de sobrevivência (SART).'),
            C('nota', 'Quem escuta quem', 'A EPIRB e a PLB avisam o <b>mundo</b> (a longa distância); o SART e o AIS avisam quem está <b>por perto</b> (no horizonte). Por isso são complementares: uma pessoa na água com PLB pede o salvamento; o AIS-MOB avisa o seu barco (e os próximos) onde ela está agora.'),
            CHECK([
              Q('m5l1-q1', 'Rádio: EPIRB, PLB, SART e AIS', 1, 'Em que frequência as EPIRBs atuais transmitem o sinal que os satélites do Cospas-Sarsat processam?',
                ['406 MHz.', '121,5 MHz.', '156,8 MHz.', '518 kHz.'], 0,
                'A NORMAM-211 e o Cospas-Sarsat usam 406 MHz. A faixa de 121,5 MHz deixou de ser processada em fevereiro de 2009 (hoje só serve como sinal de aproximação para as equipes de resgate). 156,8 MHz é o canal 16 do VHF e 518 kHz é o NAVTEX.',
                'NORMAM-211/DPC, art. 4.23.6 c', NORMAM),
              Q('m5l1-q2', 'Rádio: EPIRB, PLB, SART e AIS', 2, 'Qual aparelho aparece na tela do radar de um navio como uma linha de 12 pontos?',
                ['O SART (transponder de radar de 9 GHz).', 'A EPIRB.', 'A PLB.', 'O VHF portátil.'], 0,
                'O SART responde ao pulso do radar de 9 GHz e desenha uma linha de 12 pontos que aponta para ele. A EPIRB e a PLB são vistas por satélite, não pelo radar; o VHF portátil é um rádio de voz.',
                'Anatel, material de apoio, item 2.2.8; IMO A.802(19)', ANATEL),
              Q('m5l1-q3', 'Rádio: EPIRB, PLB, SART e AIS', 2, 'Um tripulante cai à noite, longe da costa, usando um AIS de homem ao mar e uma PLB. O que cada aparelho faz?',
                ['O AIS-MOB mostra a posição aos barcos por perto; a PLB manda o alerta por satélite ao centro de salvamento.', 'O AIS-MOB avisa o satélite; a PLB aparece no radar.', 'Os dois só funcionam se o barco estiver ligado ao INFOSAR.', 'Os dois avisam apenas o barco de onde ele caiu.'], 0,
                'O AIS-MOB transmite em VHF/AIS para o seu barco e para os vizinhos; a PLB transmite em 406 MHz para os satélites. Trocar as funções ou dizer que ambos dependem do barco está errado. O registro no INFOSAR ajuda a identificar o dono, mas não liga o aparelho.',
                'Rec. UIT-R M.585; NORMAM-211, art. 4.23.6; radio-43', M585),
            ]),
            FONTES([
              { txt: 'NORMAM-211/DPC, art. 4.23.6 (EPIRB)', url: NORMAM, ref: 'normas-174' },
              { txt: 'Anatel, material de apoio ao exame de Radiotelefonista (2026-03), item 2.2.8 (dispositivos de localização)', url: ANATEL, ref: 'extra-radio-1-20' },
              { txt: 'Cospas-Sarsat (tipos de baliza e especificações)', url: COSPAS, ref: 'radio-43' },
              { txt: 'UIT-R M.585 (prefixos de MMSI: 970, 972 e 974)', url: M585 },
              { txt: 'RIPEAM (COLREG-72), Anexo IV (sinais de perigo)', url: RIPEAM, ref: 'tecnico-88' },
            ]),
          ],
        },
        {
          id: 'l2',
          titulo: 'Do sinal ao resgate: Cospas-Sarsat, BRMCC e Salvamar',
          minutos: 12,
          objetivos: [
            'Descrever o caminho do sinal da EPIRB até o resgate',
            'Explicar por que a posição pode chegar na hora ou demorar, conforme a baliza',
            'Conhecer o papel do BRMCC e do Salvamar e o telefone 185',
          ],
          blocos: [
            P('Quando uma EPIRB é ativada, acontece uma sequência rápida e silenciosa. Conhecê-la ajuda a entender o que é preciso <b>ter registrado</b> para o resgate funcionar bem.'),
            FIG(svg('0 0 480 360', 'Caminho do alerta de uma EPIRB: a baliza transmite em 406 MHz, o satélite recebe, a estação terrena repassa ao centro de controle de missão, que aciona o centro de coordenação de salvamento e o resgate',
              defs('m5l2a') +
              caixa(80, 6, 320, 44, '1. EPIRB transmite em 406 MHz', 'pulso curto, código único') +
              caixa(80, 66, 320, 44, '2. Satélites Cospas-Sarsat', 'recebem e repassam') +
              caixa(80, 126, 320, 44, '3. Estação terrena (LUT)', 'calcula e envia o alerta') +
              caixa(80, 186, 320, 44, '4. Centro de missão (BRMCC)', 'identifica o dono pelo registro', 'mg') +
              caixa(80, 246, 320, 44, '5. SALVAMAR (centro de salvamento)', 'coordena a busca') +
              caixa(80, 306, 320, 44, '6. Resgate', 'navios, aeronaves, equipes') +
              '<line x1="240" y1="50" x2="240" y2="66" stroke="var(--ink)" stroke-width="2.2" marker-end="url(#m5l2a)"/>' +
              '<line x1="240" y1="110" x2="240" y2="126" stroke="var(--ink)" stroke-width="2.2" marker-end="url(#m5l2a)"/>' +
              '<line x1="240" y1="170" x2="240" y2="186" stroke="var(--ink)" stroke-width="2.2" marker-end="url(#m5l2a)"/>' +
              '<line x1="240" y1="230" x2="240" y2="246" stroke="var(--ink)" stroke-width="2.2" marker-end="url(#m5l2a)"/>' +
              '<line x1="240" y1="290" x2="240" y2="306" stroke="var(--ink)" stroke-width="2.2" marker-end="url(#m5l2a)"/>', 480),
              'O caminho pode levar de poucos minutos a algumas horas, conforme a baliza tenha GPS e os satélites que passem sobre ela.'),
            F('extra-radio-1-22', 'Pelo material de apoio da Anatel, os satélites do COSPAS-SARSAT detectam o sinal da EPIRB e o retransmitem a estações terrenas (LUT), que enviam a informação aos Centros de Coordenação de Salvamento (RCC/MRCC); satélites de órbita polar dão cobertura global com tempo de detecção que depende da passagem, e os geoestacionários detectam quase instantaneamente (para EPIRBs compatíveis, geralmente com GPS).'),
            F('radio-42', 'O alerta de uma baliza 406 MHz é recebido pelo Centro Brasileiro de Controle de Missão (BRMCC), que aciona as redes SALVAERO e SALVAMAR.'),
            H('Posição: com GPS é rápido'),
            L([
              '<b>Baliza com GPS</b>: o pulso já leva a posição calculada pela baliza. Os satélites geoestacionários e os de órbita média veem o sinal quase na hora, e a posição vai junto.',
              '<b>Baliza sem GPS</b>: a posição é calculada pelo <i>efeito Doppler</i> do sinal captado por satélites de órbita baixa, que passam sobre a baliza a cada tempo. A localização demora mais (depende da passagem) e é menos precisa, de alguns quilômetros. Os satélites de órbita média também estimam a posição sem GPS (por diferença de tempo e de frequência), mas a posição do GPS continua sendo a mais exata.',
              'Nos dois casos, a baliza também emite um sinal fraco em <b>121,5 MHz</b>, que ajuda as equipes de resgate a se aproximar no último trecho. Os satélites não o processam.',
            ]),
            C('dica', 'Compre com GPS', 'Hoje as EPIRBs com GPS interno são a norma do mercado, e as regras de regata mais novas passam a exigi-lo (veja a seção internacional abaixo). Elas encurtam o tempo entre o alerta e o resgate.'),
            H('O que é o BRMCC e o Salvamar'),
            F('radio-49', 'SALVAMAR é o Serviço de Busca e Salvamento da Marinha, atribuição dada pela Lei nº 7.273/1984.'),
            F('radio-48', 'O SALVAMAR atende 24 horas pedidos de socorro vindos do mar pelos sistemas de comunicações e pelo telefone 185.'),
            P('O <b>BRMCC</b> é o centro que recebe os alertas de balizas 406 MHz no Brasil e repassa à rede da Marinha (SALVAMAR, para o mar) ou da Aeronáutica (SALVAERO, para o ar). O <b>SALVAMAR</b> coordena a busca no mar, com navios, aeronaves e apoio de outros órgãos. Em caso de socorro sem rádio (por exemplo, se você está em terra e vê um barco em apuros), o telefone é o <b>185</b>.'),
            F('travessia-106', 'O SALVAMAR é alertado pelo telefone 185 (ou telefones das OM da Marinha), pelo GMDSS, por alertas de navios SOLAS e pela RENEC (Embratel, VHF e HF).'),
            H('Baliza não registrada também dispara'),
            F('radio-45', 'Um alerta de baliza 406 MHz não registrada no INFOSAR também é recebido pelo BRMCC e tratado como emergência.'),
            P('Mas o resgate fica pior: sem registro, quem coordena não sabe de quem é o barco, nem quantas pessoas estão a bordo, nem a quem ligar para conferir. É a diferença entre confirmar e buscar às cegas (veja a lição 4).'),
            C('seguranca', 'Mantenha a baliza ativada', 'Depois de ativar a EPIRB, <b>deixe-a ligada</b> até ser resgatado, com a antena para cima e livre. Se tiver de abandonar o barco, leve-a com você e prenda-a à balsa (ou a você) pelo cordão dela, para que não se solte e flutue livre. Desligar para economizar bateria é um erro: o resgate depende do sinal contínuo.'),
            { t: 'callout', intl: true, tipo: 'intl', titulo: 'Regras de regata e rallies', html: 'A edição 2026-2027 das Offshore Special Regulations (World Sailing) exige, a partir da Versão 2 (1º/01/2027), GNSS interno em toda EPIRB 406 MHz das categorias 0, 1 e 2 e, para balizas registradas após 2026, capacidade de transmitir AIS. Os rallies da WCC pedem EPIRB flutuante, de ativação na água e manual, registrada na autoridade do país do código.' },
            { t: 'fato', ref: 'travessia-04', intl: true, html: 'Na Versão 2 das OSR (vigente a partir de 01/01/2027), a regra 4.19.3 passa a exigir GNSS interno em toda EPIRB 406 MHz (Cat. 0, 1 e 2) e capacidade de transmitir AIS se registrada após 2026.' },
            { t: 'fato', ref: 'travessia-24', intl: true, html: 'Toda EPIRB deve ser registrada na autoridade do país correspondente ao código no Hex ID; o registro direto no IBRD Cospas-Sarsat só vale se o país não oferecer registro e permitir o IBRD.' },
            CHECK([
              Q('m5l2-q1', 'Rádio: EPIRB, PLB, SART e AIS', 2, 'Qual é a ordem correta do alerta de uma EPIRB, do aparelho ao resgate?',
                ['EPIRB, satélite, estação terrena, centro de missão (BRMCC), SALVAMAR, resgate.', 'EPIRB, estação costeira de VHF, Capitania, resgate.', 'EPIRB, SALVAMAR, satélite, resgate.', 'EPIRB, rádio do navio mais próximo, resgate.'], 0,
                'O sinal vai ao satélite, que o repassa à estação terrena (LUT); esta manda ao centro de controle de missão (BRMCC), que aciona o SALVAMAR para coordenar o resgate. A EPIRB não usa o VHF, e o SALVAMAR não vem antes do satélite.',
                'Anatel, material de apoio, item 2.2.5; INFOSAR (BRMCC)', ANATEL),
              Q('m5l2-q2', 'Rádio: EPIRB, PLB, SART e AIS', 2, 'Por que uma EPIRB com GPS interno agiliza o resgate?',
                ['Porque o pulso já leva a posição calculada, sem esperar a passagem de satélites de órbita baixa.', 'Porque ela transmite com potência 10 vezes maior.', 'Porque dispensa o registro no INFOSAR.', 'Porque não precisa de bateria.'], 0,
                'A posição vai dentro do alerta e é detectada na hora por satélites geoestacionários ou de órbita média. Sem GPS, a posição precisa ser calculada pelos satélites (Doppler em órbita baixa, diferença de tempo e de frequência em órbita média), o que é mais lento e menos preciso. O GPS não aumenta a potência, não dispensa registro e a baliza continua dependendo de bateria.',
                'Anatel, material de apoio, item 2.2.5; Cospas-Sarsat', COSPAS),
              Q('m5l2-q3', 'Rádio: EPIRB, PLB, SART e AIS', 1, 'Qual é o telefone do SALVAMAR, o Serviço de Busca e Salvamento da Marinha?',
                ['185.', '190.', '192.', '193.'], 0,
                'O SALVAMAR atende 24 horas pelo 185. O 190 é a Polícia Militar, o 192 é o SAMU e o 193 é o Corpo de Bombeiros, que não tratam de salvamento marítimo.',
                'Marinha do Brasil, Capitanias (SALVAMAR, telefone 185)', 'https://www.marinha.mil.br/cpm/185'),
            ]),
            FONTES([
              { txt: 'Anatel, material de apoio ao exame de Radiotelefonista (2026-03), itens 2.2.5 e 2.2.11', url: ANATEL, ref: 'extra-radio-1-22' },
              { txt: 'INFOSAR (DECEA), bloco “Emergência” e Central de Ajuda', url: INFOSAR, ref: 'radio-42' },
              { txt: 'Marinha do Brasil, SALVAMAR (telefone 185)', url: 'https://www.marinha.mil.br/cpm/185', ref: 'radio-48' },
              { txt: 'Cospas-Sarsat, descrição do sistema (LEOSAR, GEOSAR e MEOSAR)', url: COSPAS },
            ]),
          ],
        },
        {
          id: 'l3',
          titulo: 'A EPIRB no seu barco: tipo, instalação e manutenção',
          minutos: 12,
          objetivos: [
            'Citar as exigências da NORMAM-211 para a EPIRB',
            'Instalar a baliza onde o desprendimento automático funciona',
            'Planejar os testes e as trocas de bateria e do dispositivo de liberação',
          ],
          blocos: [
            P('A EPIRB é obrigatória na dotação oceânica de um veleiro de médio porte. Ter uma não basta: ela precisa ser do <b>tipo certo</b>, estar no <b>lugar certo</b> e com <b>tudo em dia</b>.'),
            F('radio-26', 'Na tabela de navegação oceânica da NORMAM-211, a EPIRB 406 MHz é obrigatória, e na inspeção naval se verificam o funcionamento, a validade das baterias e o registro atualizado no INFOSAR.'),
            F('extra-mestre-3-04', 'Na tabela de equipamentos para navegação costeira, a EPIRB 406 MHz é dispensada para embarcações de médio porte e obrigatória para as de grande porte ou iates.'),
            H('Exigências técnicas da NORMAM-211'),
            F('radio-40', 'Pela NORMAM-211, a EPIRB deve ser de tipo aprovado (lista em www.cospas-sarsat.org), ter liberação, flutuação e ativação automáticas em naufrágio e ativação manual.'),
            F('extra-radio-1-03', 'Pela NORMAM-211, toda EPIRB deve ser instalada a bordo em local de fácil acesso.'),
            F('extra-radio-1-04', 'Pela NORMAM-211, a EPIRB deve ter dimensões e peso que permitam a uma única pessoa levá-la até a embarcação de sobrevivência, com liberação, flutuação e ativação automáticas em naufrágio, e também dispositivo de ativação manual no local ou remotamente, a partir da estação de manobra.'),
            F('normas-175', 'A EPIRB deve ter código único que começa pelo dígito 710 (Brasil), seguido de seis dígitos da estação (MMSI).'),
            C('nota', 'EPIRB: o que o Anexo 4-B diz', 'No texto vigente da NORMAM-211 (PDF consolidado, Rev. 1), o Anexo 4-B (“Recomendações ao Navegante”), item 4.5, diz “É obrigatório” a EPIRB-406 MHz para embarcações que se dirijam a portos estrangeiros ou se afastem sistematicamente a mais de 100 milhas náuticas da costa. A dotação por porte e área de navegação está no Cap. 4 (art. 4.24.1 a, IV, e art. 4.24.2 a, III). Se você baixar o arquivo editável dos anexos no site da DPC (ZIP), ele ainda traz a redação antiga, “recomendável”: esse arquivo está desatualizado, vale o PDF.'),
            F('extra-capitao-3-16', 'Na NORMAM-211 em vigor (Rev. 1, Portaria DPC/DGN/MB nº 200, de 27/02/2026), o item 4.5 do Anexo 4-B diz que é obrigatório que as embarcações que se dirijam a portos estrangeiros, ou que se afastem sistematicamente a mais de 100 milhas náuticas da costa, tenham EPIRB 406 MHz. A dotação de EPIRB por porte e área está no Cap. 4 (art. 4.24.1 a, IV, e art. 4.24.2 a, III). O arquivo editável de anexos da DPC (.odt, no ZIP) está desatualizado e ainda traz “recomendável”.'),
            H('Onde instalar'),
            FIG(svg('0 0 480 270', 'Comparação de instalação: certo, EPIRB em suporte no balcão da popa, com céu livre acima; errado, EPIRB dentro de um paiol fechado ou sob o toldo',
              '<rect x="8" y="8" width="224" height="254" rx="10" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2"/>' +
              '<rect x="248" y="8" width="224" height="254" rx="10" fill="var(--land)" stroke="var(--ink)" stroke-width="2"/>' +
              t(120, 38, 'Certo', 20, 'middle', 'font-weight="700"') + t(360, 38, 'Errado', 20, 'middle', 'font-weight="700" fill="var(--magenta)"') +
              '<rect x="50" y="170" width="140" height="70" fill="var(--sea-2, var(--sea-1))" stroke="var(--ink)" stroke-width="2"/>' +
              '<rect x="108" y="124" width="26" height="46" rx="5" fill="var(--magenta)" stroke="var(--ink)" stroke-width="2"/>' +
              '<line x1="121" y1="118" x2="121" y2="62" stroke="var(--magenta)" stroke-width="3" stroke-dasharray="6 5"/><path d="M110,70 L121,54 L132,70" fill="none" stroke="var(--magenta)" stroke-width="3"/>' +
              t(120, 262, 'suporte no balcão, céu livre', 15) +
              '<rect x="290" y="64" width="140" height="22" fill="var(--sea-2, var(--sea-1))" stroke="var(--ink)" stroke-width="2"/>' +
              t(360, 80, 'toldo ou bimini', 14) +
              '<rect x="290" y="170" width="140" height="70" fill="var(--sea-2, var(--sea-1))" stroke="var(--ink)" stroke-width="2"/>' +
              '<rect x="340" y="190" width="26" height="46" rx="5" fill="var(--magenta)" stroke="var(--ink)" stroke-width="2"/>' +
              '<rect x="290" y="150" width="140" height="20" fill="var(--sea-2, var(--sea-1))" stroke="var(--ink)" stroke-width="2"/>' +
              t(360, 164, 'tampa fechada', 14) +
              t(360, 262, 'dentro do paiol, sob o toldo', 15), 480),
              'A baliza solta-se sozinha quando o barco afunda e precisa subir livre: não pode ficar presa sob toldo, retranca ou cabos, nem trancada em um paiol.'),
            L([
              '<b>Perto da saída</b>, no cockpit ou na entrada do salão, de forma que alguém a pegue em segundos e a leve para a balsa.',
              '<b>Com o dispositivo de liberação hidrostática</b> (HRU) livre: acima dele não pode haver toldo, retranca, cabo nem antena que prenda a baliza na hora de subir.',
              '<b>Longe de fonte de calor</b> (escapamento) e de produtos químicos.',
              '<b>Etiqueta visível</b>: com a data de validade da bateria e do HRU.',
              '<b>Sem lacre quebrado</b>: se o lacre de ativação manual estiver rompido, verifique antes de sair.',
            ]),
            H('Manutenção e testes'),
            TAB(['O quê', 'Quando', 'Como'], [
              ['Autoteste', 'Em geral uma vez por mês (confira o manual)', 'Botão de teste da baliza: ela faz uma sequência de verificação e não manda alerta de socorro. Anote o resultado'],
              ['Bateria da baliza', 'Antes da data de validade da etiqueta (em geral de 5 a 10 anos, conforme o modelo)', 'Troca por oficina autorizada; mantenha o comprovante'],
              ['Liberação hidrostática (HRU)', 'Antes do vencimento (normalmente a cada 2 anos)', 'Troque o HRU e confira a posição do suporte'],
              ['Registro', 'Sempre que mudar algo', 'Veja a lição 4 (INFOSAR)'],
              ['Inspeção visual', 'Antes de cada travessia', 'Carcaça sem rachaduras, antena inteira, lacres e cordão em ordem'],
            ], 'Intervalos típicos de fabricantes; o manual do seu modelo manda. A NORMAM-211 exige funcionamento, bateria dentro da validade e registro atualizado na inspeção naval.'),
            C('seguranca', 'Nunca teste ativando de verdade', 'Ativar a EPIRB de verdade, mesmo por brincadeira, dispara uma operação de busca e salvamento. Use só a função de teste. Se ativar por engano, desligue e avise o Salvamar (185) na hora, dizendo o código e que foi alarme falso.'),
            CHECK([
              Q('m5l3-q1', 'Rádio: EPIRB, PLB, SART e AIS', 2, 'Quais capacidades a NORMAM-211 exige da EPIRB?',
                ['Ser de tipo aprovado, com liberação, flutuação e ativação automáticas em naufrágio e também ativação manual.', 'Apenas ativação manual.', 'Apenas flutuar, sem transmitir.', 'Funcionar em 121,5 MHz, para ser ouvida por aviões.'], 0,
                'A norma pede tipo aprovado (lista do Cospas-Sarsat), liberação, flutuação e ativação automáticas e dispositivo de ativação manual. Só manual não atende, flutuar sem transmitir não serve e 121,5 MHz não é mais processada pelos satélites.',
                'NORMAM-211/DPC, art. 4.23.6 a, b, c', NORMAM),
              Q('m5l3-q2', 'Rádio: EPIRB, PLB, SART e AIS', 1, 'Qual é o local correto para instalar uma EPIRB com liberação automática?',
                ['Em suporte de fácil acesso, perto da saída, com o caminho para cima livre de toldos, cabos e retranca.', 'Dentro de um paiol trancado, protegida das intempéries.', 'Sob o toldo do cockpit, para não molhar.', 'Dentro da cabine, enrolada num cobertor.'], 0,
                'A norma pede local de fácil acesso, e a baliza precisa soltar-se e subir à superfície quando o barco afunda. Paiol trancado, toldo e cabine fechada a prendem. Cobertor também a isola e abafa a antena.',
                'NORMAM-211/DPC, art. 4.23.6 a I e II', NORMAM),
              Q('m5l3-q3', 'Rádio: EPIRB, PLB, SART e AIS', 2, 'O que se confere na EPIRB na inspeção naval de uma embarcação oceânica?',
                ['O funcionamento, a validade das baterias e o registro atualizado no INFOSAR.', 'Só a cor.', 'O preço de compra.', 'Se ela foi testada ativando de verdade.'], 0,
                'A nota da tabela 4.35 manda observar o correto funcionamento, a validade das baterias e o registro atualizado no INFOSAR. Cor e preço não importam, e a ativação real nunca é teste.',
                'NORMAM-211/DPC, tabela 4.35, nota (*)', NORMAM),
            ]),
            FONTES([
              { txt: 'NORMAM-211/DPC, art. 4.23.6 (EPIRB) e tabelas 4.34 e 4.35', url: NORMAM, ref: 'radio-26' },
              { txt: 'NORMAM-211/DPC (Rev. 1), Anexo 4-B, item 4.5 (EPIRB obrigatória em viagem a porto estrangeiro ou a mais de 100 milhas da costa); art. 4.24.1 a, IV, e 4.24.2 a, III', url: NORMAM, ref: 'extra-capitao-3-16' },
              { txt: 'Cospas-Sarsat, especificação das radiobalizas de 406 MHz (C/S T.001) e lista de balizas aprovadas', url: COSPAS },
            ]),
          ],
        },
        {
          id: 'l4',
          titulo: 'Cadastro no INFOSAR, codificação e alarme falso',
          minutos: 10,
          objetivos: [
            'Cadastrar uma baliza 406 MHz no INFOSAR e manter os dados atualizados',
            'Explicar a codificação da EPIRB e da PLB',
            'Agir corretamente diante de uma ativação acidental',
          ],
          blocos: [
            P('A baliza que ninguém sabe de quem é atrapalha o salvamento. O registro liga o <b>código da baliza</b> a um <b>barco</b> e a <b>pessoas</b> com telefone. É obrigatório e, na inspeção naval, é conferido.'),
            TERMOS(['infosar', 'epirb', 'plb', 'mmsi']),
            H('INFOSAR'),
            F('radio-38', 'A NORMAM-211 exige que toda EPIRB seja cadastrada no INFOSAR, serviço do DECEA, e que mudanças de propriedade, endereço e telefones sejam atualizadas nele.'),
            F('radio-41', 'O INFOSAR (DECEA) é a plataforma de registro de balizas 406 MHz e dispositivos SEND, com acesso pela conta gov.br; a página de busca e salvamento do DECEA o apresenta como “Registro ELT/EPIRB/PLB”.'),
            F('radio-46', 'Para cadastrar uma baliza 406 MHz no INFOSAR informa-se o código hexadecimal da baliza, e o sistema identifica o tipo automaticamente.'),
            H('Passo a passo'),
            L([
              'Descubra o <b>código hexadecimal</b> da baliza (um código de 15 caracteres impresso na etiqueta).',
              'Entre no <b>INFOSAR</b> (infosar.decea.mil.br) com a conta gov.br.',
              'Informe o código hexadecimal: o sistema identifica o tipo de baliza.',
              'Preencha os dados do proprietário e da embarcação, e os telefones de contato (de preferência dois, de pessoas que atendam).',
              'Guarde o comprovante do cadastro (e imprima uma cópia para o barco).',
            ], true),
            C('aconfirmar', 'Validade do registro', 'A Central de Ajuda do DECEA (atualizada em julho de 2026) diz que o registro vale 2 anos e deve ser renovado a cada 2 anos, recebendo novo código; um artigo mais antigo da mesma central diz que não expira. Siga o mais recente e confirme no INFOSAR a data de vencimento do seu cadastro.'),
            F('radio-44', 'Segundo a Central de Ajuda do DECEA (atualizada em julho de 2026), o registro INFOSAR vale 2 anos e deve ser renovado a cada 2 anos, recebendo novo código.'),
            H('O que o código faz'),
            P('Cada baliza tem um código hexadecimal único. Esse código identifica a baliza para os satélites. A <b>codificação</b> é o que liga o código a um país e a um barco ou pessoa.'),
            F('radio-37', 'O código de identificação da EPIRB é o dígito 710 (Brasil) seguido de seis dígitos da estação, conforme o apêndice 43 do Regulamento Rádio da UIT, e esse código é o MMSI.'),
            F('radio-47', 'Segundo o BRMCC, a EPIRB de embarcação não SOLAS pode ser codificada com o MMSI ou com o número de série; o PLB usa número de série; normalmente a codificação é feita pelo fabricante ou revendedor.'),
            C('dica', 'Compre onde registram', 'Peça ao revendedor para codificar a baliza para o Brasil (710) e entregue a ele o MMSI do barco, se for usar o MMSI. Uma baliza comprada fora e codificada para outro país deve ser registrada na autoridade do país do código. Depois da compra, cadastre no INFOSAR no mesmo dia.'),
            H('Ativação acidental: cancele'),
            L([
              'Desligue a baliza (siga o manual do modelo).',
              'Avise imediatamente o <b>SALVAMAR</b> (telefone 185) ou a estação costeira, dizendo o nome do barco, o código da baliza (ou o MMSI) e que foi <b>alarme falso</b>.',
              'Se o rádio VHF com DSC também disparou, cancele o alerta por voz no canal 16 (módulo 2).',
              'Anote hora, local e causa. Se foi um defeito, mande a baliza para a assistência.',
            ], true),
            F('extra-radio-1-18', 'Se um alerta de socorro for transmitido por engano, o navio deve cancelá-lo imediatamente, informando claramente às estações costeiras ou ao RCC/MRCC que foi alarme falso.'),
            W('vhf-sim', { modo: 'montar', modos: ['montar'], mensagem: 'cancelar' }, 'Treine o cancelamento de um alerta por voz no canal 16, com a hora UTC do alerta. Os nomes e o MMSI do exemplo são fictícios.'),
            CHECK([
              Q('m5l4-q1', 'Rádio: EPIRB, PLB, SART e AIS', 1, 'Onde se cadastra uma EPIRB no Brasil?',
                ['No INFOSAR, do DECEA, com a conta gov.br.', 'No SEI da Anatel.', 'Na Capitania, em papel.', 'Em nenhum lugar: não é preciso cadastrar.'], 0,
                'A NORMAM-211 exige o cadastro de toda EPIRB no INFOSAR, serviço do DECEA. O SEI é o sistema de processos da Anatel (usado para a licença da estação), não para balizas. Não cadastrar é descumprir a norma e atrasa o resgate.',
                'NORMAM-211/DPC, art. 4.23.6 e; INFOSAR', INFOSAR),
              Q('m5l4-q2', 'Rádio: EPIRB, PLB, SART e AIS', 2, 'Como é codificada uma EPIRB de embarcação não SOLAS e uma PLB?',
                ['A EPIRB com o MMSI ou o número de série; a PLB com o número de série.', 'Ambas com o MMSI do barco.', 'Ambas com o CPF do dono.', 'A EPIRB com o número do telefone; a PLB com o MMSI.'], 0,
                'Segundo o BRMCC, a EPIRB de embarcação não SOLAS pode usar o MMSI ou o número de série; a PLB usa número de série, porque é pessoal. CPF e telefone não servem como código da baliza.',
                'BRMCC, Codificação; NORMAM-211/DPC, art. 4.23.6 d', 'https://www2.fab.mil.br/brmcc/index.php/codificacao'),
              Q('m5l4-q3', 'Rádio: EPIRB, PLB, SART e AIS', 2, 'Sua EPIRB disparou por engano no porto. O que fazer?',
                ['Desligá-la e avisar o SALVAMAR (185), dizendo que foi alarme falso e informando o código.', 'Esperar alguém ligar para perguntar.', 'Jogá-la ao mar.', 'Esconder dentro do paiol, ainda ativada.'], 0,
                'O alarme falso deve ser cancelado imediatamente, informando claramente às autoridades de salvamento. Esperar, esconder ou jogar a baliza ao mar mantém ou agrava a ocorrência.',
                'UIT, Resolução 349 (Rev.CMR-23), Anexo, item 5; Anatel, material de apoio, item 2.2.15', RES349),
            ]),
            FONTES([
              { txt: 'NORMAM-211/DPC, art. 4.23.6 d, e e f', url: NORMAM, ref: 'radio-38' },
              { txt: 'INFOSAR (DECEA)', url: INFOSAR, ref: 'radio-41' },
              { txt: 'Central de Ajuda do DECEA: como cadastrar uma baliza 406 MHz e o que é o registro', url: 'https://ajuda.decea.mil.br/sem-categoria/como-cadastrar-uma-baliza-406mhz-no-infosar/', ref: 'radio-46' },
              { txt: 'BRMCC (Força Aérea Brasileira), Codificação de balizas', url: 'https://www2.fab.mil.br/brmcc/index.php/codificacao', ref: 'radio-47' },
            ]),
          ],
        },
        {
          id: 'l5',
          titulo: 'PLB, AIS-MOB e SART: no colete, na balsa e no barco',
          minutos: 12,
          objetivos: [
            'Decidir onde ficam EPIRB, PLB, AIS-MOB, SART e VHF portátil',
            'Montar a bolsa de abandono com os aparelhos de localização',
            'Criar uma rotina de inspeção dos aparelhos',
          ],
          blocos: [
            P('Cada aparelho só ajuda se estiver no lugar certo na hora certa. Pense em três momentos: <b>homem ao mar</b>, <b>abandono do barco</b> e <b>naufrágio rápido</b>. Cada um pede um aparelho diferente à mão.'),
            FIG(svg('0 0 480 300', 'Vista de cima do veleiro com a posição dos aparelhos: EPIRB perto da saída, VHF fixo na mesa de navegação, bolsa de abandono perto da saída com PLB, SART e VHF portátil, e AIS-MOB no colete de cada tripulante',
              (function () {
                var cx = 150, y0 = 14, L2 = 270, b = 130, h = b / 2, y1 = y0 + L2;
                var casco = '<path d="M' + cx + ',' + y0 + ' C' + (cx + h * 0.95) + ',' + (y0 + L2 * 0.16) + ' ' + (cx + h) + ',' + (y0 + L2 * 0.42) + ' ' + (cx + h) + ',' + (y0 + L2 * 0.56) + ' C' + (cx + h) + ',' + (y0 + L2 * 0.78) + ' ' + (cx + h * 0.9) + ',' + (y1 - L2 * 0.04) + ' ' + (cx + h * 0.78) + ',' + y1 + ' L' + (cx - h * 0.78) + ',' + y1 + ' C' + (cx - h * 0.9) + ',' + (y1 - L2 * 0.04) + ' ' + (cx - h) + ',' + (y0 + L2 * 0.78) + ' ' + (cx - h) + ',' + (y0 + L2 * 0.56) + ' C' + (cx - h) + ',' + (y0 + L2 * 0.42) + ' ' + (cx - h * 0.95) + ',' + (y0 + L2 * 0.16) + ' ' + cx + ',' + y0 + ' Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2.5"/>';
                function pt(x, y, k) { return '<circle cx="' + x + '" cy="' + y + '" r="12" fill="var(--sea-1)" stroke="var(--magenta)" stroke-width="2.5"/>' + t(x, y + 5, k, 15, 'middle', 'fill="var(--magenta)" font-weight="700"'); }
                return casco +
                  pt(150, 120, '1') + pt(150, 210, '2') + pt(112, 250, '3') + pt(188, 250, '4') + pt(150, 60, '5') +
                  t(300, 40, '1  VHF fixo (mesa de navegação)', 15, 'start') + t(300, 76, '2  EPIRB (suporte no cockpit)', 15, 'start') +
                  t(300, 112, '3  Bolsa de abandono: PLB,', 15, 'start') + t(318, 132, 'SART, VHF portátil', 15, 'start') +
                  t(300, 168, '4  Balsa salva-vidas', 15, 'start') + t(300, 204, '5  AIS-MOB e PLB no colete', 15, 'start') + t(318, 224, 'de cada tripulante', 15, 'start');
              })(), 480),
              'Esquema de exemplo, um veleiro de cruzeiro de 32 pés visto de cima, proa para cima. A posição exata depende do tamanho e do arranjo do seu barco: a regra é ter cada aparelho ao alcance de quem precisa dele na hora.'),
            H('No colete: PLB e AIS-MOB'),
            L([
              '<b>AIS-MOB</b>: preso ao colete com cobertura, dispara quando o colete infla ou à mão. Mostra a posição de quem caiu no plotter do barco, e alguns modelos também mandam um alerta DSC ao seu VHF, ligando o alarme na hora.',
              '<b>PLB</b>: presa ao colete (ou ao arnês) em bolso próprio, ativada à mão. Avisa o centro de salvamento, mesmo longe de qualquer barco.',
              'Os dois pesam pouco e cabem juntos. Para quem faz quartos noturnos sozinho no cockpit, são o seguro de vida.',
              'Teste os botões de teste uma vez por mês e confira as datas das baterias.',
            ]),
            { t: 'fato', ref: 'travessia-29', intl: true, html: 'Nas categorias 0 a 2 das Offshore Special Regulations, é exigido um localizador pessoal AIS de homem ao mar (AIS MOB beacon) para cada tripulante.' },
            { t: 'fato', ref: 'travessia-62', intl: true, html: 'Nos rallies da WCC, a EPIRB deve ser flutuante, de ativação na água e manual, em 406 MHz, com GPS interno e registrada na autoridade do país; PLBs não substituem a EPIRB do barco.' },
            H('Na bolsa de abandono e na balsa'),
            F('travessia-13', 'Cat. 1 (monocasco): um VHF portátil de no mínimo 5 W para cada grab bag, estanque ou com capa à prova d’água, guardado no grab bag.'),
            L([
              '<b>VHF portátil</b> estanque e com bateria cheia, na bolsa.',
              '<b>PLB</b> e, se tiver, o <b>SART</b> ou <b>AIS-SART</b> (sem os quais a balsa quase não aparece no radar).',
              '<b>Sinais visuais</b>: fachos, foguetes e sinal fumígeno.',
              '<b>Lista de conferência</b> na bolsa, com a data da última revisão.',
            ]),
            C('nota', 'SART na NORMAM-211', 'O transponder de radar de 9 GHz (SART) está na dotação das embarcações de grande porte ou iates e não consta da dotação de médio porte em navegação oceânica. Mesmo assim, vale levar um na bolsa de abandono de uma travessia: ele aumenta muito a chance de a balsa ser vista por um navio.'),
            F('extra-radio-1-05', 'Pela NORMAM-211, o transponder de radar de 9 GHz (SART) consta da dotação de rádio das embarcações de grande porte ou iates, e não da dotação de médio porte em navegação oceânica.'),
            H('Rotina de inspeção'),
            TAB(['Aparelho', 'Todo mês', 'Todo ano ou na data da etiqueta'], [
              ['EPIRB', 'Autoteste; olhar a etiqueta e o suporte', 'Revisar a validade do HRU; trocar a bateria ao vencer; atualizar o INFOSAR'],
              ['PLB', 'Autoteste; conferir se está presa ao colete', 'Trocar a bateria ao vencer; atualizar o INFOSAR'],
              ['AIS-MOB', 'Botão de teste; conferir o colete', 'Trocar a bateria ao vencer; verificar o MMSI 972'],
              ['SART / AIS-SART', 'Botão de teste, curto', 'Trocar a bateria ao vencer; guardar na bolsa'],
              ['VHF portátil', 'Carregar e testar em canal de trabalho', 'Verificar a vedação e a bateria de reserva'],
            ], 'Use o manual de cada modelo para os intervalos exatos.'),
            C('seguranca', 'Treine o abandono', 'Faça uma vez por ano um treino de abandono com a tripulação: quem pega a EPIRB, quem pega a bolsa, quem lança a balsa, quem faz o MAYDAY. A OSR pede ao menos um treino de homem ao mar e abandono por ano. Num abandono real, o tempo é de minutos.'),
            F('radio-79', 'OSR 6.04: pelo menos uma vez por ano a tripulação deve treinar resgate de homem ao mar e abandono da embarcação.'),
            CHECK([
              Q('m5l5-q1', 'Rádio: EPIRB, PLB, SART e AIS', 2, 'Um tripulante cai no mar de noite. Que aparelho de colete mostra no plotter do barco onde ele está agora?',
                ['O AIS de homem ao mar (AIS-MOB).', 'A EPIRB do barco.', 'O SART.', 'O VHF fixo.'], 0,
                'O AIS-MOB transmite em AIS e o plotter do barco o mostra. A EPIRB do barco fica presa ao barco; o SART responde a radar e é feito para balsas; o VHF fixo é rádio de voz e não localiza ninguém.',
                'Rec. UIT-R M.585; Cospas-Sarsat; boas práticas de MOB', M585),
              Q('m5l5-q2', 'Rádio: EPIRB, PLB, SART e AIS', 1, 'Que aparelho de colete avisa o centro de salvamento por satélite, mesmo longe de qualquer barco?',
                ['A PLB.', 'O AIS-MOB.', 'O SART.', 'A antena de emergência.'], 0,
                'A PLB transmite em 406 MHz para os satélites do Cospas-Sarsat. O AIS-MOB e o SART só são vistos por quem estiver por perto, em linha de visada.',
                'NORMAM-211/DPC, art. 4.23.6; Cospas-Sarsat', COSPAS),
              Q('m5l5-q3', 'Rádio: EPIRB, PLB, SART e AIS', 2, 'Segundo a NORMAM-211, o SART (transponder de radar de 9 GHz) é obrigatório para um veleiro de médio porte em navegação oceânica?',
                ['Não: consta da dotação de grande porte ou iates; no médio porte é dispensado.', 'Sim, sempre.', 'Sim, mas só de dia.', 'Não existe na norma.'], 0,
                'A dotação do art. 4.24.1 (grande porte ou iates) lista o transponder radar de 9 GHz; a do art. 4.24.2 (médio porte) não o inclui, e a tabela 4.35 o mostra como dispensado. Mesmo assim, é recomendável levá-lo.',
                'NORMAM-211/DPC, arts. 4.24.1 e 4.24.2; tabela 4.35, item 21', NORMAM),
            ]),
            FONTES([
              { txt: 'NORMAM-211/DPC, art. 4.24 e tabela 4.35', url: NORMAM, ref: 'extra-radio-1-05' },
              { txt: 'World Sailing, Offshore Special Regulations 2026-2027 (regras de EPIRB, AIS pessoal e treinamento)', url: 'https://www.sailing.org/offshore-special-regulations/', ref: 'travessia-29' },
              { txt: 'UIT-R M.585 (MMSI de AIS-SART e dispositivos de homem ao mar)', url: M585 },
              { txt: 'Anatel, material de apoio ao exame de Radiotelefonista (2026-03), item 2.2.8', url: ANATEL, ref: 'extra-radio-1-20' },
            ]),
          ],
        },
      ],
    },
  ],
  });
})();
