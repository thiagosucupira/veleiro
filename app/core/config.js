/* Boas-vindas (primeira visita) e Configurações. Tudo opcional e salvo só neste navegador. */
(function () {
  'use strict';
  var h = VL.h;
  VL.config = {};

  function campoUF(s, aoMudar) {
    var sel = h('select', { id: 'cfg-uf', onchange: function () { aoMudar(sel.value); } }, h('option', { value: '' }, 'Prefiro não informar'));
    (VL.data.ufs || []).forEach(function (u) { sel.appendChild(h('option', { value: u.uf, selected: s.uf === u.uf }, u.nome + ' (' + u.uf + ')')); });
    return sel;
  }
  function blocoBase(s, estado) {
    var cidade = h('input', { type: 'text', id: 'cfg-cidade', value: s.cidade || '', placeholder: 'Ex.: Recife, Ilhabela, Porto Alegre', autocomplete: 'address-level2', oninput: function () { estado.cidade = cidade.value.trim(); } });
    var status = h('p', { class: 'field-hint', role: 'status' }, s.lat != null ? 'Localização salva neste aparelho.' : '');
    var geo = h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: function () {
      if (!navigator.geolocation) { status.textContent = 'Seu navegador não oferece localização. Escolha o estado acima.'; return; }
      status.textContent = 'Pedindo permissão de localização…';
      navigator.geolocation.getCurrentPosition(function (p) {
        estado.lat = Math.round(p.coords.latitude * 1000) / 1000; estado.lon = Math.round(p.coords.longitude * 1000) / 1000;
        status.textContent = 'Localização obtida (' + VL.fmt.num(estado.lat, 3) + ', ' + VL.fmt.num(estado.lon, 3) + '). Fica só neste aparelho.';
      }, function () { status.textContent = 'Não foi possível obter a localização. Você pode escolher o estado acima.'; }, { timeout: 12000, maximumAge: 600000 });
    } }, VL.icon('alvo', 16), 'Usar minha localização');
    var limpar = h('button', { type: 'button', class: 'btn btn-quiet btn-sm', onclick: function () { estado.lat = null; estado.lon = null; status.textContent = 'Localização apagada.'; } }, 'Apagar localização');
    return h('div', null,
      h('div', { class: 'field' }, h('label', { for: 'cfg-uf' }, 'Estado de base'), campoUF(s, function (v) { estado.uf = v; }),
        h('span', { class: 'field-hint' }, 'Usamos para mostrar primeiro as escolas, clubes e a Capitania mais próximos.')),
      h('div', { class: 'field' }, h('label', { for: 'cfg-cidade' }, 'Cidade (opcional)'), cidade),
      h('div', { class: 'row' }, geo, limpar), status);
  }
  function blocoRitmo(s, estado) {
    var saida = h('output', { for: 'cfg-ritmo', style: { fontWeight: 750 } }, s.ritmoHoras + ' h por semana');
    var faixa = h('input', { type: 'range', id: 'cfg-ritmo', min: '2', max: '20', step: '1', value: String(s.ritmoHoras),
      oninput: function () { estado.ritmoHoras = Number(faixa.value); saida.textContent = faixa.value + ' h por semana'; } });
    return h('div', { class: 'field' }, h('label', { for: 'cfg-ritmo' }, 'Quantas horas por semana você pode dedicar?'), faixa, saida,
      h('span', { class: 'field-hint' }, 'Conta estudo e prática no mar. O roteiro recalcula as durações típicas com base nisso; não há prazo fixo.'));
  }
  function blocoIntl(s, estado) {
    var chk = h('input', { type: 'checkbox', checked: s.intl, onchange: function () { estado.intl = chk.checked; } });
    return h('div', { class: 'field' },
      h('label', { class: 'switch' }, chk, h('span', null, 'Mostrar a trilha internacional (RYA, ICC, ASA)')),
      h('span', { class: 'field-hint' }, 'Certificados estrangeiros úteis para fretar barcos no exterior e para travessias. Desligue para esconder tudo o que for só da trilha internacional.'));
  }

  /** Boas-vindas em passos. */
  VL.config.boasVindas = function () {
    var s = VL.settings.all(), estado = {};
    var passo = 0;
    var corpo = h('div');
    var dlg = VL.ui.dialogo({ titulo: null, corpo: corpo, semEsc: false, acoes: [], aoFechar: function () { if (!VL.settings.get('onboarded')) VL.settings.set('onboarded', true); } });
    var rodape = VL.$('.dlg-rodape', dlg);
    var passos = [
      function () {
        return h('div', null, h('h2', { id: 'dlg-t' }, 'Bem-vindo a bordo'),
          h('p', { class: 'lead' }, 'Um caminho aberto e gratuito, do zero até comandar um veleiro de cruzeiro numa travessia do Atlântico: habilitação da Marinha (Arrais, Mestre e Capitão-Amador), prática de vela, rádio, segurança e planejamento oceânico.'),
          VL.ui.callout('seguranca', 'Antes de tudo', 'Este app é material de estudo. Ele não substitui aulas práticas com instrutor, nem a habilitação oficial emitida pela Marinha do Brasil. Regras e taxas mudam: confirme sempre na Capitania.'),
          h('p', { class: 'muted mb-0' }, 'Nas próximas telas você pode, se quiser, dizer onde vai velejar e quanto tempo tem. Tudo fica só neste aparelho.'));
      },
      function () { return h('div', null, h('h2', { id: 'dlg-t' }, 'Onde você vai velejar?'), h('p', { class: 'muted' }, 'Opcional.'), blocoBase(s, estado)); },
      function () { return h('div', null, h('h2', { id: 'dlg-t' }, 'Qual é o seu ritmo?'), h('p', { class: 'muted' }, 'Opcional.'), blocoRitmo(s, estado)); },
      function () { return h('div', null, h('h2', { id: 'dlg-t' }, 'Trilha internacional'), blocoIntl(s, estado)); },
    ];
    function desenhar() {
      corpo.innerHTML = '';
      var barra = h('div', { class: 'passos-onb', 'aria-hidden': 'true' });
      passos.forEach(function (_, i) { barra.appendChild(h('span', { 'data-on': i <= passo ? '1' : '0' })); });
      corpo.appendChild(barra);
      corpo.appendChild(passos[passo]());
      rodape.innerHTML = '';
      rodape.appendChild(h('button', { type: 'button', class: 'btn btn-quiet', onclick: function () { concluir(true); } }, passo === 0 ? 'Pular configuração' : 'Pular'));
      var dir = h('div', { class: 'btn-row' });
      if (passo > 0) dir.appendChild(h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { passo--; desenhar(); } }, 'Voltar'));
      dir.appendChild(h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { if (passo < passos.length - 1) { passo++; desenhar(); } else concluir(false); } }, passo === 0 ? 'Começar' : (passo < passos.length - 1 ? 'Continuar' : 'Pronto, vamos zarpar')));
      rodape.appendChild(dir);
      var foco = VL.$('select, input, .btn-primary', corpo) || VL.$('.btn-primary', rodape);
      if (foco) setTimeout(function () { foco.focus(); }, 30);
    }
    function concluir(pular) {
      var novo = Object.assign({ onboarded: true }, pular ? {} : estado);
      VL.settings.set(novo);
      dlg.fechar();
      VL.render();
    }
    desenhar();
  };

  /** Painel de configurações completo. */
  VL.config.abrir = function () {
    var s = VL.settings.all(), estado = {};
    var tema = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Tema' });
    [['auto', 'Automático'], ['claro', 'Claro'], ['escuro', 'Escuro']].forEach(function (t) {
      var b = h('button', { type: 'button', 'aria-pressed': String(s.tema === t[0]), onclick: function () { estado.tema = t[0]; VL.$$('button', tema).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); } }, t[1]);
      tema.appendChild(b);
    });
    var novos = h('input', { type: 'number', id: 'cfg-novos', min: '0', max: '200', value: String(s.novosPorDia), oninput: function () { estado.novosPorDia = Math.max(0, Math.min(200, Number(novos.value) || 0)); } });
    var arquivo = h('input', { type: 'file', accept: 'application/json,.json', hidden: true, onchange: function () {
      if (!arquivo.files[0]) return;
      VL.progress.importarArquivo(arquivo.files[0]).then(function () { VL.ui.toast('Progresso importado.'); dlg.fechar(); VL.render(); }, function (e) { VL.ui.toast((e && e.message) || 'Arquivo inválido.'); })
        .then(function () { arquivo.value = ''; });   // permite escolher o mesmo arquivo de novo
    } });
    var corpo = h('div', null,
      h('h3', null, 'Aparência'), h('div', { class: 'field' }, h('span', { class: 'field-label' }, 'Tema'), tema),
      h('h3', { class: 'mt-6' }, 'Base e ritmo'), blocoBase(s, estado), blocoRitmo(s, estado),
      h('h3', { class: 'mt-6' }, 'Conteúdo'), blocoIntl(s, estado),
      h('div', { class: 'field' }, h('label', { for: 'cfg-novos' }, 'Flashcards novos por dia'), novos),
      h('h3', { class: 'mt-6' }, 'Seu progresso'),
      h('p', { class: 'muted' }, 'O progresso fica salvo só neste navegador. Faça um backup para levar para outro aparelho. Ao importar, o backup é mesclado com o que já existe aqui (o que vem no arquivo prevalece, item por item; o resto fica como está), e “Apagar tudo” apaga também as configurações.'),
      h('div', { class: 'btn-row' },
        h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: function () { VL.progress.exportarArquivo(); } }, VL.icon('download', 16), 'Baixar backup'),
        h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: function () { arquivo.click(); } }, VL.icon('upload', 16), 'Importar backup'), arquivo,
        h('button', { type: 'button', class: 'btn btn-danger btn-sm', onclick: function () {
          if (window.confirm('Apagar todo o progresso e as configurações deste navegador? Isso não pode ser desfeito.')) { VL.store.limparTudo(); VL.settings.aplicar(); VL.emit('settings', VL.settings.all()); VL.emit('progresso', { tipo: 'apagar' }); dlg.fechar(); VL.ui.toast('Progresso apagado.'); VL.render(); }
        } }, 'Apagar tudo')),
      h('p', { class: 'mt-4 mb-0' }, h('button', { type: 'button', class: 'btn btn-quiet btn-sm', onclick: function () { dlg.fechar(); VL.config.boasVindas(); } }, 'Rever as boas-vindas')));
    var dlg = VL.ui.dialogo({
      titulo: 'Configurações', corpo: corpo,
      acoes: [{ rotulo: 'Cancelar', tipo: 'ghost' }, { rotulo: 'Salvar', tipo: 'primary', acao: function () { VL.settings.set(estado); VL.ui.toast('Configurações salvas.'); VL.render(); } }],
    });
  };
})();
