/* Aba "Sobre e contribuir".
   #/sobre           o que é o projeto, aviso legal e de segurança, para quem é, como foi feito,
                     privacidade e backup, como contribuir, créditos e licenças de terceiros
   #/sobre/fontes    todos os fatos de VL.data.fontes, por tópico, com busca e filtro "só a confirmar"
                     (?q=texto&topico=normas&aconfirmar=1&id=normas-01)
   #/sobre/licencas  MIT (código) e CC BY-SA 4.0 (conteúdo) em linguagem simples
   Seções da página principal podem ser abertas direto: #/sobre?secao=contribuir */
(function () {
  'use strict';
  var h = VL.h;
  var CSS = 'assets/css/tabs/sobre.css';

  var URL_MIT = 'https://opensource.org/license/mit';
  var URL_CC = 'https://creativecommons.org/licenses/by-sa/4.0/deed.pt-br';
  var URL_CC_LEGAL = 'https://creativecommons.org/licenses/by-sa/4.0/legalcode.pt';
  var URL_CC_COMPAT = 'https://creativecommons.org/compatiblelicenses';

  /* Tópicos dos fatos, na mesma ordem de tools/build_fontes.py.
     duas: true → fato regulatório brasileiro, checado por dois verificadores independentes (lentes fonte e atualidade);
     os demais passam por um verificador (lente fonte). Espelha LENTES em tools/build_fontes.py. */
  var TOPICOS = [
    { id: 'normas', titulo: 'Habilitação de amadores (NORMAM-211/DPC)', duas: true },
    { id: 'programa', titulo: 'Programa oficial das provas e provas antigas', duas: true },
    { id: 'taxas', titulo: 'Taxas, inscrição, agendamento e Capitanias', duas: true },
    { id: 'radio', titulo: 'Rádio, segurança e certificados complementares', duas: true },
    { id: 'internacional', titulo: 'Trilha internacional (RYA, ICC, ASA)' },
    { id: 'travessia', titulo: 'Travessia oceânica (OSR, rotas, meteorologia, busca e salvamento)' },
    { id: 'tecnico', titulo: 'Conteúdo técnico (RIPEAM, balizamento, publicações da DHN)' },
    { id: 'benchmark', titulo: 'Comparação com outros cursos' },
    { id: 'loc_ne', titulo: 'Pesquisa de locais: Nordeste' },
    { id: 'loc_se', titulo: 'Pesquisa de locais: Sudeste' },
    { id: 'loc_s', titulo: 'Pesquisa de locais: Sul' },
    { id: 'loc_nco', titulo: 'Pesquisa de locais: Norte, Centro-Oeste e águas interiores' },
    { id: 'loc_ext', titulo: 'Pesquisa de locais: exterior' },
    { id: 'loc_regatas', titulo: 'Pesquisa de regatas, rallies e tripulação' },
  ];
  /* Fatos registrados pelos autores das lições (research_extra_*.json → topico 'extra_<parte>') */
  var TOPICO_EXTRA = { id: 'extra', titulo: 'Fatos extras citados nas lições', duas: true };
  var VERIF_DUAS = 'Verificação: dois verificadores independentes (fonte e atualidade).';
  var VERIF_UMA = 'Verificação: um verificador independente reabre a fonte.';
  /* Quantos fatos cada tópico mostra antes do botão "Mostrar mais" */
  var POR_TOPICO = 6, POR_TOPICO_BUSCA = 20, PASSO = 25;

  /* Bibliotecas e dados de terceiros (espelha assets/vendor/LICENSES.md) */
  var TERCEIROS = [
    { nome: 'three.js', versao: '0.180.0', uso: 'Cenas 3D: veleiro, esfera celeste, sextante e globo.', licenca: 'MIT', site: 'https://threejs.org/', arquivo: 'assets/vendor/licenses/three-MIT.txt' },
    { nome: 'Leaflet', versao: '1.9.4', uso: 'Mapa da aba Onde estudar.', licenca: 'BSD-2-Clause', site: 'https://leafletjs.com/', arquivo: 'assets/vendor/licenses/leaflet-BSD-2.txt' },
    { nome: 'Chart.js', versao: '4.5.1', uso: 'Gráficos de progresso e de simulados.', licenca: 'MIT', site: 'https://www.chartjs.org/', arquivo: 'assets/vendor/licenses/chartjs-MIT.md' },
    { nome: 'D3', versao: '7.9.0', uso: 'Diagramas e visualizações interativas.', licenca: 'ISC', site: 'https://d3js.org/', arquivo: 'assets/vendor/licenses/d3-ISC.txt' },
    { nome: 'Atkinson Hyperlegible Next', versao: '5.3.0', uso: 'A fonte do app, criada pelo Braille Institute para leitura fácil (distribuída pelo Fontsource).', licenca: 'SIL Open Font License 1.1', site: 'https://www.brailleinstitute.org/freefont/', arquivo: 'assets/vendor/fonts/OFL-atkinson-hyperlegible-next.txt' },
  ];
  var DADOS_GEO = [
    { nome: 'Natural Earth', uso: 'Terra e países nos mapas (escalas 1:110m e 1:50m).', licenca: 'Domínio público', site: 'https://www.naturalearthdata.com/', licencaUrl: 'https://www.naturalearthdata.com/about/terms-of-use/' },
    { nome: 'IBGE, API de Malhas v3', uso: 'Contorno dos estados do Brasil.', licenca: 'Dados públicos do IBGE, com citação da fonte', site: 'https://servicodados.ibge.gov.br/api/docs/malhas?versao=3' },
    { nome: 'OpenStreetMap', uso: 'Mapa detalhado opcional, só quando há internet.', licenca: 'ODbL, © colaboradores do OpenStreetMap', site: 'https://www.openstreetmap.org/', licencaUrl: 'https://www.openstreetmap.org/copyright' },
  ];

  var MIT_TEXTO = [
    'MIT License',
    '',
    'Copyright (c) 2026 Contribuidores do projeto Veleiro',
    '',
    'Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:',
    '',
    'The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.',
    '',
    'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.',
  ].join('\n');

  var MODELOS = {
    erro: [
      'Onde está: (aba, curso, módulo e lição; ou o começo do enunciado da questão)',
      'O que está escrito hoje:',
      'O que deveria estar:',
      'Fonte que mostra isso: (link oficial e o trecho; de preferência da Marinha, da Anatel ou do órgão que emite o certificado)',
      'Data em que você consultou a fonte:',
      'Se for problema de funcionamento: navegador, aparelho e o que você fez antes do erro',
    ].join('\n'),
    local: [
      'Nome do local:',
      'Cidade e estado (ou país):',
      'Tipo: (escola de vela, clube ou iate clube, curso preparatório para a prova, regata, charter, rally, outro)',
      'O que oferece: (curso de vela, curso para a prova, saídas como tripulante, aluguel de barco...)',
      'Site oficial: (obrigatório: sem link conferido o local não entra)',
      'Contato público: (e-mail ou telefone que aparece no site oficial)',
      'Preço, se estiver publicado no site:',
      'Data em que você conferiu o site:',
    ].join('\n'),
    questao: [
      'Nível: (Arrais-Amador, Mestre-Amador ou Capitão-Amador)',
      'Tema: (por exemplo: RIPEAM, luzes de navegação)',
      'Enunciado:',
      'A)',
      'B)',
      'C)',
      'D)',
      'E) (só para Capitão-Amador)',
      'Alternativa certa:',
      'Explicação: (por que a certa está certa e por que cada uma das outras está errada)',
      'Referência: (por exemplo: RIPEAM, Regra 15; com link oficial se houver)',
      'Declaro que a questão é de minha autoria e pode ser publicada sob CC BY-SA 4.0.',
    ].join('\n'),
  };

  /* ---------- utilidades ---------- */
  function urlSegura(u) { return /^https?:\/\//i.test(String(u || '')) ? String(u) : null; }
  function repoUrl() { return urlSegura(VL.projeto && VL.projeto.repo); }
  function siteUrl() { return /^https?:$/.test(location.protocol) ? location.origin + location.pathname : ''; }
  function dataBR(iso) {
    if (!iso || !/^\d{4}-\d{2}-\d{2}/.test(iso)) return '';
    var d = new Date(String(iso).slice(0, 10) + 'T12:00');
    return isNaN(d.getTime()) ? '' : VL.fmt.data(d);
  }
  function plural(n, um, varios) { return VL.fmt.num(n, 0) + ' ' + (n === 1 ? um : varios); }
  function linkAba(id, rotulo) { return VL.tabs.get(id) ? h('a', { href: VL.link(id) }, rotulo) : h('span', null, rotulo); }
  function externo(url, rotulo) { return h('a', { href: url, target: '_blank', rel: 'noopener' }, rotulo); }
  function ajustarAltura(ta) {
    if (!ta || !ta.offsetParent) return;
    ta.style.height = '0px';
    ta.style.height = (ta.scrollHeight + 2) + 'px';
  }
  function autoAltura(raiz) {
    var todos = function () { VL.$$('textarea.sobre-modelo-txt', raiz).forEach(ajustarAltura); };
    VL.$$('details', raiz).forEach(function (d) { d.addEventListener('toggle', function () { if (d.open) VL.$$('textarea.sobre-modelo-txt', d).forEach(ajustarAltura); }); });
    var t = null;
    var aoRedim = function () { clearTimeout(t); t = setTimeout(todos, 120); };
    window.addEventListener('resize', aoRedim);
    VL.aoSair(function () { window.removeEventListener('resize', aoRedim); clearTimeout(t); });
    requestAnimationFrame(todos);
  }
  function reduzMovimento() { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }

  function copiar(texto, msgOk, botao) {
    function fallback() {
      var ta = h('textarea', { readonly: true, 'aria-hidden': 'true', style: { position: 'fixed', top: '-1000px', left: '0', opacity: '0' } });
      ta.value = texto;
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      ta.remove();
      if (botao) botao.focus();
      VL.ui.toast(ok ? msgOk : 'Não foi possível copiar. Selecione o texto e copie manualmente.');
    }
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(texto).then(function () { VL.ui.toast(msgOk); }, fallback);
        return;
      }
    } catch (e) { /* segue para o plano B */ }
    fallback();
  }

  function fatosLista() {
    var f = (VL.data.fontes && VL.data.fontes.fatos) || {};
    if (Array.isArray(f)) return f.filter(function (x) { return x && x.id; });
    return Object.keys(f).map(function (id) { return Object.assign({}, f[id], { id: id }); });
  }
  function confirmado(f) { return f.status === 'confirmado'; }
  function resumoFatos() {
    var l = fatosLista();
    var ok = l.filter(confirmado).length;
    return { lista: l, total: l.length, ok: ok, q: l.length - ok, gerado: VL.data.fontes && VL.data.fontes.gerado };
  }

  /* ---------- moldura comum ---------- */
  function subnav(atual) {
    var itens = [['', 'Sobre o projeto'], ['fontes', 'Fatos verificados'], ['licencas', 'Licenças']];
    var nav = h('nav', { class: 'sobre-subnav', 'aria-label': 'Páginas de Sobre e contribuir' });
    itens.forEach(function (it) {
      nav.appendChild(h('a', { href: VL.link('sobre' + (it[0] ? '/' + it[0] : '')), 'aria-current': it[0] === atual ? 'page' : null }, it[1]));
    });
    return nav;
  }
  function secao(id, titulo, filhos) {
    return h('section', { class: 'sobre-secao', id: 'sobre-' + id, 'aria-labelledby': 'sobre-' + id + '-t' },
      h('h2', { id: 'sobre-' + id + '-t', tabindex: '-1' }, titulo), filhos);
  }
  function irPara(alvo, focar) {
    if (!alvo) return;
    alvo.scrollIntoView({ behavior: reduzMovimento() ? 'auto' : 'smooth', block: 'start' });
    if (focar) { try { focar.focus({ preventScroll: true }); } catch (e) { focar.focus(); } }
  }

  /* =====================================================================
     #/sobre
     ===================================================================== */
  var SECOES = [
    ['aviso', 'Aviso legal e de segurança'],
    ['projeto', 'O que é o projeto'],
    ['publico', 'Para quem é'],
    ['metodo', 'Como foi feito'],
    ['privacidade', 'Privacidade e backup'],
    ['contribuir', 'Como contribuir'],
    ['creditos', 'Créditos e licenças'],
  ];

  function blocoAviso() {
    var itens = [
      ['Não substitui a prática.', 'Vela se aprende no barco. Faça aulas práticas com instrutor habilitado e ganhe experiência aos poucos, com gente experiente a bordo.'],
      ['Não substitui a habilitação oficial.', 'Só a Marinha do Brasil emite a habilitação de Arrais-Amador, Mestre-Amador e Capitão-Amador. Este app ajuda você a estudar para ela.'],
      ['Confirme antes da prova.', 'Regras, taxas, documentos e datas mudam. Antes de agendar, confirme tudo na Capitania, Delegacia ou Agência onde vai fazer a prova.'],
      ['Não use para navegar.', 'As cartas, tábuas, simuladores e dados do app são de treinamento. Para navegar, use cartas náuticas oficiais e atualizadas e as publicações oficiais.'],
      ['Não é um site oficial.', 'Este é um projeto comunitário, sem vínculo com a Marinha do Brasil nem com outro órgão público.'],
    ];
    var lista = h('ul', { class: 'sobre-aviso-lista' });
    itens.forEach(function (it) { lista.appendChild(h('li', null, h('strong', null, it[0]), ' ', it[1])); });
    return h('section', { class: 'callout callout-seguranca sobre-aviso', id: 'sobre-aviso', 'aria-labelledby': 'sobre-aviso-t' },
      h('h2', { id: 'sobre-aviso-t', tabindex: '-1' }, VL.icon('alerta', 22), h('span', null, 'Aviso legal e de segurança')),
      h('p', null, 'O Veleiro é material de estudo, aberto e gratuito. Leia com atenção:'),
      lista,
      h('p', { class: 'mb-0' }, 'No mar, quem responde pelo barco e pelas pessoas a bordo é quem comanda. Use o bom senso e não saia além do que a sua experiência permite.'));
  }

  function cartucho(r) {
    var dado = function (rotulo, valor) { return h('div', null, h('dt', null, rotulo), h('dd', null, valor)); };
    var fatosTxt = r.total ? plural(r.total, 'fato', 'fatos') + ', ' + VL.fmt.num(r.ok, 0) + ' confirmados' : 'lista em montagem';
    return h('figure', { class: 'sobre-cartucho', 'aria-labelledby': 'sobre-cartucho-t' },
      h('p', { class: 'cartucho-titulo', id: 'sobre-cartucho-t' }, 'Veleiro'),
      h('p', { class: 'cartucho-sub' }, 'de leigo a transatlântico'),
      h('p', { class: 'cartucho-sup' }, 'projeto comunitário de código aberto'),
      h('div', { class: 'cartucho-escala', 'aria-hidden': 'true' }),
      h('dl', { class: 'cartucho-dados' },
        dado('Edição', 'versão ' + VL.versao),
        dado('Idioma', 'português do Brasil'),
        dado('Fatos verificados', fatosTxt),
        dado('Licenças', ['código MIT, conteúdo ', h('span', { class: 'sobre-nobr' }, 'CC BY-SA 4.0')])),
      h('p', { class: 'cartucho-aviso' }, 'Material de estudo. Não use para navegação.'));
  }

  function blocoProjeto(r) {
    var oQue = h('ul', { class: 'sobre-lista' },
      h('li', null, linkAba('roteiro', 'Roteiro'), ': as etapas da habilitação e da experiência no mar, no seu ritmo.'),
      h('li', null, 'Cursos de ', linkAba('arrais', 'Arrais-Amador'), ', ', linkAba('mestre', 'Mestre-Amador'), ' e ', linkAba('capitao', 'Capitão-Amador'), ', em lições curtas com checagem de compreensão.'),
      h('li', null, linkAba('vela', 'Vela prática'), ', ', linkAba('travessia', 'Travessia oceânica'), ' e ', linkAba('radio', 'Rádio e segurança'), ', com simuladores e cenas em 3D.'),
      h('li', null, linkAba('simulados', 'Simulados'), ' no formato da prova, com correção comentada, e flashcards com repetição espaçada.'),
      h('li', null, linkAba('locais', 'Onde estudar'), ': mapa de escolas, clubes e lugares para ganhar experiência, no Brasil e no exterior.'),
      h('li', null, linkAba('glossario', 'Glossário'), ' com os termos náuticos e links para as fontes oficiais.'));
    return secao('projeto', 'O que é o projeto', [
      h('div', { class: 'sobre-projeto' },
        h('div', { class: 'sobre-projeto-txt' },
          h('p', null, 'O Veleiro é um curso aberto e gratuito, em português do Brasil, feito em comunidade. Ele junta num só lugar o caminho de quem nunca pisou num veleiro até comandar um veleiro de cruzeiro, do tamanho que for, numa travessia oceânica.'),
          h('p', null, 'O caminho passa pela habilitação de amador da Marinha do Brasil (Arrais-Amador, Mestre-Amador e Capitão-Amador) e vai além da prova: vela prática, rádio, segurança, meteorologia e planejamento de uma travessia.'),
          h('p', null, 'Ninguém é dono do conteúdo: qualquer pessoa pode ler, corrigir, adaptar e ensinar com ele.')),
        cartucho(r)),
      h('h3', null, 'O que você encontra aqui'),
      oQue,
      h('p', { class: 'muted' }, 'Funciona no celular e nos temas claro e escuro. Se você baixar o projeto e abrir o arquivo ', h('code', null, 'app/index.html'), ', funciona também sem internet. Não tem cadastro nem anúncios.'),
    ]);
  }

  function blocoPublico() {
    return secao('publico', 'Para quem é', [
      h('ul', { class: 'sobre-lista sobre-lista-marcada' },
        h('li', null, 'Quem nunca velejou e quer começar do jeito certo, sem pular etapas.'),
        h('li', null, 'Quem vai fazer a prova de Arrais-Amador, Mestre-Amador ou Capitão-Amador e quer estudar pelo programa oficial.'),
        h('li', null, 'Quem já veleja e quer revisar, subir de categoria ou planejar a primeira travessia.'),
        h('li', null, 'Escolas, clubes e instrutores que queiram usar ou adaptar o material nas aulas. A licença permite, até em curso pago.')),
      h('p', { class: 'muted' }, 'Não é atalho. Nenhum app substitui a prova oficial nem as horas de mar ao lado de quem sabe.'),
    ]);
  }

  function blocoMetodo(r) {
    var passos = [
      ['Pesquisa na fonte oficial', 'Lemos a norma ou a página oficial (Marinha do Brasil, Anatel, World Sailing, RYA e outras) e anotamos o link, o ponto exato do documento, o trecho que comprova e a data da consulta.'],
      ['Conferência automática do trecho', 'Um programa procura o trecho citado, palavra por palavra, no texto da fonte. Trecho que não aparece na fonte acende um alerta para os verificadores.'],
      ['Dois verificadores independentes', 'Cada fato regulatório (habilitação, provas, taxas e rádio) passa por duas checagens separadas. Uma reabre a fonte e confere se o trecho diz mesmo aquilo. A outra procura confirmação ou contradição em fontes oficiais mais atuais, como uma norma mais nova. Conteúdo técnico, trilha internacional, travessia e locais passam pela checagem da fonte.'],
      ['Confirmado ou a confirmar', 'Só fica "confirmado" o fato aprovado em todas as checagens. Se as fontes divergem, se não há fonte oficial ou se a checagem ainda não terminou, o fato ganha o selo amarelo e aparece assim no app inteiro.'],
      ['Aberto para conferência', 'A lista completa fica pública, com fonte, trecho, data e a nota de quem verificou. Achou algo desatualizado? Avise e a gente corrige.'],
    ];
    var derrota = h('ol', { class: 'sobre-derrota' });
    passos.forEach(function (p) { derrota.appendChild(h('li', null, h('h3', null, p[0]), h('p', null, p[1]))); });

    var selo = h('aside', { class: 'callout callout-aconfirmar sobre-selo-demo', 'aria-label': 'O selo a confirmar' },
      h('p', { class: 'sobre-selo-amostra' }, 'Exemplo de selo: ', VL.ui.seloQ()),
      h('p', null, 'O amarelo é o da bandeira Q do Código Internacional de Sinais. O selo quer dizer: as fontes divergem, ou não encontramos fonte oficial, ou a verificação daquele fato ainda não terminou. Antes de se basear nesse dado, confirme na Capitania, Delegacia ou Agência, ou no órgão que emite o certificado.'),
      h('p', { class: 'mb-0' }, 'Na lista de fatos verificados, cada selo vem com a nota do verificador explicando o motivo.'));

    var exemplos = null;
    var exOk = r.lista.filter(confirmado)[0], exQ = r.lista.filter(function (f) { return !confirmado(f); })[0];
    if (exOk || exQ) {
      exemplos = h('div', { class: 'sobre-exemplos' }, h('p', { class: 'sobre-exemplos-t' }, 'Exemplos reais da lista'));
      [exOk, exQ].forEach(function (f) {
        if (!f) return;
        var txt = String(f.claim || '');
        if (txt.length > 220) txt = txt.slice(0, 217).replace(/\s+\S*$/, '') + '…';
        exemplos.appendChild(h('p', { class: 'sobre-exemplo' }, txt, VL.ui.fonte(f.id), ' ',
          confirmado(f) ? h('span', { class: 'selo-ok' }, VL.icon('check', 15), 'confirmado') : null, confirmado(f) ? ' ' : null,
          h('a', { class: 'sobre-exemplo-id', href: VL.link('sobre/fontes?id=' + encodeURIComponent(f.id)) }, 'ver detalhes')));
      });
    }

    var contagem = r.total
      ? h('p', null, 'Hoje a lista tem ', h('strong', null, plural(r.total, 'fato', 'fatos')), ': ', VL.fmt.num(r.ok, 0), ' confirmados e ', VL.fmt.num(r.q, 0), ' a confirmar. ', h('a', { href: VL.link('sobre/fontes') }, 'Ver todos os fatos verificados'), '.')
      : h('p', null, 'A lista de fatos verificados ainda está sendo montada a partir da pesquisa. ', h('a', { href: VL.link('sobre/fontes') }, 'Ver como ela vai funcionar'), '.');

    return secao('metodo', 'Como foi feito', [
      h('p', null, 'Toda informação sobre normas, provas, taxas e certificados segue o mesmo caminho:'),
      derrota,
      selo,
      exemplos,
      contagem,
      h('p', null, 'O conteúdo técnico, como as regras do RIPEAM e o balizamento, cita a regra ou a publicação oficial de onde veio (por exemplo, "RIPEAM, Regra 15").'),
      h('p', { class: 'muted' }, 'Parte da pesquisa, da verificação e da redação foi feita com ajuda de ferramentas de inteligência artificial, sempre presas à fonte citada. Por isso tudo traz link e trecho: você não precisa confiar na gente, pode conferir.'),
    ]);
  }

  function blocoPrivacidade() {
    var item = function (icone, titulo, texto) {
      return h('li', { class: 'sobre-priv-item' }, VL.icon(icone, 22), h('div', null, h('p', { class: 'sobre-priv-t' }, titulo), h('p', { class: 'sobre-priv-d' }, texto)));
    };
    function textoSalvo() {
      var lic = VL.store.get('licoes', {}) || {};
      var nLic = Object.keys(lic).length, nSim = VL.progress.tentativas().length, nDias = VL.progress.dias().length;
      return (nLic || nSim || nDias)
        ? 'Neste navegador estão salvos: ' + plural(nLic, 'lição concluída', 'lições concluídas') + ', ' + plural(nSim, 'simulado feito', 'simulados feitos') + ' e ' + plural(nDias, 'dia de estudo', 'dias de estudo') + '.'
        : 'Ainda não há progresso salvo neste navegador.';
    }
    var estadoBackup = h('p', { class: 'sobre-backup-estado', role: 'status' }, textoSalvo());
    /* o progresso pode mudar em outra parte do app (ou no diálogo de configurações) enquanto esta página está aberta */
    var desinscrever = VL.on('progresso', function () { estadoBackup.textContent = textoSalvo(); });
    VL.aoSair(desinscrever);

    var arquivo = h('input', { type: 'file', accept: 'application/json,.json', hidden: true, 'aria-hidden': 'true', tabindex: '-1', onchange: function () {
      var f = arquivo.files && arquivo.files[0];
      if (!f) return;
      VL.progress.importarArquivo(f).then(function () {
        /* sem VL.render(): a página não volta ao topo; a linha de estado se atualiza pelo evento 'progresso' */
        estadoBackup.textContent = textoSalvo();
        arquivo.value = '';
        VL.ui.toast('Progresso importado.');
      }, function (e) {
        VL.ui.toast((e && e.message && /backup do Veleiro/.test(e.message)) ? e.message : 'Não foi possível ler este arquivo. Escolha um backup do Veleiro (.json).');
        arquivo.value = '';
      });
    } });

    return secao('privacidade', 'Privacidade e backup', [
      h('ul', { class: 'sobre-priv' },
        item('local', 'Tudo fica no seu navegador.', 'Progresso, respostas, flashcards e configurações ficam salvos só neste aparelho, no armazenamento do navegador. O projeto não tem servidor recebendo seus dados.'),
        item('seguranca', 'Sem cadastro, sem rastreadores, sem anúncios.', 'O app não pede nome nem e-mail e não usa cookies de rastreamento nem ferramentas de análise de acesso.'),
        item('alvo', 'Localização só se você pedir.', 'Ela serve apenas para mostrar primeiro os locais mais perto de você ("perto de mim"). O navegador só pede permissão quando você toca num botão de localização, como "Usar minha localização" nas Configurações. O app não envia a sua localização a ninguém. Nas Configurações ela fica guardada arredondada, a cerca de 100 metros, e você pode apagá-la quando quiser.'),
        item('globo', 'O que usa a internet.', 'Links para sites oficiais abrem o site de fora, com as regras de privacidade dele. Quando há internet, o mapa pode mostrar imagens do OpenStreetMap: elas vêm direto dos servidores do OpenStreetMap, que recebem o pedido da área que aparece na tela, como em qualquer mapa online. Quem hospeda este site pode registrar acessos, como acontece com qualquer site.')),
      h('div', { class: 'panel sobre-backup' },
        h('h3', null, 'Faça backup do seu progresso'),
        h('p', null, 'Limpar os dados do navegador apaga o progresso. Baixe um arquivo de backup para guardar uma cópia ou levar o progresso para outro aparelho. Importar um backup substitui o progresso salvo aqui pelo do arquivo.'),
        estadoBackup,
        h('div', { class: 'btn-row' },
          h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { VL.progress.exportarArquivo(); VL.ui.toast('Backup baixado.'); } }, VL.icon('download', 18), 'Baixar backup'),
          h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { arquivo.click(); } }, VL.icon('upload', 18), 'Importar backup'),
          arquivo,
          h('button', { type: 'button', class: 'btn btn-quiet', onclick: function () { if (VL.config && VL.config.abrir) VL.config.abrir(); } }, VL.icon('config', 18), 'Abrir configurações'))),
    ]);
  }

  function modelo(id, titulo, resumo, incluir, texto) {
    var idTa = 'sobre-modelo-' + id;
    var ta = h('textarea', { id: idTa, class: 'sobre-modelo-txt', readonly: true, rows: String(texto.split('\n').length + 1), spellcheck: 'false' });
    ta.value = texto;
    var btn = h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: function () { copiar(texto, 'Modelo copiado. Cole no seu relato.', btn); } }, 'Copiar modelo');
    var lista = h('ul', { class: 'sobre-lista' });
    incluir.forEach(function (x) { lista.appendChild(h('li', { html: x })); });
    return h('details', { class: 'sobre-modelo' },
      h('summary', null, h('span', { class: 'sobre-modelo-t' }, titulo), h('span', { class: 'sobre-modelo-r' }, resumo), VL.icon('baixo', 20)),
      h('div', { class: 'sobre-modelo-corpo' },
        lista,
        h('div', { class: 'spread' }, h('label', { for: idTa, class: 'field-label' }, 'Modelo para copiar'), btn),
        ta));
  }

  function blocoContribuir() {
    var repo = repoUrl();
    var onde = repo
      ? h('p', null, 'Os relatos vão para o repositório do projeto. ', externo(repo.replace(/\/$/, '') + '/issues/new', 'Abrir um relato (issue)'), ' ou ', externo(repo, 'ver o repositório'), '.')
      : h('p', null, 'Os relatos vão para o repositório do projeto, onde ficam o código e o conteúdo: abra uma ', h('em', null, 'issue'), ' (um relato) com um dos modelos abaixo. Quem sabe programar pode mandar a correção direto, num ', h('em', null, 'pull request'), ' (uma proposta de mudança).');

    var regras = h('ol', { class: 'sobre-regras' },
      h('li', null, h('strong', null, 'Fato regulatório só com fonte oficial.'), ' Norma, prova, taxa, requisito ou certificado entra com link oficial, o trecho que comprova e a data da consulta.'),
      h('li', null, h('strong', null, 'Nada inventado.'), ' Se não achou fonte oficial, diga isso: o fato entra com o selo "a confirmar" e o motivo, ou não entra.'),
      h('li', null, h('strong', null, 'Escreva para leigos.'), ' Português do Brasil, frases curtas, voz ativa e cada termo técnico explicado na primeira vez.'),
      h('li', null, h('strong', null, 'Só conteúdo seu ou de fonte pública.'), ' Não copie questões, textos ou figuras de livros, apostilas ou cursos.'),
      h('li', null, h('strong', null, 'Sem dados pessoais.'), ' Locais entram só com o contato público que aparece no site oficial.'),
      h('li', null, h('strong', null, 'Mesmas licenças.'), ' Ao contribuir, você concorda em publicar o código sob MIT e o conteúdo sob CC BY-SA 4.0.'));

    var pasta = function (nome, desc) { return h('li', null, h('code', { class: 'sobre-pasta' }, nome), h('span', null, desc)); };
    var arvore = h('ul', { class: 'sobre-arvore', 'aria-label': 'Pastas e arquivos do repositório' },
      pasta('app/', 'O site em si: index.html, core/ (o núcleo), tabs/ (uma aba por arquivo), widgets/ (simuladores), data/ (cursos, questões, flashcards, locais e fatos) e assets/ (CSS, fonte e bibliotecas).'),
      pasta('research/', 'A pesquisa com fontes: normas, programa das provas, locais e a lista de fatos verificados.'),
      pasta('docs/', 'Arquitetura (as regras para escrever código), design system, registro de decisões e status.'),
      pasta('tools/', 'Validação dos dados, geração dos fatos e dos locais e captura de telas para teste.'),
      pasta('LICENSE', 'Licença MIT do código.'),
      pasta('LICENSE-CONTEUDO.txt', 'Licença CC BY-SA 4.0 do conteúdo.'));

    var cmd = function (linha, desc) { return h('div', { class: 'sobre-cmd-linha' }, h('code', null, linha), h('span', null, desc)); };

    return secao('contribuir', 'Como contribuir', [
      h('p', { class: 'sobre-destaque' }, 'O Veleiro melhora com quem usa. Você não precisa programar para ajudar.'),
      onde,
      h('div', { class: 'sobre-modelos' },
        modelo('erro', 'Relatar um erro', 'Texto errado, informação desatualizada ou algo que não funciona.', [
          'Onde está: aba, curso, módulo e lição, ou o começo do enunciado da questão.',
          'O que está escrito hoje e o que deveria estar.',
          'A fonte que mostra isso, de preferência oficial, com link e a data em que você consultou.',
          'Se for problema de funcionamento: navegador, aparelho e o que você fez antes. Uma captura de tela ajuda muito.',
        ], MODELOS.erro),
        modelo('local', 'Sugerir um local de prática', 'Escola de vela, clube, regata, charter ou rally onde dá para ganhar experiência.', [
          'Nome, cidade e estado (ou país) e o tipo de local.',
          'O que ele oferece: cursos, saídas como tripulante, aluguel de barco.',
          '<strong>Site oficial com link.</strong> Sem site conferido, o local não entra no mapa.',
          'Só contato público, que aparece no próprio site. Preço apenas se estiver publicado.',
        ], MODELOS.local),
        modelo('questao', 'Propor uma questão', 'Uma questão nova para os simulados, com explicação e referência.', [
          'Nível e tema da questão.',
          'Enunciado claro e uma só alternativa certa. Nos simulados do app, Arrais e Mestre usam 4 alternativas e Capitão usa 5.',
          'Distratores plausíveis, sem "todas as anteriores" ou "nenhuma das anteriores".',
          'Explicação de por que a certa está certa e de por que cada outra está errada.',
          'Referência normativa (por exemplo, "RIPEAM, Regra 15") e, se houver, o link oficial.',
        ], MODELOS.questao)),
      h('h3', null, 'Regras de ouro'),
      regras,
      h('h3', null, 'Para quem programa'),
      h('p', null, 'O site é estático: não tem build nem servidor. Leia ', h('code', null, 'docs/arquitetura.md'), ' antes de escrever código. Em resumo: scripts clássicos (sem ', h('code', null, 'import'), ' nem ', h('code', null, 'export'), '), nada de ', h('code', null, 'fetch'), ' de arquivos locais, só os tokens de cor do design system e tudo testado no celular.'),
      arvore,
      h('p', null, 'Antes de enviar, rode na pasta do projeto:'),
      h('div', { class: 'sobre-cmd', role: 'group', 'aria-label': 'Comandos de teste' },
        cmd('./run.sh', 'abre o app num servidor local, no navegador'),
        cmd('node tools/validate.mjs', 'confere contagens e formatos dos dados (precisa do Node.js)'),
        cmd('python3 tools/qa_shot.py --out /tmp/telas --mobile --dark sobre', 'abre a aba no Chrome sem janela, salva a tela e lista erros de console, exceções e acessos externos (precisa de Python, Playwright e Google Chrome)')),
      h('p', null, 'Toda aba deve sair sem erros, sem acessos externos no modo ', h('code', null, '--offline'), ' e sem rolagem horizontal no celular. Fatos novos entram por ', h('code', null, 'research/'), ' e ', h('code', null, 'tools/build_fontes.py'), ', que gera ', h('code', null, 'app/data/fontes.js'), ': não edite esse arquivo à mão.'),
      h('h3', null, 'O que as licenças permitem'),
      h('div', { class: 'grid-2 sobre-lic-resumo' },
        h('div', { class: 'panel-quiet' },
          h('p', { class: 'sobre-lic-nome' }, 'Código: MIT'),
          h('p', { class: 'mb-0' }, 'Você pode usar, copiar, mudar, juntar com outro programa e até vender. Só precisa manter o aviso de direitos autorais e o texto da licença. Vem sem garantia.')),
        h('div', { class: 'panel-quiet' },
          h('p', { class: 'sobre-lic-nome' }, 'Conteúdo: ', h('span', { class: 'sobre-nobr' }, 'CC BY-SA 4.0')),
          h('p', { class: 'mb-0' }, 'Você pode copiar, adaptar e usar para qualquer fim, até num curso pago. Precisa dar crédito ao projeto e, se adaptar, publicar a sua versão com a mesma licença.'))),
      h('p', null, h('a', { href: VL.link('sobre/licencas') }, 'Entenda as licenças em detalhe'), '.'),
    ]);
  }

  function listaCreditos(itens, comVersao) {
    var ul = h('ul', { class: 'sobre-creditos' });
    itens.forEach(function (c) {
      ul.appendChild(h('li', null,
        h('p', { class: 'cred-nome' }, externo(c.site, c.nome), comVersao && c.versao ? h('span', { class: 'cred-versao' }, ' ' + c.versao) : null),
        h('p', { class: 'cred-uso' }, c.uso),
        h('p', { class: 'cred-lic' }, h('span', { class: 'cred-rot' }, 'Licença: '), c.arquivo ? h('a', { href: c.arquivo, target: '_blank', rel: 'noopener' }, c.licenca) : (c.licencaUrl ? externo(c.licencaUrl, c.licenca) : c.licenca))));
    });
    return ul;
  }

  function blocoCreditos() {
    return secao('creditos', 'Créditos e licenças de terceiros', [
      h('p', null, 'O Veleiro é feito pelos contribuidores do projeto e se apoia no trabalho aberto de outras pessoas. Cada componente mantém a própria licença; os textos ficam junto do app, em ', h('a', { href: 'assets/vendor/LICENSES.md', target: '_blank', rel: 'noopener' }, h('code', null, 'assets/vendor/')), '.'),
      h('h3', null, 'Bibliotecas e fonte'),
      listaCreditos(TERCEIROS, true),
      h('h3', null, 'Dados geográficos'),
      listaCreditos(DADOS_GEO, false),
      h('h3', null, 'Normas e publicações oficiais'),
      h('p', null, 'A NORMAM-211/DPC e as demais normas citadas são documentos públicos da Marinha do Brasil. Citamos trechos para estudo, sempre com link para a fonte oficial. Esses documentos não estão sob as licenças do projeto, e o projeto não tem vínculo com a Marinha.'),
      h('p', { class: 'sobre-versao' }, 'Você está usando a versão ', h('strong', null, VL.versao), ' do app.'),
    ]);
  }

  function indice() {
    var ol = h('ol');
    SECOES.forEach(function (s) {
      ol.appendChild(h('li', null, h('a', { href: VL.link('sobre?secao=' + s[0]), 'data-secao': s[0] }, s[1])));
    });
    return h('nav', { class: 'sobre-indice', 'aria-labelledby': 'sobre-indice-t' }, h('p', { class: 'sobre-indice-t', id: 'sobre-indice-t' }, 'Nesta página'), ol);
  }

  function paginaSobre(raiz, rota) {
    var r = resumoFatos();
    var nav = indice();
    var corpo = h('div', { class: 'sobre-corpo' },
      blocoAviso(), blocoProjeto(r), blocoPublico(), blocoMetodo(r), blocoPrivacidade(), blocoContribuir(), blocoCreditos());
    raiz.appendChild(h('div', { class: 'sobre-layout' }, nav, corpo));

    /* índice: rolagem suave sem quebrar o roteador por hash */
    VL.$$('a[data-secao]', nav).forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        var id = a.getAttribute('data-secao');
        irPara(VL.$('#sobre-' + id), VL.$('#sobre-' + id + '-t'));
        try { history.replaceState(null, '', VL.link('sobre?secao=' + id)); } catch (err) { /* sem history */ }
      });
    });

    /* destaca no índice a seção que está na tela */
    var io = null;
    if ('IntersectionObserver' in window) {
      var links = {};
      VL.$$('a[data-secao]', nav).forEach(function (a) { links[a.getAttribute('data-secao')] = a; });
      var marcar = function (id) {
        Object.keys(links).forEach(function (k) { if (k === id) links[k].setAttribute('aria-current', 'location'); else links[k].removeAttribute('aria-current'); });
      };
      io = new IntersectionObserver(function (ents) {
        var vis = ents.filter(function (x) { return x.isIntersecting; }).sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
        if (vis.length) marcar(vis[0].target.id.replace(/^sobre-/, ''));
      }, { rootMargin: '-15% 0px -70% 0px' });
      SECOES.forEach(function (s) { var el = VL.$('#sobre-' + s[0]); if (el) io.observe(el); });
      VL.aoSair(function () { io.disconnect(); });
    }

    var alvo = rota.query.secao;
    if (alvo && VL.$('#sobre-' + alvo)) {
      requestAnimationFrame(function () {
        var sec = VL.$('#sobre-' + alvo), tit = VL.$('#sobre-' + alvo + '-t');
        if (sec) sec.scrollIntoView({ block: 'start' });
        if (tit) { try { tit.focus({ preventScroll: true }); } catch (e) { tit.focus(); } }
      });
    }
  }

  /* =====================================================================
     #/sobre/fontes — fatos verificados
     ===================================================================== */
  function normCaracteres(s) {
    var out = '';
    for (var i = 0; i < s.length; i++) { var c = VL.semAcento(s[i]); out += c.length ? c[0] : ' '; }
    return out;
  }
  /** Texto com os termos da busca marcados (sem acento e sem diferença de maiúsculas). */
  function marcarTermos(texto, termos) {
    texto = String(texto == null ? '' : texto);
    if (!termos.length) return document.createTextNode(texto);
    var n = normCaracteres(texto), faixas = [];
    termos.forEach(function (t) {
      var i = n.indexOf(t);
      while (t && i !== -1) { faixas.push([i, i + t.length]); i = n.indexOf(t, i + t.length); }
    });
    if (!faixas.length) return document.createTextNode(texto);
    faixas.sort(function (a, b) { return a[0] - b[0]; });
    var junt = [faixas[0]];
    faixas.slice(1).forEach(function (f) { var u = junt[junt.length - 1]; if (f[0] <= u[1]) u[1] = Math.max(u[1], f[1]); else junt.push(f); });
    var frag = document.createDocumentFragment(), pos = 0;
    junt.forEach(function (f) {
      if (f[0] > pos) frag.appendChild(document.createTextNode(texto.slice(pos, f[0])));
      frag.appendChild(h('mark', null, texto.slice(f[0], f[1])));
      pos = f[1];
    });
    if (pos < texto.length) frag.appendChild(document.createTextNode(texto.slice(pos)));
    return frag;
  }
  function rotuloFonte(f) {
    var base = String(f.txt || '').split(', ')[0];
    if (!base && f.url) { try { base = new URL(f.url).hostname.replace(/^www\./, ''); } catch (e) { base = ''; } }
    return base || 'fonte';
  }
  var NOME_LENTE = { fonte: 'Checagem da fonte', atual: 'Checagem de atualidade' };
  /** Lentes de verificação do tópico do fato (espelha LENTES em tools/build_fontes.py); null se desconhecido. */
  function lentesDe(f) {
    var t = String(f.topico || '');
    for (var i = 0; i < TOPICOS.length; i++) if (TOPICOS[i].id === t) return TOPICOS[i].duas ? ['fonte', 'atual'] : ['fonte'];
    return /^extra_/.test(t) ? ['fonte', 'atual'] : null;
  }
  /**
   * A nota gerada lista só as checagens que NÃO confirmaram: "[fonte] divergente: …; [atual] sem veredito".
   * Quando ela está nesse formato, completamos com as checagens que confirmaram, para mostrar o quadro inteiro.
   */
  function partesNota(nota, lentes) {
    var partes = String(nota || '').split(/;\s*(?=\[)/).map(function (p) {
      var m = p.match(/^\[(fonte|atual)\]\s*(.*)$/);
      if (!m) return { lente: null, quem: null, txt: p.trim() };
      var t = m[2].trim();
      if (t === 'sem veredito') t = 'ainda não deu parecer.';
      return { lente: m[1], quem: NOME_LENTE[m[1]], txt: t };
    }).filter(function (x) { return x.txt; });
    var formatoGerado = partes.length && partes.every(function (p) { return p.lente; });
    if (!formatoGerado || !lentes) return partes;
    return lentes.map(function (l) {
      for (var i = 0; i < partes.length; i++) if (partes[i].lente === l) return partes[i];
      return { lente: l, quem: NOME_LENTE[l], txt: 'confirmou.', ok: true };
    });
  }

  function itemFato(f, termos, alvo) {
    var ok = confirmado(f);
    var li = h('li', { class: 'fato', id: 'fato-' + VL.slug(f.id), 'data-status': ok ? 'ok' : 'q', 'data-alvo': alvo ? '1' : null, tabindex: alvo ? '-1' : null });
    li.appendChild(h('p', { class: 'fato-claim' }, marcarTermos(f.claim || 'Fato sem texto.', termos)));
    var url = urlSegura(f.url);
    var fonte = h('p', { class: 'fato-fonte' }, h('span', { class: 'fato-rot' }, 'Fonte: '),
      url ? h('a', { href: url, target: '_blank', rel: 'noopener' }, marcarTermos(rotuloFonte(f), termos), VL.icon('externo', 14)) : h('span', null, rotuloFonte(f), ' (sem link)'),
      f.locator ? h('span', null, ', ', marcarTermos(f.locator, termos)) : null);
    var data = dataBR(f.consultado);
    li.appendChild(h('div', { class: 'fato-meta' },
      ok ? h('span', { class: 'selo-ok' }, VL.icon('check', 15), 'confirmado') : VL.ui.seloQ(),
      data ? h('span', { class: 'fato-data' }, 'consultado em ' + data) : h('span', { class: 'fato-data' }, 'data de consulta não registrada')));
    li.appendChild(fonte);
    /* rodapé: trecho da fonte (recolhido) e o código do fato, com link direto (útil para relatar erro) */
    li.appendChild(h('div', { class: 'fato-pe' },
      f.quote ? h('details', { class: 'fato-trecho' }, h('summary', null, 'Trecho da fonte'), h('blockquote', null, marcarTermos(f.quote, termos))) : h('span', { class: 'fato-trecho fato-sem-trecho' }, 'Sem trecho registrado'),
      h('a', { class: 'fato-id', href: VL.link('sobre/fontes?id=' + encodeURIComponent(f.id)), title: 'Link direto para este fato', 'aria-label': 'Link direto para o fato ' + f.id }, marcarTermos(f.id, termos))));
    if (!ok) {
      var partes = partesNota(f.nota, lentesDe(f));
      var nota = h('div', { class: 'fato-nota' }, h('p', { class: 'fato-nota-t' }, 'Nota do verificador'));
      if (!partes.length) nota.appendChild(h('p', null, 'Sem nota. Trate como não confirmado.'));
      else if (partes.length === 1) nota.appendChild(h('p', null, partes[0].quem ? h('strong', null, partes[0].quem + ': ') : null, marcarTermos(partes[0].txt, termos)));
      else {
        var ul = h('ul');
        partes.forEach(function (p) { ul.appendChild(h('li', { 'data-ok': p.ok ? '1' : null }, p.quem ? h('strong', null, p.quem + ': ') : null, marcarTermos(p.txt, termos))); });
        nota.appendChild(ul);
      }
      li.appendChild(nota);
    }
    return li;
  }

  function paginaFontes(raiz, rota) {
    var r = resumoFatos();
    var intl = VL.settings.get('intl') !== false;
    var todos = r.lista.map(function (f) {
      f._busca = VL.semAcento([f.id, f.claim, f.txt, f.locator, f.quote, f.nota].filter(Boolean).join(' '));
      return f;
    });
    var q = rota.query || {};
    var estado = { busca: q.q || '', topico: q.topico || '', soQ: q.aconfirmar === '1', alvo: q.id || '' };
    if (estado.alvo) { estado.busca = ''; estado.topico = ''; estado.soQ = false; }
    /* trilha internacional desligada: esconde os fatos dela, menos o fato pedido pelo link direto */
    var ehIntl = function (f) { return (f.topico === 'internacional' || f.topico === 'loc_ext') && f.id !== estado.alvo; };
    var ocultos = intl ? 0 : todos.filter(ehIntl).length;
    var base = intl ? todos : todos.filter(function (f) { return !ehIntl(f); });

    var conhecidos = {};
    TOPICOS.forEach(function (t) { conhecidos[t.id] = t; });
    function grupoDe(f) {
      if (conhecidos[f.topico]) return f.topico;
      return /^extra_/.test(String(f.topico || '')) ? TOPICO_EXTRA.id : '_outros';
    }
    var grupos = TOPICOS.slice();
    if (base.some(function (f) { return grupoDe(f) === TOPICO_EXTRA.id; })) grupos.push(TOPICO_EXTRA);
    if (base.some(function (f) { return grupoDe(f) === '_outros'; })) grupos.push({ id: '_outros', titulo: 'Outros' });
    var limites = {};

    if (!todos.length) {
      raiz.appendChild(h('div', { class: 'vazio fontes-vazio' },
        VL.icon('livro', 28),
        h('p', { class: 'fontes-vazio-t' }, 'A lista de fatos ainda está vazia nesta versão.'),
        h('p', null, 'Ela é gerada a partir da pesquisa em ', h('code', null, 'research/'), ' pelo script ', h('code', null, 'tools/build_fontes.py'), '. Quando a pesquisa for consolidada, cada fato aparece aqui com a fonte, o trecho, a data da consulta e o resultado da verificação.'),
        h('p', null, 'Enquanto isso, o significado dos selos é este: ', h('span', { class: 'selo-ok' }, VL.icon('check', 15), 'confirmado'), ' foi aprovado em todas as checagens (duas independentes, nos fatos regulatórios); ', VL.ui.seloQ(), ' as fontes divergem, falta fonte oficial ou a checagem não terminou.'),
        h('p', { class: 'mb-0' }, 'Quer ajudar a levantar fontes? ', h('a', { href: VL.link('sobre?secao=contribuir') }, 'Veja como contribuir'), '.')));
      return;
    }

    /* resumo */
    var baseOk = base.filter(confirmado).length;
    var stat = function (v, rotulo, extra) { return h('div', { class: 'stat fontes-stat' + (extra ? ' ' + extra : '') }, h('span', { class: 'stat-v' }, VL.fmt.num(v, 0)), h('span', { class: 'stat-l' }, rotulo)); };
    raiz.appendChild(h('div', { class: 'fontes-resumo' },
      h('div', { class: 'fontes-stats' },
        stat(base.length, 'fatos na lista'),
        stat(baseOk, 'confirmados', 'fontes-stat-ok'),
        stat(base.length - baseOk, 'a confirmar', 'fontes-stat-q')),
      h('div', { class: 'fontes-legenda' },
        h('p', null, h('span', { class: 'selo-ok' }, VL.icon('check', 15), 'confirmado'), ' foi aprovado em todas as checagens previstas para o tópico.'),
        h('p', null, VL.ui.seloQ(), ' as fontes divergem, falta fonte oficial ou a checagem não terminou. A nota do verificador explica.'),
        h('p', { class: 'muted mb-0' }, 'Fatos regulatórios (habilitação, provas, taxas e rádio) passam por dois verificadores independentes; os demais, por um. Cada tópico diz qual foi o caso.',
          r.gerado ? ' Lista gerada em ' + (dataBR(r.gerado) || r.gerado) + '.' : ''))));
    if (ocultos) {
      raiz.appendChild(VL.ui.callout('nota', null, h('p', { class: 'mb-0' }, 'A trilha internacional está desligada nas configurações, por isso ' + plural(ocultos, 'fato dela está oculto', 'fatos dela estão ocultos') + '. ',
        h('button', { type: 'button', class: 'btn btn-quiet btn-sm sobre-inline-btn', onclick: function () { if (VL.config && VL.config.abrir) VL.config.abrir(); } }, 'Abrir configurações'))));
    }

    /* barra de busca e filtros */
    var busca = h('input', { type: 'search', id: 'fontes-busca', value: estado.busca, placeholder: 'Ex.: idade mínima, taxa, VHF', autocomplete: 'off', enterkeyhint: 'search' });
    var selTopico = h('select', { id: 'fontes-topico' }, h('option', { value: '' }, 'Todos os tópicos'));
    grupos.forEach(function (g) {
      var n = base.filter(function (f) { return grupoDe(f) === g.id; }).length;
      if (n) selTopico.appendChild(h('option', { value: g.id, selected: estado.topico === g.id }, g.titulo + ' (' + n + ')'));
    });
    var chkQ = h('input', { type: 'checkbox', id: 'fontes-soq', checked: estado.soQ });
    var contador = h('p', { class: 'fontes-contador', role: 'status', 'aria-live': 'polite' });
    raiz.appendChild(h('div', { class: 'fontes-barra', role: 'search', 'aria-label': 'Buscar e filtrar fatos' },
      h('div', { class: 'field fontes-campo-busca' }, h('label', { for: 'fontes-busca' }, 'Buscar nos fatos'),
        h('div', { class: 'fontes-busca-caixa' }, VL.icon('busca', 18), busca)),
      h('div', { class: 'field' }, h('label', { for: 'fontes-topico' }, 'Tópico'), selTopico),
      h('div', { class: 'field fontes-campo-q' }, h('span', { class: 'field-label', 'aria-hidden': 'true' }, ' '),
        h('label', { class: 'switch' }, chkQ, h('span', null, 'Só a confirmar')))));
    raiz.appendChild(contador);
    var lista = h('div', { class: 'fontes-resultado' });
    raiz.appendChild(lista);

    function sincronizarUrl() {
      var p = [];
      if (estado.busca) p.push('q=' + encodeURIComponent(estado.busca));
      if (estado.topico) p.push('topico=' + encodeURIComponent(estado.topico));
      if (estado.soQ) p.push('aconfirmar=1');
      try { history.replaceState(null, '', VL.link('sobre/fontes' + (p.length ? '?' + p.join('&') : ''))); } catch (e) { /* sem history */ }
    }
    function limparFiltros() {
      estado.busca = ''; estado.topico = ''; estado.soQ = false; limites = {};
      busca.value = ''; selTopico.value = ''; chkQ.checked = false;
      sincronizarUrl(); desenhar(); busca.focus();
    }

    function desenhar() {
      lista.innerHTML = '';
      var termos = VL.semAcento(estado.busca).split(/\s+/).filter(Boolean);
      var filtrados = base.filter(function (f) {
        if (estado.soQ && confirmado(f)) return false;
        if (estado.topico && grupoDe(f) !== estado.topico) return false;
        for (var i = 0; i < termos.length; i++) if (f._busca.indexOf(termos[i]) === -1) return false;
        return true;
      });
      var filtrando = termos.length || estado.topico || estado.soQ;
      var nGrupos = grupos.filter(function (g) { return filtrados.some(function (f) { return grupoDe(f) === g.id; }); }).length;
      contador.textContent = filtrando
        ? (filtrados.length ? 'Encontrados ' + VL.fmt.num(filtrados.length, 0) + ' de ' + plural(base.length, 'fato', 'fatos') + (nGrupos > 1 ? ', em ' + nGrupos + ' tópicos.' : '.') : 'Nenhum fato encontrado com esses filtros.')
        : plural(base.length, 'fato', 'fatos') + ' em ' + plural(nGrupos, 'tópico', 'tópicos') + '. Cada tópico mostra os primeiros; abra o resto com "Mostrar mais" ou use a busca.';
      if (!filtrados.length) {
        lista.appendChild(h('div', { class: 'vazio' },
          h('p', null, 'Nada encontrado. Tente outra palavra ou tire um filtro.'),
          h('button', { type: 'button', class: 'btn btn-ghost', onclick: limparFiltros }, 'Limpar filtros')));
        return;
      }
      var inicial = (termos.length || estado.soQ) ? POR_TOPICO_BUSCA : (estado.topico ? PASSO : POR_TOPICO);
      grupos.forEach(function (g) {
        var itens = filtrados.filter(function (f) { return grupoDe(f) === g.id; });
        if (!itens.length) return;
        var nQ = itens.filter(function (f) { return !confirmado(f); }).length;
        var idxAlvo = estado.alvo ? itens.map(function (f) { return f.id; }).indexOf(estado.alvo) : -1;
        var lim = Math.max(limites[g.id] || inicial, idxAlvo + 1);
        var ol = h('ol', { class: 'fatos', 'aria-labelledby': 'fontes-g-' + g.id });
        var mostrados = 0;
        var mais = h('div', { class: 'fontes-mais' });
        function acrescentar(ate, focar) {
          var primeiro = null;
          for (; mostrados < Math.min(ate, itens.length); mostrados++) {
            var li = itemFato(itens[mostrados], termos, itens[mostrados].id === estado.alvo);
            if (!primeiro) primeiro = li;
            ol.appendChild(li);
          }
          limites[g.id] = mostrados;
          desenharMais();
          if (focar && primeiro) { primeiro.setAttribute('tabindex', '-1'); try { primeiro.focus({ preventScroll: false }); } catch (e) { primeiro.focus(); } }
        }
        function desenharMais() {
          mais.innerHTML = '';
          var resta = itens.length - mostrados;
          if (resta <= 0) { mais.hidden = true; return; }
          mais.hidden = false;
          var prox = Math.min(PASSO, resta);
          mais.appendChild(h('p', { class: 'fontes-mais-txt' }, 'Mostrando ' + VL.fmt.num(mostrados, 0) + ' de ' + VL.fmt.num(itens.length, 0) + '.'));
          var row = h('div', { class: 'btn-row' },
            h('button', { type: 'button', class: 'btn btn-ghost btn-sm', 'aria-label': 'Mostrar mais ' + prox + ' fatos de ' + g.titulo, onclick: function () { acrescentar(mostrados + prox, true); } }, 'Mostrar mais ' + VL.fmt.num(prox, 0)));
          if (resta > prox) row.appendChild(h('button', { type: 'button', class: 'btn btn-quiet btn-sm', 'aria-label': 'Mostrar todos os ' + itens.length + ' fatos de ' + g.titulo, onclick: function () { acrescentar(itens.length, true); } }, 'Mostrar todos (' + VL.fmt.num(itens.length, 0) + ')'));
          mais.appendChild(row);
        }
        acrescentar(lim, false);
        lista.appendChild(h('section', { class: 'fontes-grupo', 'aria-labelledby': 'fontes-g-' + g.id },
          h('h2', { id: 'fontes-g-' + g.id }, g.titulo),
          h('p', { class: 'fontes-grupo-meta' },
            h('span', null, plural(itens.length, 'fato', 'fatos') + (nQ ? ', ' + VL.fmt.num(nQ, 0) + ' a confirmar.' : (itens.length > 1 ? ', todos confirmados.' : ', confirmado.'))),
            g.id !== '_outros' ? h('span', null, ' ' + (g.duas ? VERIF_DUAS : VERIF_UMA)) : null),
          ol, mais));
      });
    }

    var espera = null;
    function mudouFiltro() { estado.alvo = ''; limites = {}; sincronizarUrl(); desenhar(); }
    busca.addEventListener('input', function () {
      clearTimeout(espera);
      espera = setTimeout(function () { estado.busca = busca.value.trim(); mudouFiltro(); }, 160);
    });
    busca.addEventListener('keydown', function (e) { if (e.key === 'Escape' && busca.value) { e.preventDefault(); busca.value = ''; estado.busca = ''; mudouFiltro(); } });
    selTopico.addEventListener('change', function () { estado.topico = selTopico.value; mudouFiltro(); });
    chkQ.addEventListener('change', function () { estado.soQ = chkQ.checked; mudouFiltro(); });
    VL.aoSair(function () { clearTimeout(espera); });

    desenhar();

    if (estado.alvo) {
      var el = VL.$('#fato-' + VL.slug(estado.alvo));
      if (el) requestAnimationFrame(function () { el.scrollIntoView({ block: 'center' }); try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } });
      else contador.textContent = 'O fato "' + estado.alvo + '" não está nesta lista. ' + contador.textContent;
    }
  }

  /* =====================================================================
     #/sobre/licencas
     ===================================================================== */
  function textoCredito() {
    var onde = repoUrl() || siteUrl();
    return '"Veleiro: de leigo a transatlântico", dos contribuidores do projeto Veleiro' + (onde ? ' (' + onde + ')' : '') +
      ', licenciado sob CC BY-SA 4.0 (' + URL_CC + '). Adaptado por: [seu nome]. Mudanças: [o que você alterou].';
  }

  function paginaLicencas(raiz) {
    var lista = function (itens) { var ul = h('ul', { class: 'sobre-lista' }); itens.forEach(function (x) { ul.appendChild(h('li', null, x)); }); return ul; };

    var mitTxt = h('pre', { class: 'lic-texto', tabindex: '0', 'aria-label': 'Texto da licença MIT, em inglês' }, MIT_TEXTO);
    var mit = h('section', { class: 'lic-painel', 'aria-labelledby': 'lic-mit-t' },
      h('h2', { id: 'lic-mit-t' }, 'Código: MIT'),
      h('p', { class: 'lic-nome' }, 'Licença MIT, aprovada pela Open Source Initiative'),
      h('p', null, 'Cobre o código: ', h('code', null, 'app/core'), ', ', h('code', null, 'app/tabs'), ', ', h('code', null, 'app/widgets'), ', o CSS, ', h('code', null, 'tools/'), ' e ', h('code', null, 'run.sh'), '.'),
      h('h3', null, 'Você pode'),
      lista(['Usar para qualquer fim, inclusive comercial.', 'Copiar, modificar e juntar com outros programas.', 'Publicar, distribuir, sublicenciar e vender cópias.']),
      h('h3', null, 'Com a condição de'),
      lista(['Manter o aviso de direitos autorais e o texto da licença em todas as cópias ou partes importantes do código.']),
      h('h3', null, 'Saiba que'),
      lista(['O código vem "como está", sem garantia de nenhum tipo. Os autores não respondem por danos causados pelo uso.']),
      h('p', { class: 'lic-onde' }, 'No repositório: arquivo ', h('code', null, 'LICENSE'), ', na raiz.'),
      h('div', { class: 'btn-row' }, h('a', { class: 'btn btn-ghost btn-sm', href: URL_MIT, target: '_blank', rel: 'noopener' }, 'Texto oficial na Open Source Initiative', VL.icon('externo', 16))),
      h('details', { class: 'lic-detalhe' }, h('summary', null, 'Ler o texto completo (em inglês)'), mitTxt));

    var cc = h('section', { class: 'lic-painel', 'aria-labelledby': 'lic-cc-t' },
      h('h2', { id: 'lic-cc-t' }, 'Conteúdo: ', h('span', { class: 'sobre-nobr' }, 'CC BY-SA 4.0')),
      h('p', { class: 'lic-nome' }, 'Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional'),
      h('p', null, 'Cobre o conteúdo educativo: textos das lições, questões, flashcards, glossário, dados de locais e a pesquisa em ', h('code', null, 'research/'), '.'),
      h('h3', null, 'Você pode'),
      lista(['Compartilhar: copiar e redistribuir em qualquer meio ou formato.', 'Adaptar: remixar, transformar e criar a partir do material.', 'Fazer isso para qualquer fim, mesmo comercial, como num curso pago.']),
      h('h3', null, 'Com a condição de'),
      lista([
        h('span', null, h('strong', null, 'Dar crédito:'), ' citar o projeto, pôr um link para a licença e dizer se você mudou algo, sem sugerir que o projeto apoia você ou o seu uso.'),
        h('span', null, h('strong', null, 'Compartilhar igual:'), ' se você adaptar, publique a sua versão sob a mesma licença (ou uma ', externo(URL_CC_COMPAT, 'licença compatível'), ').'),
        h('span', null, h('strong', null, 'Não restringir:'), ' não usar termos jurídicos ou travas técnicas que impeçam outras pessoas de fazer o que a licença permite.'),
      ]),
      h('h3', null, 'Saiba que'),
      lista(['A licença não cobre o que está em domínio público nem usos já permitidos por lei, como a citação.', 'Não há garantia. Outros direitos, como direito de imagem e privacidade, podem limitar o uso.']),
      h('p', { class: 'lic-onde' }, 'No repositório: arquivo ', h('code', null, 'LICENSE-CONTEUDO.txt'), ', na raiz.'),
      h('div', { class: 'btn-row' },
        h('a', { class: 'btn btn-ghost btn-sm', href: URL_CC, target: '_blank', rel: 'noopener' }, 'Resumo oficial em português', VL.icon('externo', 16)),
        h('a', { class: 'btn btn-quiet btn-sm', href: URL_CC_LEGAL, target: '_blank', rel: 'noopener' }, 'Texto legal', VL.icon('externo', 16))));

    var credito = textoCredito();
    var taId = 'lic-credito-txt';
    var ta = h('textarea', { id: taId, class: 'sobre-modelo-txt', readonly: true, rows: '4', spellcheck: 'false' });
    ta.value = credito;
    var btnCopiar = h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: function () { copiar(credito, 'Texto de crédito copiado.', btnCopiar); } }, 'Copiar texto de crédito');

    var pergunta = function (p, resp) { return h('details', { class: 'lic-pergunta' }, h('summary', null, p, VL.icon('baixo', 20)), h('div', { class: 'lic-resposta' }, resp)); };

    raiz.appendChild(h('div', { class: 'lic-onde-ficam' },
      VL.icon('info', 20),
      h('p', { class: 'mb-0' }, 'Os textos completos ficam na raiz do repositório, fora da pasta ', h('code', null, 'app/'), ' que vira o site: ', h('code', null, 'LICENSE'), ' (código) e ', h('code', null, 'LICENSE-CONTEUDO.txt'), ' (conteúdo). Por isso eles não abrem por aqui; os links abaixo levam aos textos oficiais.')));
    raiz.appendChild(h('div', { class: 'lic-grid' }, mit, cc));

    raiz.appendChild(h('section', { class: 'lic-secao', 'aria-labelledby': 'lic-credito-t' },
      h('h2', { id: 'lic-credito-t' }, 'Como dar crédito'),
      h('p', null, 'Ao usar ou adaptar o conteúdo, cite o título, os autores, onde encontrar o original e a licença. Pode usar este texto e completar o que estiver entre colchetes:'),
      h('div', { class: 'spread' }, h('label', { for: taId, class: 'field-label' }, 'Texto de crédito'), btnCopiar),
      ta));

    raiz.appendChild(h('section', { class: 'lic-secao', 'aria-labelledby': 'lic-faq-t' },
      h('h2', { id: 'lic-faq-t' }, 'Perguntas comuns'),
      pergunta('Posso usar o material na minha escola ou num curso pago?', h('p', null, 'Pode. A CC BY-SA 4.0 permite uso comercial. Dê crédito ao projeto, com link para a licença, e diga se você mudou algo.')),
      pergunta('Posso adaptar, traduzir ou montar uma apostila?', h('p', null, 'Pode. A versão adaptada precisa dar crédito e ser publicada sob a mesma licença, CC BY-SA 4.0, ou uma licença compatível. Assim quem recebe a sua versão tem as mesmas liberdades que você teve.')),
      pergunta('Posso usar o código em outro app, até fechado?', h('p', null, 'O código está sob MIT: pode, desde que mantenha o aviso de direitos autorais e o texto da licença. Atenção: os textos, questões e dados continuam sob CC BY-SA 4.0, mesmo dentro de outro app.')),
      pergunta('As normas da Marinha estão sob a licença do projeto?', h('p', null, 'Não. A NORMAM-211/DPC e as demais normas são documentos públicos da Marinha do Brasil. O app cita trechos para estudo, sempre com link para a fonte oficial.')),
      pergunta('E as bibliotecas, a fonte e os mapas?', h('div', null,
        h('p', null, 'Cada um mantém a própria licença:'),
        listaCreditos(TERCEIROS.concat(DADOS_GEO), false),
        h('p', { class: 'mb-0' }, 'Resumo completo em ', h('a', { href: 'assets/vendor/LICENSES.md', target: '_blank', rel: 'noopener' }, h('code', null, 'assets/vendor/LICENSES.md')), '.')))));

    raiz.appendChild(h('p', { class: 'aviso-legal' }, 'Este resumo ajuda a entender as licenças, mas não as substitui: vale o texto legal de cada uma. Versão do app: ' + VL.versao + '.'));
  }

  /* =====================================================================
     registro
     ===================================================================== */
  var CABECALHOS = {
    '': ['Sobre e contribuir', 'Um curso aberto, gratuito e feito em comunidade, em português do Brasil. Ele leva quem nunca velejou até a travessia de um oceano, passando pela habilitação da Marinha.'],
    fontes: ['Fatos verificados', 'Toda informação sobre normas, provas, taxas e certificados usada no app vem desta lista. Cada fato traz a fonte oficial, o ponto exato onde ele aparece, a data da consulta e o resultado da verificação. Confira e avise se algo mudou.'],
    licencas: ['Licenças', 'O código e o conteúdo são livres. Veja, em linguagem simples, o que você pode fazer com eles e o que pedimos em troca.'],
  };

  VL.tabs.register({
    id: 'sobre', titulo: 'Sobre e contribuir', curto: 'Sobre e contribuir', grupo: 'projeto', icone: 'coracao', ordem: 11,
    render: function (el, rota) {
      var sub = rota.params[0] || '';
      if (!CABECALHOS[sub]) sub = '';
      var vivo = true;
      VL.aoSair(function () { vivo = false; });
      el.appendChild(VL.ui.carregando());
      return VL.loadCSS(CSS).then(function () {
        if (!vivo) return;
        el.innerHTML = '';
        var cab = CABECALHOS[sub];
        if (sub) document.title = cab[0] + ' — Veleiro';
        var raiz = h('div', { class: 'sobre sobre-' + (sub || 'inicio') });
        raiz.appendChild(VL.ui.cabecalho(cab[0], VL.esc(cab[1]), subnav(sub)));
        el.appendChild(raiz);
        if (sub === 'fontes') paginaFontes(raiz, rota);
        else if (sub === 'licencas') paginaLicencas(raiz, rota);
        else paginaSobre(raiz, rota);
        autoAltura(raiz);
      });
    },
  });
})();
