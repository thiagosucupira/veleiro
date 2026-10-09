/* Curso Mestre-Amador — parte 1: a carta náutica, coordenadas e distâncias, rumos, marcações e a agulha.
   Programa oficial: NORMAM-211/DPC, Anexo 5-A, item 2.1, alíneas a), b), c) e g).
   Fontes técnicas principais: Miguens, Navegação: a Ciência e a Arte, vol. I (DHN, 2ª rev. 2023), caps. 1, 2, 3 e 11;
   Carta 12000 (INT 1), DHN/CHM, 5ª ed. 2022. Fatos regulatórios só com ref para research/claims_verified.json
   (ou research/_work/research_extra_mestre-1.json, ids extra-mestre-1-NN).
   IDs de lição são únicos no curso inteiro (o progresso é salvo por curso/lição): esta parte usa l1 a l17. */
(function () {
  var VOL1 = 'https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/arquivosss/Manual_Navega%C3%A7%C3%A3o_MB_Vol_1_%282%C2%AARevis%C3%A3o_2023%29.pdf';
  var C12000 = 'https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2026-05/Carta-12000-5a-ED-2022-Completo%202026.indd__1.pdf';
  var C12000_PAG = 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/carta-12000-int-1';
  var NORMAM211 = 'https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-211.pdf';
  var CHM_CARTAS = 'https://www.marinha.mil.br/chm/dados-do-segnav-cartas-nauticas';
  var CHM_RASTER = 'https://www.marinha.mil.br/chm/dados-do-segnav/cartas-raster';
  var CHM_CATALOGO = 'https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/catalogo-de-cartas-e-publicacoes';
  var LISTA_FAROIS = 'https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2026-09/LF-40ED-2026-2027-FOL-17-26-compactado_1.pdf';
  var WMM = 'https://www.ncei.noaa.gov/products/world-magnetic-model';
  var NOAA_CALC = 'https://www.ngdc.noaa.gov/geomag/calculators/magcalc.shtml';
  var BOWDITCH = 'https://msi.nga.mil/Publications/APN';
  var TABUA_CABEDELO = 'https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/dados_de_mare/23%20-%20PORTO%20DE%20CABEDELO%20-%2079%20-%2081.pdf';

  function mig(cap) { return { txt: 'Miguens, Navegação: a Ciência e a Arte, vol. I (DHN, 2ª rev. 2023), ' + cap, url: VOL1 }; }
  function c12(sec) { return { txt: 'Carta 12000 (INT 1), DHN, 5ª ed. 2022, ' + sec, url: C12000, ref: 'tecnico-144' }; }

  /* ------------------------------------------------------------------ figuras do módulo 1 */
  var FIG_FOLHA = `<svg viewBox="0 0 400 300" width="100%" role="img" aria-labelledby="m1f1t" style="max-width:560px;display:block;margin:0 auto">
<title id="m1f1t">Partes de uma folha de carta náutica: escalas nas bordas, terra, título, rosa dos rumos e notas</title>
<rect x="30" y="20" width="340" height="230" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2"/>
<line x1="34" y1="24" x2="34" y2="246" stroke="var(--ink)" stroke-width="6" stroke-dasharray="11 11"/>
<line x1="366" y1="24" x2="366" y2="246" stroke="var(--ink)" stroke-width="6" stroke-dasharray="11 11"/>
<line x1="34" y1="24" x2="366" y2="24" stroke="var(--ink)" stroke-width="6" stroke-dasharray="11 11"/>
<line x1="34" y1="246" x2="366" y2="246" stroke="var(--ink)" stroke-width="6" stroke-dasharray="11 11"/>
<rect x="38" y="28" width="324" height="214" fill="none" stroke="var(--ink)" stroke-width="1"/>
<path d="M38 28 H362 V64 C330 80 300 58 262 84 C226 108 186 66 140 90 C104 108 70 76 38 98 Z" fill="var(--land)" stroke="var(--ink)" stroke-width="1.2"/>
<text x="74" y="56" font-size="15" fill="var(--ink)">Terra</text>
<path d="M60 150 C120 140 180 150 240 132 S330 118 362 112" fill="none" stroke="var(--sea-3)" stroke-width="2"/>
<text x="250" y="150" font-size="15" fill="var(--ink)" font-style="italic">isóbata</text>
<rect x="222" y="164" width="130" height="64" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="1.2"/>
<text x="287" y="184" font-size="15" fill="var(--ink)" text-anchor="middle" font-weight="700">Título</text>
<line x1="236" y1="196" x2="338" y2="196" stroke="var(--ink)" stroke-width="1"/>
<line x1="246" y1="206" x2="328" y2="206" stroke="var(--ink)" stroke-width="1"/>
<line x1="240" y1="216" x2="334" y2="216" stroke="var(--ink)" stroke-width="1"/>
<g transform="translate(108 176)">
<circle r="36" fill="none" stroke="var(--magenta)" stroke-width="1.6"/>
<circle r="26" fill="none" stroke="var(--magenta)" stroke-width="1"/>
<line x1="0" y1="0" x2="0" y2="-36" stroke="var(--magenta)" stroke-width="2"/>
<path d="M0 -42 L-5 -32 L5 -32 Z" fill="var(--magenta)"/>
<line x1="0" y1="0" x2="-9.7" y2="-24.1" stroke="var(--magenta)" stroke-width="1.4"/>
</g>
<text x="108" y="234" font-size="15" fill="var(--ink)" text-anchor="middle">Rosa dos rumos</text>
<rect x="160" y="112" width="58" height="34" fill="var(--sea-1)" stroke="var(--magenta)" stroke-width="1.2"/>
<text x="189" y="134" font-size="15" fill="var(--magenta)" text-anchor="middle">Notas</text>
<text x="19" y="135" font-size="15" fill="var(--ink)" text-anchor="middle" transform="rotate(-90 19 135)">Escala de latitudes</text>
<text x="381" y="135" font-size="15" fill="var(--ink)" text-anchor="middle" transform="rotate(90 381 135)">Escala de latitudes</text>
<text x="200" y="274" font-size="15" fill="var(--ink)" text-anchor="middle">Escala de longitudes (em cima e embaixo)</text>
</svg>`;

  // grade de Mercator: espaçamento dos paralelos proporcional às partes meridionais (0° a 70°, de 10 em 10)
  var FIG_MERCATOR = `<svg viewBox="0 0 400 330" width="100%" role="img" aria-labelledby="m1f2t" style="max-width:560px;display:block;margin:0 auto">
<title id="m1f2t">Na projeção de Mercator os meridianos ficam paralelos e os paralelos se afastam cada vez mais com a latitude; a loxodromia vira uma reta</title>
<rect x="60" y="20" width="300" height="270" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="1.5"/>
<g stroke="var(--ink)" stroke-width="1"><line x1="60" y1="290" x2="360" y2="290"/><line x1="60" y1="262.9" x2="360" y2="262.9"/><line x1="60" y1="235" x2="360" y2="235"/><line x1="60" y1="205.2" x2="360" y2="205.2"/><line x1="60" y1="172.2" x2="360" y2="172.2"/><line x1="60" y1="133.9" x2="360" y2="133.9"/><line x1="60" y1="86.6" x2="360" y2="86.6"/><line x1="60" y1="22" x2="360" y2="22"/><line x1="113.9" y1="20" x2="113.9" y2="290"/><line x1="167.8" y1="20" x2="167.8" y2="290"/><line x1="221.7" y1="20" x2="221.7" y2="290"/><line x1="275.6" y1="20" x2="275.6" y2="290"/><line x1="329.5" y1="20" x2="329.5" y2="290"/></g>
<g font-size="15" fill="var(--ink)" text-anchor="end"><text x="54" y="295">0°</text><text x="54" y="267.9">10°</text><text x="54" y="240">20°</text><text x="54" y="210.2">30°</text><text x="54" y="177.2">40°</text><text x="54" y="138.9">50°</text><text x="54" y="91.6">60°</text><text x="54" y="27">70°</text></g>
<circle cx="135" cy="276.5" r="10" fill="none" stroke="var(--magenta)" stroke-width="2"/>
<circle cx="135" cy="111.8" r="17.4" fill="none" stroke="var(--magenta)" stroke-width="2"/>
<line x1="190" y1="285" x2="340" y2="40" stroke="var(--magenta)" stroke-width="2.5"/>
<text x="246" y="160" font-size="15" fill="var(--magenta)" text-anchor="end">loxodromia</text><text x="246" y="178" font-size="15" fill="var(--magenta)" text-anchor="end">(rumo constante)</text>
<text x="210" y="318" font-size="15" fill="var(--ink)" text-anchor="middle">O mesmo círculo da Terra fica maior em latitude alta</text>
</svg>`;

  var FIG_BORDAS = `<svg viewBox="0 0 400 300" width="100%" role="img" aria-labelledby="m1f3t" style="max-width:560px;display:block;margin:0 auto">
<title id="m1f3t">Canto inferior esquerdo de um trecho de carta do Hemisfério Sul, a oeste de Greenwich: a latitude cresce para baixo e a longitude cresce para a esquerda</title>
<rect x="90" y="20" width="290" height="200" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="1.2"/>
<rect x="70" y="20" width="16" height="200" fill="none" stroke="var(--ink)" stroke-width="1"/>
<rect x="90" y="224" width="290" height="16" fill="none" stroke="var(--ink)" stroke-width="1"/>
<g fill="var(--ink)"><rect x="70" y="206.9" width="16" height="13.1"/><rect x="70" y="180.6" width="16" height="13.1"/><rect x="70" y="154.4" width="16" height="13.1"/><rect x="70" y="128.2" width="16" height="13.1"/><rect x="70" y="101.9" width="16" height="13.1"/><rect x="70" y="75.7" width="16" height="13.1"/><rect x="70" y="49.4" width="16" height="13.1"/><rect x="70" y="23.2" width="16" height="13.1"/><rect x="368" y="224" width="12" height="16"/><rect x="344" y="224" width="12" height="16"/><rect x="320" y="224" width="12" height="16"/><rect x="296" y="224" width="12" height="16"/><rect x="272" y="224" width="12" height="16"/><rect x="248" y="224" width="12" height="16"/><rect x="224" y="224" width="12" height="16"/><rect x="200" y="224" width="12" height="16"/><rect x="176" y="224" width="12" height="16"/><rect x="152" y="224" width="12" height="16"/><rect x="128" y="224" width="12" height="16"/><rect x="104" y="224" width="12" height="16"/><rect x="90" y="224" width="2" height="16"/></g>
<line x1="66" y1="220" x2="90" y2="220" stroke="var(--ink)" stroke-width="2"/><line x1="66" y1="88.8" x2="90" y2="88.8" stroke="var(--ink)" stroke-width="2"/>
<line x1="380" y1="224" x2="380" y2="252" stroke="var(--ink)" stroke-width="2"/><line x1="260" y1="224" x2="260" y2="252" stroke="var(--ink)" stroke-width="2"/><line x1="140" y1="224" x2="140" y2="252" stroke="var(--ink)" stroke-width="2"/>
<g font-size="15" fill="var(--ink)"><text x="64" y="93.8" text-anchor="end">49′</text><text x="64" y="225" text-anchor="end">23°50′S</text><text x="396" y="268" text-anchor="end">044°10′W</text><text x="260" y="268" text-anchor="middle">11′</text><text x="140" y="268" text-anchor="middle">12′</text></g>
<line x1="90" y1="128.2" x2="296" y2="128.2" stroke="var(--magenta)" stroke-width="1.6" stroke-dasharray="5 4"/>
<line x1="296" y1="128.2" x2="296" y2="224" stroke="var(--magenta)" stroke-width="1.6" stroke-dasharray="5 4"/>
<circle cx="296" cy="128.2" r="5" fill="none" stroke="var(--magenta)" stroke-width="2"/>
<text x="306" y="102.2" font-size="15" fill="var(--magenta)">23°49,3′S</text><text x="306" y="123.2" font-size="15" fill="var(--magenta)">044°10,7′W</text>
<text x="104" y="48" font-size="15" fill="var(--ink)">latitude S cresce para baixo</text>
<text x="104" y="205" font-size="15" fill="var(--ink)">cada faixa = 0,1′</text>
<text x="235" y="292" font-size="15" fill="var(--ink)" text-anchor="middle">longitude W cresce para a esquerda</text>
</svg>`;

  var FIG_TITULO = `<svg viewBox="0 0 400 270" width="100%" role="img" aria-labelledby="m1f4t" style="max-width:560px;display:block;margin:0 auto">
<title id="m1f4t">Exemplo de título de uma carta de treino fictícia, com as informações na ordem usada pela DHN</title>
<rect x="20" y="10" width="360" height="250" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="1.5"/>
<g font-size="15" fill="var(--ink)" text-anchor="middle">
<text x="200" y="36" font-weight="700">Brasil — Costa Sul</text>
<text x="200" y="58" font-weight="700">Da Ponta do Vigia à Ilha da Gaivota</text>
<text x="200" y="84">Carta de treino (fictícia)</text>
<text x="200" y="108">Profundidades em metros</text>
<text x="200" y="132">Escala 1:50.000 (23°50′)</text>
<text x="200" y="156">Profundidades reduzidas ao nível médio</text>
<text x="200" y="174">das baixa-mares de sizígia</text>
<text x="200" y="198">Altitudes em metros acima do nível médio do mar</text>
<text x="200" y="220">Posições referidas ao Datum WGS-84</text>
<text x="200" y="242">IALA Região B · Projeção de Mercator</text>
</g>
</svg>`;

  var FIG_NIVEIS = `<svg viewBox="0 0 400 320" width="100%" role="img" aria-labelledby="m1f5t" style="max-width:560px;display:block;margin:0 auto">
<title id="m1f5t">Perfil vertical: altitudes contadas do nível médio do mar; sondagens e alturas de secagem contadas do nível de redução; profundidade real é a sondagem mais a altura da maré</title>
<path d="M20 120 L70 60 L105 40 L130 70 L150 150 L20 150 Z" fill="var(--land)" stroke="var(--ink)" stroke-width="1.2"/>
<rect x="150" y="96" width="230" height="194" fill="var(--sea-1)"/>
<path d="M150 150 C180 190 200 200 220 214 L240 208 L252 214 C290 240 330 268 380 280 L380 300 L150 300 Z" fill="var(--land)" stroke="var(--ink)" stroke-width="1.2"/>
<path d="M224 216 L238 172 L254 214 Z" fill="var(--ink)"/>
<line x1="150" y1="96" x2="380" y2="96" stroke="var(--sea-3)" stroke-width="2"/>
<line x1="20" y1="122" x2="380" y2="122" stroke="var(--ink)" stroke-width="1.4" stroke-dasharray="7 4"/>
<line x1="150" y1="190" x2="380" y2="190" stroke="var(--magenta)" stroke-width="2"/>
<g font-size="15" fill="var(--ink)">
<text x="384" y="92" text-anchor="end">nível da maré agora</text>
<text x="384" y="118" text-anchor="end">nível médio do mar (NMM)</text>
<text x="384" y="184" text-anchor="end" fill="var(--magenta)">nível de redução (NR)</text>
</g>
<line x1="105" y1="40" x2="105" y2="122" stroke="var(--ink)" stroke-width="1.4"/>
<text x="111" y="74" font-size="15" fill="var(--ink)">altitude</text>
<text x="111" y="95" font-size="15" fill="var(--ink)">(acima do NMM)</text>
<line x1="320" y1="190" x2="320" y2="256" stroke="var(--ink)" stroke-width="1.4"/>
<path d="M320 256 l-4 -9 h8 Z" fill="var(--ink)"/>
<text x="326" y="236" font-size="15" fill="var(--ink)">sondagem</text>
<line x1="298" y1="96" x2="298" y2="190" stroke="var(--sea-3)" stroke-width="3"/>
<text x="292" y="150" font-size="15" fill="var(--ink)" text-anchor="end">altura da maré</text>
<text x="220" y="233" font-size="15" fill="var(--ink)" text-anchor="end">rocha que</text>
<text x="220" y="253" font-size="15" fill="var(--ink)" text-anchor="end">descobre</text>
<text x="200" y="314" font-size="15" fill="var(--ink)" text-anchor="middle">Profundidade agora = sondagem + altura da maré</text>
</svg>`;

  var FIG_PERIGOS = `<svg viewBox="0 0 400 330" width="100%" role="img" aria-labelledby="m1f6t" style="max-width:560px;display:block;margin:0 auto">
<title id="m1f6t">Desenhos simplificados de símbolos de perigo da Carta 12000, seção K</title>
<g fill="none" stroke="var(--ink)" stroke-width="1.8">
<g transform="translate(46 40)"><line x1="-9" y1="0" x2="9" y2="0"/><line x1="0" y1="-9" x2="0" y2="9"/><line x1="-6.4" y1="-6.4" x2="6.4" y2="6.4"/><line x1="-6.4" y1="6.4" x2="6.4" y2="-6.4"/></g>
<g transform="translate(46 110)"><line x1="-9" y1="0" x2="9" y2="0"/><line x1="0" y1="-9" x2="0" y2="9"/></g>
<g transform="translate(46 180)"><line x1="-9" y1="0" x2="9" y2="0"/><line x1="0" y1="-9" x2="0" y2="9"/><circle r="16" stroke-dasharray="2 3"/></g>
<g transform="translate(46 250)"><line x1="-14" y1="0" x2="14" y2="0"/><line x1="-6" y1="-6" x2="-6" y2="6"/><line x1="0" y1="-8" x2="0" y2="8"/><line x1="6" y1="-6" x2="6" y2="6"/><ellipse rx="22" ry="14" stroke-dasharray="2 3"/></g>
<g transform="translate(46 305)"><line x1="-14" y1="0" x2="14" y2="0"/><line x1="-6" y1="-6" x2="-6" y2="6"/><line x1="0" y1="-8" x2="0" y2="8"/><line x1="6" y1="-6" x2="6" y2="6"/></g>
</g>
<g fill="var(--ink)">
<g transform="translate(46 110)"><circle cx="-5" cy="-5" r="1.8"/><circle cx="5" cy="-5" r="1.8"/><circle cx="-5" cy="5" r="1.8"/><circle cx="5" cy="5" r="1.8"/></g>
</g>
<text x="64" y="44" font-size="15" fill="var(--ink)" font-style="italic">(<tspan text-decoration="underline">1</tspan>₆)</text>
<g font-size="15" fill="var(--ink)">
<text x="100" y="36">Rocha que cobre e descobre:</text>
<text x="100" y="54">seca 1,6 m acima do NR (K 11)</text>
<text x="100" y="106">Rocha à flor d’água no NR</text>
<text x="100" y="124">(K 12)</text>
<text x="100" y="176">Rocha submersa perigosa,</text>
<text x="100" y="194">profundidade desconhecida (K 13)</text>
<text x="100" y="246">Casco soçobrado perigoso,</text>
<text x="100" y="264">profundidade desconhecida (K 28)</text>
<text x="100" y="301">Casco soçobrado não perigoso (K 29)</text>
<text x="100" y="319">A linha pontilhada é a linha de perigo (K 1)</text>
</g>
</svg>`;

  /* ------------------------------------------------------------------ figuras do módulo 2 */
  var FIG_PLOTAR = `<svg viewBox="0 0 400 320" width="100%" role="img" aria-labelledby="m2f1t" style="max-width:560px;display:block;margin:0 auto">
<title id="m2f1t">Plotagem do ponto 23°48,6′S, 044°09,4′W: traça-se o paralelo da latitude e marca-se a longitude com o compasso a partir do meridiano 044°10′W</title>
<rect x="60" y="30" width="330" height="206.6" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="1.2"/>
<g stroke="var(--ink)" stroke-width="1" stroke-opacity="0.55"><line x1="60" y1="40" x2="390" y2="40"/><line x1="60" y1="138.3" x2="390" y2="138.3"/><line x1="110" y1="30" x2="110" y2="236.6"/><line x1="200" y1="30" x2="200" y2="236.6"/><line x1="290" y1="30" x2="290" y2="236.6"/><line x1="380" y1="30" x2="380" y2="236.6"/></g>
<g fill="var(--ink)"><rect x="44" y="40" width="12" height="9.8"/><rect x="44" y="59.7" width="12" height="9.8"/><rect x="44" y="79.3" width="12" height="9.8"/><rect x="44" y="99" width="12" height="9.8"/><rect x="44" y="118.6" width="12" height="9.8"/><rect x="44" y="138.3" width="12" height="9.8"/><rect x="44" y="158" width="12" height="9.8"/><rect x="44" y="177.6" width="12" height="9.8"/><rect x="44" y="197.3" width="12" height="9.8"/><rect x="44" y="216.9" width="12" height="9.8"/><rect x="371" y="240.6" width="9" height="12"/><rect x="353" y="240.6" width="9" height="12"/><rect x="335" y="240.6" width="9" height="12"/><rect x="317" y="240.6" width="9" height="12"/><rect x="299" y="240.6" width="9" height="12"/><rect x="281" y="240.6" width="9" height="12"/><rect x="263" y="240.6" width="9" height="12"/><rect x="245" y="240.6" width="9" height="12"/><rect x="227" y="240.6" width="9" height="12"/><rect x="209" y="240.6" width="9" height="12"/><rect x="191" y="240.6" width="9" height="12"/><rect x="173" y="240.6" width="9" height="12"/><rect x="155" y="240.6" width="9" height="12"/><rect x="137" y="240.6" width="9" height="12"/><rect x="119" y="240.6" width="9" height="12"/><rect x="101" y="240.6" width="9" height="12"/><rect x="83" y="240.6" width="9" height="12"/><rect x="65" y="240.6" width="9" height="12"/></g>
<rect x="44" y="40" width="12" height="196.6" fill="none" stroke="var(--ink)"/>
<rect x="60" y="240.6" width="330" height="12" fill="none" stroke="var(--ink)"/>
<g font-size="15" fill="var(--ink)" text-anchor="end"><text x="40" y="45">48′</text><text x="40" y="143.3">49′</text><text x="40" y="241.6">50′</text></g>
<g font-size="15" fill="var(--ink)" text-anchor="middle"><text x="110" y="270.6">11′</text><text x="200" y="270.6">044°10′W</text><text x="290" y="270.6">9′</text><text x="372" y="270.6">8′</text></g>
<line x1="170" y1="99" x2="294" y2="99" stroke="var(--magenta)" stroke-width="2"/>
<line x1="44" y1="99" x2="70" y2="99" stroke="var(--magenta)" stroke-width="2.4"/>
<g stroke="var(--magenta)" stroke-width="2.2" fill="none"><line x1="200" y1="99" x2="227" y2="37"/><line x1="254" y1="99" x2="227" y2="37"/></g><circle cx="227" cy="37" r="4" fill="var(--magenta)"/>
<g stroke="var(--magenta)" stroke-width="2.2"><line x1="200" y1="256.6" x2="254" y2="256.6"/></g>
<circle cx="254" cy="99" r="6" fill="none" stroke="var(--magenta)" stroke-width="2"/>
<g font-size="15" fill="var(--ink)"><text x="264" y="89">1015</text><text x="70" y="62">1. paralelo de 23°48,6′S</text><text x="241" y="41">2. compasso: 0,6′</text><text x="264" y="121">3. ponto e hora</text></g>
<text x="225" y="292.6" font-size="15" fill="var(--ink)" text-anchor="middle">A abertura de 0,6′ é tirada na escala de longitudes</text>
</svg>`;

  var FIG_DIST = `<svg viewBox="0 0 400 300" width="100%" role="img" aria-labelledby="m2f2t" style="max-width:560px;display:block;margin:0 auto">
<title id="m2f2t">A abertura do compasso entre dois pontos é levada à escala de latitudes, na faixa de latitudes do próprio trecho</title>
<rect x="80" y="20" width="300" height="240" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="1.2"/>
<g fill="var(--ink)"><rect x="62" y="20" width="14" height="20"/><rect x="62" y="60" width="14" height="20"/><rect x="62" y="100" width="14" height="20"/><rect x="62" y="140" width="14" height="20"/><rect x="62" y="180" width="14" height="20"/><rect x="62" y="220" width="14" height="20"/></g>
<rect x="62" y="20" width="14" height="240" fill="none" stroke="var(--ink)"/>
<g font-size="15" fill="var(--ink)" text-anchor="end"><text x="58" y="25">0′</text><text x="58" y="65">1′</text><text x="58" y="105">2′</text><text x="58" y="145">3′</text><text x="58" y="185">4′</text><text x="58" y="225">5′</text><text x="58" y="265">6′</text></g>
<line x1="150" y1="92" x2="300" y2="196" stroke="var(--ink)" stroke-width="1.6"/>
<circle cx="150" cy="92" r="5" fill="var(--ink)"/><circle cx="300" cy="196" r="5" fill="var(--ink)"/>
<text x="138" y="82" font-size="15" fill="var(--ink)" text-anchor="end">A</text><text x="312" y="214" font-size="15" fill="var(--ink)">B</text>
<g stroke="var(--magenta)" stroke-width="2.2" fill="none"><line x1="150" y1="92" x2="256.3" y2="98.8"/><line x1="300" y1="196" x2="256.3" y2="98.8"/></g><circle cx="256.3" cy="98.8" r="4" fill="var(--magenta)"/>
<line x1="90" y1="92" x2="380" y2="92" stroke="var(--ink)" stroke-width="1" stroke-dasharray="3 4"/>
<line x1="90" y1="196" x2="380" y2="196" stroke="var(--ink)" stroke-width="1" stroke-dasharray="3 4"/>
<g stroke="var(--magenta)" stroke-width="3"><line x1="86" y1="52.7" x2="86" y2="235.3"/><line x1="82" y1="52.7" x2="92" y2="52.7"/><line x1="82" y1="235.3" x2="92" y2="235.3"/></g>
<text x="98" y="138" font-size="15" fill="var(--magenta)">meça aqui,</text><text x="98" y="156" font-size="15" fill="var(--magenta)">entre as latitudes</text><text x="98" y="174" font-size="15" fill="var(--magenta)">de A e de B</text>
<text x="230" y="286" font-size="15" fill="var(--ink)" text-anchor="middle">1′ de latitude = 1 milha náutica</text>
</svg>`;

  var FIG_VTD = `<svg viewBox="0 0 400 250" width="100%" role="img" aria-labelledby="m2f3t" style="max-width:520px;display:block;margin:0 auto">
<title id="m2f3t">Triângulo da distância, velocidade e tempo: distância igual a velocidade vezes tempo; com o tempo em minutos, divide-se por 60</title>
<path d="M200 20 L360 200 L40 200 Z" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="2"/>
<line x1="102" y1="130" x2="298" y2="130" stroke="var(--ink)" stroke-width="2"/><line x1="200" y1="130" x2="200" y2="200" stroke="var(--ink)" stroke-width="2"/>
<g fill="var(--ink)" text-anchor="middle"><text x="200" y="94" font-size="26" font-weight="700">D</text><text x="200" y="118" font-size="15">milhas</text>
<text x="140" y="168" font-size="26" font-weight="700">V</text><text x="140" y="192" font-size="15">nós</text><text x="262" y="168" font-size="26" font-weight="700">T</text><text x="262" y="192" font-size="15">horas</text></g>
<g font-size="15" fill="var(--ink)" text-anchor="middle"><text x="200" y="226">D = V × T   ·   V = D ÷ T   ·   T = D ÷ V</text><text x="200" y="246" fill="var(--magenta)">com minutos: D = V × min ÷ 60</text></g>
</svg>`;

  var FIG_ROSA = `<svg viewBox="0 0 400 300" width="100%" role="img" aria-labelledby="m2f4t" style="max-width:560px;display:block;margin:0 auto">
<title id="m2f4t">Leitura do rumo verdadeiro: a régua paralela leva a direção da linha AB até o centro da rosa, e o rumo se lê no anel externo, no sentido do movimento</title>
<rect x="10" y="10" width="380" height="280" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="1"/>
<circle cx="120" cy="150" r="90" fill="none" stroke="var(--magenta)" stroke-width="1.6"/><circle cx="120" cy="150" r="76" fill="none" stroke="var(--magenta)" stroke-width="1"/>
<g stroke="var(--magenta)"><line x1="120" y1="60" x2="120" y2="74" stroke-width="2"/><line x1="135.6" y1="61.4" x2="134.2" y2="69.2" stroke-width="1"/><line x1="150.8" y1="65.4" x2="148" y2="72.9" stroke-width="1"/><line x1="165" y1="72.1" x2="158" y2="84.2" stroke-width="1"/><line x1="177.9" y1="81.1" x2="172.7" y2="87.2" stroke-width="1"/><line x1="188.9" y1="92.1" x2="182.8" y2="97.3" stroke-width="1"/><line x1="197.9" y1="105" x2="185.8" y2="112" stroke-width="1"/><line x1="204.6" y1="119.2" x2="197.1" y2="122" stroke-width="1"/><line x1="208.6" y1="134.4" x2="200.8" y2="135.8" stroke-width="1"/><line x1="210" y1="150" x2="196" y2="150" stroke-width="2"/><line x1="208.6" y1="165.6" x2="200.8" y2="164.2" stroke-width="1"/><line x1="204.6" y1="180.8" x2="197.1" y2="178" stroke-width="1"/><line x1="197.9" y1="195" x2="185.8" y2="188" stroke-width="1"/><line x1="188.9" y1="207.9" x2="182.8" y2="202.7" stroke-width="1"/><line x1="177.9" y1="218.9" x2="172.7" y2="212.8" stroke-width="1"/><line x1="165" y1="227.9" x2="158" y2="215.8" stroke-width="1"/><line x1="150.8" y1="234.6" x2="148" y2="227.1" stroke-width="1"/><line x1="135.6" y1="238.6" x2="134.2" y2="230.8" stroke-width="1"/><line x1="120" y1="240" x2="120" y2="226" stroke-width="2"/><line x1="104.4" y1="238.6" x2="105.8" y2="230.8" stroke-width="1"/><line x1="89.2" y1="234.6" x2="92" y2="227.1" stroke-width="1"/><line x1="75" y1="227.9" x2="82" y2="215.8" stroke-width="1"/><line x1="62.1" y1="218.9" x2="67.3" y2="212.8" stroke-width="1"/><line x1="51.1" y1="207.9" x2="57.2" y2="202.7" stroke-width="1"/><line x1="42.1" y1="195" x2="54.2" y2="188" stroke-width="1"/><line x1="35.4" y1="180.8" x2="42.9" y2="178" stroke-width="1"/><line x1="31.4" y1="165.6" x2="39.2" y2="164.2" stroke-width="1"/><line x1="30" y1="150" x2="44" y2="150" stroke-width="2"/><line x1="31.4" y1="134.4" x2="39.2" y2="135.8" stroke-width="1"/><line x1="35.4" y1="119.2" x2="42.9" y2="122" stroke-width="1"/><line x1="42.1" y1="105" x2="54.2" y2="112" stroke-width="1"/><line x1="51.1" y1="92.1" x2="57.2" y2="97.3" stroke-width="1"/><line x1="62.1" y1="81.1" x2="67.3" y2="87.2" stroke-width="1"/><line x1="75" y1="72.1" x2="82" y2="84.2" stroke-width="1"/><line x1="89.2" y1="65.4" x2="92" y2="72.9" stroke-width="1"/><line x1="104.4" y1="61.4" x2="105.8" y2="69.2" stroke-width="1"/></g>
<g font-size="15" fill="var(--magenta)" text-anchor="middle"><text x="120" y="49">000</text><text x="226" y="155">090</text><text x="120" y="261">180</text><text x="14" y="155">270</text></g>
<line x1="230" y1="250" x2="369.1" y2="193.8" stroke="var(--ink)" stroke-width="2"/>
<circle cx="230" cy="250" r="5" fill="var(--ink)"/><circle cx="369.1" cy="193.8" r="5" fill="var(--ink)"/>
<text x="216" y="256" font-size="15" fill="var(--ink)" text-anchor="end">A</text><text x="379.1" y="187.8" font-size="15" fill="var(--ink)">B</text>
<text x="283.5" y="211.9" font-size="15" fill="var(--ink)" text-anchor="end">R 068</text>
<line x1="36.6" y1="183.7" x2="203.4" y2="116.3" stroke="var(--ink)" stroke-width="1.6" stroke-dasharray="6 4"/>
<circle cx="203.4" cy="116.3" r="6" fill="none" stroke="var(--ink)" stroke-width="2"/>
<text x="214.6" y="103.8" font-size="15" fill="var(--ink)">068°: certo</text>
<text x="26" y="222" font-size="15" fill="var(--ink)">248°:</text><text x="26" y="240" font-size="15" fill="var(--ink)">recíproca</text>
</svg>`;

  /* ------------------------------------------------------------------ figuras do módulo 3 */
  var FIG_NORTES = `<svg viewBox="0 0 400 300" width="100%" role="img" aria-labelledby="m3f1t" style="max-width:560px;display:block;margin:0 auto">
<title id="m3f1t">Os três nortes: Norte verdadeiro, Norte magnético (22 graus a oeste) e Norte da agulha (6 graus a leste do magnético, exagerado para ver melhor), e a proa do barco com os rumos verdadeiro, magnético e da agulha</title>
<line x1="200" y1="250" x2="200" y2="50" stroke="var(--ink)" stroke-width="2.2"/>
<line x1="200" y1="250" x2="125.1" y2="64.6" stroke="var(--ink)" stroke-width="1.8" stroke-dasharray="7 4"/>
<line x1="200" y1="250" x2="144.9" y2="57.7" stroke="var(--magenta)" stroke-width="1.8"/>
<line x1="200" y1="250" x2="359.7" y2="191.9" stroke="var(--ink)" stroke-width="3"/>
<path d="M359.7 191.9 L348.3 201.3 L344.9 191.9 Z" fill="var(--ink)"/>
<g font-size="15" font-weight="700"><text x="206" y="64" fill="var(--ink)">Nv</text><text x="119.1" y="78.6" fill="var(--ink)" text-anchor="end">Nmg</text><text x="148.9" y="51.7" fill="var(--magenta)">Nag</text></g>
<text x="355.7" y="179.9" font-size="15" fill="var(--ink)" text-anchor="end">proa</text>
<path d="M200 180 A70 70 0 0 1 265.8 226.1" fill="none" stroke="var(--ink)" stroke-width="1.6"/>
<path d="M162.5 157.3 A100 100 0 0 1 294 215.8" fill="none" stroke="var(--ink)" stroke-width="1.2" stroke-dasharray="5 3"/>
<path d="M164.2 125 A130 130 0 0 1 322.2 205.5" fill="none" stroke="var(--magenta)" stroke-width="1.4"/>
<g font-size="15"><text x="262" y="258" fill="var(--ink)">Rv 070° (do Nv)</text><text x="262" y="276" fill="var(--ink)">Rmg 092° (do Nmg)</text><text x="262" y="294" fill="var(--magenta)">Rag 086° (do Nag)</text></g>
<path d="M134.4 87.7 A175 175 0 0 1 200 75" fill="none" stroke="var(--ink)" stroke-width="1.2"/>
<text x="104" y="134.1" font-size="15" fill="var(--ink)" text-anchor="end">Dec 22° W</text>
<text x="20" y="292" font-size="15" fill="var(--magenta)">Dag 6° E (exagerado)</text>
</svg>`;

  var FIG_ROSA_DEC = `<svg viewBox="0 0 400 320" width="100%" role="img" aria-labelledby="m3f2t" style="max-width:520px;display:block;margin:0 auto">
<title id="m3f2t">Rosa dos rumos: anel externo verdadeiro e anel interno magnético, girado 22 graus e 10 minutos para oeste, com a anotação da declinação, do ano e da variação anual</title>
<circle cx="200" cy="160" r="118" fill="none" stroke="var(--magenta)" stroke-width="1.6"/><circle cx="200" cy="160" r="102" fill="none" stroke="var(--magenta)" stroke-width="0.8"/>
<circle cx="200" cy="160" r="86" fill="none" stroke="var(--magenta)" stroke-width="1.2"/><circle cx="200" cy="160" r="74" fill="none" stroke="var(--magenta)" stroke-width="0.8"/>
<g stroke="var(--magenta)"><line x1="200" y1="42" x2="200" y2="58" stroke-width="2"/><line x1="210.3" y1="42.4" x2="209.8" y2="48.4" stroke-width="1"/><line x1="220.5" y1="43.8" x2="218.8" y2="53.6" stroke-width="1"/><line x1="230.5" y1="46" x2="229" y2="51.8" stroke-width="1"/><line x1="240.4" y1="49.1" x2="236.9" y2="58.5" stroke-width="1"/><line x1="249.9" y1="53.1" x2="247.3" y2="58.5" stroke-width="1"/><line x1="259" y1="57.8" x2="251" y2="71.7" stroke-width="1"/><line x1="267.7" y1="63.3" x2="264.2" y2="68.3" stroke-width="1"/><line x1="275.8" y1="69.6" x2="269.4" y2="77.3" stroke-width="1"/><line x1="283.4" y1="76.6" x2="279.2" y2="80.8" stroke-width="1"/><line x1="290.4" y1="84.2" x2="282.7" y2="90.6" stroke-width="1"/><line x1="296.7" y1="92.3" x2="291.7" y2="95.8" stroke-width="1"/><line x1="302.2" y1="101" x2="288.3" y2="109" stroke-width="1"/><line x1="306.9" y1="110.1" x2="301.5" y2="112.7" stroke-width="1"/><line x1="310.9" y1="119.6" x2="301.5" y2="123.1" stroke-width="1"/><line x1="314" y1="129.5" x2="308.2" y2="131" stroke-width="1"/><line x1="316.2" y1="139.5" x2="306.4" y2="141.2" stroke-width="1"/><line x1="317.6" y1="149.7" x2="311.6" y2="150.2" stroke-width="1"/><line x1="318" y1="160" x2="302" y2="160" stroke-width="2"/><line x1="317.6" y1="170.3" x2="311.6" y2="169.8" stroke-width="1"/><line x1="316.2" y1="180.5" x2="306.4" y2="178.8" stroke-width="1"/><line x1="314" y1="190.5" x2="308.2" y2="189" stroke-width="1"/><line x1="310.9" y1="200.4" x2="301.5" y2="196.9" stroke-width="1"/><line x1="306.9" y1="209.9" x2="301.5" y2="207.3" stroke-width="1"/><line x1="302.2" y1="219" x2="288.3" y2="211" stroke-width="1"/><line x1="296.7" y1="227.7" x2="291.7" y2="224.2" stroke-width="1"/><line x1="290.4" y1="235.8" x2="282.7" y2="229.4" stroke-width="1"/><line x1="283.4" y1="243.4" x2="279.2" y2="239.2" stroke-width="1"/><line x1="275.8" y1="250.4" x2="269.4" y2="242.7" stroke-width="1"/><line x1="267.7" y1="256.7" x2="264.2" y2="251.7" stroke-width="1"/><line x1="259" y1="262.2" x2="251" y2="248.3" stroke-width="1"/><line x1="249.9" y1="266.9" x2="247.3" y2="261.5" stroke-width="1"/><line x1="240.4" y1="270.9" x2="236.9" y2="261.5" stroke-width="1"/><line x1="230.5" y1="274" x2="229" y2="268.2" stroke-width="1"/><line x1="220.5" y1="276.2" x2="218.8" y2="266.4" stroke-width="1"/><line x1="210.3" y1="277.6" x2="209.8" y2="271.6" stroke-width="1"/><line x1="200" y1="278" x2="200" y2="262" stroke-width="2"/><line x1="189.7" y1="277.6" x2="190.2" y2="271.6" stroke-width="1"/><line x1="179.5" y1="276.2" x2="181.2" y2="266.4" stroke-width="1"/><line x1="169.5" y1="274" x2="171" y2="268.2" stroke-width="1"/><line x1="159.6" y1="270.9" x2="163.1" y2="261.5" stroke-width="1"/><line x1="150.1" y1="266.9" x2="152.7" y2="261.5" stroke-width="1"/><line x1="141" y1="262.2" x2="149" y2="248.3" stroke-width="1"/><line x1="132.3" y1="256.7" x2="135.8" y2="251.7" stroke-width="1"/><line x1="124.2" y1="250.4" x2="130.6" y2="242.7" stroke-width="1"/><line x1="116.6" y1="243.4" x2="120.8" y2="239.2" stroke-width="1"/><line x1="109.6" y1="235.8" x2="117.3" y2="229.4" stroke-width="1"/><line x1="103.3" y1="227.7" x2="108.3" y2="224.2" stroke-width="1"/><line x1="97.8" y1="219" x2="111.7" y2="211" stroke-width="1"/><line x1="93.1" y1="209.9" x2="98.5" y2="207.3" stroke-width="1"/><line x1="89.1" y1="200.4" x2="98.5" y2="196.9" stroke-width="1"/><line x1="86" y1="190.5" x2="91.8" y2="189" stroke-width="1"/><line x1="83.8" y1="180.5" x2="93.6" y2="178.8" stroke-width="1"/><line x1="82.4" y1="170.3" x2="88.4" y2="169.8" stroke-width="1"/><line x1="82" y1="160" x2="98" y2="160" stroke-width="2"/><line x1="82.4" y1="149.7" x2="88.4" y2="150.2" stroke-width="1"/><line x1="83.8" y1="139.5" x2="93.6" y2="141.2" stroke-width="1"/><line x1="86" y1="129.5" x2="91.8" y2="131" stroke-width="1"/><line x1="89.1" y1="119.6" x2="98.5" y2="123.1" stroke-width="1"/><line x1="93.1" y1="110.1" x2="98.5" y2="112.7" stroke-width="1"/><line x1="97.8" y1="101" x2="111.7" y2="109" stroke-width="1"/><line x1="103.3" y1="92.3" x2="108.3" y2="95.8" stroke-width="1"/><line x1="109.6" y1="84.2" x2="117.3" y2="90.6" stroke-width="1"/><line x1="116.6" y1="76.6" x2="120.8" y2="80.8" stroke-width="1"/><line x1="124.2" y1="69.6" x2="130.6" y2="77.3" stroke-width="1"/><line x1="132.3" y1="63.3" x2="135.8" y2="68.3" stroke-width="1"/><line x1="141" y1="57.8" x2="149" y2="71.7" stroke-width="1"/><line x1="150.1" y1="53.1" x2="152.7" y2="58.5" stroke-width="1"/><line x1="159.6" y1="49.1" x2="163.1" y2="58.5" stroke-width="1"/><line x1="169.5" y1="46" x2="171" y2="51.8" stroke-width="1"/><line x1="179.5" y1="43.8" x2="181.2" y2="53.6" stroke-width="1"/><line x1="189.7" y1="42.4" x2="190.2" y2="48.4" stroke-width="1"/><line x1="167.6" y1="80.4" x2="172.1" y2="91.5" stroke-width="1"/><line x1="181.9" y1="75.9" x2="183.1" y2="81.8" stroke-width="1"/><line x1="196.7" y1="74.1" x2="197" y2="80.1" stroke-width="1"/><line x1="211.7" y1="74.8" x2="210.1" y2="86.7" stroke-width="1"/><line x1="226.3" y1="78.1" x2="224.5" y2="83.8" stroke-width="1"/><line x1="240.2" y1="83.9" x2="237.4" y2="89.3" stroke-width="1"/><line x1="252.7" y1="92.1" x2="245.4" y2="101.6" stroke-width="1"/><line x1="263.7" y1="102.3" x2="259.3" y2="106.3" stroke-width="1"/><line x1="272.8" y1="114.2" x2="267.7" y2="117.4" stroke-width="1"/><line x1="279.6" y1="127.6" x2="268.5" y2="132.1" stroke-width="1"/><line x1="284.1" y1="141.9" x2="278.2" y2="143.1" stroke-width="1"/><line x1="285.9" y1="156.7" x2="279.9" y2="157" stroke-width="1"/><line x1="285.2" y1="171.7" x2="273.3" y2="170.1" stroke-width="1"/><line x1="281.9" y1="186.3" x2="276.2" y2="184.5" stroke-width="1"/><line x1="276.1" y1="200.2" x2="270.7" y2="197.4" stroke-width="1"/><line x1="267.9" y1="212.7" x2="258.4" y2="205.4" stroke-width="1"/><line x1="257.7" y1="223.7" x2="253.7" y2="219.3" stroke-width="1"/><line x1="245.8" y1="232.8" x2="242.6" y2="227.7" stroke-width="1"/><line x1="232.4" y1="239.6" x2="227.9" y2="228.5" stroke-width="1"/><line x1="218.1" y1="244.1" x2="216.9" y2="238.2" stroke-width="1"/><line x1="203.3" y1="245.9" x2="203" y2="239.9" stroke-width="1"/><line x1="188.3" y1="245.2" x2="189.9" y2="233.3" stroke-width="1"/><line x1="173.7" y1="241.9" x2="175.5" y2="236.2" stroke-width="1"/><line x1="159.8" y1="236.1" x2="162.6" y2="230.7" stroke-width="1"/><line x1="147.3" y1="227.9" x2="154.6" y2="218.4" stroke-width="1"/><line x1="136.3" y1="217.7" x2="140.7" y2="213.7" stroke-width="1"/><line x1="127.2" y1="205.8" x2="132.3" y2="202.6" stroke-width="1"/><line x1="120.4" y1="192.4" x2="131.5" y2="187.9" stroke-width="1"/><line x1="115.9" y1="178.1" x2="121.8" y2="176.9" stroke-width="1"/><line x1="114.1" y1="163.3" x2="120.1" y2="163" stroke-width="1"/><line x1="114.8" y1="148.3" x2="126.7" y2="149.9" stroke-width="1"/><line x1="118.1" y1="133.7" x2="123.8" y2="135.5" stroke-width="1"/><line x1="123.9" y1="119.8" x2="129.3" y2="122.6" stroke-width="1"/><line x1="132.1" y1="107.3" x2="141.6" y2="114.6" stroke-width="1"/><line x1="142.3" y1="96.3" x2="146.3" y2="100.7" stroke-width="1"/><line x1="154.2" y1="87.2" x2="157.4" y2="92.3" stroke-width="1"/></g>
<g font-size="15" fill="var(--magenta)" text-anchor="middle"><text x="200" y="31">000</text><text x="334" y="165">090</text><text x="200" y="295">180</text><text x="66" y="165">270</text></g>
<path d="M200 26 l-6 12 h12 Z" fill="var(--magenta)"/>
<line x1="200" y1="160" x2="172.8" y2="93.3" stroke="var(--magenta)" stroke-width="1.6"/>
<path d="M172.8 93.3 L173.1 106.3 L183.1 106.3 Z" fill="var(--magenta)"/>
<g font-size="15" fill="var(--magenta)" text-anchor="middle"><text x="200" y="186">22°10′W 2025</text><text x="200" y="204">(7′W)</text></g>
<text x="189.9" y="115.5" font-size="15" fill="var(--magenta)">Nmg</text>
<text x="200" y="316" font-size="14" fill="var(--ink)" text-anchor="middle">Anel externo: verdadeiro · anel interno: magnético</text>
</svg>`;

  var FIG_CURVA = `<svg viewBox="0 0 400 290" width="100%" role="img" aria-labelledby="m3f3t" style="max-width:560px;display:block;margin:0 auto">
<title id="m3f3t">Curva de desvios de exemplo: desvio leste nas proas entre 015 e 225 graus, com máximo de 4 graus leste na proa 090, e desvio oeste entre 225 e 015 graus, com máximo de 4 graus oeste na proa 300</title>
<rect x="50" y="30" width="330" height="200" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="1"/>
<g stroke="var(--ink)" stroke-opacity="0.35" stroke-width="1"><line x1="77.5" y1="30" x2="77.5" y2="230"/><line x1="105" y1="30" x2="105" y2="230"/><line x1="132.5" y1="30" x2="132.5" y2="230"/><line x1="160" y1="30" x2="160" y2="230"/><line x1="187.5" y1="30" x2="187.5" y2="230"/><line x1="215" y1="30" x2="215" y2="230"/><line x1="242.5" y1="30" x2="242.5" y2="230"/><line x1="270" y1="30" x2="270" y2="230"/><line x1="297.5" y1="30" x2="297.5" y2="230"/><line x1="325" y1="30" x2="325" y2="230"/><line x1="352.5" y1="30" x2="352.5" y2="230"/><line x1="50" y1="210" x2="380" y2="210"/><line x1="50" y1="190" x2="380" y2="190"/><line x1="50" y1="170" x2="380" y2="170"/><line x1="50" y1="150" x2="380" y2="150"/><line x1="50" y1="110" x2="380" y2="110"/><line x1="50" y1="90" x2="380" y2="90"/><line x1="50" y1="70" x2="380" y2="70"/><line x1="50" y1="50" x2="380" y2="50"/></g>
<line x1="50" y1="130" x2="380" y2="130" stroke="var(--ink)" stroke-width="1.6"/>
<polyline points="50,150 77.5,110 105,70 132.5,50 160,70 187.5,70 215,90 242.5,110 270,150 297.5,190 325,210 352.5,190 380,150" fill="none" stroke="var(--magenta)" stroke-width="2.4"/>
<circle cx="50" cy="150" r="3.5" fill="var(--magenta)"/><circle cx="77.5" cy="110" r="3.5" fill="var(--magenta)"/><circle cx="105" cy="70" r="3.5" fill="var(--magenta)"/><circle cx="132.5" cy="50" r="3.5" fill="var(--magenta)"/><circle cx="160" cy="70" r="3.5" fill="var(--magenta)"/><circle cx="187.5" cy="70" r="3.5" fill="var(--magenta)"/><circle cx="215" cy="90" r="3.5" fill="var(--magenta)"/><circle cx="242.5" cy="110" r="3.5" fill="var(--magenta)"/><circle cx="270" cy="150" r="3.5" fill="var(--magenta)"/><circle cx="297.5" cy="190" r="3.5" fill="var(--magenta)"/><circle cx="325" cy="210" r="3.5" fill="var(--magenta)"/><circle cx="352.5" cy="190" r="3.5" fill="var(--magenta)"/>
<g stroke="var(--ink)" stroke-width="1.4" stroke-dasharray="4 3"><line x1="118.8" y1="230" x2="118.8" y2="60"/><line x1="50" y1="60" x2="118.8" y2="60"/></g>
<circle cx="118.8" cy="60" r="5" fill="none" stroke="var(--ink)" stroke-width="2"/>
<g font-size="15" fill="var(--ink)" text-anchor="middle"><text x="50" y="250">000</text><text x="132.5" y="250">090</text><text x="215" y="250">180</text><text x="297.5" y="250">270</text><text x="380" y="250">360</text><text x="215" y="272">proa (graus)</text></g>
<g font-size="15" fill="var(--ink)" text-anchor="end"><text x="44" y="55">4E</text><text x="44" y="95">2E</text><text x="44" y="135">0</text><text x="44" y="175">2W</text><text x="44" y="215">4W</text></g>
<text x="126.8" y="50" font-size="15" fill="var(--ink)">proa 075: 3,5° E</text>
</svg>`;

  var FIG_ALINH = `<svg viewBox="0 0 400 300" width="100%" role="img" aria-labelledby="m3f4t" style="max-width:560px;display:block;margin:0 auto">
<title id="m3f4t">Determinação do desvio por alinhamento: o barco governa exatamente sobre o alinhamento de duas marcas em terra e compara o rumo da agulha com o rumo magnético do alinhamento tirado da carta</title>
<rect x="0" y="0" width="400" height="300" fill="var(--sea-1)"/>
<path d="M0 0 H230 C200 40 170 60 150 110 C120 140 60 130 0 150 Z" fill="var(--land)" stroke="var(--ink)" stroke-width="1.2"/>
<g stroke="var(--ink)" stroke-width="2"><line x1="104" y1="66" x2="104" y2="32"/><line x1="134" y1="104" x2="134" y2="84"/></g>
<path d="M98 32 h12 l-6 -10 Z" fill="var(--ink)"/><path d="M128 84 h12 l-6 -10 Z" fill="var(--ink)"/>
<line x1="104" y1="60" x2="330" y2="286" stroke="var(--magenta)" stroke-width="2" stroke-dasharray="8 5"/>
<g transform="translate(270 226) rotate(-45)"><path d="M0 -26 C10 -14 10 10 7 20 L-7 20 C-10 10 -10 -14 0 -26 Z" fill="var(--nav-white)" stroke="var(--ink)" stroke-width="1.6"/></g>
<g font-size="15" fill="var(--ink)"><text x="116" y="30">marca posterior (alta)</text><text x="146" y="100">marca anterior</text></g>
<g font-size="15" fill="var(--ink)"><text x="16" y="200">Carta: Mv 315°</text><text x="16" y="218">Dec 22° W: Mmg 337°</text><text x="16" y="236" fill="var(--magenta)">Agulha: Rag 340°</text><text x="16" y="254" font-weight="700">Dag = 337 − 340 = 3° W</text></g>
</svg>`;

  var FIG_CONV = `<svg viewBox="0 0 400 230" width="100%" role="img" aria-labelledby="m3f5t" style="max-width:560px;display:block;margin:0 auto">
<title id="m3f5t">Conversão de rumos: da agulha para a carta, aplica-se o desvio e depois a declinação, somando leste e subtraindo oeste; da carta para a agulha, o caminho é o inverso, com os sinais trocados</title>
<rect x="14" y="80" width="88" height="54" rx="8" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="1.6"/><text x="58" y="106" font-size="18" font-weight="700" fill="var(--ink)" text-anchor="middle">Rag</text><text x="58" y="125" font-size="15" fill="var(--ink)" text-anchor="middle">agulha</text><rect x="156" y="80" width="88" height="54" rx="8" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="1.6"/><text x="200" y="106" font-size="18" font-weight="700" fill="var(--ink)" text-anchor="middle">Rmg</text><text x="200" y="125" font-size="15" fill="var(--ink)" text-anchor="middle">magnético</text><rect x="298" y="80" width="88" height="54" rx="8" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="1.6"/><text x="342" y="106" font-size="18" font-weight="700" fill="var(--ink)" text-anchor="middle">Rv</text><text x="342" y="125" font-size="15" fill="var(--ink)" text-anchor="middle">carta</text>
<defs><marker id="m3seta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="var(--magenta)"/></marker><marker id="m3setb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="var(--ink)"/></marker></defs>
<g stroke="var(--magenta)" stroke-width="2.2" fill="none" marker-end="url(#m3seta)"><path d="M70 76 C100 44 130 44 162 72"/><path d="M212 76 C242 44 272 44 304 72"/></g>
<g stroke="var(--ink)" stroke-width="2.2" fill="none" marker-end="url(#m3setb)"><path d="M330 138 C300 170 270 170 238 142"/><path d="M188 138 C158 170 128 170 96 142"/></g>
<g font-size="15" text-anchor="middle"><text x="116" y="40" fill="var(--magenta)">± Dag</text><text x="258" y="40" fill="var(--magenta)">± Dec mg</text><text x="200" y="18" fill="var(--magenta)" font-weight="700">Agulha → carta: leste soma, oeste subtrai</text>
<text x="116" y="188" fill="var(--ink)">∓ Dag</text><text x="258" y="188" fill="var(--ink)">∓ Dec mg</text><text x="200" y="218" fill="var(--ink)" font-weight="700">Carta → agulha: leste subtrai, oeste soma</text></g>
</svg>`;

  var FIG_MARC = `<svg viewBox="0 0 400 340" width="100%" role="img" aria-labelledby="m3f6t" style="max-width:520px;display:block;margin:0 auto">
<title id="m3f6t">Marcações relativas medidas a partir da proa, no sentido horário: A a 135 graus, B a 180, C a 270 e D a 340 graus</title>
<circle cx="200" cy="165" r="112" fill="var(--sea-1)" stroke="var(--ink)" stroke-width="1.4"/>
<g stroke="var(--ink)"><line x1="200" y1="53" x2="200" y2="67"/><line x1="219.4" y1="54.7" x2="218.6" y2="59.6"/><line x1="238.3" y1="59.8" x2="236.6" y2="64.5"/><line x1="256" y1="68" x2="251.5" y2="75.8"/><line x1="272" y1="79.2" x2="268.8" y2="83"/><line x1="285.8" y1="93" x2="282" y2="96.2"/><line x1="297" y1="109" x2="289.2" y2="113.5"/><line x1="305.2" y1="126.7" x2="300.5" y2="128.4"/><line x1="310.3" y1="145.6" x2="305.4" y2="146.4"/><line x1="312" y1="165" x2="298" y2="165"/><line x1="310.3" y1="184.4" x2="305.4" y2="183.6"/><line x1="305.2" y1="203.3" x2="300.5" y2="201.6"/><line x1="297" y1="221" x2="289.2" y2="216.5"/><line x1="285.8" y1="237" x2="282" y2="233.8"/><line x1="272" y1="250.8" x2="268.8" y2="247"/><line x1="256" y1="262" x2="251.5" y2="254.2"/><line x1="238.3" y1="270.2" x2="236.6" y2="265.5"/><line x1="219.4" y1="275.3" x2="218.6" y2="270.4"/><line x1="200" y1="277" x2="200" y2="263"/><line x1="180.6" y1="275.3" x2="181.4" y2="270.4"/><line x1="161.7" y1="270.2" x2="163.4" y2="265.5"/><line x1="144" y1="262" x2="148.5" y2="254.2"/><line x1="128" y1="250.8" x2="131.2" y2="247"/><line x1="114.2" y1="237" x2="118" y2="233.8"/><line x1="103" y1="221" x2="110.8" y2="216.5"/><line x1="94.8" y1="203.3" x2="99.5" y2="201.6"/><line x1="89.7" y1="184.4" x2="94.6" y2="183.6"/><line x1="88" y1="165" x2="102" y2="165"/><line x1="89.7" y1="145.6" x2="94.6" y2="146.4"/><line x1="94.8" y1="126.7" x2="99.5" y2="128.4"/><line x1="103" y1="109" x2="110.8" y2="113.5"/><line x1="114.2" y1="93" x2="118" y2="96.2"/><line x1="128" y1="79.2" x2="131.2" y2="83"/><line x1="144" y1="68" x2="148.5" y2="75.8"/><line x1="161.7" y1="59.8" x2="163.4" y2="64.5"/><line x1="180.6" y1="54.7" x2="181.4" y2="59.6"/></g>
<g transform="translate(200 165)"><path d="M0 -40 C14 -22 14 14 10 30 L-10 30 C-14 14 -14 -22 0 -40 Z" fill="var(--nav-white)" stroke="var(--ink)" stroke-width="1.8"/></g>
<text x="214" y="34" font-size="15" fill="var(--ink)">proa = 000° relativo</text>
<line x1="200" y1="165" x2="279.2" y2="244.2" stroke="var(--magenta)" stroke-width="1.6" stroke-dasharray="6 4"/><circle cx="279.2" cy="244.2" r="6" fill="var(--magenta)"/>
<text x="293.3" y="263.3" font-size="15" fill="var(--magenta)" text-anchor="start">A 135°</text>
<line x1="200" y1="165" x2="200" y2="277" stroke="var(--magenta)" stroke-width="1.6" stroke-dasharray="6 4"/><circle cx="200" cy="277" r="6" fill="var(--magenta)"/>
<text x="200" y="311" font-size="15" fill="var(--magenta)" text-anchor="middle">B 180°</text>
<line x1="200" y1="165" x2="88" y2="165" stroke="var(--magenta)" stroke-width="1.6" stroke-dasharray="6 4"/><circle cx="88" cy="165" r="6" fill="var(--magenta)"/>
<text x="68" y="170" font-size="15" fill="var(--magenta)" text-anchor="end">C 270°</text>
<line x1="200" y1="165" x2="161.7" y2="59.8" stroke="var(--magenta)" stroke-width="1.6" stroke-dasharray="6 4"/><circle cx="161.7" cy="59.8" r="6" fill="var(--magenta)"/>
<text x="154.9" y="46" font-size="15" fill="var(--magenta)" text-anchor="end">D 340°</text>
<text x="200" y="334" font-size="15" fill="var(--ink)" text-anchor="middle">Mv = Mr + Rv (tire 360° se passar)</text>
</svg>`;

  var FIG_PRUMO = `<svg viewBox="0 0 400 340" width="100%" role="img" aria-labelledby="m3f7t" style="max-width:500px;display:block;margin:0 auto">
<title id="m3f7t">Marcas da linha do prumo de mão de 1 a 10 metros: tiras de couro nos metros ímpares, nós de merlim nos pares e uma pinha com filele branco aos 10 metros</title>
<line x1="110" y1="34" x2="110" y2="286" stroke="var(--ink)" stroke-width="2"/>
<text x="96" y="39" font-size="15" fill="var(--ink)" text-anchor="end">zero (na mão)</text>
<rect x="107" y="51" width="6" height="14" fill="var(--land)" stroke="var(--ink)"/>
<text x="96" y="63" font-size="15" fill="var(--ink)" text-anchor="end">1 m</text><text x="150" y="63" font-size="15" fill="var(--ink)">tira de couro</text>
<circle cx="110" cy="82" r="3" fill="var(--ink)"/>
<text x="96" y="87" font-size="15" fill="var(--ink)" text-anchor="end">2 m</text><text x="150" y="87" font-size="15" fill="var(--ink)">1 nó de merlim</text>
<rect x="107" y="99" width="6" height="14" fill="var(--land)" stroke="var(--ink)"/>
<text x="96" y="111" font-size="15" fill="var(--ink)" text-anchor="end">3 m</text><text x="150" y="111" font-size="15" fill="var(--ink)">tira de couro</text>
<circle cx="110" cy="127" r="3" fill="var(--ink)"/>
<circle cx="110" cy="133" r="3" fill="var(--ink)"/>
<text x="96" y="135" font-size="15" fill="var(--ink)" text-anchor="end">4 m</text><text x="150" y="135" font-size="15" fill="var(--ink)">2 nós</text>
<rect x="107" y="147" width="6" height="14" fill="var(--land)" stroke="var(--ink)"/>
<text x="96" y="159" font-size="15" fill="var(--ink)" text-anchor="end">5 m</text><text x="150" y="159" font-size="15" fill="var(--ink)">tira de couro</text>
<circle cx="110" cy="172" r="3" fill="var(--ink)"/>
<circle cx="110" cy="178" r="3" fill="var(--ink)"/>
<circle cx="110" cy="184" r="3" fill="var(--ink)"/>
<text x="96" y="183" font-size="15" fill="var(--ink)" text-anchor="end">6 m</text><text x="150" y="183" font-size="15" fill="var(--ink)">3 nós</text>
<rect x="107" y="195" width="6" height="14" fill="var(--land)" stroke="var(--ink)"/>
<text x="96" y="207" font-size="15" fill="var(--ink)" text-anchor="end">7 m</text><text x="150" y="207" font-size="15" fill="var(--ink)">tira de couro</text>
<circle cx="110" cy="217" r="3" fill="var(--ink)"/>
<circle cx="110" cy="223" r="3" fill="var(--ink)"/>
<circle cx="110" cy="229" r="3" fill="var(--ink)"/>
<circle cx="110" cy="235" r="3" fill="var(--ink)"/>
<text x="96" y="231" font-size="15" fill="var(--ink)" text-anchor="end">8 m</text><text x="150" y="231" font-size="15" fill="var(--ink)">4 nós</text>
<rect x="107" y="243" width="6" height="14" fill="var(--land)" stroke="var(--ink)"/>
<text x="96" y="255" font-size="15" fill="var(--ink)" text-anchor="end">9 m</text><text x="150" y="255" font-size="15" fill="var(--ink)">tira de couro</text>
<circle cx="110" cy="274" r="7" fill="var(--ink)"/><path d="M116 274 l26 -6 l0 12 Z" fill="var(--nav-white)" stroke="var(--ink)"/>
<text x="96" y="279" font-size="15" fill="var(--ink)" text-anchor="end">10 m</text><text x="150" y="279" font-size="15" fill="var(--ink)">pinha + filele branco</text>
<path d="M101 286 h18 l6 34 h-30 Z" fill="var(--ink)"/>
<text x="140" y="308" font-size="15" fill="var(--ink)">chumbada (base com sebo)</text>
</svg>`;

  VL.dado('cursos/mestre-1', {
    modulos: [
      /* =============================================================================== M1 */
      {
        id: 'm1', titulo: 'A carta náutica',
        resumo: 'O que é a carta náutica, a projeção de Mercator, escalas, latitude e longitude nas bordas, o título e as notas, o catálogo de cartas e os símbolos da Carta 12000 (INT 1): faróis, boias, sondagens, isóbatas, nível de redução, altitudes, perigos, cascos soçobrados e natureza do fundo.',
        licoes: [
          /* ---------------------------------------------------------------- l1 */
          {
            id: 'l1', titulo: 'A carta náutica: a ferramenta central do Mestre', minutos: 9,
            objetivos: [
              'Explicar a diferença entre carta náutica e mapa.',
              'Saber quem produz as cartas brasileiras e em que formatos elas existem.',
              'Aplicar as regras de ouro do trabalho na carta: maior escala, lápis e carta atualizada.',
            ],
            blocos: [
              { t: 'p', html: 'No Arrais, você navegou em águas abrigadas, quase sempre vendo onde estava. No Mestre, você vai conduzir o barco entre portos, ao longo da costa. Ali, a pergunta “onde estou e para onde devo governar?” se responde em cima de uma folha de papel: a <b>carta náutica</b>.' },
              { t: 'p', html: 'Um <b>mapa</b> serve para olhar: mostra cidades, estradas e fronteiras. Uma <b>carta</b> serve para <b>trabalhar sobre ela</b>. Nela você mede ângulos (rumos e marcações), mede distâncias e marca posições pelas coordenadas, com régua, compasso e lápis. Por isso os documentos usados na navegação se chamam sempre cartas, nunca mapas.' },
              { t: 'p', html: 'A carta mostra o que interessa a quem navega: profundidades, perigos (bancos, pedras submersas, cascos soçobrados), natureza do fundo, fundeadouros, auxílios à navegação (faróis, boias, balizas), altitudes e pontos notáveis de terra, linha de costa, marés, correntes e a declinação magnética.' },
              { t: 'termos', ids: ['carta-nautica', 'escala-da-carta', 'sondagem', 'isobata', 'carta-12000'] },
              { t: 'figura', svg: FIG_FOLHA, legenda: 'As partes de uma folha de carta. As escalas das bordas servem para ler e marcar coordenadas e medir distâncias; o título e as notas dizem como interpretar tudo o resto.' },
              { t: 'h', txt: 'Quem faz as cartas do Brasil' },
              { t: 'p', html: 'A Diretoria de Hidrografia e Navegação (DHN), por meio do Centro de Hidrografia da Marinha (CHM), produz e mantém atualizadas as cartas das águas jurisdicionais brasileiras. A carta em papel é impressa sob demanda e vendida pela EMGEPRON: quando você compra, ela sai atualizada até o último Aviso aos Navegantes daquela data.' },
              { t: 'lista', itens: [
                '<b>Carta em papel</b>: o documento tradicional. É nela que se treina para a prova.',
                '<b>Carta raster</b> (RNC): imagem digitalizada e georreferenciada da carta em papel. O CHM oferece as cartas raster de graça, no formato BSB.',
                '<b>Carta eletrônica</b> (ENC): um banco de dados vetorial, que permite alarmes de profundidade e perigo. A ENC oficial é distribuída por distribuidores autorizados, não por download gratuito.',
              ] },
              { t: 'callout', tipo: 'seguranca', titulo: 'Plotter ajuda, mas não substitui a carta', html: 'O CHM avisa que a carta raster não dispensa a carta em papel atualizada e recomenda configurar o GPS e o programa no datum WGS-84. Os arquivos GeoTIFF do site são só para fins acadêmicos: não servem para navegar. No mar, a bateria acaba, a tela molha e o aplicativo pode trazer uma carta desatualizada.' },
              { t: 'fato', ref: 'extra-mestre-1-04', html: 'A NORMAM-211 exige que as embarcações de esporte e recreio, exceto as miúdas, tenham a bordo cartas náuticas das regiões onde vão operar, em local acessível. Um Sistema de Cartas Eletrônicas (ECS) pode ser aceito para cumprir essa exigência.' },
              { t: 'h', txt: 'Regras de ouro do trabalho na carta' },
              { t: 'lista', ordenada: true, itens: [
                '<b>Use a carta de maior escala</b> que cobre a área. Ela mostra mais detalhes do fundo, dos perigos e da costa, e o mesmo erro de lápis vale poucos metros nela e muitos décimos de milha numa carta de pequena escala.',
                '<b>Trabalhe só a lápis</b>, com traço leve e borracha macia. Não use caneta nos traçados de navegação; a única exceção é a correção de Aviso Permanente, a tinta vermelha (lição 4).',
                '<b>Leia o título e todas as notas</b> antes de traçar qualquer linha.',
                '<b>Na carta só se traçam rumos e marcações verdadeiros.</b> A conversão a partir da agulha é assunto do módulo 3.',
                '<b>Confira se a carta está atualizada</b> pelos Avisos aos Navegantes.',
              ] },
              { t: 'fato', ref: 'programa-14', html: 'A prova de Mestre-Amador tem 40 questões de múltipla escolha, quatro delas resolvidas com uso de carta náutica, e dura no máximo três horas.' },
              { t: 'callout', tipo: 'dica', titulo: 'Comece a juntar o seu material', html: 'Para treinar em casa: compasso de pontas secas, régua paralela (ou um par de esquadros), transferidor, lápis HB ou lapiseira 0,5 mm e borracha macia. Este curso traz uma carta de treino interativa, mas vale imprimir ou comprar uma carta real da sua região.' },
              { t: 'callout', tipo: 'intl', intl: true, titulo: 'Trilha internacional', html: 'Os símbolos das cartas seguem o padrão da Organização Hidrográfica Internacional. No Reino Unido, a versão do INT 1 é a <i>Chart 5011</i> (UKHO); nos Estados Unidos, a <i>U.S. Chart No. 1</i>. Os desenhos são os mesmos da Carta 12000; mudam as abreviaturas, em inglês.' },
              { t: 'check', questoes: [
                { id: 'msa1-l1-1', nivel: 'mestre', tema: 'Carta náutica', dificuldade: 1,
                  enunciado: 'Qual é a principal diferença entre uma carta náutica e um mapa?',
                  alternativas: [
                    'A carta é feita para se trabalhar sobre ela: medir ângulos e distâncias e plotar posições, com profundidades, perigos e auxílios à navegação.',
                    'O mapa é desenhado numa projeção cartográfica e a carta náutica não usa projeção nenhuma.',
                    'A carta náutica existe só em formato eletrônico; o mapa existe em papel.',
                    'O mapa mostra as profundidades e a carta mostra só a parte de terra.',
                  ], correta: 0,
                  explicacao: 'A carta é um documento técnico para resolver problemas gráficos de navegação: ângulos, distâncias e coordenadas. Os dois documentos usam projeções (a carta náutica, em geral, a de Mercator). A carta existe em papel e em formatos digitais. E é a carta, não o mapa, que traz profundidades e perigos.',
                  referencia: 'Miguens, vol. I, itens 2.1 e 2.6.1', fonte_url: VOL1 },
                { id: 'msa1-l1-2', nivel: 'mestre', tema: 'Carta náutica', dificuldade: 1,
                  enunciado: 'Duas cartas cobrem a entrada do porto onde você vai chegar: uma na escala 1:300.000 e outra na escala 1:25.000. Qual delas deve ser usada na aproximação?',
                  alternativas: ['A de 1:25.000, porque é a de maior escala e mostra mais detalhes.', 'A de 1:300.000, porque mostra uma área maior.', 'Tanto faz, porque as duas têm as mesmas sondagens.', 'A de edição mais antiga, porque já foi testada pelos navegantes.'], correta: 0,
                  explicacao: 'A regra é navegar sempre na carta de maior escala (denominador menor). Ela mostra mais detalhes do fundo e dos perigos, e o erro gráfico vale menos metros. A carta de 1:300.000 cobre mais área, mas com menos detalhe. As sondagens não são as mesmas: a carta de pequena escala omite muitas. Edição antiga não é vantagem: levantamentos antigos tendem a ser menos precisos.',
                  referencia: 'Miguens, vol. I, itens 2.6.2 e 2.7', fonte_url: VOL1 },
                { id: 'msa1-l1-3', nivel: 'mestre', tema: 'Carta náutica', dificuldade: 2,
                  enunciado: 'Sobre as cartas raster que o CHM disponibiliza gratuitamente, é correto afirmar:',
                  alternativas: [
                    'São imagens georreferenciadas das cartas em papel e não dispensam a carta em papel atualizada.',
                    'São cartas eletrônicas vetoriais (ENC), com alarmes automáticos de perigo.',
                    'Os arquivos GeoTIFF do site podem ser usados como auxílio à navegação.',
                    'Dispensam qualquer atualização, porque são geradas a cada viagem.',
                  ], correta: 0,
                  explicacao: 'A carta raster (RNC) é a imagem digitalizada e georreferenciada da carta em papel, e o CHM avisa que ela não dispensa a carta em papel atualizada. Quem tem estrutura vetorial e alarmes é a ENC. Os GeoTIFF são para fins acadêmicos e não devem ser usados para navegar. E toda carta precisa de atualização pelos Avisos aos Navegantes.',
                  referencia: 'CHM, páginas Cartas Náuticas e Cartas Raster; Miguens, vol. I, item 2.6.4', fonte_url: CHM_RASTER },
              ] },
              { t: 'fontes', itens: [
                mig('cap. 2, itens 2.1, 2.6, 2.7 e 2.8'),
                { txt: 'CHM, Cartas Náuticas (raster gratuitas, ENC e datum WGS-84)', url: CHM_CARTAS, ref: 'tecnico-146' },
                { txt: 'CHM, Cartas Raster (GeoTIFF só para fins acadêmicos)', url: CHM_RASTER, ref: 'tecnico-149' },
                { txt: 'NORMAM-211/DPC, art. 4.20 (Publicações)', url: NORMAM211, ref: 'extra-mestre-1-04' },
                { txt: 'NORMAM-211/DPC, Anexo 5-A, Seção I, item 2 (exame de Mestre-Amador)', url: NORMAM211, ref: 'programa-14' },
              ] },
            ],
          },
          /* ---------------------------------------------------------------- l2 */
          {
            id: 'l2', titulo: 'A projeção de Mercator e a escala da carta', minutos: 12,
            objetivos: [
              'Explicar por que as cartas náuticas usam a projeção de Mercator.',
              'Entender as latitudes crescidas e por que a distância se mede na escala de latitudes.',
              'Ler a escala natural e classificar uma carta como de pequena, média ou grande escala.',
            ],
            blocos: [
              { t: 'p', html: 'A Terra é quase uma esfera e a carta é plana. Não existe jeito de “desembrulhar” uma esfera sem deformar alguma coisa: ângulos, áreas ou distâncias. Por isso o cartógrafo escolhe uma <b>projeção</b> que preserve o que mais importa para aquele uso.' },
              { t: 'p', html: 'Para o navegante, o que importa é o <b>rumo</b>. Quem governa pela agulha segue uma linha que corta todos os meridianos com o mesmo ângulo: a <b>loxodromia</b>, ou linha de rumo. A carta ideal para navegar precisa mostrar essa linha como uma reta, com o ângulo certo.' },
              { t: 'termos', ids: ['projecao-de-mercator', 'loxodromica', 'ortodromica', 'meridiano', 'paralelo'] },
              { t: 'h', txt: 'A solução de Mercator' },
              { t: 'p', html: 'Em 1569, Gerardus Mercator publicou uma carta em que as loxodromias são retas. Hoje ela é descrita como uma <b>projeção cilíndrica equatorial conforme</b>: imagine um cilindro encostado na Terra pelo Equador. Os meridianos viram retas verticais e paralelas entre si; os paralelos viram retas horizontais.' },
              { t: 'p', html: 'Só que, na Terra, os meridianos se juntam nos polos. Ao torná-los paralelos, a projeção “estica” os paralelos, e estica mais quanto maior a latitude. Para não deformar os ângulos (é isso que “conforme” quer dizer), ela estica os meridianos na mesma proporção. Resultado: perto dos polos, tudo fica ampliado.' },
              { t: 'figura', svg: FIG_MERCATOR, legenda: 'Grade de Mercator de 0° a 70°: os paralelos se afastam cada vez mais. Os dois círculos têm o mesmo tamanho na Terra. A linha magenta, de rumo constante, é uma reta.' },
              { t: 'lista', itens: [
                '<b>Vantagens</b>: meridianos e paralelos são retas perpendiculares; é fácil plotar e ler coordenadas; o ângulo medido na carta é o ângulo verdadeiro; a linha de rumo é uma reta.',
                '<b>Limitações</b>: deformação grande em altas latitudes (a Groenlândia parece maior que o Brasil, que tem quatro vezes a área dela); os polos não podem ser representados; o arco de círculo máximo (o caminho mais curto, a <b>ortodromia</b>) aparece curvo. Para planejar derrotas oceânicas longas usa-se a carta gnomônica, assunto do Capitão-Amador.',
              ] },
              { t: 'h', txt: 'Latitudes crescidas: a regra que protege a sua distância' },
              { t: 'p', html: 'Numa carta de Mercator, a escala de longitudes é constante, mas a escala de latitudes cresce à medida que a latitude aumenta. O minuto de latitude desenhado na borda sul de uma carta do Sudeste é um pouco mais comprido que o da borda norte. Esse crescimento acompanha exatamente o “esticamento” da carta naquela altura.' },
              { t: 'p', html: 'Daí a regra: <b>distância se mede na escala de latitudes, na altura do trecho medido</b>. Nunca na escala de longitudes. Um minuto de longitude só tem uma milha no Equador; a 23°S ele vale cerca de 0,92 milha. Quem mede 10′ na escala de longitudes, nessa latitude, acha 10 milhas onde há só 9,2.' },
              { t: 'h', txt: 'A escala da carta' },
              { t: 'p', html: 'A <b>escala</b> é a relação entre o tamanho na carta e o tamanho real. Na escala 1:100.000, 1 mm na carta vale 100.000 mm na Terra, ou seja, 100 m. <b>Quanto maior o denominador, menor a escala</b>: uma carta 1:300.000 é de escala menor que uma 1:25.000.' },
              { t: 'p', html: 'O título mostra a <b>escala natural</b> junto com o paralelo de referência, por exemplo “Escala 1:300.000 (3°30′)”. Como a escala de Mercator muda com a latitude, ela só é exata naquele paralelo, que normalmente é a latitude média da área.' },
              { t: 'lista', itens: [
                '500 m numa carta 1:100.000: 500 m ÷ 100 m por mm = <b>5 mm</b>.',
                'Os mesmos 500 m numa carta 1:25.000: 500 ÷ 25 = <b>20 mm</b>.',
                '15 mm medidos numa carta 1:25.000: 15 × 25 m = <b>375 m</b>.',
              ] },
              { t: 'tabela', cab: ['Uso da carta', 'Faixa de escala (OHI, S-4)', 'Séries da DHN'],
                linhas: [
                  ['Navegação oceânica (pequena escala)', 'menor que 1:2.000.000', 'oceânicas: 1:3.500.000 a 1:10.000.000'],
                  ['Travessia e aterragem (média escala)', '1:2.000.000 a 1:350.000', 'gerais: 1:1.000.000'],
                  ['Navegação costeira (média escala)', '1:350.000 a 1:75.000', 'costeiras: 1:300.000'],
                  ['Aproximação de portos (grande escala)', '1:75.000 a 1:30.000', 'aproximação: 1:75.000 a 1:100.000'],
                  ['Portos, fundeadouros e canais (grande escala)', 'maior que 1:30.000', 'porto: maior que 1:30.000'],
                ], legenda: 'Classificação da publicação S-4 da OHI e escalas das séries de cartas em papel da DHN (III Plano Cartográfico Náutico Brasileiro), conforme o Miguens, vol. I, item 2.6.2.' },
              { t: 'callout', tipo: 'dica', titulo: 'Para não confundir', html: 'Grande escala = muito detalhe = área pequena (pense num zoom grande). Pequena escala = pouco detalhe = área grande.' },
              { t: 'check', questoes: [
                { id: 'msa1-l2-1', nivel: 'mestre', tema: 'Carta náutica', dificuldade: 2,
                  enunciado: 'Numa carta de Mercator, por que a distância deve ser medida na escala de latitudes?',
                  alternativas: [
                    'Porque a escala de latitudes cresce junto com a deformação da carta e 1′ de latitude corresponde a 1 milha náutica.',
                    'Porque a escala de longitudes é graduada em graus e não em minutos.',
                    'Porque a escala de latitudes é igual em toda a carta, ao contrário da de longitudes.',
                    'Tanto faz: as duas escalas dão a mesma distância em qualquer latitude.',
                  ], correta: 0,
                  explicacao: 'Na Mercator, a escala de latitudes cresce com a latitude na mesma proporção em que a carta foi esticada, e um minuto de latitude vale uma milha. A escala de longitudes é constante e só equivale a milhas no Equador. As duas bordas têm graus e minutos. A escala de latitudes não é igual em toda a carta: é a de longitudes que é constante. Por isso as escalas não dão a mesma distância fora do Equador.',
                  referencia: 'Miguens, vol. I, itens 1.7.1 e 2.4.4', fonte_url: VOL1 },
                { id: 'msa1-l2-2', nivel: 'mestre', tema: 'Carta náutica', dificuldade: 2,
                  enunciado: 'Numa carta na escala 1:50.000, você mede 2 cm entre dois pontos. Qual é a distância real?',
                  alternativas: ['1.000 m', '100 m', '10 km', '2.500 m'], correta: 0,
                  explicacao: '2 cm × 50.000 = 100.000 cm = 1.000 m (cerca de 0,54 milha). 100 m seria uma escala de 1:5.000; 10 km, de 1:500.000. 2.500 m resulta de dividir 50.000 por 20 em vez de multiplicar.',
                  referencia: 'Miguens, vol. I, item 2.6.2', fonte_url: VOL1 },
                { id: 'msa1-l2-3', nivel: 'mestre', tema: 'Carta náutica', dificuldade: 2,
                  enunciado: 'Qual propriedade torna a projeção de Mercator a mais usada nas cartas náuticas?',
                  alternativas: [
                    'A linha de rumo constante (loxodromia) aparece como reta e os ângulos medidos na carta são os verdadeiros.',
                    'O caminho mais curto entre dois pontos (ortodromia) aparece sempre como reta.',
                    'As áreas são representadas sem deformação em todas as latitudes.',
                    'Os polos aparecem com a forma correta.',
                  ], correta: 0,
                  explicacao: 'A Mercator é conforme e mostra a loxodromia como reta, o que permite traçar e ler rumos diretamente. Quem mostra a ortodromia como reta é a projeção gnomônica. A Mercator deforma muito as áreas em latitudes altas e não consegue representar os polos.',
                  referencia: 'Miguens, vol. I, itens 2.4.3 e 2.5.1', fonte_url: VOL1 },
              ] },
              { t: 'fontes', itens: [
                mig('cap. 1, item 1.7, e cap. 2, itens 2.1 a 2.6.2'),
                { txt: 'OHI, publicação S-4 (classificação das cartas por escala), citada no Miguens, vol. I, item 2.6.2', url: VOL1 },
              ] },
            ],
          },
          /* ---------------------------------------------------------------- l3 */
          {
            id: 'l3', titulo: 'Latitude, longitude e as escalas das bordas', minutos: 12,
            objetivos: [
              'Definir latitude e longitude e escrevê-las no padrão da DHN.',
              'Ler as graduações das bordas da carta em graus, minutos e décimos.',
              'Evitar o erro de sentido típico de quem navega no Hemisfério Sul, a oeste de Greenwich.',
            ],
            blocos: [
              { t: 'p', html: 'Toda posição na Terra é dada por duas coordenadas. A <b>latitude</b> (símbolo φ) é o arco de meridiano entre o Equador e o paralelo do lugar: vai de 0° a 90°, para o Norte (N) ou para o Sul (S). A <b>longitude</b> (símbolo λ) é o arco do Equador entre o meridiano de Greenwich e o meridiano do lugar: vai de 0° a 180°, para Leste (E) ou para Oeste (W).' },
              { t: 'p', html: 'Todo o Brasil fica a oeste de Greenwich, então as longitudes são sempre W. Quase todo o litoral fica ao sul do Equador; só o extremo norte (Amapá e a foz do Amazonas) está no Hemisfério Norte.' },
              { t: 'termos', ids: ['latitude', 'longitude', 'equador', 'meridiano', 'paralelo', 'datum'] },
              { t: 'h', txt: 'Como escrever uma posição' },
              { t: 'p', html: 'Na navegação usam-se graus, minutos e <b>décimos de minuto</b>, e não segundos. A longitude leva sempre três algarismos nos graus. Exemplo no padrão da DHN: <b>Lat 23°48,6′ S, Long 044°05,8′ W</b>. Um décimo de minuto de latitude vale cerca de 185 m.' },
              { t: 'callout', tipo: 'nota', titulo: 'Segundos não são décimos', html: '23°48′30″ é igual a <b>23°48,5′</b> (30 segundos são meio minuto), e não 23°48,3′. Configure o GPS para graus e minutos decimais e para o datum WGS-84, o mesmo das cartas atuais da DHN.' },
              { t: 'h', txt: 'As escalas das bordas' },
              { t: 'p', html: 'Ao longo dos meridianos extremos (bordas da esquerda e da direita) fica a <b>escala de latitudes</b>. Ao longo dos paralelos extremos (bordas de cima e de baixo) fica a <b>escala de longitudes</b>. Cada grau se divide em minutos, e cada minuto em décimos ou em quintos, conforme a escala da carta. Antes de ler, conte quantas divisões há entre dois minutos rotulados.' },
              { t: 'figura', svg: FIG_BORDAS, legenda: 'Canto inferior esquerdo de um trecho de carta perto de 23°50′S, 044°10′W. As faixas alternadas valem 0,1′ cada; o minuto de latitude é um pouco maior que o de longitude, como em toda carta de Mercator nessa latitude. O ponto magenta está 0,7′ acima (ao norte) de 23°50′ e 0,7′ à esquerda (a oeste) de 044°10′: 23°49,3′S, 044°10,7′W.' },
              { t: 'h', txt: 'O erro clássico: o sentido da leitura' },
              { t: 'p', html: 'No Hemisfério Sul, <b>a latitude cresce para baixo</b>, em direção ao Sul. A oeste de Greenwich, <b>a longitude cresce para a esquerda</b>, em direção ao Oeste. Quem está acostumado com gráficos de escola, em que os números crescem para cima e para a direita, erra o sentido e lê, por exemplo, 23°50,7′ em vez de 23°49,3′.' },
              { t: 'lista', ordenada: true, itens: [
                'Identifique o hemisfério (N ou S) e o lado de Greenwich (E ou W) olhando os números da borda.',
                'Ache os dois minutos inteiros rotulados mais próximos do ponto.',
                'Conte os décimos no sentido em que os valores crescem.',
                'Escreva a posição completa, com N ou S e E ou W.',
              ] },
              { t: 'widget', w: 'carta-nautica', opts: { modo: 'explorar', ferramenta: 'posicao' }, legenda: 'Carta de treino, costa fictícia de 23°40′S a 24°00′S e de 044°24′W a 044°00′W. Use a ferramenta de posição para ler as coordenadas de alguns pontos. Repare que a latitude cresce para baixo e a longitude para a esquerda. Faça zoom para ver os décimos de minuto nas bordas.' },
              { t: 'callout', tipo: 'intl', intl: true, titulo: 'Trilha internacional', html: 'Em cartas e livros em inglês, a vírgula decimal vira ponto: 23°48.6′S, 044°05.8′W. Nos exames da RYA a posição costuma ser escrita assim, com os minutos e décimos.' },
              { t: 'check', questoes: [
                { id: 'msa1-l3-1', nivel: 'mestre', tema: 'Coordenadas e distâncias', dificuldade: 1,
                  enunciado: 'Numa carta da costa de São Paulo, para que lado os valores de latitude aumentam?',
                  alternativas: ['Para a borda inferior (Sul).', 'Para a borda superior (Norte).', 'Para a borda direita (Leste).', 'Não aumentam: a latitude é a mesma em toda a carta.'], correta: 0,
                  explicacao: 'No Hemisfério Sul a latitude é contada do Equador para o Sul, então cresce para baixo na carta, que tem o Norte em cima. Para cima ela diminui. A borda direita é onde a longitude W diminui. E cada paralelo da carta tem uma latitude diferente.',
                  referencia: 'Miguens, vol. I, item 1.6', fonte_url: VOL1 },
                { id: 'msa1-l3-2', nivel: 'mestre', tema: 'Coordenadas e distâncias', dificuldade: 2,
                  enunciado: 'O GPS, configurado em graus, minutos e segundos, mostra 23°48′30″ S. Em graus, minutos e décimos de minuto, essa latitude é:',
                  alternativas: ['23°48,5′ S', '23°48,3′ S', '23°49,0′ S', '23,48° S'], correta: 0,
                  explicacao: '30 segundos são meio minuto, ou 0,5′: 23°48,5′ S. Escrever 48,3′ é confundir segundos com décimos. 49,0′ arredonda demais. 23,48° mistura os minutos com fração decimal do grau (23,48° seria 23°28,8′).',
                  referencia: 'Miguens, vol. I, item 1.6 e Apêndice A ao cap. 2', fonte_url: VOL1 },
                { id: 'msa1-l3-3', nivel: 'mestre', tema: 'Coordenadas e distâncias', dificuldade: 1,
                  enunciado: 'Onde fica a escala de longitudes numa carta de Mercator?',
                  alternativas: ['Nas bordas de cima e de baixo (paralelos extremos).', 'Nas bordas da esquerda e da direita (meridianos extremos).', 'No anel externo da rosa dos rumos.', 'No título, junto da escala natural.'], correta: 0,
                  explicacao: 'A escala de longitudes acompanha os paralelos extremos, nas bordas superior e inferior. Nas bordas laterais fica a escala de latitudes. A rosa dos rumos é graduada em graus de direção, não em longitude. O título traz a escala natural, que é outra coisa.',
                  referencia: 'Miguens, vol. I, item 2.6.3 a', fonte_url: VOL1 },
              ] },
              { t: 'fontes', itens: [
                mig('cap. 1, itens 1.5 e 1.6, e cap. 2, item 2.6.3'),
                { txt: 'CHM, Cartas Náuticas (recomendação do datum WGS-84)', url: CHM_CARTAS, ref: 'tecnico-146' },
              ] },
            ],
          },
          /* ---------------------------------------------------------------- l4 */
          {
            id: 'l4', titulo: 'Título, notas e o catálogo de cartas', minutos: 11,
            objetivos: [
              'Ler o título da carta e entender cada informação dele.',
              'Reconhecer notas de precaução, diagrama de levantamentos e o significado das cores.',
              'Usar o catálogo para montar o jogo de cartas de uma derrota e mantê-lo atualizado.',
            ],
            blocos: [
              { t: 'p', html: 'Antes de traçar qualquer linha, leia o <b>título</b>. Ele diz em que unidade estão as profundidades, a partir de que nível elas foram medidas, em que datum estão as posições e qual sistema de balizamento a carta usa. Errar uma dessas informações leva a erros de metros na profundidade e de centenas de metros na posição.' },
              { t: 'figura', svg: FIG_TITULO, legenda: 'Título da carta de treino deste curso (fictícia), montado com os elementos e a ordem das cartas da DHN.' },
              { t: 'lista', ordenada: true, itens: [
                '<b>Área e trecho da costa.</b> Para a cartografia náutica, a costa do Brasil se divide em Costa Norte (do Cabo Orange ao Cabo Calcanhar), Costa Leste (do Cabo Calcanhar ao Cabo Frio) e Costa Sul (do Cabo Frio ao Arroio Chuí).',
                '<b>Referência geográfica</b> da área, do Norte para o Sul (ex.: “Do Cabo Orange à Ponta Tucumã”).',
                '<b>Unidade das profundidades</b>: metros, nas cartas brasileiras.',
                '<b>Escala natural e paralelo de referência</b> (ex.: 1:300.000 (3°30′)).',
                '<b>Nível de redução das profundidades</b>: nas cartas brasileiras, o nível médio das baixa-mares de sizígia.',
                '<b>Altitudes</b> em metros acima do nível médio do mar.',
                '<b>Datum horizontal</b>: hoje, WGS-84, o mesmo do GPS.',
                '<b>Balizamento</b>: Sistema IALA, Região B.',
                '<b>Projeção</b>: Mercator.',
                '<b>Levantamentos</b>: remete ao diagrama de levantamentos.',
              ] },
              { t: 'callout', tipo: 'nota', titulo: 'Carta antiga, datum antigo', html: 'Cartas muito antigas podem estar em outro datum (Córrego Alegre ou SAD-69). Nesse caso a posição do GPS precisa de correção, informada em nota na própria carta. Sempre confira o datum no título antes de plotar posições do GPS.' },
              { t: 'h', txt: 'Notas, diagrama de levantamentos e cores' },
              { t: 'p', html: 'As <b>notas de precaução e explanatórias</b>, em geral perto do título, avisam sobre áreas de fundeio ou navegação proibidos, marés ou correntes anormais, anomalias magnéticas e outros assuntos que não cabem num símbolo. Leia todas.' },
              { t: 'p', html: 'O <b>diagrama de levantamentos</b> mostra quando e em que escala cada área foi sondada. Levantamento antigo é menos preciso; fundo de areia ou lama muda com os anos; e espaços em branco entre sondagens podem significar que ali ninguém sondou. Em área de pedras, trate esses espaços como suspeitos.' },
              { t: 'callout', tipo: 'seguranca', titulo: 'Costa de pedra: respeite a isóbata de 20 m', html: 'O Manual de Navegação da DHN recomenda não navegar, em costa rochosa, por dentro da linha de 20 metros de profundidade sem tomar toda precaução: pedras isoladas e escarpadas podem não ter sido encontradas na sondagem. Se a carta tiver uma derrota aconselhada, navegue sobre ela.' },
              { t: 'p', html: 'As cores também informam. <b>Preto</b>: estrutura da carta, feições físicas e profundidades. <b>Magenta</b>: luzes, rosas dos rumos, cabos e dutos submarinos, áreas restritas e outras informações sobrepostas. <b>Bege</b> (ou cinza): terra. <b>Azul</b>: águas rasas, mais escuro quanto mais raso. <b>Verde</b>: áreas que cobrem e descobrem com a maré.' },
              { t: 'h', txt: 'Número da carta e catálogo' },
              { t: 'p', html: 'Cada carta tem um número da DHN. As da série internacional têm também um número INT: a Carta 21100, por exemplo, é a INT 4194. As cartas INT trazem as abreviaturas em inglês; as exclusivamente nacionais, em português. A tábua de marés do Porto de Cabedelo, por exemplo, indica como carta de referência a Carta 830.' },
              { t: 'fato', ref: 'extra-mestre-1-06', html: 'O catálogo vigente é o Catálogo de Cartas e Publicações 2026-2030 (15ª edição) do CHM. Cartas e publicações podem ser compradas no Posto de Vendas da EMGEPRON, em Niterói, ou na loja on-line cartasnauticasbrasil.com.br.' },
              { t: 'lista', ordenada: true, itens: [
                'No catálogo, ache as cartas gerais e costeiras que cobrem toda a derrota.',
                'Acrescente as cartas de aproximação e de porto da partida, da chegada e dos abrigos possíveis no caminho.',
                'Confira a edição e as correções de cada carta.',
                'Leve também a Carta 12000 e as publicações de apoio (Roteiro, Lista de Faróis, Tábuas das Marés).',
              ] },
              { t: 'h', txt: 'Manter a carta atualizada' },
              { t: 'p', html: 'As alterações que afetam a segurança da navegação saem nos <b>Avisos aos Navegantes</b>. Correção de Aviso Permanente: a tinta vermelha, sem rasura, registrando o ano e o número do aviso no canto esquerdo da margem inferior. Avisos Temporários e Preliminares: a lápis, apagados quando cancelados. Informação cancelada se risca, nunca se apaga. O módulo de publicações náuticas detalha os Avisos.' },
              { t: 'check', questoes: [
                { id: 'msa1-l4-1', nivel: 'mestre', tema: 'Carta náutica', dificuldade: 2,
                  enunciado: 'O título diz: “Profundidades em metros reduzidas ao nível médio das baixa-mares de sizígia”. Isso significa que:',
                  alternativas: [
                    'As sondagens foram referidas a um nível baixo de maré; na maior parte do tempo há mais água do que a carta mostra.',
                    'As sondagens foram medidas a partir do nível médio do mar.',
                    'São as altitudes dos morros que estão em metros acima da baixa-mar.',
                    'A carta garante que nunca haverá menos água do que a sondagem, em nenhuma maré.',
                  ], correta: 0,
                  explicacao: 'O nível de redução das cartas brasileiras é a média das baixa-mares de sizígia, um nível baixo. Em geral a maré está acima dele. O nível médio do mar é a referência das altitudes, não das sondagens. E o NR é uma média: em marés excepcionais, a água pode ficar abaixo dele.',
                  referencia: 'Miguens, vol. I, item 2.6.3 b; Carta 12000, Introdução', fonte_url: VOL1 },
                { id: 'msa1-l4-2', nivel: 'mestre', tema: 'Carta náutica', dificuldade: 2,
                  enunciado: 'Como se lança na carta em papel a correção de um Aviso aos Navegantes Permanente?',
                  alternativas: [
                    'A tinta vermelha, sem rasuras, registrando ano e número do aviso no canto esquerdo da margem inferior.',
                    'A lápis, para poder apagar quando sair a próxima edição da carta.',
                    'Com corretivo branco sobre a informação antiga e caneta preta por cima.',
                    'Não se corrige: espera-se a nova edição da carta.',
                  ], correta: 0,
                  explicacao: 'Aviso Permanente se lança a tinta vermelha, de forma clara e sem rasuras, com o registro na margem inferior esquerda. Lápis é para Avisos Temporários e Preliminares. Informação cancelada se risca, nunca se apaga com corretivo. E a carta deve ser corrigida a bordo, sem esperar nova edição.',
                  referencia: 'Miguens, vol. I, item 2.8 a', fonte_url: VOL1 },
                { id: 'msa1-l4-3', nivel: 'mestre', tema: 'Carta náutica', dificuldade: 1,
                  enunciado: 'Que publicação da DHN você consulta para saber quais cartas cobrem a sua derrota e em que escalas elas existem?',
                  alternativas: ['O Catálogo de Cartas e Publicações.', 'A Lista de Faróis.', 'As Tábuas das Marés.', 'A Carta 12000.'], correta: 0,
                  explicacao: 'O Catálogo lista todas as cartas e publicações da DHN, com seus limites e escalas. A Lista de Faróis descreve os sinais luminosos. As Tábuas das Marés trazem as previsões de maré por porto. A Carta 12000 explica símbolos e abreviaturas, sem listar cartas.',
                  referencia: 'Miguens, vol. I, item 2.9; CHM, Catálogo de Cartas e Publicações', fonte_url: CHM_CATALOGO },
              ] },
              { t: 'fontes', itens: [
                mig('cap. 1, item 1.4, e cap. 2, itens 2.6.3, 2.7, 2.8 e 2.9'),
                { txt: 'CHM, Catálogo de Cartas e Publicações 2026-2030', url: CHM_CATALOGO, ref: 'extra-mestre-1-06' },
                { txt: 'CHM, Tábua de Maré 2026 do Porto de Cabedelo (carta de referência 830)', url: TABUA_CABEDELO, ref: 'tecnico-135' },
                c12('Introdução (planos de referência)'),
              ] },
            ],
          },
          /* ---------------------------------------------------------------- l5 */
          {
            id: 'l5', titulo: 'Carta 12000 (1): luzes, faróis e boias', minutos: 13,
            objetivos: [
              'Saber como a Carta 12000 (INT 1) é organizada e onde procurar cada símbolo.',
              'Decodificar a característica de uma luz escrita na carta.',
              'Reconhecer os símbolos de boias e calcular até onde um farol pode ser visto.',
            ],
            blocos: [
              { t: 'p', html: 'A <b>Carta 12000</b> não é uma carta: é uma publicação da DHN com a coletânea completa dos símbolos, abreviaturas e termos usados nas cartas nacionais e internacionais. Ela segue as especificações da Organização Hidrográfica Internacional e corresponde ao INT 1. A edição vigente é a 5ª, de 2022, com PDF gratuito no site do CHM. É bibliografia do exame.' },
              { t: 'tabela', cab: ['Seção', 'Assunto'],
                linhas: [
                  ['A e B', 'Número, título e informações marginais; posições, distâncias, marcações e rosas'],
                  ['C, D, E e F', 'Topografia: feições naturais, edificações, pontos de referência e portos'],
                  ['H', 'Marés e correntes'],
                  ['I e J', 'Profundidades e natureza do fundo'],
                  ['K e L', 'Rochas, cascos soçobrados e obstruções; instalações ao largo da costa'],
                  ['M e N', 'Derrotas e rotas; áreas e limites (fundeadouros, áreas proibidas)'],
                  ['P, Q e R', 'Luzes; boias e balizas; sinais de cerração'],
                  ['S, T e U', 'Sistemas radar, rádio e satélite; serviços; facilidades para pequenas embarcações'],
                ], legenda: 'Organização da Carta 12000. As letras G e O não são usadas.' },
              { t: 'h', txt: 'Como a carta mostra uma luz' },
              { t: 'p', html: 'A posição de um farol, farolete ou boia luminosa é marcada por um pequeno círculo ou ponto, com uma “chama” magenta (o símbolo de luz). Ao lado vem a <b>característica</b>, sempre na mesma ordem: ritmo, cor, período, altitude do foco e alcance.' },
              { t: 'p', html: 'Exemplo da própria Carta 12000: <b>Lp(3) BEV 15s 21m 15-11M</b>. Lê-se: grupo de três lampejos (Lp(3)); cores branca, encarnada e verde, cada uma num setor (BEV); o grupo completo se repete a cada 15 segundos; o foco está a 21 m de altitude; o alcance é de 15 milhas no setor branco e 11 no verde, com o encarnado entre os dois.' },
              { t: 'tabela', cab: ['Nas cartas nacionais', 'Nas cartas INT', 'Significado'],
                linhas: [
                  ['F', 'F', 'Fixa: luz contínua'],
                  ['Lp', 'Fl', 'Lampejo: luz mais curta que o eclipse'],
                  ['LpL', 'LFl', 'Lampejo longo: lampejo de 2 segundos ou mais'],
                  ['Oc', 'Oc', 'Ocultação: luz mais longa que o eclipse'],
                  ['Iso', 'Iso', 'Isofásica: luz e eclipse com a mesma duração'],
                  ['R', 'Q', 'Rápida: 50 a 79 lampejos por minuto (em geral 50 ou 60)'],
                  ['MR', 'VQ', 'Muito rápida: 80 a 159 por minuto (em geral 100 ou 120)'],
                  ['Alt.', 'Al.', 'Alternada: muda de cor'],
                  ['Mo(A)', 'Mo(A)', 'Código Morse (aqui, a letra A)'],
                  ['B, E, V, A, Az', 'W, R, G, Y, Bu', 'Cores: branca, encarnada, verde, amarela, azul'],
                ], legenda: 'Abreviaturas de ritmo e cor (Carta 12000, seção P, itens 10 e 11). Um número entre parênteses indica grupo: Lp(2) = dois lampejos seguidos de um eclipse mais longo.' },
              { t: 'callout', tipo: 'nota', titulo: 'Pegadinhas de leitura', html: '<b>Luz sem letra de cor é branca</b>: a carta só escreve a cor branca em luzes de setor ou alternadas. <b>“R” tem vários sentidos</b>: na característica de uma luz nacional é rápida; numa carta INT é <i>red</i> (encarnada); na natureza do fundo é rocha. <b>“E”</b> é encarnada na cor da luz, mas Leste (East) na direção. Leia sempre pelo contexto.' },
              { t: 'widget', w: 'ritmos-luz', opts: { caracteristica: 'Lp(3) 12s 41m 12M' }, legenda: 'Decodificador de características. Esta é a do Farol da Ilha da Gaivota, na carta de treino. Experimente também LpL 10s, MR(9) 10s e Oc(2) E 8s.' },
              { t: 'h', txt: 'Até onde o farol aparece' },
              { t: 'p', html: 'O número antes do “M” é o alcance da luz, em milhas. Mas a curvatura da Terra também limita: o <b>alcance geográfico</b> depende da altitude do foco (H) e da altura do seu olho (h), em metros. A Lista de Faróis dá a fórmula: <b>D = 1,927 × (√H + √h)</b>, em milhas. Você avista a luz até o menor dos dois alcances.' },
              { t: 'p', html: 'Exemplo, no cockpit de um cruzeiro de 32 pés (≈ 9,75 m), com o olho a cerca de 2,5 m da água (no seu barco, use a altura real do seu olho): o Farol da Ponta do Vigia, da carta de treino, tem foco a 48 m e alcance de 17 M. D = 1,927 × (6,93 + 1,58) ≈ 16,4 M. Com boa visibilidade, a luz aparece a cerca de 16 milhas, limitada pela curvatura da Terra. Já o Farol da Ilha da Gaivota (41 m, 12 M) daria 15,4 M de alcance geográfico, mas sua luz só alcança 12 M.' },
              { t: 'h', txt: 'Boias e balizas na carta' },
              { t: 'p', html: 'A seção Q mostra cada boia pelo formato: <b>cônica</b>, <b>cilíndrica</b>, <b>esférica</b>, <b>pilar</b>, <b>charuto</b> ou <b>tonel</b>. Boias de uma cor só, verde ou preta, são desenhadas cheias; as de outra cor única, vazadas. As letras sob o símbolo dizem as cores (em faixas horizontais, de cima para baixo). O tope aparece desenhado sobre a boia, e a boia luminosa tem o símbolo de luz magenta com a característica.' },
              { t: 'p', html: 'Na Região B, que o Brasil adota, quem entra do mar deixa as boias encarnadas (cônicas) a boreste e as verdes (cilíndricas) a bombordo. As cardinais, de perigo isolado, de águas seguras e especiais você revisa no simulador de balizamento do curso de Arrais. No Mestre, o desafio é reconhecê-las e localizá-las na carta.' },
              { t: 'check', questoes: [
                { id: 'msa1-l5-1', nivel: 'mestre', tema: 'Carta 12000', dificuldade: 2,
                  enunciado: 'Ao lado de uma boia, a carta nacional mostra “Lp(2) E 6s”. O que isso significa?',
                  alternativas: [
                    'Grupo de dois lampejos encarnados, repetido a cada 6 segundos.',
                    'Dois lampejos brancos a cada 6 segundos, seguidos de um lampejo encarnado.',
                    'Luz de ocultação encarnada, com dois eclipses em 6 segundos.',
                    'Luz rápida encarnada com alcance de 6 milhas.',
                  ], correta: 0,
                  explicacao: 'Lp(2) é grupo de dois lampejos; E, nas cores das luzes nacionais, é encarnada; 6s é o período do grupo completo. Não há branco na característica. Ocultação seria “Oc”. Rápida seria “R”, e alcance viria com a letra M (6M), não com s.',
                  referencia: 'Carta 12000, seção P, itens 10 a 16', fonte_url: C12000 },
                { id: 'msa1-l5-2', nivel: 'mestre', tema: 'Carta 12000', dificuldade: 2,
                  enunciado: 'Um farol aparece na carta como “Lp(3) 12s 41m 12M”, sem nenhuma letra de cor. Qual é a cor da luz?',
                  alternativas: ['Branca.', 'Amarela.', 'Encarnada.', 'A luz está apagada (extinta).'], correta: 0,
                  explicacao: 'Na Carta 12000, a cor branca só é escrita em luzes de setor ou alternadas; sem indicação, a luz é branca. Amarela e encarnada sempre aparecem escritas (A ou E nas cartas nacionais). Luz extinta é indicada por abreviatura própria (Exting), não pela falta da cor.',
                  referencia: 'Carta 12000, seção P, item 11.1', fonte_url: C12000 },
                { id: 'msa1-l5-3', nivel: 'mestre', tema: 'Carta 12000', dificuldade: 1,
                  enunciado: 'Em que seção da Carta 12000 você procura o desenho das boias e balizas?',
                  alternativas: ['Seção Q.', 'Seção P.', 'Seção K.', 'Seção J.'], correta: 0,
                  explicacao: 'A seção Q trata de boias e balizas. A P trata de luzes; a K, de rochas, cascos soçobrados e obstruções; a J, da natureza do fundo.',
                  referencia: 'Carta 12000, Sumário', fonte_url: C12000 },
                { id: 'msa1-l5-4', nivel: 'mestre', tema: 'Carta 12000', dificuldade: 3,
                  enunciado: 'Um farol tem foco a 25 m e alcance luminoso de 20 M. Do seu veleiro, com o olho a 2,25 m da água, a que distância aproximada você começa a ver a luz numa noite clara?',
                  alternativas: ['Cerca de 12,5 M.', 'Cerca de 20 M.', 'Cerca de 27 M.', 'Cerca de 6,5 M.'], correta: 0,
                  explicacao: 'Alcance geográfico: D = 1,927 × (√25 + √2,25) = 1,927 × (5 + 1,5) ≈ 12,5 M. Como é menor que o alcance luminoso de 20 M, é ele que limita. 20 M ignora a curvatura da Terra. 27 M seria somar os dois alcances. 6,5 M é só a soma das raízes, sem o fator 1,927.',
                  referencia: 'Lista de Faróis (DHN), 40ª ed., Introdução, item 3.5', fonte_url: LISTA_FAROIS },
              ] },
              { t: 'fontes', itens: [
                c12('seções P (luzes) e Q (boias e balizas)'),
                { txt: 'CHM, página da Carta 12000 (INT 1)', url: C12000_PAG, ref: 'tecnico-144' },
                { txt: 'Lista de Faróis (DHN), 40ª ed. 2026-2027, Introdução, item 3.5 (alcances)', url: LISTA_FAROIS, ref: 'tecnico-141' },
                mig('cap. 2, item 2.6.3 f'),
              ] },
            ],
          },
          /* ---------------------------------------------------------------- l6 */
          {
            id: 'l6', titulo: 'Carta 12000 (2): profundidades, perigos e natureza do fundo', minutos: 15,
            objetivos: [
              'Ler sondagens, isóbatas e alturas de secagem e saber a que nível cada uma se refere.',
              'Distinguir altitude, sondagem e nível de redução e calcular a água disponível.',
              'Reconhecer rochas, cascos soçobrados, obstruções e as abreviaturas da natureza do fundo.',
            ],
            blocos: [
              { t: 'p', html: 'Os números espalhados pelo mar da carta são as <b>sondagens</b>: profundidades, em metros, contadas a partir do <b>nível de redução</b> (NR). Nas cartas brasileiras o NR é o nível médio das baixa-mares de sizígia; a Carta 12000 informa que, no futuro, será adotada a menor maré astronômica (LAT).' },
              { t: 'p', html: 'Como o NR é um nível baixo, na maior parte do tempo há mais água do que a sondagem mostra. A profundidade num instante é a <b>sondagem somada à altura da maré</b>, também contada do NR. Mas o NR é uma média: em marés de sizígia fortes a água pode descer abaixo dele.' },
              { t: 'termos', ids: ['sondagem', 'nivel-de-reducao', 'isobata', 'mare', 'calado'] },
              { t: 'figura', svg: FIG_NIVEIS, legenda: 'Cada número da carta tem a sua referência: altitudes em terra contam do nível médio do mar; sondagens e alturas de secagem contam do nível de redução.' },
              { t: 'h', txt: 'Como os números aparecem' },
              { t: 'lista', itens: [
                '<b>Sondagens</b> de 0,1 a 20,9 m: em metros e decímetros, com o decímetro menor e mais baixo (4₂ = 4,2 m). De 21 a 31 m: metros e meio metro. Acima disso: metros inteiros. A posição da sondagem é o centro do número.',
                '<b>Alturas de secagem</b> (bancos e pedras que cobrem e descobrem): algarismos sublinhados, contados para cima a partir do NR, em metros e decímetros.',
                '<b>Altitudes</b> em terra (morros, ilhas, foco dos faróis): metros acima do nível médio do mar.',
                '<b>Vãos livres</b> de pontes e cabos aéreos: contados de um nível alto (de preferência a maior maré astronômica), para dar a menor folga provável.',
              ] },
              { t: 'p', html: 'As <b>isóbatas</b> ligam pontos de mesma profundidade. Tons de azul destacam as águas rasas, e quanto mais escuro, mais raso. Na carta de treino deste curso há isóbatas de 2, 5, 10, 20 e 50 m.' },
              { t: 'callout', tipo: 'seguranca', titulo: 'Faça a conta da água sob a quilha', html: 'Sondagem 2₄ (2,4 m), maré prevista de 0,6 m e calado de 1,8 m: profundidade = 2,4 + 0,6 = 3,0 m, folga de só 1,2 m, sem contar a onda e o balanço. Deixe sempre margem e desconfie de áreas com poucas sondagens.' },
              { t: 'h', txt: 'Rochas, cascos soçobrados e obstruções (seção K)' },
              { t: 'figura', svg: FIG_PERIGOS, legenda: 'Desenhos simplificados para estudo. Confira os símbolos oficiais na Carta 12000, seção K.' },
              { t: 'p', html: 'A <b>linha de perigo</b> (pontilhada) envolve perigos isolados: é o aviso visual de que ali você deve dar resguardo. Também aparecem <b>obstruções</b> (Obstn) e áreas de <b>fundo sujo</b>, que não oferecem perigo à navegação mas devem ser evitadas para fundear ou pescar.' },
              { t: 'callout', tipo: 'nota', titulo: 'Abreviaturas de incerteza', html: '<b>ED</b> = existência duvidosa; <b>PA</b> = posição aproximada; <b>PD</b> = posição duvidosa; <b>SD</b> = sondagem duvidosa; <b>Com</b> = comunicado, mas não confirmado. Trate esses perigos como reais e dê resguardo maior.' },
              { t: 'h', txt: 'Natureza do fundo (seção J)' },
              { t: 'tabela', cab: ['Cartas nacionais', 'Cartas INT', 'Significado'],
                linhas: [
                  ['A', 'S', 'Areia'], ['L', 'M', 'Lama'], ['Arg', 'Cy', 'Argila'], ['Ld', 'Si', 'Lodo, vasa'],
                  ['P', 'St', 'Pedras'], ['C', 'G', 'Cascalho'], ['S', 'P', 'Seixos'], ['R', 'R', 'Rocha'],
                  ['Cor', 'Co', 'Coral'], ['Con', 'Sh', 'Conchas'],
                ], legenda: 'Qualificadores nacionais: f (fina), m (média) e g (grossa), usados só para areia (Af, Am, Ag); ml (mole); d (duro). Duas camadas: A/L = areia sobre lama. Misturas: Af. L. Con = areia fina com lama e conchas.' },
              { t: 'callout', tipo: 'nota', titulo: 'Letras trocadas entre as cartas', html: 'Na carta nacional, <b>S</b> é seixos e <b>P</b> é pedras. Na carta INT, <b>S</b> é <i>sand</i> (areia) e <b>P</b> é <i>pebbles</i> (seixos). Antes de interpretar, veja no título se a carta é nacional ou INT.' },
              { t: 'p', html: 'A natureza do fundo é a <b>tença</b>: diz se o ferro vai unhar. Areia e lama costumam segurar bem; rocha segura mal, e no coral o ferro danifica o recife. O símbolo de âncora marca fundeadouros, e há símbolos próprios para áreas proibidas ao fundeio (seção N).' },
              { t: 'widget', w: 'carta-nautica', opts: { modo: 'explorar' }, legenda: 'Na carta de treino, ache a Laje Preta (rocha que cobre e descobre), a Pedra do Ilhote (rocha submersa perigosa), o casco soçobrado com profundidade mínima de 4,2 m e a boia de perigo isolado que o sinaliza. Observe as isóbatas e como as sondagens ficam mais rasas perto da costa.' },
              { t: 'check', questoes: [
                { id: 'msa1-l6-1', nivel: 'mestre', tema: 'Carta 12000', dificuldade: 2,
                  enunciado: 'Junto de uma pedra, a carta mostra o número 0₈ sublinhado. O que ele indica?',
                  alternativas: [
                    'A pedra fica 0,8 m acima do nível de redução: descobre na baixa-mar.',
                    'Há 0,8 m de água sobre a pedra no nível de redução.',
                    'A pedra tem 0,8 m de altitude acima do nível médio do mar.',
                    'A profundidade ali é de 8 m.',
                  ], correta: 0,
                  explicacao: 'Algarismo sublinhado é altura de secagem, contada para cima a partir do NR: a pedra aparece quando a maré desce abaixo de 0,8 m. Água sobre a pedra seria uma sondagem, sem sublinhado. Altitude, em terra, conta do nível médio do mar. E 0₈ vale 0,8 m, não 8 m.',
                  referencia: 'Carta 12000, Introdução e seção K, item 11', fonte_url: C12000 },
                { id: 'msa1-l6-2', nivel: 'mestre', tema: 'Carta 12000', dificuldade: 2,
                  enunciado: 'A sondagem no ponto é 4₂, a maré prevista para a hora da passagem é 1,1 m e o seu veleiro cala 1,8 m. Qual é a folga sob a quilha, sem considerar ondas?',
                  alternativas: ['3,5 m', '2,4 m', '1,3 m', '5,3 m'], correta: 0,
                  explicacao: 'Profundidade = sondagem + altura da maré = 4,2 + 1,1 = 5,3 m. Folga = 5,3 − 1,8 = 3,5 m. 2,4 m ignora a maré (4,2 − 1,8). 1,3 m subtrai a maré em vez de somar (4,2 − 1,1 − 1,8). 5,3 m é a profundidade, não a folga.',
                  referencia: 'Miguens, vol. I, cap. 10, item 10.1.9', fonte_url: VOL1 },
                { id: 'msa1-l6-3', nivel: 'mestre', tema: 'Carta 12000', dificuldade: 2,
                  enunciado: 'Numa carta nacional, a natureza do fundo está escrita como “Af. L. Con”. Isso significa:',
                  alternativas: ['Areia fina com lama e conchas.', 'Argila fofa com lodo e coral.', 'Areia fina sobre lama, com cascalho.', 'Alto-fundo de lama consolidada.'], correta: 0,
                  explicacao: 'Af é areia fina, L é lama e Con são conchas; separados por pontos, indicam uma mistura com o principal componente primeiro. Argila é Arg e coral é Cor. Uma camada sobre outra usa barra (A/L), e cascalho é C. AF (alto-fundo) é outra abreviatura e não descreve a tença.',
                  referencia: 'Carta 12000, seção J, itens 1 a 12 e 30', fonte_url: C12000 },
                { id: 'msa1-l6-4', nivel: 'mestre', tema: 'Carta 12000', dificuldade: 1,
                  enunciado: 'O símbolo de casco soçobrado aparece envolvido por uma linha pontilhada. O que isso indica?',
                  alternativas: ['Casco soçobrado perigoso à navegação.', 'Casco soçobrado não perigoso à navegação.', 'Área de fundeio recomendada.', 'Boia de naufrágio luminosa.'], correta: 0,
                  explicacao: 'A linha pontilhada é a linha de perigo: o casco é perigoso à navegação (K 28). O casco não perigoso (K 29) aparece sem ela. Fundeadouro tem o símbolo de âncora, e boias têm símbolos próprios na seção Q.',
                  referencia: 'Carta 12000, seção K, itens 1, 28 e 29', fonte_url: C12000 },
              ] },
              { t: 'fontes', itens: [
                c12('Introdução (sondagens e planos de referência) e seções I, J, K e N'),
                mig('cap. 2, itens 2.6.3 h e 2.7; cap. 10, item 10.1.9'),
                { txt: 'Profundidade num instante = sondagem + altura da maré (Miguens, vol. I, cap. 10)', url: VOL1, ref: 'tecnico-162' },
              ] },
            ],
          },
        ],
      },
      /* =============================================================================== M2 */
      {
        id: 'm2', titulo: 'Coordenadas, distâncias e plotagem',
        resumo: 'Plotar e ler posições pelas coordenadas, medir distâncias com o compasso na escala de latitudes (1 milha = 1 minuto de latitude), relacionar velocidade, tempo e distância com a regra do 60 e resolver na carta o rumo, a distância e a hora de chegada de uma pernada.',
        licoes: [
          /* ---------------------------------------------------------------- l7 */
          {
            id: 'l7', titulo: 'Plotar uma posição pelas coordenadas', minutos: 11,
            objetivos: [
              'Conhecer o material de plotagem, que é o mesmo levado à prova.',
              'Plotar um ponto na carta com régua paralela e compasso.',
              'Rotular a posição plotada de forma clara.',
            ],
            blocos: [
              { t: 'p', html: '<b>Plotar</b> é marcar na carta um ponto dado pelas suas coordenadas. Numa travessia costeira você faz isso toda hora: com a posição do GPS, com o ponto de partida, com um <i>waypoint</i> recebido por rádio. Na prova, várias questões começam com “plote o ponto…”.' },
              { t: 'fato', ref: 'programa-19', html: 'Na prova de Mestre-Amador, o candidato leva material de desenho: lápis ou lapiseira, régua, um par de esquadros ou réguas paralelas, transferidor, compasso e borracha.' },
              { t: 'h', txt: 'O material' },
              { t: 'lista', itens: [
                '<b>Régua paralela</b>: duas réguas unidas por braços articulados. Ela “caminha” pela carta sem mudar de direção. Se escorregar no meio do caminho, recomece.',
                '<b>Plotador paralelo</b>: régua com roletes que rola sem perder o alinhamento. Mais prático num barco pequeno, com balanço e pouco espaço.',
                '<b>Par de esquadros</b>: um desliza encostado no outro e transporta a direção, como a régua paralela.',
                '<b>Compasso de navegação</b>: de pontas secas, abre e fecha com uma mão e precisa manter a abertura. Se houver dúvida de que a abertura mudou, confira.',
                '<b>Transferidor ou plotador de navegação</b>: lê a direção apoiado num meridiano da própria carta, sem ir até a rosa.',
              ] },
              { t: 'termos', ids: ['regua-paralela', 'compasso-de-navegacao', 'latitude', 'longitude'] },
              { t: 'h', txt: 'Passo a passo com régua e compasso' },
              { t: 'lista', ordenada: true, itens: [
                'Marque a <b>latitude</b> na escala lateral, contando os décimos no sentido certo (no Hemisfério Sul, para baixo).',
                'Com a régua paralela apoiada num paralelo do reticulado, leve-a até essa marca e trace um <b>traço curto</b> do paralelo do ponto, só na região onde ele vai ficar.',
                'Abra o <b>compasso na escala de longitudes</b> (borda de cima ou de baixo), do meridiano do reticulado mais próximo até a longitude do ponto.',
                'Leve essa abertura até o traço do paralelo, a partir do mesmo meridiano, e marque o ponto.',
                'Faça um pequeno círculo em volta do ponto e escreva a <b>hora com quatro algarismos</b> (ex.: 1015).',
              ] },
              { t: 'figura', svg: FIG_PLOTAR, legenda: 'Plotagem do ponto 23°48,6′S, 044°09,4′W. O ponto fica 0,6′ de longitude a leste do meridiano 044°10′W, abertura tirada na escala de longitudes.' },
              { t: 'p', html: 'Há outros caminhos igualmente corretos: traçar primeiro o meridiano do ponto e marcar a latitude com o compasso, a partir de um paralelo do reticulado; ou traçar com a régua o paralelo e o meridiano, e o ponto fica no cruzamento. Em todos, trace só o necessário, de leve, perto do ponto.' },
              { t: 'p', html: 'Pense na precisão. Numa carta 1:50.000, 1 mm vale 50 m. Um lápis grosso ou um compasso frouxo põem o ponto 100 m fora do lugar sem você perceber. Use lapiseira 0,5 mm, compasso firme e confira o resultado relendo as coordenadas do ponto que você marcou, como na próxima lição.' },
              { t: 'widget', w: 'carta-nautica', opts: { modo: 'exercicio', exercicio: 'plotar' }, legenda: 'Exercício: a carta de treino gera uma posição para você plotar. A correção mostra o passo a passo e o ponto certo. Repita até acertar três seguidas.' },
              { t: 'callout', tipo: 'intl', intl: true, titulo: 'Trilha internacional', html: 'Nas convenções de plotagem da RYA, a posição observada (<i>fix</i>) é um círculo com ponto e a hora, e a posição estimada (<i>estimated position</i>, EP) é um triângulo com ponto. Muitos alunos usam o plotador tipo Breton ou Portland, que lê o rumo num meridiano qualquer.' },
              { t: 'check', questoes: [
                { id: 'msa1-l7-1', nivel: 'mestre', tema: 'Coordenadas e distâncias', dificuldade: 1,
                  enunciado: 'Para plotar a latitude de um ponto, onde você a localiza?',
                  alternativas: ['Na escala de latitudes, nas bordas da esquerda ou da direita da carta.', 'Na escala de longitudes, nas bordas de cima ou de baixo.', 'No anel externo da rosa dos rumos.', 'Medindo em centímetros com a régua e convertendo pela escala do título.'], correta: 0,
                  explicacao: 'A latitude se marca na escala lateral, ao longo dos meridianos extremos. A escala de cima e de baixo é a de longitudes. A rosa mede direções, não latitude. Converter centímetros pela escala natural é impreciso, porque na Mercator a escala varia com a latitude.',
                  referencia: 'Miguens, vol. I, Apêndice A ao cap. 2, item A', fonte_url: VOL1 },
                { id: 'msa1-l7-2', nivel: 'mestre', tema: 'Coordenadas e distâncias', dificuldade: 2,
                  enunciado: 'Já traçado o paralelo do ponto, como se leva a longitude até ele com o compasso?',
                  alternativas: [
                    'Tomando, na escala de longitudes, a abertura do meridiano do reticulado mais próximo até a longitude do ponto e marcando-a a partir desse mesmo meridiano.',
                    'Tomando a abertura na escala de latitudes, porque é nela que se medem distâncias.',
                    'Tomando a abertura na rosa dos rumos, a partir do Norte verdadeiro.',
                    'Tomando a abertura a partir do paralelo mais próximo, e não do meridiano.',
                  ], correta: 0,
                  explicacao: 'Diferença de longitude se toma na escala de longitudes e se marca a partir do meridiano de onde foi medida. A escala de latitudes serve para distâncias e latitudes, não para longitudes. A rosa mede ângulos. E a longitude conta a partir de um meridiano, não de um paralelo.',
                  referencia: 'Miguens, vol. I, Apêndice A ao cap. 2, item A', fonte_url: VOL1 },
                { id: 'msa1-l7-3', nivel: 'mestre', tema: 'Coordenadas e distâncias', dificuldade: 2,
                  enunciado: 'Numa carta na escala 1:50.000, um erro de 2 mm na plotagem corresponde a cerca de:',
                  alternativas: ['100 m', '10 m', '1 km', '0,5 milha'], correta: 0,
                  explicacao: 'Em 1:50.000, 1 mm vale 50.000 mm = 50 m; 2 mm valem 100 m. 10 m corresponderia a uma escala de 1:5.000; 1 km, a 1:500.000. Meia milha são cerca de 926 m, quase dez vezes mais.',
                  referencia: 'Miguens, vol. I, item 2.6.2', fonte_url: VOL1 },
              ] },
              { t: 'fontes', itens: [
                mig('Apêndice A ao cap. 2 (itens A e B) e cap. 11, itens 11.6.1, 11.6.2 e 11.6.5'),
                { txt: 'NORMAM-211/DPC, Anexo 5-A, Seção I, item 2 e) (material da prova de Mestre-Amador)', url: NORMAM211, ref: 'programa-19' },
              ] },
            ],
          },
          /* ---------------------------------------------------------------- l8 */
          {
            id: 'l8', titulo: 'Ler as coordenadas de um ponto', minutos: 9,
            objetivos: [
              'Determinar a latitude e a longitude de qualquer ponto da carta.',
              'Usar só o compasso, a partir do reticulado.',
              'Conferir a leitura e transformá-la em waypoint sem erro.',
            ],
            blocos: [
              { t: 'p', html: 'O problema inverso é tão importante quanto plotar: dado um ponto na carta, achar as suas coordenadas. Você vai precisar disso para levar ao GPS a posição de uma boia de entrada, de um ponto de guinada ou de um perigo que merece alarme.' },
              { t: 'h', txt: 'Com a régua paralela' },
              { t: 'lista', ordenada: true, itens: [
                'Apoie a régua num paralelo do reticulado e faça-a caminhar até encostar no ponto.',
                'Leve-a até a borda lateral e leia a latitude, contando os décimos no sentido certo.',
                'Repita com um meridiano do reticulado: leve a régua do ponto até a borda de cima ou de baixo e leia a longitude.',
              ] },
              { t: 'h', txt: 'Só com o compasso' },
              { t: 'p', html: 'Ponha uma ponta no ponto e abra até a outra ponta tocar o <b>paralelo do reticulado mais próximo</b>, na perpendicular (a ponta “tangencia” a linha). Leve essa abertura à escala de latitudes, a partir desse mesmo paralelo, para o lado onde está o ponto, e leia. Faça o mesmo com o <b>meridiano mais próximo</b> e a escala de longitudes.' },
              { t: 'p', html: 'Um exemplo real do Manual da DHN: na Carta 52, do Arquipélago de Fernando de Noronha, na escala 1:30.000, o farol da Ilha Rata (“Lp B 15s 63m 16M”) está em <b>Lat 03°48,76′S, Long 032°23,21′W</b>. Em escala grande assim, dá para ler até centésimos de minuto. Na carta de treino deste curso, o Farol da Ponta do Vigia está em cerca de 23°48,6′S, 044°05,8′W.' },
              { t: 'p', html: 'A precisão da leitura depende da escala. Em carta de porto, a menor divisão da borda é de um décimo de minuto ou menos. Em carta costeira, de escala pequena, a menor divisão pode valer vários décimos: estime a fração entre dois traços e escreva a posição com um décimo de minuto. Prefira sempre a carta de maior escala que mostra o ponto.' },
              { t: 'p', html: 'Ler coordenadas também serve para conferir o seu trabalho. Depois de plotar um ponto, leia de volta as coordenadas dele: se não baterem com as que você recebeu, refaça. E se a posição do GPS, plotada com cuidado, cair em cima de terra ou de uma laje que você sabe estar longe, desconfie primeiro do datum da carta e da configuração do aparelho.' },
              { t: 'callout', tipo: 'nota', titulo: 'Confira o sentido antes de escrever', html: 'Um ponto 1,4′ <b>acima</b> (ao norte) do paralelo 23°50′S está em <b>23°48,6′S</b>, e não em 23°51,4′S. Um ponto 4,2′ <b>à direita</b> (a leste) do meridiano 044°10′W está em <b>044°05,8′W</b>, e não em 044°14,2′W. No Brasil, subir na carta diminui a latitude e ir para a direita diminui a longitude.' },
              { t: 'widget', w: 'carta-nautica', opts: { modo: 'exercicio', exercicio: 'ler' }, legenda: 'Exercício: a carta de treino marca um ponto e pede as coordenadas. A tolerância é pequena: trabalhe com zoom e conte os décimos nas bordas.' },
              { t: 'callout', tipo: 'seguranca', titulo: 'Waypoint errado é perigo novo', html: 'Ao digitar coordenadas no GPS, um dígito trocado pode pôr o waypoint em cima de uma laje. Depois de digitar, confira de duas formas: releia o número e veja se o rumo e a distância que o GPS mostra até o waypoint batem com os da carta.' },
              { t: 'check', questoes: [
                { id: 'msa1-l8-1', nivel: 'mestre', tema: 'Coordenadas e distâncias', dificuldade: 2,
                  enunciado: 'Um ponto está 1,4′ ao norte (acima) do paralelo de 23°50′S. Qual é a latitude dele?',
                  alternativas: ['23°48,6′ S', '23°51,4′ S', '23°49,4′ S', '23°48,4′ S'], correta: 0,
                  explicacao: 'No Hemisfério Sul, ir para o norte diminui a latitude: 23°50,0′ − 1,4′ = 23°48,6′ S. 23°51,4′ é o erro de somar. 23°49,4′ subtrai só 0,6′. 23°48,4′ subtrai 1,6′.',
                  referencia: 'Miguens, vol. I, item 1.6 e Apêndice A ao cap. 2, item B', fonte_url: VOL1 },
                { id: 'msa1-l8-2', nivel: 'mestre', tema: 'Coordenadas e distâncias', dificuldade: 2,
                  enunciado: 'Um ponto está 4,2′ a leste (à direita) do meridiano de 044°10′W. Qual é a longitude dele?',
                  alternativas: ['044°05,8′ W', '044°14,2′ W', '044°06,2′ W', '043°55,8′ W'], correta: 0,
                  explicacao: 'A oeste de Greenwich, ir para leste diminui a longitude: 044°10,0′ − 4,2′ = 044°05,8′ W. 044°14,2′ é o erro de somar. 044°06,2′ é erro de conta com os décimos. 043°55,8′ tira 14,2′ em vez de 4,2′.',
                  referencia: 'Miguens, vol. I, item 1.6 e Apêndice A ao cap. 2, item B', fonte_url: VOL1 },
                { id: 'msa1-l8-3', nivel: 'mestre', tema: 'Coordenadas e distâncias', dificuldade: 1,
                  enunciado: 'Usando só o compasso para ler a latitude de um ponto, a abertura deve ir do ponto até:',
                  alternativas: ['O paralelo do reticulado mais próximo, tocando-o na perpendicular.', 'O meridiano do reticulado mais próximo.', 'O centro da rosa dos rumos.', 'A borda inferior da carta, em qualquer direção.'], correta: 0,
                  explicacao: 'Para a latitude, mede-se a distância do ponto ao paralelo mais próximo e leva-se essa abertura à escala de latitudes a partir dele. O meridiano serve para a longitude. A rosa não tem relação com coordenadas. Medir até a borda em qualquer direção dá uma distância inclinada, que não é diferença de latitude.',
                  referencia: 'Miguens, vol. I, Apêndice A ao cap. 2, item B', fonte_url: VOL1 },
              ] },
              { t: 'fontes', itens: [
                mig('Apêndice A ao cap. 2, item B (Carta 52, Fernando de Noronha)'),
                mig('cap. 2, item 2.6.3 a (reticulado e escalas)'),
              ] },
            ],
          },
          /* ---------------------------------------------------------------- l9 */
          {
            id: 'l9', titulo: 'A milha náutica e a medida de distâncias', minutos: 12,
            objetivos: [
              'Entender por que 1 milha náutica corresponde a 1 minuto de latitude.',
              'Medir distâncias com o compasso na escala de latitudes, na altura certa.',
              'Converter milhas, metros, amarras e jardas.',
            ],
            blocos: [
              { t: 'p', html: 'A <b>milha náutica</b> é o comprimento do arco de 1 minuto de meridiano, ou seja, de <b>1′ de latitude</b>. Como a Terra não é uma esfera perfeita, esse arco varia um pouco; por isso um acordo internacional de 1929 fixou a milha em <b>1.852 metros</b>. O <b>nó</b> é a velocidade de uma milha por hora.' },
              { t: 'p', html: 'A conta ajuda a lembrar: uma volta completa num meridiano tem 360° × 60′ = 21.600 minutos, logo cerca de 21.600 milhas. Multiplicando por 1,852 km, dá uns 40.000 km, a circunferência da Terra.' },
              { t: 'termos', ids: ['milha-nautica', 'no-velocidade', 'compasso-de-navegacao'] },
              { t: 'p', html: 'Já o minuto de longitude encolhe à medida que os meridianos se aproximam dos polos. Ele só vale uma milha no Equador. A 23°S, vale cerca de 0,92 milha; a 30°S, 0,87. Por isso a escala de longitudes nunca serve para medir distância.' },
              { t: 'h', txt: 'Medindo com o compasso' },
              { t: 'lista', ordenada: true, itens: [
                'Una os dois pontos com um traço leve da régua.',
                'Abra o compasso de um ponto ao outro, se couber numa só abertura.',
                'Leve a abertura à <b>escala de latitudes</b>, na altura das latitudes dos dois pontos (em torno da latitude média do trecho).',
                'Leia em minutos: cada minuto é uma milha.',
                'Se não couber numa abertura, abra o compasso com um valor redondo (por exemplo, 5 M) tirado na escala de latitudes na altura do trecho, e “caminhe” com ele sobre a linha, somando as aberturas e medindo a sobra no fim.',
                'Escreva a distância sob a linha, precedida de “d” (ex.: d 5,4 M).',
              ] },
              { t: 'figura', svg: FIG_DIST, legenda: 'A mesma abertura do compasso entre A e B é levada à escala de latitudes, na faixa entre as latitudes de A e de B. Aqui ela mede cerca de 4,6′, ou seja, 4,6 milhas.' },
              { t: 'p', html: 'Em cartas de escala grande e trechos curtos, a diferença entre medir na altura certa ou um pouco ao lado é mínima. Em cartas de escala pequena, que cobrem vários graus de latitude, ela pode chegar a várias milhas. Crie o hábito de medir sempre na altura do trecho.' },
              { t: 'tabela', cab: ['Unidade', 'Valor'],
                linhas: [
                  ['1 milha náutica (M)', '1.852 m; cerca de 2.025 jardas (na prática, 2.000)'],
                  ['1 amarra', '100 braças = 200 jardas ≈ 183 m'],
                  ['1 braça', '2 jardas = 6 pés ≈ 1,83 m'],
                  ['1 pé', '0,3048 m (por exemplo, 32 pés ≈ 9,75 m)'],
                  ['1 nó', '1 M por hora ≈ 1,852 km/h ≈ 0,514 m/s'],
                ], legenda: 'Unidades de distância usadas em navegação (Miguens, vol. I, itens 1.7.1, 1.9 e 1.10).' },
              { t: 'widget', w: 'carta-nautica', opts: { modo: 'explorar', ferramenta: 'compasso' }, legenda: 'Com o compasso da carta de treino, meça a distância da boia de águas seguras da Barra (23°49,0′S, 044°11,7′W) ao Farol da Ponta do Vigia. Você deve achar cerca de 5,4 M. Depois meça entre os faróis da Ilha da Gaivota e da Ponta do Vigia (cerca de 11,8 M).' },
              { t: 'callout', tipo: 'intl', intl: true, titulo: 'Trilha internacional', html: 'Na RYA, o <i>cable</i> é tratado como um décimo de milha (cerca de 185 m), um pouco diferente da amarra de 183 m do Manual da DHN. Cartas antigas dos Estados Unidos podem trazer profundidades em pés ou em braças (<i>fathoms</i>): confira no título.' },
              { t: 'check', questoes: [
                { id: 'msa1-l9-1', nivel: 'mestre', tema: 'Coordenadas e distâncias', dificuldade: 1,
                  enunciado: 'Quantos metros tem uma milha náutica?',
                  alternativas: ['1.852 m', '1.609 m', '1.000 m', '1.828 m'], correta: 0,
                  explicacao: 'A milha náutica foi fixada em 1.852 m, cerca de um minuto de latitude. 1.609 m é a milha terrestre inglesa, que não se usa na navegação. 1.000 m é o quilômetro. 1.828 m corresponde a 1.000 braças, não a uma milha.',
                  referencia: 'Miguens, vol. I, item 1.7.1', fonte_url: VOL1 },
                { id: 'msa1-l9-2', nivel: 'mestre', tema: 'Coordenadas e distâncias', dificuldade: 2,
                  enunciado: 'Ao medir a distância entre dois pontos de latitudes 23°10′S e 23°40′S, onde você deve levar a abertura do compasso?',
                  alternativas: ['À escala de latitudes, na faixa entre 23°10′ e 23°40′.', 'À escala de longitudes, na borda mais próxima dos pontos.', 'À escala de latitudes, em qualquer altura da carta.', 'À escala gráfica em metros do título.'], correta: 0,
                  explicacao: 'Na Mercator a escala de latitudes varia com a latitude, então a medida deve ser feita na altura do trecho, em torno da latitude média. A escala de longitudes não dá milhas fora do Equador. Medir em qualquer altura introduz erro, maior quanto menor a escala da carta. A escala natural do título é exata só no paralelo de referência.',
                  referencia: 'Miguens, vol. I, Apêndice A ao cap. 2, item E', fonte_url: VOL1 },
                { id: 'msa1-l9-3', nivel: 'mestre', tema: 'Coordenadas e distâncias', dificuldade: 3,
                  enunciado: 'Por engano, um aluno levou a abertura do compasso à escala de longitudes, numa carta da costa a 23°S, e leu 6′. A distância verdadeira é de aproximadamente:',
                  alternativas: ['5,5 M', '6,0 M', '6,5 M', '12 M'], correta: 0,
                  explicacao: 'Na Mercator, o minuto de latitude desenhado é maior que o de longitude na razão 1/cos φ (cerca de 1,09 a 23°). A mesma abertura vale, portanto, uns 6 × 0,92 ≈ 5,5 minutos de latitude, ou 5,5 M. Ler 6 M é o erro do aluno. 6,5 M aplica a correção ao contrário. 12 M não tem relação com a conta.',
                  referencia: 'Miguens, vol. I, itens 1.7.1 e 2.4.4', fonte_url: VOL1 },
              ] },
              { t: 'fontes', itens: [
                mig('cap. 1, itens 1.7.1, 1.9 e 1.10; cap. 2, item 2.4.4 e Apêndice A, item E'),
              ] },
            ],
          },
          /* ---------------------------------------------------------------- l10 */
          {
            id: 'l10', titulo: 'Velocidade, tempo e distância: a regra do 60', minutos: 12,
            objetivos: [
              'Relacionar velocidade, tempo e distância em nós, horas e minutos.',
              'Usar de cabeça a regra do 60 e a regra dos 6 minutos.',
              'Calcular a hora estimada de chegada (ETA) de uma pernada.',
            ],
            blocos: [
              { t: 'p', html: 'Na navegação costeira, quase todo cálculo de tempo cabe numa fórmula só: <b>distância = velocidade × tempo</b>. Com a velocidade em nós e o tempo em horas, a distância sai em milhas. O problema é que no mar o tempo quase sempre está em minutos: 20 minutos, 42 minutos. Daí a <b>regra do 60</b>.' },
              { t: 'figura', svg: FIG_VTD, legenda: 'Tampe a grandeza que você quer achar: D fica sobre V × T. Com o tempo em minutos, divida por 60.' },
              { t: 'lista', itens: [
                '<b>Distância</b> (M) = velocidade (nós) × minutos ÷ 60. A 6 nós, em 20 min: 6 × 20 ÷ 60 = <b>2,0 M</b>.',
                '<b>Tempo</b> (min) = 60 × distância ÷ velocidade. 5,4 M a 6 nós: 60 × 5,4 ÷ 6 = <b>54 min</b>.',
                '<b>Velocidade</b> (nós) = 60 × distância ÷ minutos. 3,5 M em 42 min: 60 × 3,5 ÷ 42 = <b>5,0 nós</b>.',
              ] },
              { t: 'callout', tipo: 'dica', titulo: 'Regra dos 6 minutos', html: 'Seis minutos são um décimo de hora. Então, em 6 minutos, o barco anda um décimo da velocidade: a 6,5 nós, 0,65 M; a 4 nós, 0,4 M. É ótima para conferir de cabeça a posição estimada a cada 6, 12 ou 30 minutos.' },
              { t: 'h', txt: 'Velocidade na água e no fundo' },
              { t: 'p', html: 'O odômetro do barco mede a velocidade em relação à <b>água</b>. O GPS mostra a velocidade em relação ao <b>fundo</b>. Se houver corrente, as duas diferem. O exemplo do Manual da DHN: a 10 nós na água, a favor de uma corrente de 2 nós, o navio faz 12 nós no fundo; contra ela, 8 nós. Para calcular a hora de chegada, o que vale é a velocidade no fundo, ou a <b>velocidade de avanço</b> que você planeja manter.' },
              { t: 'p', html: 'Exemplo de ETA (hora estimada de chegada): você larga às 0840 para uma barra a 18 M e espera fazer 5,5 nós no fundo. Tempo = 60 × 18 ÷ 5,5 ≈ 196 min = 3 h 16 min. ETA ≈ <b>1156</b>. Se a barra só deve ser cruzada com luz do dia e maré enchente, é assim que você decide a hora de largar.' },
              { t: 'termos', ids: ['odometro', 'rumo-no-fundo', 'corrente', 'singradura'] },
              { t: 'h', txt: 'Sem instrumento nenhum' },
              { t: 'p', html: 'O Manual da DHN ensina um processo prático: lance pela proa um objeto flutuante e cronometre quanto ele leva para passar da proa à popa. A velocidade em nós é aproximadamente <b>2 × comprimento do barco (m) ÷ tempo (s)</b>. Por exemplo, num cruzeiro de 32 pés (cerca de 9,75 m; troque pelo comprimento do seu barco), se o objeto leva 3 segundos: 2 × 9,75 ÷ 3 ≈ <b>6,5 nós</b>. Não jogue lixo no mar: use algo biodegradável, como um pedaço de fruta.' },
              { t: 'callout', tipo: 'seguranca', titulo: 'Planeje com folga', html: 'Calcule a ETA com uma velocidade conservadora e confira a cada hora se ela se mantém. Chegar de noite a uma barra desconhecida, ou com a maré errada, é um dos erros de planejamento mais comuns na navegação costeira.' },
              { t: 'check', questoes: [
                { id: 'msa1-l10-1', nivel: 'mestre', tema: 'Velocidade, tempo e distância', dificuldade: 1,
                  enunciado: 'Navegando a 7 nós durante 25 minutos, quanto o barco percorre?',
                  alternativas: ['2,9 M', '2,5 M', '3,5 M', '17,5 M'], correta: 0,
                  explicacao: 'D = 7 × 25 ÷ 60 ≈ 2,92 M. 2,5 M e 3,5 M são arredondamentos errados do tempo (21 e 30 min). 17,5 M esquece de dividir por 60 e trata os minutos como horas.',
                  referencia: 'Miguens, vol. I, item 1.9 (nó e velocidade)', fonte_url: VOL1 },
                { id: 'msa1-l10-2', nivel: 'mestre', tema: 'Velocidade, tempo e distância', dificuldade: 2,
                  enunciado: 'Quanto tempo leva uma pernada de 12 M a 5 nós?',
                  alternativas: ['2 h 24 min', '2 h 40 min', '2 h 12 min', '1 h 44 min'], correta: 0,
                  explicacao: 'T = 60 × 12 ÷ 5 = 144 min = 2 h 24 min (12 ÷ 5 = 2,4 h; 0,4 h = 24 min). 2 h 40 min confunde 2,4 h com 2 h 40. 2 h 12 min e 1 h 44 min são erros de conta.',
                  referencia: 'Miguens, vol. I, item 1.9', fonte_url: VOL1 },
                { id: 'msa1-l10-3', nivel: 'mestre', tema: 'Velocidade, tempo e distância', dificuldade: 1,
                  enunciado: 'Pela regra dos 6 minutos, quanto um barco a 4,5 nós anda em 6 minutos?',
                  alternativas: ['0,45 M', '4,5 M', '0,75 M', '0,27 M'], correta: 0,
                  explicacao: 'Seis minutos são 1/10 de hora, então a distância é a velocidade dividida por 10: 0,45 M. 4,5 M é a distância de uma hora inteira. 0,75 M e 0,27 M não correspondem à regra.',
                  referencia: 'Regra prática derivada de D = V × T (Miguens, vol. I, item 1.9)', fonte_url: VOL1 },
                { id: 'msa1-l10-4', nivel: 'mestre', tema: 'Velocidade, tempo e distância', dificuldade: 2,
                  enunciado: 'O odômetro marca 5,5 nós e o GPS mostra 4,0 nós no fundo, no mesmo rumo. A explicação mais provável é:',
                  alternativas: ['Uma corrente contrária de cerca de 1,5 nó.', 'Uma corrente a favor de cerca de 1,5 nó.', 'O GPS está com defeito, porque o odômetro é sempre mais preciso.', 'O barco está fazendo 9,5 nós no fundo.'], correta: 0,
                  explicacao: 'O odômetro mede na água e o GPS no fundo. Se o barco avança menos no fundo do que na água, há corrente contrária, aqui de cerca de 5,5 − 4,0 = 1,5 nó (supondo-a alinhada com o rumo). Corrente a favor aumentaria a velocidade no fundo. Nenhum dos dois é “sempre mais preciso”: medem coisas diferentes. Somar as velocidades não faz sentido.',
                  referencia: 'Miguens, vol. I, item 11.3.2 a', fonte_url: VOL1 },
              ] },
              { t: 'fontes', itens: [
                mig('cap. 1, item 1.9; cap. 11, itens 11.3.2 e 11.3.3'),
              ] },
            ],
          },
          /* ---------------------------------------------------------------- l11 */
          {
            id: 'l11', titulo: 'Na carta: rumo, distância e hora de chegada', minutos: 14,
            objetivos: [
              'Traçar e ler o rumo verdadeiro entre dois pontos com a régua paralela e a rosa.',
              'Medir a distância da pernada e calcular o tempo de navegação.',
              'Traçar um rumo que passe a uma distância segura de um perigo.',
            ],
            blocos: [
              { t: 'p', html: 'Agora junte tudo. Uma <b>pernada</b> é um trecho reto da derrota, entre dois pontos. Para cada pernada o navegante precisa de três números: o <b>rumo verdadeiro</b>, a <b>distância</b> e o <b>tempo</b>. Neste módulo trabalhamos só com o rumo verdadeiro, lido no anel externo da rosa; a conversão para o rumo da agulha vem no módulo 3.' },
              { t: 'h', txt: 'Ler o rumo entre dois pontos' },
              { t: 'lista', ordenada: true, itens: [
                'Plote os dois pontos e una-os com a régua paralela.',
                'Faça a régua caminhar, sem girar, até uma das bordas passar pelo centro da rosa dos rumos verdadeiros mais próxima.',
                'Leia o rumo no <b>anel externo</b> (verdadeiro), do lado para onde o barco vai.',
                'Escreva o rumo sobre a linha, com três algarismos e precedido de R (ex.: R 068), e a distância sob a linha (d 2,8 M).',
              ] },
              { t: 'figura', svg: FIG_ROSA, legenda: 'A direção de A para B é levada ao centro da rosa. O rumo de A para B é 068°; o lado oposto da rosa mostra 248°, a recíproca, que seria o rumo de B para A.' },
              { t: 'callout', tipo: 'nota', titulo: 'Cuidado com a recíproca', html: 'A régua mostra uma direção com dois sentidos. Antes de escrever, pense: “estou indo mais para leste ou para oeste? para norte ou para sul?”. Se a pernada vai para nordeste, o rumo tem de estar entre 000° e 090°. A recíproca difere de 180°.' },
              { t: 'h', txt: 'Passar a uma distância segura de um perigo' },
              { t: 'lista', ordenada: true, itens: [
                'Tome com o compasso a distância de resguardo desejada (por exemplo, 1 M) na escala de latitudes, na altura do perigo.',
                'Trace, com essa abertura, um arco de círculo em volta do perigo.',
                'Do ponto de partida, trace a reta tangente a esse arco, pelo lado por onde você quer passar.',
                'Leve a direção da tangente à rosa e leia o rumo.',
              ] },
              { t: 'p', html: 'O Manual da DHN resolve assim, por exemplo, o rumo para passar a 1,0 M da ponta da Sapata, em Fernando de Noronha. A distância de resguardo não é um número fixo: aumente-a à noite, com mar grosso, com corrente atravessada ou quando a carta vem de levantamentos antigos.' },
              { t: 'h', txt: 'Exercício guiado na carta de treino' },
              { t: 'p', html: 'Da boia de águas seguras da Barra (23°49,0′S, 044°11,7′W) até o Farol da Ponta do Vigia, a carta dá <b>R 085,5</b> e <b>d 5,4 M</b>. Saindo às 1400 a 6 nós no fundo, o tempo é 60 × 5,4 ÷ 6 = 54 min: você estaria pelo través do farol perto de 1454. Repare que a Laje Preta e a boia cardinal Oeste ficam cerca de 1,4 M ao sul dessa linha. Confira tudo no exercício abaixo, que gera novas pernadas a cada rodada.' },
              { t: 'widget', w: 'carta-nautica', opts: { modo: 'exercicio', exercicio: 'rumo-dist' }, legenda: 'Exercício de rumo e distância. A correção aceita ±2° e ±0,2 M e mostra a solução traçada na carta.' },
              { t: 'callout', tipo: 'intl', intl: true, titulo: 'Trilha internacional', html: 'Na convenção da RYA, a linha de rumo na água leva uma seta, o rumo no fundo (<i>ground track</i>) leva duas e o vetor da corrente (<i>tidal stream</i>) leva três. A diferença entre rumo na água e no fundo é assunto do módulo de navegação estimada e corrente.' },
              { t: 'check', questoes: [
                { id: 'msa1-l11-1', nivel: 'mestre', tema: 'Coordenadas e distâncias', dificuldade: 1,
                  enunciado: 'Qual é a recíproca do rumo 068°?',
                  alternativas: ['248°', '112°', '292°', '158°'], correta: 0,
                  explicacao: 'A recíproca difere de 180°: 068° + 180° = 248°. 112° é o complemento de 068° para 180°. 292° é 360° − 068°. 158° é 068° + 90°, uma perpendicular.',
                  referencia: 'Miguens, vol. I, Apêndice A ao cap. 2, itens C e D', fonte_url: VOL1 },
                { id: 'msa1-l11-2', nivel: 'mestre', tema: 'Coordenadas e distâncias', dificuldade: 2,
                  enunciado: 'Numa pernada que vai claramente para leste, você leu na rosa o rumo 265°. O que aconteceu?',
                  alternativas: ['Você leu a recíproca; o rumo é 085°.', 'Está certo: leste é 265°.', 'Você leu o anel magnético; o rumo é 243°.', 'A régua girou; o rumo é 175°.'], correta: 0,
                  explicacao: 'Rumos para leste ficam perto de 090°. 265° aponta para oeste e é a recíproca de 085°. Leste não é 265°. Ler o anel magnético daria um valor perto do verdadeiro, deslocado da declinação, e não o rumo oposto. Uma régua girada não produz justamente 180° de diferença.',
                  referencia: 'Miguens, vol. I, Apêndice A ao cap. 2, item C', fonte_url: VOL1 },
                { id: 'msa1-l11-3', nivel: 'mestre', tema: 'Coordenadas e distâncias', dificuldade: 2,
                  enunciado: 'Para traçar um rumo que passe a 1 M de uma ponta, onde se toma a abertura de 1 M no compasso?',
                  alternativas: ['Na escala de latitudes, na altura da ponta.', 'Na escala de longitudes, na altura da ponta.', 'No anel externo da rosa dos rumos.', 'Em qualquer lugar da borda, porque 1 M é sempre do mesmo tamanho na carta.'], correta: 0,
                  explicacao: 'A milha se toma na escala de latitudes, na altura do lugar. A escala de longitudes não dá milhas. A rosa mede ângulos. E o tamanho de 1 M na carta de Mercator varia com a latitude.',
                  referencia: 'Miguens, vol. I, Apêndice A ao cap. 2, item F', fonte_url: VOL1 },
                { id: 'msa1-l11-4', nivel: 'mestre', tema: 'Velocidade, tempo e distância', dificuldade: 2,
                  enunciado: 'Uma pernada tem 5,4 M. Saindo às 1400 a 6 nós no fundo, a que horas você completa a pernada?',
                  alternativas: ['1454', '1532', '1424', '1505'], correta: 0,
                  explicacao: 'T = 60 × 5,4 ÷ 6 = 54 min; 1400 + 54 min = 1454. 1532 soma 1 h 32. 1424 usa 24 min. 1505 soma 65 min.',
                  referencia: 'Miguens, vol. I, item 1.9', fonte_url: VOL1 },
              ] },
              { t: 'fontes', itens: [
                mig('Apêndice A ao cap. 2, itens C, D, E e F'),
                mig('cap. 11, item 11.6.1 (réguas paralelas e plotadores)'),
              ] },
            ],
          },
        ],
      },
      /* =============================================================================== M3 */
      {
        id: 'm3', titulo: 'Rumos, marcações e a agulha',
        resumo: 'Rumo verdadeiro, magnético e da agulha; declinação magnética e sua atualização pela rosa da carta; desvio, curva de desvios e determinação por alinhamento; conversão de rumos e de marcações (verdadeira, magnética, da agulha e relativa); e os instrumentos: agulhas magnética e giroscópica, odômetros, prumo de mão, alidades e taxímetro.',
        licoes: [
          /* ---------------------------------------------------------------- l12 */
          {
            id: 'l12', titulo: 'Os três nortes: rumo verdadeiro, magnético e da agulha', minutos: 10,
            objetivos: [
              'Definir rumo, proa e as três direções de referência usadas a bordo.',
              'Usar as abreviaturas oficiais Rv, Rmg, Rag e Rgiro.',
              'Entender por que na carta só se traçam rumos verdadeiros.',
            ],
            blocos: [
              { t: 'p', html: '<b>Rumo</b> é o ângulo horizontal entre uma direção de referência e a proa do barco, medido de 000° a 360° no sentido dos ponteiros do relógio. Escreve-se sempre com três algarismos na parte inteira (045°, 233,5°), com precisão de meio grau. A <b>proa</b> é para onde o barco aponta num instante: ela oscila com o mar, o vento e o timoneiro, enquanto o rumo é o que se procura manter.' },
              { t: 'p', html: 'O número do rumo depende do “norte” de onde se começa a contar. A bordo convivem três:' },
              { t: 'lista', itens: [
                '<b>Norte verdadeiro</b> (geográfico): a direção do polo Norte ao longo do meridiano. É o norte da carta e o da agulha giroscópica.',
                '<b>Norte magnético</b>: para onde aponta uma agulha livre de qualquer influência do barco, seguindo o meridiano magnético do lugar.',
                '<b>Norte da agulha</b>: para onde a agulha de bordo realmente aponta, desviada pelos ferros, pelo motor e pelos equipamentos elétricos do barco.',
              ] },
              { t: 'figura', svg: FIG_NORTES, legenda: 'O mesmo rumo em três referências. Com declinação de 22° W e desvio de 6° E (exagerado para ficar visível), a proa que está no Rv 070° corresponde ao Rmg 092° e ao Rag 086°.' },
              { t: 'p', html: 'O ângulo entre o Norte verdadeiro e o magnético é a <b>declinação magnética</b> (Dec mg). O ângulo entre o Norte magnético e o da agulha é o <b>desvio da agulha</b> (Dag). Os dois se chamam Leste (E) ou Oeste (W) conforme o lado para onde fica o segundo norte. As próximas lições tratam de cada um.' },
              { t: 'tabela', cab: ['Abreviatura', 'Rumo', 'Medido a partir do'],
                linhas: [
                  ['Rv (ou R)', 'verdadeiro', 'Norte verdadeiro'],
                  ['Rmg', 'magnético', 'Norte magnético'],
                  ['Rag', 'da agulha', 'Norte da agulha magnética de bordo'],
                  ['Rgiro', 'da giro', 'Norte da agulha giroscópica'],
                  ['Rp', 'prático', 'referências de terra, em rios e canais'],
                  ['Rfd', 'no fundo', 'Norte verdadeiro, já com o efeito da corrente'],
                ], legenda: 'Convenção do Manual de Navegação da DHN. Repare: magnético é Rmg, e não Rm.' },
              { t: 'termos', ids: ['rumo', 'rumo-verdadeiro', 'rumo-magnetico', 'rumo-da-agulha', 'declinacao-magnetica', 'desvio-da-agulha', 'linha-de-fe'] },
              { t: 'h', txt: 'Na carta, só o verdadeiro' },
              { t: 'p', html: 'A carta é construída sobre os meridianos, que apontam o Norte verdadeiro. Por isso a regra do Manual da DHN é taxativa: <b>só se traçam na carta rumos e marcações verdadeiros</b>. Quem traça na carta o número lido na agulha erra pela soma da declinação e do desvio, que na costa brasileira pode passar de 20°.' },
              { t: 'callout', tipo: 'dica', titulo: 'Quem usa cada número', html: 'O navegante planeja na carta em <b>Rv</b>. O timoneiro governa pela agulha em <b>Rag</b>. Quando o comandante diz “governe 104”, está dando um rumo da agulha. A conversão entre os dois é o trabalho do navegante, e é o que mais cai na prova.' },
              { t: 'widget', w: 'agulha-calc', opts: { conhecido: 'v', valor: 70 }, legenda: 'Arraste a proa na rosa de três anéis (verdadeiro, magnético e da agulha) e observe como o mesmo rumo tem três números diferentes. A declinação e a tabela de desvios são as da carta de treino.' },
              { t: 'callout', tipo: 'intl', intl: true, titulo: 'Trilha internacional', html: 'Em inglês: <i>True</i> (Rv), <i>Magnetic</i> (Rmg) e <i>Compass</i> (Rag); a declinação se chama <i>variation</i> e o desvio, <i>deviation</i>. O mnemônico americano “True Virgins Make Dull Companions” lembra a ordem: <i>True, Variation, Magnetic, Deviation, Compass</i>.' },
              { t: 'check', questoes: [
                { id: 'msa1-l12-1', nivel: 'mestre', tema: 'Agulha e conversão de rumos', dificuldade: 1,
                  enunciado: 'Qual é a forma correta de escrever um rumo de quarenta e cinco graus?',
                  alternativas: ['045°', '45°', 'N 45° E', '4,5°'], correta: 0,
                  explicacao: 'Rumos e marcações se escrevem sempre com três algarismos na parte inteira: 045°. “45°” sem o zero pode ser confundido numa leitura rápida. “N 45° E” é a notação por quadrantes, que não se usa na navegação moderna. 4,5° é outro ângulo.',
                  referencia: 'Miguens, vol. I, item 1.8', fonte_url: VOL1 },
                { id: 'msa1-l12-2', nivel: 'mestre', tema: 'Agulha e conversão de rumos', dificuldade: 1,
                  enunciado: 'O desvio da agulha é o ângulo entre:',
                  alternativas: ['O Norte magnético e o Norte da agulha.', 'O Norte verdadeiro e o Norte magnético.', 'A proa e o Norte verdadeiro.', 'O rumo e a marcação de um farol.'], correta: 0,
                  explicacao: 'Desvio é o ângulo entre o Norte magnético e o Norte da agulha, causado pelo próprio barco. O ângulo entre Norte verdadeiro e magnético é a declinação. O ângulo entre a proa e o Norte verdadeiro é o rumo verdadeiro. Rumo e marcação são grandezas diferentes, sem nome especial para a diferença entre elas.',
                  referencia: 'Miguens, vol. I, item 3.2.4 b', fonte_url: VOL1 },
                { id: 'msa1-l12-3', nivel: 'mestre', tema: 'Agulha e conversão de rumos', dificuldade: 1,
                  enunciado: 'Que rumo se traça na carta náutica?',
                  alternativas: ['O rumo verdadeiro.', 'O rumo da agulha, porque é o que o timoneiro lê.', 'O rumo magnético, porque a rosa tem um anel magnético.', 'Qualquer um, desde que anotado ao lado da linha.'], correta: 0,
                  explicacao: 'Só se traçam na carta rumos e marcações verdadeiros, porque a carta é referida aos meridianos verdadeiros. O rumo da agulha é para governar, depois de convertido. O anel magnético da rosa é um auxílio de leitura, não muda a regra. Anotar o tipo não corrige o erro de traçar na referência errada.',
                  referencia: 'Miguens, vol. I, item 3.2.5', fonte_url: VOL1 },
              ] },
              { t: 'fontes', itens: [
                mig('cap. 1, item 1.8, e cap. 3, itens 3.1 e 3.2.5'),
                { txt: 'Convenção de abreviaturas de rumos (Miguens, vol. I, p. 1-15)', url: VOL1, ref: 'tecnico-178' },
                { txt: 'Só se traçam na carta rumos e marcações verdadeiros (Miguens, vol. I, item 3.2.5)', url: VOL1, ref: 'tecnico-179' },
              ] },
            ],
          },
          /* ---------------------------------------------------------------- l13 */
          {
            id: 'l13', titulo: 'Declinação magnética: ler e atualizar a rosa da carta', minutos: 12,
            objetivos: [
              'Explicar o que é a declinação magnética e por que ela muda com o lugar e com o tempo.',
              'Ler a declinação, o ano e a variação anual na rosa dos rumos.',
              'Atualizar a declinação para o ano em que você navega.',
            ],
            blocos: [
              { t: 'p', html: 'A Terra se comporta como um grande ímã, com dois polos magnéticos que não coincidem com os geográficos e que se deslocam lentamente ao longo dos anos. A agulha se alinha com as linhas de força desse campo, os <b>meridianos magnéticos</b>, que nem são retas regulares.' },
              { t: 'p', html: 'A <b>declinação magnética</b> (Dec mg) é o ângulo, num lugar, entre o Norte verdadeiro e o Norte magnético. É <b>W</b> quando o Norte magnético fica a oeste do verdadeiro e <b>E</b> quando fica a leste. Ela muda de lugar para lugar e muda com o tempo. Nos exemplos do Manual da DHN, vale 22°10′W no Rio de Janeiro (2015) e 21°25′W em Fernando de Noronha (1990). Com valores assim, esquecer a declinação é errar o rumo em mais de 20°.' },
              { t: 'termos', ids: ['declinacao-magnetica', 'rosa-dos-ventos', 'agulha'] },
              { t: 'h', txt: 'Lendo a rosa dos rumos' },
              { t: 'p', html: 'A carta mostra a declinação dentro da rosa dos rumos: o anel externo é o verdadeiro, o interno é o magnético, girado do valor da declinação. Junto vem uma anotação como <b>22°10′W 2025 (7′W)</b>: a declinação era de 22°10′ para oeste em 2025 e aumenta 7′ por ano para oeste.' },
              { t: 'figura', svg: FIG_ROSA_DEC, legenda: 'Rosa da carta de treino deste curso (valores fictícios, plausíveis para o Sudeste). O anel interno está girado 22°10′ para oeste em relação ao externo.' },
              { t: 'p', html: 'Em cartas de escala menor que 1:750.000, ou onde a declinação muda rápido, a informação vem em <b>linhas isogônicas</b> (de mesma declinação), a cada 1°, 2° ou 3°, rotuladas com o valor e a variação anual. Notas da carta também podem avisar sobre <b>anomalias magnéticas</b> locais.' },
              { t: 'h', txt: 'Atualizando para o ano da navegação' },
              { t: 'lista', ordenada: true, itens: [
                'Conte os anos entre o ano da rosa e o ano atual.',
                'Multiplique pela variação anual.',
                'Se a variação tem o <b>mesmo sentido</b> da declinação (W com W), <b>some</b>; se tem <b>sentido oposto</b> (W com E), <b>subtraia</b>.',
                'Arredonde o resultado para meio grau.',
              ] },
              { t: 'p', html: '<b>Exemplo do Manual da DHN</b>, costa do Rio de Janeiro: 22°10′W em 2015, variação 6′W. Em 2021 são 6 anos × 6′W = 36′W. Declinação: 22°10′ + 36′ = 22°46′W ≈ <b>23°W</b>.' },
              { t: 'p', html: '<b>Exemplo com variação contrária</b>: Fernando de Noronha, 21°25′W em 1990, variação 1′E. Em 2026 são 36 anos × 1′E = 36′E. Declinação: 21°25′ − 36′ = 20°49′W ≈ <b>21°W</b>. Repare que, com uma rosa tão antiga, a extrapolação fica pouco confiável: prefira a carta mais recente.' },
              { t: 'p', html: '<b>Na carta de treino</b>, em 2026: 1 ano × 7′W = 7′W; 22°10′ + 7′ = 22°17′W ≈ <b>22,5°W</b>.' },
              { t: 'callout', tipo: 'nota', titulo: 'Para conferir um valor atual', html: 'O Manual da DHN indica as cartas de isogônicas da NOAA/NCEI baseadas no modelo magnético mundial (WMM). A versão vigente, WMM2025, foi lançada em dezembro de 2024 e vale até o fim de 2029; a NOAA tem uma calculadora on-line de declinação. Use esses valores para conferir, mas, na prova e na navegação, a referência é a rosa da carta.' },
              { t: 'widget', w: 'agulha-calc', opts: { modo: 'exercicio', exercicio: 'dec' }, legenda: 'Exercícios de atualização da declinação, com resolução comentada. Faça vários: os sinais (W com W soma, W com E subtrai) são o ponto que mais derruba candidatos.' },
              { t: 'check', questoes: [
                { id: 'msa1-l13-1', nivel: 'mestre', tema: 'Agulha e conversão de rumos', dificuldade: 2,
                  enunciado: 'A rosa da carta diz “21°30′W 2020 (8′W)”. Qual é a declinação em 2026?',
                  alternativas: ['22°18′W, ou cerca de 22,5°W', '20°42′W', '21°38′W', '22°18′E'], correta: 0,
                  explicacao: 'São 6 anos × 8′W = 48′W; como a variação tem o mesmo sentido da declinação, soma: 21°30′ + 48′ = 22°18′W, arredondado para 22,5°W. 20°42′W subtrai em vez de somar. 21°38′W aplica só um ano. 22°18′E troca o nome da declinação.',
                  referencia: 'Miguens, vol. I, item 3.2.5, exemplo 2', fonte_url: VOL1 },
                { id: 'msa1-l13-2', nivel: 'mestre', tema: 'Agulha e conversão de rumos', dificuldade: 1,
                  enunciado: 'Uma declinação de 20° W significa que:',
                  alternativas: ['O Norte magnético fica 20° a oeste do Norte verdadeiro.', 'O Norte magnético fica 20° a leste do Norte verdadeiro.', 'A agulha do barco tem 20° de desvio para oeste.', 'O rumo verdadeiro é sempre 20° maior que o da agulha.'], correta: 0,
                  explicacao: 'O nome da declinação indica o lado do Norte magnético em relação ao verdadeiro: W, a oeste. Leste seria declinação E. Desvio é outra coisa, causada pelo barco. E a relação entre Rv e Rag depende também do desvio; com declinação W, aliás, o Rv é menor que o Rmg.',
                  referencia: 'Miguens, vol. I, item 3.2.3 b', fonte_url: VOL1 },
                { id: 'msa1-l13-3', nivel: 'mestre', tema: 'Agulha e conversão de rumos', dificuldade: 3,
                  enunciado: 'Numa carta estrangeira, a rosa diz “2°15′E 2016 (10′W)”. Qual é a declinação em 2026?',
                  alternativas: ['0°35′E', '3°55′E', '0°35′W', '1°40′W'], correta: 0,
                  explicacao: 'São 10 anos × 10′W = 100′W = 1°40′W. Como a variação tem sentido oposto ao da declinação (E), subtrai: 2°15′ − 1°40′ = 0°35′E. 3°55′E soma em vez de subtrair. 0°35′W troca o nome sem motivo: a declinação ainda não passou de zero. 1°40′W é só a variação acumulada.',
                  referencia: 'Miguens, vol. I, itens 3.2.3 e 3.2.5', fonte_url: VOL1 },
              ] },
              { t: 'fontes', itens: [
                mig('cap. 3, itens 3.2.3 e 3.2.5 (exemplo 2); cap. 2, item 2.6.3 i; Apêndice A ao cap. 2, item C'),
                { txt: 'Definição de declinação magnética (Miguens, vol. I, item 3.2.3)', url: VOL1, ref: 'tecnico-168' },
                { txt: 'NOAA/NCEI, World Magnetic Model (WMM2025)', url: WMM, ref: 'tecnico-171' },
                { txt: 'NOAA/NCEI, calculadoras de campo magnético', url: NOAA_CALC, ref: 'tecnico-173' },
              ] },
            ],
          },
          /* ---------------------------------------------------------------- l14 */
          {
            id: 'l14', titulo: 'Desvio da agulha, curva de desvios e alinhamentos', minutos: 15,
            objetivos: [
              'Explicar o que causa o desvio e por que ele muda com a proa.',
              'Ler a tabela e a curva de desvios, interpolando quando preciso.',
              'Determinar o desvio da agulha por alinhamento, como pede o programa do Mestre.',
            ],
            blocos: [
              { t: 'p', html: 'Em terra, longe de ferros, a agulha aponta o Norte magnético. A bordo, ela sente também o campo magnético do próprio barco: o motor, o lastro de ferro, a fiação, os alto-falantes, as ferramentas. O resultado é o <b>desvio da agulha</b> (Dag), o ângulo entre o Norte magnético e o Norte da agulha. É <b>E</b> quando o Norte da agulha fica a leste do magnético e <b>W</b> quando fica a oeste.' },
              { t: 'p', html: 'O detalhe que importa: o desvio <b>muda com a proa</b>. Imagine todo o ferro do barco concentrado na proa. Aproado ao Norte magnético, o ferro puxa a agulha no mesmo sentido da Terra e o desvio é zero. Aproado a 090°, o ferro puxa a agulha para leste e o desvio é máximo E. Aproado ao Sul, volta a zero; a 270°, é máximo W. Na vida real o ferro não fica num ponto só, mas o desvio continua dependendo da proa.' },
              { t: 'lista', itens: [
                'Mudar de lugar peças de ferro, o motor ou a bateria.',
                'Instalar equipamentos elétricos ou alto-falantes perto da agulha.',
                'Esquecer chave, canivete, celular ou lanterna perto dela.',
                'Raios, tempestades magnéticas e choques fortes, como um encalhe.',
                'Navegar perto de terra com solo magnético, ou de outros navios.',
              ] },
              { t: 'callout', tipo: 'seguranca', titulo: 'Agulha limpa', html: 'Deixe uma zona livre em volta da agulha de governo. Um celular ou uma lata de cerveja no cockpit podem mudar o desvio em vários graus sem ninguém perceber.' },
              { t: 'h', txt: 'Compensação, tabela e curva' },
              { t: 'p', html: 'A <b>compensação</b> consiste em instalar ímãs corretores que reduzem o desvio. O que sobra, o <b>desvio residual</b>, é medido em proas equidistantes (de 15°, 30° ou 45°) e registrado numa <b>tabela de desvios</b> e numa <b>curva de desvios</b>, que deve ficar junto da agulha.' },
              { t: 'fato', ref: 'extra-mestre-1-01', html: 'A NORMAM-211 exige agulha magnética de governo em todas as embarcações, exceto as miúdas. As de 24 m ou mais devem ter também certificado de compensação ou curva de desvio, atualizados a cada 2 anos.' },
              { t: 'fato', ref: 'extra-mestre-1-05', html: 'No quadro-resumo da navegação costeira, a agulha magnética é obrigatória para embarcações de médio porte; para as de grande porte ou iates, compensada ou com curva de desvio válida por 2 anos.' },
              { t: 'callout', tipo: 'dica', titulo: 'E o seu veleiro?', html: 'Nos quadros de equipamentos do Capítulo 4, que seguem o Glossário da norma, uma embarcação com menos de 24 m (fora as miúdas) é de médio porte, e é aí que entra a maioria dos veleiros de cruzeiro (acima de 6 m e abaixo de 24 m): para elas, a norma exige a agulha de governo, mas não o certificado de compensação. O art. 1.7 da mesma norma divide de outro jeito (“pequeno porte” de 6 a 12 m): é uma inconsistência interna do texto, então, em caso de dúvida, pergunte à sua Capitania qual enquadramento ela aplica. Mesmo assim, faça e mantenha a sua curva de desvios. Sem ela, todo rumo da agulha carrega um erro que você não conhece.' },
              { t: 'fato', ref: 'normas-18', html: 'Pelo Glossário da NORMAM-211, embarcação de médio porte é a de comprimento inferior a 24 m, exceto as miúdas. O art. 1.7 diz outra coisa (médio porte de 12 a 24 m; pequeno porte de 6 a 12 m): as duas definições divergem no próprio texto da norma.' },
              { t: 'tabela', cab: ['Proa', 'Desvio', 'Proa', 'Desvio'],
                linhas: [
                  ['000°', '1° W', '180°', '2° E'], ['030°', '1° E', '210°', '1° E'], ['060°', '3° E', '240°', '1° W'],
                  ['090°', '4° E', '270°', '3° W'], ['120°', '3° E', '300°', '4° W'], ['150°', '3° E', '330°', '3° W'],
                ], legenda: 'Tabela de desvios de exemplo de uma agulha de antepara já compensada (é a mesma usada nos simuladores deste curso).' },
              { t: 'figura', svg: FIG_CURVA, legenda: 'A curva de desvios correspondente. Entre dois valores da tabela, interpole: na proa 075°, metade do caminho entre 060° (3° E) e 090° (4° E), o desvio é 3,5° E.' },
              { t: 'p', html: 'Regras de uso: entre na curva sempre com o <b>rumo (a proa)</b>, nunca com uma marcação. A curva é feita para rumos magnéticos; quando você só tem o rumo da agulha, entre com ele como se fosse o magnético, como faz o Manual da DHN. Use os valores aproximados a meio grau.' },
              { t: 'h', txt: 'Determinar o desvio por alinhamento' },
              { t: 'p', html: 'Um <b>alinhamento</b> é formado por dois objetos fixos, representados na carta, vistos um exatamente atrás do outro (“enfiados”): marcas de alinhamento de um canal, um farol e uma torre, duas pontas bem definidas. Na carta você lê a direção verdadeira do alinhamento e a converte em magnética com a declinação do ano.' },
              { t: 'p', html: 'Em veleiros e iates com bússola de antepara, que não permite tomar marcações, o método é <b>governar exatamente sobre o alinhamento</b> e ler o rumo da agulha. O desvio é a diferença: <b>Dag = Rmg do alinhamento − Rag lido</b>. Resultado positivo é desvio E; negativo, W. Para montar a curva, você precisa de vários alinhamentos, de preferência perto de N–S, E–W e dos quadrantais (NE–SW, NW–SE).' },
              { t: 'figura', svg: FIG_ALINH, legenda: 'Alinhamento com Mv 315° na carta. Com declinação de 22° W, a direção magnética é 337°. Governando sobre ele, a agulha mostra 340°: o desvio nessa proa é de 3° W.' },
              { t: 'p', html: 'Com uma agulha que permite tomar marcações (com alidade ou círculo azimutal), basta um alinhamento: cruze-o em várias proas e, no instante em que as marcas ficam enfiadas, compare a marcação da agulha com a marcação magnética do alinhamento. Durante o trabalho, mantenha cada proa por alguns minutos e faça guinadas suaves.' },
              { t: 'widget', w: 'agulha-calc', opts: { modo: 'exercicio', exercicio: 'alinhamento' }, legenda: 'Exercícios de desvio por alinhamento, com resolução comentada.' },
              { t: 'check', questoes: [
                { id: 'msa1-l14-1', nivel: 'mestre', tema: 'Agulha e conversão de rumos', dificuldade: 1,
                  enunciado: 'O desvio de uma agulha magnética de bordo varia principalmente com:',
                  alternativas: ['A proa do barco.', 'A hora do dia.', 'O ano, como a declinação.', 'A distância percorrida desde a última compensação.'], correta: 0,
                  explicacao: 'O desvio vem do magnetismo do barco, cuja orientação em relação ao campo da Terra muda com a proa. A hora do dia não interfere. Quem muda com o ano é a declinação. A distância navegada, por si, não altera o desvio.',
                  referencia: 'Miguens, vol. I, item 3.2.4 b', fonte_url: VOL1 },
                { id: 'msa1-l14-2', nivel: 'mestre', tema: 'Agulha e conversão de rumos', dificuldade: 2,
                  enunciado: 'Pela tabela da lição, qual é o desvio na proa 105°?',
                  alternativas: ['3,5° E', '4° E', '3° E', '3,5° W'], correta: 0,
                  explicacao: '105° fica no meio entre 090° (4° E) e 120° (3° E); interpolando, 3,5° E. 4° E e 3° E são os valores das proas vizinhas, sem interpolar. 3,5° W troca o nome do desvio.',
                  referencia: 'Miguens, vol. I, item 3.2.4 e', fonte_url: VOL1 },
                { id: 'msa1-l14-3', nivel: 'mestre', tema: 'Agulha e conversão de rumos', dificuldade: 2,
                  enunciado: 'Um alinhamento tem direção magnética de 200°. Governando exatamente sobre ele, a agulha indica 197°. Qual é o desvio nessa proa?',
                  alternativas: ['3° E', '3° W', 'Zero', '6° E'], correta: 0,
                  explicacao: 'Dag = Rmg − Rag = 200° − 197° = +3°, ou seja, 3° E. Conferindo: Rmg = Rag + Dag E = 197° + 3° = 200°. 3° W inverte o sinal. Zero ignora a diferença. 6° E dobra o valor.',
                  referencia: 'Miguens, vol. I, item 3.2.4 h', fonte_url: VOL1 },
                { id: 'msa1-l14-4', nivel: 'mestre', tema: 'Agulha e conversão de rumos', dificuldade: 2,
                  enunciado: 'Para converter uma marcação da agulha, com que valor se entra na curva de desvios?',
                  alternativas: ['Com o rumo (proa) do barco.', 'Com a própria marcação observada.', 'Com a declinação magnética.', 'Com a média entre o rumo e a marcação.'], correta: 0,
                  explicacao: 'O desvio depende da orientação do barco, isto é, da proa. Todas as marcações tomadas na mesma proa usam o mesmo desvio. Entrar com a marcação é o erro clássico. A declinação não é argumento da curva. Média de rumo e marcação não tem sentido físico.',
                  referencia: 'Miguens, vol. I, item 3.2.5 b', fonte_url: VOL1 },
              ] },
              { t: 'fontes', itens: [
                mig('cap. 3, itens 3.2.4 (b a h) e 3.2.5'),
                { txt: 'O desvio varia com a proa (Miguens, vol. I, item 3.2.4)', url: VOL1, ref: 'tecnico-176' },
                { txt: 'Desvio por alinhamentos em veleiros com bússola de antepara (Miguens, vol. I, item 3.2.4 h)', url: VOL1, ref: 'tecnico-177' },
                { txt: 'NORMAM-211/DPC, art. 4.19.1 a) (agulha magnética de governo)', url: NORMAM211, ref: 'extra-mestre-1-01' },
                { txt: 'NORMAM-211/DPC, art. 4.34 (quadro da navegação costeira)', url: NORMAM211, ref: 'extra-mestre-1-05' },
              ] },
            ],
          },
          /* ---------------------------------------------------------------- l15 */
          {
            id: 'l15', titulo: 'Conversão de rumos: da agulha para a carta e de volta', minutos: 14,
            objetivos: [
              'Converter Rag em Rmg e Rv, e Rv em Rmg e Rag, com os sinais certos.',
              'Usar um diagrama simples para não errar o sentido.',
              'Resolver problemas completos com declinação atualizada e curva de desvios.',
            ],
            blocos: [
              { t: 'p', html: 'Converter rumos é aplicar duas correções em sequência: o <b>desvio</b> leva da agulha ao magnético, e a <b>declinação</b> leva do magnético ao verdadeiro. As fórmulas do Manual da DHN são:' },
              { t: 'lista', itens: [
                '<b>Rmg = Rag ± Dag</b>',
                '<b>Rv = Rmg ± Dec mg</b>',
                'Indo da agulha para a carta (Rag → Rv): <b>leste soma, oeste subtrai</b>. Indo da carta para a agulha (Rv → Rag): o contrário, <b>oeste soma, leste subtrai</b>.',
              ] },
              { t: 'figura', svg: FIG_CONV, legenda: 'O caminho da conversão. Escreva sempre as três caixas e os dois valores, com E ou W, antes de fazer a conta.' },
              { t: 'callout', tipo: 'dica', titulo: 'Confira pelo desenho', html: 'Se a declinação é W, o Norte magnético está à esquerda do verdadeiro; contado a partir dele, o mesmo rumo dá um número maior. Logo, com declinação W, o <b>Rmg é maior que o Rv</b>. Se a sua conta disser o contrário, o sinal está trocado. O mesmo vale para o desvio: com desvio W, o Rag é maior que o Rmg.' },
              { t: 'h', txt: 'Exemplos resolvidos do Manual da DHN' },
              { t: 'lista', ordenada: true, itens: [
                '<b>Da agulha para a carta.</b> Dec mg 20° W; Rag 085°; Dag 5° E. Rmg = 085° + 5° = <b>090°</b>. Rv = 090° − 20° = <b>070°</b>.',
                '<b>Da carta para a agulha.</b> Dec mg 15° W; Rv 075°. Rmg = 075° + 15° = <b>090°</b>. Na curva, desvio de 3° E nessa proa. Rag = 090° − 3° = <b>087°</b>.',
                '<b>Com atualização da declinação.</b> Costa do Rio, 2021, Dec mg 23° W (calculada na lição anterior). Rag 160°; entrando na curva com 160°, Dag 2° W. Rmg = 160° − 2° = <b>158°</b>. Rv = 158° − 23° = <b>135°</b>.',
                '<b>Planejando uma pernada.</b> Do farol da Ilha Rasa ao de Maricás, a carta dá Rv 078°; Dec mg 23° W. Rmg = 078° + 23° = <b>101°</b>. Desvio para essa proa: 2,5° E. Rag = 101° − 2,5° = <b>098,5°</b>.',
              ] },
              { t: 'callout', tipo: 'nota', titulo: 'De onde vêm os desvios', html: 'Nestes quatro exemplos, os desvios (5° E, 3° E, 2° W e 2,5° E) são os dados pelo Manual para a agulha dele. Não são os da tabela da lição 14: na prova, o desvio vem da curva que o problema fornece. Na carta de treino, logo abaixo, usamos a tabela da lição 14.' },
              { t: 'h', txt: 'Na carta de treino' },
              { t: 'p', html: 'Na lição 11 você mediu da boia da Barra ao Farol da Ponta do Vigia: <b>Rv 085,5°</b>. Em 2026 a declinação da carta de treino é 22°17′W, cerca de 22,5° W. Rmg = 085,5° + 22,5° = <b>108°</b>. Na tabela de desvios, 108° fica entre 090° (4° E) e 120° (3° E): interpolando, cerca de 3,5° E. Rag = 108° − 3,5° = <b>104,5°</b>. É esse o número que você passa ao timoneiro. Conferindo de volta: 104,5° + 3,5° = 108°; 108° − 22,5° = 085,5°.' },
              { t: 'callout', tipo: 'seguranca', titulo: 'O sinal trocado dobra o erro', html: 'Com declinação de 22° W, quem aplica o sinal ao contrário erra o rumo em 44°. Numa pernada de 10 milhas, isso põe o barco a quase 7 milhas do destino, talvez em cima de uma laje. Confira toda conversão fazendo o caminho de volta.' },
              { t: 'widget', w: 'agulha-calc', opts: { modo: 'exercicio', exercicio: 'rv-rag' }, legenda: 'Exercícios de conversão do rumo verdadeiro para o da agulha, com resolução passo a passo. Mude o tipo de exercício para treinar também o caminho inverso.' },
              { t: 'check', questoes: [
                { id: 'msa1-l15-1', nivel: 'mestre', tema: 'Agulha e conversão de rumos', dificuldade: 2,
                  enunciado: 'Dec mg 21° W, Rag 150° e, para essa proa, Dag 2° E. Quais são o Rmg e o Rv?',
                  alternativas: ['Rmg 152° e Rv 131°', 'Rmg 148° e Rv 127°', 'Rmg 152° e Rv 173°', 'Rmg 148° e Rv 169°'], correta: 0,
                  explicacao: 'Da agulha para a carta, leste soma e oeste subtrai: Rmg = 150° + 2° = 152°; Rv = 152° − 21° = 131°. Rmg 148° subtrai o desvio E. Rv 173° soma a declinação W. Rmg 148° com Rv 169° troca os dois sinais.',
                  referencia: 'Miguens, vol. I, item 3.2.5', fonte_url: VOL1 },
                { id: 'msa1-l15-2', nivel: 'mestre', tema: 'Agulha e conversão de rumos', dificuldade: 2,
                  enunciado: 'Na carta, Rv 040°. Dec mg 22° W e, para a proa correspondente, Dag 4° W. Em que rumo da agulha você deve governar?',
                  alternativas: ['066°', '014°', '058°', '022°'], correta: 0,
                  explicacao: 'Da carta para a agulha, oeste soma: Rmg = 040° + 22° = 062°; Rag = 062° + 4° = 066°. 014° subtrai os dois (sinais de agulha para carta). 058° subtrai o desvio W. 022° subtrai a declinação e soma o desvio.',
                  referencia: 'Miguens, vol. I, item 3.2.5', fonte_url: VOL1 },
                { id: 'msa1-l15-3', nivel: 'mestre', tema: 'Agulha e conversão de rumos', dificuldade: 1,
                  enunciado: 'Ao converter um rumo verdadeiro em rumo da agulha, a regra de sinais é:',
                  alternativas: ['Oeste soma e leste subtrai.', 'Leste soma e oeste subtrai.', 'Sempre se soma, qualquer que seja o nome.', 'Sempre se subtrai, qualquer que seja o nome.'], correta: 0,
                  explicacao: 'No caminho da carta para a agulha, os sinais são o inverso do caminho da agulha para a carta: oeste soma, leste subtrai. “Leste soma” vale para Rag → Rv. Somar ou subtrair sempre ignora o nome E/W, que é justamente o que define o sentido.',
                  referencia: 'Miguens, vol. I, item 3.2.5 a', fonte_url: VOL1 },
                { id: 'msa1-l15-4', nivel: 'mestre', tema: 'Agulha e conversão de rumos', dificuldade: 2,
                  enunciado: 'Numa área de declinação 22° W, você aplica a declinação com o sinal trocado. De quanto fica errado o rumo?',
                  alternativas: ['44°', '22°', '11°', 'Não há erro, só uma diferença de notação.'], correta: 0,
                  explicacao: 'Em vez de somar 22°, você subtrai 22° (ou o contrário): o resultado fica a 44° do certo. 22° seria esquecer a declinação. 11° não tem relação com a conta. E o erro é real: o barco segue outra direção.',
                  referencia: 'Miguens, vol. I, item 3.2.5', fonte_url: VOL1 },
              ] },
              { t: 'fontes', itens: [
                mig('cap. 3, item 3.2.5 a (exemplos 1 a 4 e Figuras 3.13 e 3.14)'),
                { txt: 'Exemplo DHN de conversão Rag → Rmg → Rv (Miguens, vol. I, Figura 3.13)', url: VOL1, ref: 'tecnico-181' },
                { txt: 'Aproximação a 0,5° na conversão (Miguens, vol. I, item 3.2.5)', url: VOL1, ref: 'tecnico-180' },
              ] },
            ],
          },
          /* ---------------------------------------------------------------- l16 */
          {
            id: 'l16', titulo: 'Marcações: verdadeira, magnética, da agulha e relativa', minutos: 13,
            objetivos: [
              'Definir marcação e os seus tipos: Mv, Mmg, Mag, relativa e polar.',
              'Converter marcações usando o desvio da proa.',
              'Tomar marcações com agulha de mão, alidade ou taxímetro.',
            ],
            blocos: [
              { t: 'p', html: '<b>Marcação</b> é o ângulo horizontal entre uma direção de referência e a linha que vai do observador até um objeto: um farol, uma ponta, uma torre. Ela é a matéria-prima da posição na navegação costeira: cada marcação de um ponto conhecido vira, na carta, uma linha de posição.' },
              { t: 'lista', itens: [
                '<b>Marcação verdadeira (Mv)</b>: a partir do Norte verdadeiro, de 000° a 360°. É a que se traça na carta.',
                '<b>Marcação magnética (Mmg)</b>: a partir do Norte magnético.',
                '<b>Marcação da agulha (Mag)</b>: a partir do Norte da agulha de bordo, como sai de uma agulha de mão ou de uma alidade sobre a agulha.',
                '<b>Marcação relativa (Mr)</b>: a partir da proa, de 000° a 360°, no sentido horário.',
                '<b>Marcação polar (Mp)</b>: a partir da proa, de 000° a 180°, para boreste (BE) ou para bombordo (BB).',
              ] },
              { t: 'termos', ids: ['marcacao', 'marcacao-relativa', 'alinhamento', 'linha-de-posicao'] },
              { t: 'h', txt: 'Da marcação relativa à verdadeira' },
              { t: 'p', html: 'A regra é uma soma: <b>Mv = Mr + Rv</b>, tirando 360° se passar. Uma marcação polar se transforma antes em relativa: para boreste, Mr = Mp; para bombordo, Mr = 360° − Mp. Exemplo do Manual: no Rv 045°, um farol exatamente no través de bombordo está em Mp 090° BB, ou Mr 270°; logo Mv = 270° + 045° = <b>315°</b>.' },
              { t: 'figura', svg: FIG_MARC, legenda: 'Marcações relativas a partir da proa. Se o barco está no Rv 045°, as marcações verdadeiras são: A 180°, B 225°, C 315° e D 025° (340° + 45° = 385°, menos 360°).' },
              { t: 'h', txt: 'Convertendo marcações da agulha' },
              { t: 'p', html: 'Marcações da agulha se convertem como os rumos: <b>Mmg = Mag ± Dag</b> e <b>Mv = Mmg ± Dec mg</b>, com leste somando e oeste subtraindo. A diferença é uma só, e decisiva: <b>o desvio usado é o da proa do barco</b>, não o da direção do objeto. Todas as marcações tomadas sem mudar de rumo usam o mesmo desvio.' },
              { t: 'p', html: 'Exemplo do Manual da DHN, costa do Rio, 2021: no Rag 110°, marca-se o farol da Ilha Rasa na Mag 327°. Pela curva do Manual, desvio de 2° E para a proa 110° (a tabela da lição 14 é de outra agulha). Mmg = 327° + 2° = 329°. Com Dec mg 23° W: Mv = 329° − 23° = <b>306°</b>, a marcação a traçar na carta. O rumo verdadeiro do barco é 110° + 2° − 23° = 089°.' },
              { t: 'callout', tipo: 'nota', titulo: 'O erro clássico', html: 'Entrar na curva com a marcação 327° daria o desvio de outra proa (por exemplo, 3° W, como na tabela da lição 14 perto de 330°) e uma Mv errada em 5°. Pergunte sempre: “qual é a minha proa agora?”.' },
              { t: 'h', txt: 'Instrumentos para tomar marcações' },
              { t: 'lista', itens: [
                '<b>Agulha de mão</b>: bússola com visor, comum em veleiros. Dá a marcação da agulha. Use-a sempre do mesmo lugar, longe do motor, do estai e de ferragens, porque ela também sofre desvio.',
                '<b>Alidade de pínulas</b>: régua com dois visores (uma fenda e uma mira) montada sobre a rosa de uma agulha ou repetidora. Visa-se o objeto e lê-se a marcação na rosa.',
                '<b>Círculo azimutal</b>: anel com visores que gira sobre a repetidora da giro ou a agulha, com nível de bolha e prisma de leitura; pode ter espelho para azimutes do Sol.',
                '<b>Alidade telescópica</b>: igual ao círculo azimutal, mas com uma luneta com retículo, que amplia objetos distantes.',
                '<b>Taxímetro</b>: rosa graduada <b>sem ímã</b>, que não busca o norte, com uma alidade. Com o zero na linha de fé, ele mede marcações relativas; girando a rosa até o rumo do momento, dá marcações na mesma referência desse rumo. É útil quando a agulha fica onde não se consegue visar.',
              ] },
              { t: 'callout', tipo: 'intl', intl: true, titulo: 'Trilha internacional', html: 'O taxímetro corresponde ao <i>pelorus</i> dos livros em inglês, e a agulha de mão é a <i>hand-bearing compass</i>. Para a RYA, a marcação com a agulha de mão é a forma padrão de obter linhas de posição num veleiro.' },
              { t: 'widget', w: 'agulha-calc', opts: { tipo: 'marcacao', modo: 'exercicio', exercicio: 'marc' }, legenda: 'Exercícios de conversão de marcações da agulha em verdadeiras, sempre com o desvio da proa.' },
              { t: 'check', questoes: [
                { id: 'msa1-l16-1', nivel: 'mestre', tema: 'Marcações', dificuldade: 2,
                  enunciado: 'No Rv 120°, um farol está na marcação relativa 300°. Qual é a marcação verdadeira do farol?',
                  alternativas: ['060°', '180°', '240°', '420°'], correta: 0,
                  explicacao: 'Mv = Mr + Rv = 300° + 120° = 420°; tirando 360°, 060°. 180° é a diferença entre as duas. 240° é 120° + 120°. 420° esquece de tirar 360°.',
                  referencia: 'Miguens, vol. I, item 1.8 (Figura 1.15)', fonte_url: VOL1 },
                { id: 'msa1-l16-2', nivel: 'mestre', tema: 'Marcações', dificuldade: 2,
                  enunciado: 'No Rv 200°, você avista uma boia na marcação polar 045° BB. Qual é a marcação verdadeira?',
                  alternativas: ['155°', '245°', '335°', '115°'], correta: 0,
                  explicacao: 'Para bombordo, Mr = 360° − 45° = 315°; Mv = 315° + 200° = 515° − 360° = 155°. 245° trata a marcação como se fosse para boreste (45° + 200°). 335° e 115° vêm de somas erradas.',
                  referencia: 'Miguens, vol. I, item 1.8 (Figuras 1.16 e 1.17)', fonte_url: VOL1 },
                { id: 'msa1-l16-3', nivel: 'mestre', tema: 'Marcações', dificuldade: 3,
                  enunciado: 'No Rag 250°, com desvio de 2° W para essa proa e Dec mg 22° W, você marca uma ponta na Mag 015°. Qual é a Mv a traçar na carta?',
                  alternativas: ['351°', '039°', '355°', '013°'], correta: 0,
                  explicacao: 'Mmg = 015° − 2° = 013°; Mv = 013° − 22° = −9°, ou seja, 351°. 039° soma os dois valores W. 355° aplica o desvio com o sinal trocado. 013° esquece a declinação.',
                  referencia: 'Miguens, vol. I, item 3.2.5 b', fonte_url: VOL1 },
                { id: 'msa1-l16-4', nivel: 'mestre', tema: 'Marcações', dificuldade: 1,
                  enunciado: 'O que é o taxímetro?',
                  alternativas: ['Uma rosa graduada sem ímã, com alidade, para tomar marcações relativas.', 'Uma agulha magnética de mão com prisma de leitura.', 'O instrumento que mede a velocidade do barco na água.', 'Uma agulha giroscópica portátil.'], correta: 0,
                  explicacao: 'O taxímetro não tem elemento magnético: é uma rosa com alidade, que mede ângulos a partir da linha de fé (ou do rumo em que a rosa for ajustada). A agulha de mão é magnética. Quem mede velocidade é o odômetro ou velocímetro. A giroscópica é outro instrumento, que busca o Norte verdadeiro.',
                  referencia: 'Miguens, vol. I, item 11.2.2; Bowditch (NGA), Pub. 9 (pelorus)', fonte_url: VOL1 },
              ] },
              { t: 'fontes', itens: [
                mig('cap. 1, item 1.8; cap. 3, itens 3.2.5 b e 3.3.5; cap. 11, item 11.2.2'),
                { txt: 'Bowditch, The American Practical Navigator (NGA, Pub. 9, ed. 2024), capítulo de agulhas (pelorus)', url: BOWDITCH },
              ] },
            ],
          },
          /* ---------------------------------------------------------------- l17 */
          {
            id: 'l17', titulo: 'Instrumentos: agulhas, odômetros e prumo de mão', minutos: 15,
            objetivos: [
              'Comparar a agulha magnética e a giroscópica: princípio, vantagens e limitações.',
              'Saber o que mede cada tipo de odômetro e como calibrá-lo pela corrida da milha.',
              'Usar o prumo de mão e reconhecer as marcas da sua linha.',
            ],
            blocos: [
              { t: 'h', txt: 'Agulha magnética' },
              { t: 'p', html: 'A agulha magnética tradicional é uma <b>rosa graduada</b> com ímãs presos por baixo, apoiada num estilete e flutuando num líquido dentro de uma <b>cuba</b>. A cuba fica em suspensão cardan, na <b>bitácula</b>, e traz gravada a <b>linha de fé</b>, alinhada com o eixo proa–popa: o rumo se lê onde a linha de fé cruza a rosa.' },
              { t: 'p', html: 'Em veleiros são comuns a <b>agulha esférica</b> (“de bolha”), de antepara ou de pedestal, muito estável com balanço; a <b>agulha de mão</b>, para marcações; e a <b>agulha de fluxo magnético</b> (<i>fluxgate</i>), eletrônica, precisa e que envia o rumo ao piloto automático e ao radar. A fluxgate se compensa sozinha: basta iniciar o modo de autocompensação e dar dois giros completos com o barco. O Manual descreve esse procedimento “de modo resumido”: siga também as instruções do fabricante do seu equipamento.' },
              { t: 'h', txt: 'Agulha giroscópica' },
              { t: 'p', html: 'A agulha giroscópica usa um rotor girando em alta velocidade. Pela inércia giroscópica e pela precessão, ele se estabiliza apontando o <b>Norte verdadeiro</b>, sem depender do magnetismo. O erro que sobra, o <b>desvio da giro</b> (Dgi), é <b>constante em todos os rumos</b>, ao contrário do desvio da agulha magnética, e se determina por alinhamento ou pelo azimute de um astro.' },
              { t: 'tabela', cab: ['', 'Agulha magnética', 'Agulha giroscópica'],
                linhas: [
                  ['Indica', 'Norte magnético', 'Norte verdadeiro'],
                  ['Energia', 'não precisa', 'precisa de energia constante'],
                  ['Erros', 'declinação e desvio, que varia com a proa', 'desvio da giro, constante em todos os rumos'],
                  ['Pontos fortes', 'simples, robusta, barata, quase sem manutenção', 'mais precisa, transmite o rumo a outros equipamentos'],
                  ['Pontos fracos', 'sofre com ferros e eletricidade; piora em latitudes altas', 'complexa; erros acima de 70° de latitude; alguns modelos levam horas para se orientar'],
                ], legenda: 'Comparação resumida (Miguens, vol. I, itens 3.2.2 e 3.3.4). Em veleiros de cruzeiro, a giroscópica é rara; a agulha magnética é a referência e o reserva de tudo.' },
              { t: 'callout', tipo: 'nota', titulo: 'E o celular?', html: 'Smartphones têm magnetômetro e aplicativos de bússola, mas o Manual da DHN registra que a Marinha do Brasil não reconhece esses aplicativos nem aceita que substituam a agulha magnética.' },
              { t: 'h', txt: 'Odômetros: velocidade e distância na água' },
              { t: 'lista', itens: [
                '<b>Odômetro de superfície</b>: um hélice rebocado por uma linha gira e aciona um registrador que conta a distância navegada na superfície. Simples e preciso, mas tem de ser recolhido ao dar atrás, enrosca em algas e não pode ser usado em portos movimentados.',
                '<b>Odômetro de fundo</b>: instalado no casco, abaixo da linha d’água. O de pressão usa um tubo de Pitot (precisão de cerca de meio nó); o eletromagnético mede a força eletromotriz induzida na água (cerca de 0,1 nó). <b>Apesar do nome, ambos medem a velocidade em relação à água.</b>',
                '<b>Odômetro Doppler</b>: mede o desvio de frequência de um sinal refletido pelo fundo. É o único odômetro que dá a velocidade em relação ao fundo.',
                '<b>Velocímetro de hélice</b> (a “rodinha” no casco): o mais comum em barcos de esporte e recreio. Deve ser conferido de tempos em tempos.',
              ] },
              { t: 'p', html: 'Para calibrar, faz-se a <b>corrida da milha</b>: o barco percorre uma distância conhecida entre alinhamentos de terra, cronometrando, e repete a corrida no <b>rumo oposto</b>. A média das duas anula o efeito da corrente. Faça com pouco vento e em profundidade de pelo menos cinco vezes o calado. No exemplo do Manual, as médias deram 9,91 nós no fundo e 10,30 nós no odômetro: erro de +3,8%, corrigido aplicando −3,8% às leituras.' },
              { t: 'h', txt: 'Prumo de mão' },
              { t: 'p', html: 'O prumo de mão é uma <b>chumbada</b> de 2,5 a 7 kg presa a uma linha de 25 a 45 m. A base da chumbada tem um cavado com sebo ou sabão, que traz uma amostra do fundo: você sabe a profundidade e a tença. O zero da linha é marcado a uma distância da chumbada igual à altura da mão do operador sobre a água, para ler a profundidade na própria mão.' },
              { t: 'figura', svg: FIG_PRUMO, legenda: 'Marcas da linha do prumo de mão. As dezenas seguintes repetem as marcas das unidades (16 m tem três nós; 23 m, uma tira de couro). Aos 20 m: duas pinhas e filele azul; aos 30 m: três pinhas e filele encarnado.' },
              { t: 'p', html: 'Para sondar, reduza a velocidade a no máximo 3 nós, lance a chumbada com força para vante e leia quando a linha estiver a pique e você sentir a chumbada tocar o fundo. Como a linha faz uma curva, a profundidade real costuma ser um pouco <b>menor</b> que a lida. Fundeado, o prumo também mostra se o ferro está garrando: deixe a chumbada no fundo com um pouco de seio e observe a inclinação da linha.' },
              { t: 'fato', ref: 'extra-mestre-1-03', html: 'A NORMAM-211 exige ecobatímetro nas embarcações de grande porte ou iates construídos após 11/02/2000 e recomenda o seu uso nas menores.' },
              { t: 'fato', ref: 'extra-mestre-1-02', html: 'Para embarcações de médio porte, a NORMAM-211 exige 1 aparelho GNSS na navegação costeira e 2 na oceânica, recomendando que ao menos um tenha fonte de energia independente.' },
              { t: 'callout', tipo: 'dica', titulo: 'Redundância', html: 'Ecobatímetro e GNSS são assuntos de outros módulos. Mas guarde a ideia: a agulha magnética, o prumo de mão e a estima com relógio e odômetro continuam funcionando quando a eletrônica falha.' },
              { t: 'check', questoes: [
                { id: 'msa1-l17-1', nivel: 'mestre', tema: 'Instrumentos náuticos', dificuldade: 2,
                  enunciado: 'O odômetro de fundo do tipo eletromagnético mede:',
                  alternativas: ['A velocidade do barco em relação à água.', 'A velocidade do barco em relação ao fundo do mar.', 'A profundidade sob a quilha.', 'A distância até o fundo, em milhas.'], correta: 0,
                  explicacao: 'O nome “de fundo” vem de ele ficar no fundo do casco; ele mede a velocidade em relação à massa d’água. Só o odômetro Doppler (e o GNSS) dão velocidade no fundo. Profundidade é com o ecobatímetro ou o prumo. Distância até o fundo não é medida por odômetro.',
                  referencia: 'Miguens, vol. I, itens 11.3.1 e 11.3.2', fonte_url: VOL1 },
                { id: 'msa1-l17-2', nivel: 'mestre', tema: 'Instrumentos náuticos', dificuldade: 2,
                  enunciado: 'Como se comporta o desvio de uma agulha giroscópica?',
                  alternativas: ['É constante em todos os rumos.', 'Varia com a proa, como o da agulha magnética.', 'É igual à declinação magnética do lugar.', 'É sempre zero, porque a giro aponta o Norte verdadeiro.'], correta: 0,
                  explicacao: 'O desvio da giro vem de pequenos erros do equipamento e é o mesmo em qualquer rumo. Quem varia com a proa é o desvio da agulha magnética. A giro não depende do magnetismo, então a declinação não se aplica. E ela pode ter desvio, que deve ser determinado com frequência.',
                  referencia: 'Miguens, vol. I, item 3.3.6 b', fonte_url: VOL1 },
                { id: 'msa1-l17-3', nivel: 'mestre', tema: 'Instrumentos náuticos', dificuldade: 1,
                  enunciado: 'Na linha do prumo de mão, como é marcada a profundidade de 20 m?',
                  alternativas: ['Duas pinhas e filele azul.', 'Uma pinha e filele branco.', 'Três pinhas e filele encarnado.', 'Dois nós de merlim.'], correta: 0,
                  explicacao: 'Aos 20 m vão duas pinhas e filele azul. Uma pinha com filele branco marca 10 m; três pinhas com filele encarnado, 30 m. Dois nós de merlim marcam 4 m (e 14, 24…).',
                  referencia: 'Miguens, vol. I, item 11.5.1', fonte_url: VOL1 },
                { id: 'msa1-l17-4', nivel: 'mestre', tema: 'Instrumentos náuticos', dificuldade: 2,
                  enunciado: 'Por que a corrida da milha é feita em dois rumos opostos?',
                  alternativas: ['Para que a média das duas corridas anule o efeito da corrente.', 'Para compensar o desvio da agulha.', 'Porque a milha medida só tem marcas de alinhamento numa direção.', 'Para medir a declinação magnética do local.'], correta: 0,
                  explicacao: 'A corrente ajuda numa corrida e atrapalha na outra; a média cancela o efeito e dá a velocidade real na água para comparar com o odômetro. A corrida da milha não é usada para compensar a agulha nem para medir a declinação. E as marcas servem para os dois sentidos.',
                  referencia: 'Miguens, vol. I, item 11.3.2 b', fonte_url: VOL1 },
              ] },
              { t: 'fontes', itens: [
                mig('cap. 3, itens 3.2.1, 3.2.2, 3.2.7, 3.2.8 e 3.3; cap. 11, itens 11.2, 11.3 e 11.5.1'),
                { txt: 'NORMAM-211/DPC, art. 4.19.3 b) (ecobatímetro)', url: NORMAM211, ref: 'extra-mestre-1-03' },
                { txt: 'NORMAM-211/DPC, art. 4.19.2 a) (GNSS em embarcações de médio porte)', url: NORMAM211, ref: 'extra-mestre-1-02' },
              ] },
            ],
          },
        ],
      },
    ],
  });
})();
