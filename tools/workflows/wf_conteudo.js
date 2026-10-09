export const meta = {
  name: 'veleiro-conteudo',
  description: 'Construção paralela do conteúdo: cursos (partes por autor), flashcards, Roteiro e Locais',
  phases: [{ title: 'Conteúdo', detail: 'autores por parte de curso + abas Roteiro e Locais' }],
}
const ROOT = '/home/sobranceiro/veleiro_certificacoes'
const SP = '/tmp/claude-1000/-home-sobranceiro/767d06b5-c8a6-4493-9ee3-da137f666222/scratchpad'

const COMMON = `Você é autor didático sênior e instrutor de vela/navegação (nível Yachtmaster Ocean e Capitão-Amador), escrevendo para o app "Veleiro: de leigo a transatlântico" — app web estático, open source, PT-BR, comunitário, qualidade IGUAL OU SUPERIOR a RYA/ASA/NauticEd e aos melhores cursos brasileiros de Arrais/Mestre/Capitão. Projeto: ${ROOT}. Hoje: 2026-10-07.

LEIA ANTES DE ESCREVER: ${ROOT}/PLAN.md; ${ROOT}/docs/arquitetura.md (contrato: formatos de curso, blocos, questões, flashcards — obrigatório); ${ROOT}/app/core/course.js (comentário do topo lista os blocos); ${ROOT}/research/programa_provas.md (PROGRAMA OFICIAL — siga item por item o que é do seu nível); ${ROOT}/research/sources.md (fatos verificados com status e IDs) e ${ROOT}/research/claims_verified.json; os .md de pesquisa relevantes em ${ROOT}/research/; os cabeçalhos dos widgets em ${ROOT}/app/widgets/*.js (nomes e opts aceitos) e ${ROOT}/docs/widgets.md (manifesto); o texto oficial em ${ROOT}/research/acervo/ (NORMAM-211 e anexos) quando precisar.

REGRAS DE CONTEÚDO:
- PT-BR claro para leigos: frases curtas, voz ativa, explique cada termo na primeira vez (pode usar o bloco {t:'termos', ids:[...]} com ids do glossário em app/data/glossario.js). Termos náuticos brasileiros corretos. Nomes de águas em <span class="agua">itálico</span> quando citados.
- Precisão técnica absoluta (RIPEAM-72, IALA Região B, Miguens/DHN, NORMAM-211). Um instrutor cético vai revisar tudo depois.
- FATOS REGULATÓRIOS (NORMAM, taxas, prazos, documentos, requisitos, provas, certificados, equipamentos obrigatórios): SÓ com bloco {t:'fato', ref:'<id>', html:'…'} ou fonte {txt,url,ref} apontando para um ID existente em research/claims_verified.json (o selo "a confirmar" aparece sozinho quando o fato não foi confirmado). Se precisar de um fato regulatório que NÃO está lá, leia a fonte oficial (acervo local da NORMAM-211 ou site oficial; marinha.mil.br via: curl -s -G localhost:8799/page --data-urlencode "url=<URL>"), e registre-o em ${ROOT}/research/_work/research_extra_<SUAPARTE>.json no MESMO formato de claims (campos id, topic, claim, source_url, locator, quote, official, confidence) com ids "extra-<SUAPARTE>-01"… e use esse id no bloco fato. Esses fatos extras passarão por verificação dupla depois. Nunca escreva número regulatório solto sem referência.
- Conteúdo técnico (não regulatório) cita a fonte técnica no fim da lição (bloco {t:'fontes'}: ex. RIPEAM Regra 15; Miguens vol. I cap. X; WMO; Cruz Vermelha). Valores físicos/médicos/químicos (pontos de fulgor, hipotermia, RCP etc.) com fonte confiável e URL.
- Cada LIÇÃO: id curto estável (l1, l2…), titulo, minutos (5–15), objetivos (2–4), blocos com: explicação em parágrafos curtos e listas; pelo menos uma figura SVG inline OU um widget quando ajudar a entender (use os widgets existentes com opts corretos — confira o cabeçalho do arquivo do widget); callouts de segurança/dica quando couber; um bloco {t:'check'} com 2–4 questões no formato oficial de questão (explicação que diga por que a certa está certa e por que cada errada está errada, referência normativa/técnica) ; e {t:'fontes'}. Lições de 400–1000 palavras. Módulos com 3–6 lições. Prefira profundidade e exemplos práticos brasileiros (portos, ventos, Capitanias) sem viés para uma cidade.
- SVG inline: viewBox, width 100%, cores só via var(--ink), var(--magenta), var(--sea-1/2/3), var(--land), var(--nav-red/green/white/yellow), currentColor; texto ≥ 12px equivalentes; role="img" e <title>.
- Trilha internacional (RYA/ICC/ASA): blocos/lições com intl:true (somem se o usuário desligar).
- FLASHCARDS: escreva também ${ROOT}/app/data/flashcards/<SUAPARTE>.js com VL.dado('flashcards/<SUAPARTE>', {id:'<SUAPARTE>', titulo:'<curso>: <tema da parte>', nivel:'<curso>', cartas:[{id, frente, verso, dica?, ref?}]}) — 35 a 60 cartas sobre os pontos que mais caem/mais importam (frente curta; verso com a resposta e uma linha de porquê).
- Arquivos: escreva SOMENTE os seus (listados na tarefa). Não edite core/, index.html, tabs de outros, nem o arquivo principal do curso (data/cursos/<curso>.js já existe e lista as partes).

TESTE (obrigatório): abra suas lições no navegador e corrija até ficar perfeito:
  cd ${ROOT} && python3 tools/qa_shot.py --out ${SP}/c-<SUAPARTE> --wait 2500 --full "<curso>/<modulo>/<licao>" …  (+ --mobile --dark)
  e valide a sintaxe: node -e "global.VL={dado:(n,v)=>v};require('${ROOT}/app/data/cursos/<SUAPARTE>.js');require('${ROOT}/app/data/flashcards/<SUAPARTE>.js');console.log('ok')"
Abra PNGs com Read; sem pageerrors/console/overflowX; widgets aparecendo; figuras legíveis nos dois temas.`

const RET = { type: 'object', properties: {
  arquivos: { type: 'array', items: { type: 'string' } },
  modulos: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, titulo: { type: 'string' }, licoes: { type: 'number' } }, required: ['id', 'titulo', 'licoes'] } },
  fatos_extra: { type: 'number' }, flashcards: { type: 'number' }, palavras_aprox: { type: 'number' },
  pendencias: { type: 'array', items: { type: 'string' } }, notas: { type: 'string' } },
  required: ['arquivos', 'modulos', 'fatos_extra', 'flashcards', 'pendencias', 'notas'] }

const PARTES = __PARTES__

phase('Conteúdo')
const r = await parallel(PARTES.map(p => () => agent(COMMON.replace(/<SUAPARTE>/g, p.parte).replace(/<curso>/g, p.curso) + '\n\n' + p.prompt, { label: `conteudo:${p.parte}`, phase: 'Conteúdo', schema: RET })))
return r.map((x, i) => x ? { parte: PARTES[i].parte, ...x } : { parte: PARTES[i].parte, failed: true })
