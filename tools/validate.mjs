#!/usr/bin/env node
// Valida os dados do app: contagens mínimas e formatos. Uso: node tools/validate.mjs [--json]
// Sai com código 1 se algum critério obrigatório falhar.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const APP = path.join(ROOT, 'app');
const dados = {};
const ctx = { VL: { dado: (n, v) => { dados[n] = v; return v; }, data: {}, geo: {} }, window: {}, console };
ctx.window.VL = ctx.VL;
vm.createContext(ctx);

function carregar(rel) {
  const p = path.join(APP, rel);
  if (!fs.existsSync(p)) return false;
  try { vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: rel }); return true; } catch (e) { erros.push(`${rel}: erro de sintaxe/execução: ${e.message}`); return false; }
}
const erros = [], avisos = [], resumo = {};
const NIVEIS_PROVA = ['arrais', 'mestre', 'capitao'];
const CURSOS = ['arrais', 'mestre', 'capitao', 'vela', 'travessia', 'radio'];

// fontes
carregar('data/fontes.js');
const fatos = (dados.fontes && dados.fontes.fatos) || {};
resumo.fatos = Object.keys(fatos).length;
resumo.fatos_a_confirmar = Object.values(fatos).filter(f => f.status !== 'confirmado').length;

// widgets existentes
const widgetsDir = path.join(APP, 'widgets');
const widgets = new Set(fs.existsSync(widgetsDir) ? fs.readdirSync(widgetsDir).filter(f => f.endsWith('.js')).map(f => f.replace(/\.js$/, '')) : []);
resumo.widgets = [...widgets].sort();

function validarQuestao(q, onde, ids) {
  const e = [];
  if (!q.id) e.push('sem id');
  if (ids) { if (ids.has(q.id)) e.push('id repetido ' + q.id); ids.add(q.id); }
  if (!q.enunciado || q.enunciado.length < 12) e.push('enunciado curto');
  if (!Array.isArray(q.alternativas) || q.alternativas.length < 3 || q.alternativas.length > 5) e.push('alternativas: precisa de 3 a 5');
  else {
    if (!(Number.isInteger(q.correta) && q.correta >= 0 && q.correta < q.alternativas.length)) e.push('correta fora do intervalo');
    const norm = q.alternativas.map(a => String(a).trim().toLowerCase());
    if (new Set(norm).size !== norm.length) e.push('alternativas repetidas');
    if (norm.some(a => /todas as anteriores|nenhuma das anteriores/.test(a)) && !q.fixa) e.push('"todas/nenhuma das anteriores" sem fixa:true');
  }
  if (!q.explicacao || q.explicacao.replace(/<[^>]+>/g, '').length < 40) e.push('explicação ausente/curta');
  if (!q.referencia || q.referencia.length < 4) e.push('referência ausente');
  if (!q.tema) e.push('sem tema');
  if (q.figura && q.figura.widget && !widgets.has(q.figura.widget)) e.push('widget inexistente ' + q.figura.widget);
  if (e.length) erros.push(`${onde} ${q.id || '?'}: ${e.join('; ')}`);
}

