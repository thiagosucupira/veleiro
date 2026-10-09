/* Progresso do estudante (tudo local, no navegador): lições concluídas, etapas do roteiro,
   tentativas de simulado, estatística por questão e dias de estudo. */
(function () {
  'use strict';
  var S = VL.store;
  function obj(k) { return S.get(k, {}) || {}; }

  VL.progress = {
    /* Lições */
    licao: function (cursoId, licaoId, feita) {
      var p = obj('licoes');
      var chave = cursoId + '/' + licaoId;
      if (feita === false) delete p[chave]; else p[chave] = VL.hoje();
      S.set('licoes', p);
      VL.progress.marcarEstudo();
      VL.emit('progresso', { tipo: 'licao', curso: cursoId, licao: licaoId });
    },
    licaoFeita: function (cursoId, licaoId) { return !!obj('licoes')[cursoId + '/' + licaoId]; },
    /** fração de lições concluídas de um curso (respeita a trilha internacional) */
    cursoFrac: function (curso) {
      if (!curso || !curso.modulos) return 0;
      var intl = VL.settings.get('intl'), tot = 0, ok = 0, p = obj('licoes');
      curso.modulos.forEach(function (m) {
        if (m.intl && !intl) return;
        (m.licoes || []).forEach(function (l) {
          if (l.intl && !intl) return;
          tot++; if (p[curso.id + '/' + m.id + '.' + l.id]) ok++;
        });
      });
      return tot ? ok / tot : 0;
    },
    /** Resumo leve por curso, salvo pelas abas de curso ao renderizar. Guarda as chaves das lições
        (com e sem a trilha internacional) para o trilho contar certo mesmo depois de ligar/desligar a trilha. */
    salvarResumoCurso: function (curso) {
      var r = obj('resumoCursos'), todas = [], semIntl = [];
      (curso.modulos || []).forEach(function (m) {
        (m.licoes || []).forEach(function (l) {
          var k = m.id + '.' + l.id;
          todas.push(k);
          if (!m.intl && !l.intl) semIntl.push(k);
        });
      });
      r[curso.id] = { todas: todas, semIntl: semIntl };
      S.set('resumoCursos', r);
    },
    resumoCurso: function (cursoId) {
      var r = obj('resumoCursos')[cursoId];
      if (!r || !r.todas) return null;
      var lista = VL.settings.get('intl') ? r.todas : r.semIntl;
      var p = obj('licoes'), feitas = 0;
      lista.forEach(function (k) { if (p[cursoId + '/' + k]) feitas++; });
      return { total: lista.length, feitas: feitas };
    },

    /* Etapas do roteiro (checkboxes) */
    etapa: function (id, valor) {
      var p = obj('etapas');
      if (valor === undefined) return !!p[id];
      if (valor) p[id] = VL.hoje(); else delete p[id];
      S.set('etapas', p);
      VL.emit('progresso', { tipo: 'etapa', id: id });
      return valor;
    },
    etapas: function () { return obj('etapas'); },

    /* Simulados */
    registrarTentativa: function (t) {
      var lista = S.get('tentativas', []) || [];
      t.data = t.data || new Date().toISOString();
      lista.push(t);
      if (lista.length > 400) lista = lista.slice(-400);
      S.set('tentativas', lista);
      VL.progress.marcarEstudo();
      VL.emit('progresso', { tipo: 'tentativa', tentativa: t });
    },
    tentativas: function (nivel) {
      var l = S.get('tentativas', []) || [];
      return nivel ? l.filter(function (t) { return t.nivel === nivel; }) : l;
    },

    /* Estatística por questão (para revisão das que você mais erra) */
    responder: function (qid, acertou) {
      var q = obj('questoes');
      var r = q[qid] || { v: 0, a: 0 };
      r.v++; if (acertou) r.a++; r.u = acertou ? 1 : 0; r.d = VL.hoje();
      q[qid] = r;
      S.set('questoes', q);
    },
    questaoStats: function (qid) { return obj('questoes')[qid] || null; },
    todasQuestaoStats: function () { return obj('questoes'); },

    /* Dias de estudo */
    marcarEstudo: function () {
      var d = S.get('dias', []) || [];
      var hj = VL.hoje();
      if (d[d.length - 1] !== hj) { d.push(hj); if (d.length > 800) d = d.slice(-800); S.set('dias', d); }
    },
    dias: function () { return S.get('dias', []) || []; },
    sequencia: function () {
      var d = VL.progress.dias(); if (!d.length) return 0;
      var set = {}; d.forEach(function (x) { set[x] = 1; });
      var n = 0, dt = new Date();
      var fmt = function (x) { return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); };
      if (!set[fmt(dt)]) dt.setDate(dt.getDate() - 1);
      while (set[fmt(dt)]) { n++; dt.setDate(dt.getDate() - 1); }
      return n;
    },

    /* Backup */
    exportarArquivo: function () {
      var blob = new Blob([JSON.stringify({ app: 'veleiro', versao: VL.versao, exportado: new Date().toISOString(), dados: VL.store.exportar() }, null, 1)], { type: 'application/json' });
      var a = VL.h('a', { href: URL.createObjectURL(blob), download: 'veleiro-progresso-' + VL.hoje() + '.json' });
      document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    },
    importarArquivo: function (arquivo) {
      return arquivo.text().then(function (txt) {
        var j;
        try { j = JSON.parse(txt); } catch (e) { throw new Error('Este arquivo não é um backup do Veleiro (não é JSON válido).'); }
        if (!j || j.app !== 'veleiro' || !j.dados || typeof j.dados !== 'object') throw new Error('Este arquivo não é um backup do Veleiro.');
        VL.store.importar(j.dados);
        VL.settings.aplicar();
        VL.emit('settings', VL.settings.all());
        VL.emit('progresso', { tipo: 'import' });
      });
    },
  };
})();
