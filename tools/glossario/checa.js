// Confere app/data/glossario.js: ids únicos, relacionados existentes, figuras que renderizam, HTML bem formado.
const fs = require('fs'), vm = require('vm'), path = require('path'), cp = require('child_process');
const arq = process.argv[2];
const dados = {};
const ctx = { VL: { dado: (n, v) => { dados[n] = v; return v; }, data: {}, geo: {} }, window: {}, console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(arq, 'utf8'), ctx, { filename: arq });
const g = dados.glossario, idx = dados.glossarioIndice;
const erros = [], avisos = [];
const ids = new Set();
const cats = new Set(g.categorias.map(c => c.id));
const porCat = {};
const widgets = {};
const WID = new Set(fs.readdirSync('/home/sobranceiro/veleiro_certificacoes/app/widgets').map(f => f.replace(/\.js$/, '')));
const svgs = [];
g.termos.forEach(t => {
  if (ids.has(t.id)) erros.push('id repetido ' + t.id);
  ids.add(t.id);
  if (!/^[a-z0-9-]+$/.test(t.id)) erros.push('id inválido ' + t.id);
  if (!cats.has(t.categoria)) erros.push('categoria inválida ' + t.id + ' ' + t.categoria);
  porCat[t.categoria] = (porCat[t.categoria] || 0) + 1;
  if (!t.def || t.def.length < 15) erros.push('def curta ' + t.id);
  if (!t.en) avisos.push('sem en ' + t.id);
  if (t.widget) widgets[t.widget.w] = (widgets[t.widget.w] || 0) + 1;
  if (t.figura) {
    try { const s = t.figura.svg; if (!s || s.indexOf('<svg') !== 0) erros.push('figura vazia ' + t.id); svgs.push([t.id, s]); }
    catch (e) { erros.push('figura quebra ' + t.id + ': ' + e.message); }
  }
  const frases = t.def.replace(/<[^>]+>/g, '').split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ“])/).length;
  if (frases > 4) avisos.push('def longa (' + frases + ' frases) ' + t.id);
});
g.termos.forEach(t => (t.ver || []).forEach(v => { if (!ids.has(v)) erros.push('ver inexistente ' + t.id + ' -> ' + v); if (v === t.id) erros.push('ver a si mesmo ' + t.id); }));
Object.keys(g.alias).forEach(a => { if (ids.has(a)) erros.push('alias colide ' + a); });
// HTML e SVG bem formados (python xml)
const tmp = path.join(require('os').tmpdir(), 'veleiro-glossario-xmlcheck.json');
const lote = svgs.concat(g.termos.map(t => [t.id + ':def', '<div>' + t.def + '</div>']));
fs.writeFileSync(tmp, JSON.stringify(lote));
const py = `
import json,sys,xml.etree.ElementTree as ET
for k,s in json.load(open(sys.argv[1])):
    try: ET.fromstring(s.replace('&nbsp;','&#160;'))
    except Exception as e: print('XML', k, e)
`;
const r = cp.spawnSync('python3', ['-c', py, tmp], { encoding: 'utf8' });
if (r.stdout.trim()) erros.push(...r.stdout.trim().split('\n'));
console.log(JSON.stringify({ termos: g.termos.length, comFigura: svgs.length, alias: Object.keys(g.alias).length, indice: Object.keys(idx).length, porCat, widgets: Object.fromEntries(Object.entries(widgets).map(([k, v]) => [k + (WID.has(k) ? '' : ' (ainda não existe)'), v])), kb: Math.round(fs.statSync(arq).size / 1024) }, null, 1));
if (avisos.length) console.log('AVISOS:\n  ' + avisos.join('\n  '));
if (erros.length) { console.log('ERROS:\n  ' + erros.join('\n  ')); process.exit(1); }
console.log('OK');