// questões
resumo.questoes = {};
const todasIds = new Set();
for (const n of [...NIVEIS_PROVA, 'vela', 'travessia', 'radio']) {
  if (!carregar(`data/questoes/${n}.js`)) { (NIVEIS_PROVA.includes(n) ? erros : avisos).push(`falta data/questoes/${n}.js`); continue; }
  const qs = dados[`questoes/${n}`] || [];
  resumo.questoes[n] = qs.length;
  const enun = new Set();
  qs.forEach(q => {
    validarQuestao(q, `questoes/${n}`, todasIds);
    const k = (q.enunciado || '').replace(/<[^>]+>/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
    if (enun.has(k)) erros.push(`questoes/${n} ${q.id}: enunciado duplicado`);
    enun.add(k);
  });
  if (NIVEIS_PROVA.includes(n) && qs.length < 150) erros.push(`questoes/${n}: ${qs.length} questões (mínimo 150)`);
  const temas = {}; qs.forEach(q => { temas[q.tema] = (temas[q.tema] || 0) + 1; });
  resumo['temas_' + n] = temas;
}

// flashcards
resumo.flashcards = {};
const fdir = path.join(APP, 'data', 'flashcards');
if (fs.existsSync(fdir)) for (const f of fs.readdirSync(fdir).filter(f => f.endsWith('.js') && f !== 'indice.js')) {
  carregar('data/flashcards/' + f);
  const nome = 'flashcards/' + f.replace(/\.js$/, '');
  const d = dados[nome];
  if (!d || !Array.isArray(d.cartas)) { erros.push(`${nome}: formato inválido`); continue; }
  resumo.flashcards[d.id] = d.cartas.length;
  resumo.flashcards_nivel = resumo.flashcards_nivel || {};
  resumo.flashcards_nivel[d.nivel] = (resumo.flashcards_nivel[d.nivel] || 0) + d.cartas.length;
  const ids = new Set();
  d.cartas.forEach(c => { if (!c.id || !c.frente || !c.verso) erros.push(`${nome} ${c.id || '?'}: carta incompleta`); if (ids.has(c.id)) erros.push(`${nome}: id repetido ${c.id}`); ids.add(c.id); });
}
for (const n of NIVEIS_PROVA) if (!(resumo.flashcards_nivel || {})[n]) erros.push(`faltam flashcards do nível ${n}`);

// cursos
resumo.cursos = {};
for (const c of CURSOS) {
  if (!carregar(`data/cursos/${c}.js`)) { erros.push(`falta data/cursos/${c}.js`); continue; }
  const curso = dados['cursos/' + c];
  let modulos = (curso.modulos || []).slice();
  for (const p of curso.partes || []) { if (carregar(`data/${p}.js`)) modulos = modulos.concat((dados[p] && dados[p].modulos) || []); else erros.push(`cursos/${c}: parte ausente ${p}`); }
  let licoes = 0, checks = 0, wids = new Set(), palavras = 0;
  const idsM = new Set();
  modulos.forEach(m => {
    if (idsM.has(m.id)) erros.push(`cursos/${c}: módulo repetido ${m.id}`); idsM.add(m.id);
    const idsL = new Set();
    (m.licoes || []).forEach(l => {
      licoes++;
      if (idsL.has(l.id)) erros.push(`cursos/${c}/${m.id}: lição repetida ${l.id}`); idsL.add(l.id);
      if (!l.blocos || !l.blocos.length) erros.push(`cursos/${c}/${m.id}/${l.id}: lição vazia`);
      (l.blocos || []).forEach(b => {
        if (b.t === 'check') { checks++; (b.questoes || []).forEach(q => validarQuestao(q, `cursos/${c}/${m.id}/${l.id} check`, null)); }
        if (b.t === 'widget') { wids.add(b.w); if (!widgets.has(b.w)) erros.push(`cursos/${c}/${m.id}/${l.id}: widget inexistente "${b.w}"`); }
        if (b.t === 'fato' && !fatos[b.ref]) erros.push(`cursos/${c}/${m.id}/${l.id}: fato inexistente "${b.ref}"`);
        for (const campo of ['html', 'txt']) if (b[campo]) palavras += String(b[campo]).replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
        (b.itens || []).forEach(it => { if (typeof it === 'string') palavras += it.split(/\s+/).length; else if (it && it.ref && !fatos[it.ref]) erros.push(`cursos/${c}: fonte ${it.ref} inexistente`); });
      });
    });
  });
  resumo.cursos[c] = { modulos: modulos.length, licoes, checks, widgets: [...wids], palavras };
  if (licoes < 8) erros.push(`cursos/${c}: só ${licoes} lições`);
}

// locais
if (carregar('data/locais.js')) {
  const it = (dados.locais && dados.locais.itens) || [];
  const semOrgao = it.filter(l => !(l.tipos || []).includes('orgao-maritimo'));
  resumo.locais = { total: it.length, sem_orgaos: semOrgao.length, nordeste: it.filter(l => l.regiao === 'Nordeste').length, exterior: it.filter(l => l.regiao === 'Exterior').length };
  it.forEach(l => {
    const e = [];
    if (!l.site || !/^https?:\/\//.test(l.site)) e.push('site');
    if (!l.fonte_url) e.push('fonte_url');
    if (!l.verificado_em) e.push('verificado_em');
    if (l.coord_precisao !== 'sem-mapa' && (typeof l.lat !== 'number' || typeof l.lon !== 'number')) e.push('coordenadas');
    if (e.length) erros.push(`locais ${l.id}: falta ${e.join(', ')}`);
  });
  if (semOrgao.length < 60) erros.push(`locais: ${semOrgao.length} verificados (fora Capitanias); mínimo 60`);
} else erros.push('falta data/locais.js');

// glossário
if (carregar('data/glossario.js')) {
  const g = dados.glossario || {};
  resumo.glossario = (g.termos || []).length;
  if ((g.termos || []).length < 150) avisos.push(`glossário com ${(g.termos || []).length} termos (meta 150+)`);
} else erros.push('falta data/glossario.js');

// dados de teste esquecidos
(function varrer(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) { varrer(p); continue; }
    if (f.endsWith('.js') && /DADOS-TEMPORARIOS-TESTE/.test(fs.readFileSync(p, 'utf8').slice(0, 400))) erros.push(`dados de teste esquecidos em ${path.relative(ROOT, p)}`);
  }
})(path.join(APP, 'data'));

const out = { ok: erros.length === 0, erros: erros.slice(0, 200), n_erros: erros.length, avisos, resumo };
if (process.argv.includes('--json')) console.log(JSON.stringify(out, null, 1));
else {
  console.log(JSON.stringify(resumo, null, 1));
  if (avisos.length) console.log('\nAvisos:\n- ' + avisos.join('\n- '));
  console.log(erros.length ? `\n${erros.length} ERRO(S):\n- ` + erros.slice(0, 80).join('\n- ') : '\nOK: todos os critérios passaram.');
}
process.exit(erros.length ? 1 : 0);
