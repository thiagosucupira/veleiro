export const meta = {
  name: 'veleiro-questoes',
  description: 'Banco de questões comentadas por nível: geração por lote → revisão técnica cética → revisão de ambiguidade/didática',
  phases: [
    { title: 'Geração', detail: 'lotes de questões por nível e assunto' },
    { title: 'Revisão técnica', detail: 'instrutor cético corrige ou descarta' },
    { title: 'Revisão de clareza', detail: 'resposta única, distratores, explicação' },
  ],
}
const ROOT = '/home/sobranceiro/veleiro_certificacoes'
const QD = ROOT + '/research/_work/questoes'

const BASE = `Projeto: app "Veleiro: de leigo a transatlântico" (${ROOT}), PT-BR, comunitário, open source. Hoje: 2026-10-07. Leia ${ROOT}/docs/arquitetura.md (formato da questão), ${ROOT}/research/programa_provas.md (programa oficial do nível — Anexo 5-A da NORMAM-211 — e estilo das provas: seção 10 e ${ROOT}/research/provas_antigas.md), ${ROOT}/research/sources.md e ${ROOT}/research/claims_verified.json (fatos regulatórios verificados com status), e as lições já escritas do curso do nível em ${ROOT}/app/data/cursos/<nivel>-*.js (para alinhar terminologia e não contradizer o curso).
FORMATO de cada questão (JSON): {"tema": "<um dos temas listados>", "dificuldade": 1|2|3, "enunciado": "HTML simples", "alternativas": [...], "correta": <índice 0-based>, "explicacao": "HTML: por que a correta está certa E por que cada distrator está errado (1 frase cada)", "referencia": "fonte normativa/técnica precisa, ex.: 'RIPEAM, Regra 13(b)'; 'NORMAM-211/DPC, art. 5.5.1 b)'; 'Miguens, Navegação: a Ciência e a Arte, vol. I, cap. 7'", "fonte_url": "URL oficial quando houver", "figura": opcional {"svg": "<svg …>"} (cores só var(--ink), var(--nav-red/green/white/yellow), var(--sea-1/2/3), var(--land), currentColor; viewBox; ≤ 4 KB) ou {"widget": "nome", "opts": {…}} só se o widget existir em ${ROOT}/app/widgets/ e aceitar essas opts}.`

const GEN = (nivel, lote, n, temas, extra) => `${BASE}
Você é um examinador experiente da Marinha e instrutor de navegação. TAREFA: escreva ${n} questões ORIGINAIS de múltipla escolha para o nível ${nivel} (lote ${lote}), distribuídas assim por tema: ${temas}.
${extra}
REGRAS: exatamente UMA alternativa correta e inequívoca; distratores plausíveis (erros típicos de aluno), mesmo tamanho aproximado da correta, sem pistas gramaticais; nada de "todas/nenhuma das anteriores"; misture memorização, compreensão e aplicação (cenários práticos brasileiros, cálculos com números redondos verificáveis); dificuldade 1/2/3 equilibrada (30/45/25%). Não copie questões de provas oficiais (pode imitar o estilo). Questões de legislação/regulamento SÓ sobre fatos com status "confirmado" em research/claims_verified.json, citando o artigo; nunca sobre números "a confirmar". Confira cada cálculo duas vezes. PT-BR correto e simples.
SAÍDA: escreva ${QD}/${nivel}-${lote}.json como {"questoes": [...]} (crie a pasta se preciso) e valide que é JSON válido (python3 -c "import json;d=json.load(open('${QD}/${nivel}-${lote}.json'));print(len(d['questoes']))"). Retorne o resumo.`

const REV1 = (nivel, lote) => `${BASE}
Você é um INSTRUTOR DE VELA E NAVEGAÇÃO CÉTICO (Capitão-Amador e Yachtmaster Ocean) revisando o lote ${QD}/${nivel}-${lote}.json. Sua missão é achar ERROS TÉCNICOS: resposta marcada errada, afirmação falsa no enunciado ou na explicação, número/regra/artigo errado, cálculo errado (refaça TODOS os cálculos), referência que não diz aquilo (abra a fonte: NORMAM no acervo local ${ROOT}/research/acervo/, RIPEAM, Miguens), terminologia errada, fato regulatório que não está "confirmado" em research/claims_verified.json, figura SVG que contradiz o texto (leia o SVG). Corrija o que puder; descarte (com motivo) o que não tiver conserto. Não seja condescendente: na dúvida sobre correção técnica, corrija ou descarte.
SAÍDA: escreva ${QD}/${nivel}-${lote}.rev1.json como {"questoes": [...questões finais...], "log": [{"idx": i, "acao": "ok|corrigida|descartada", "motivo": "…"}]} e valide o JSON. Retorne o resumo.`

const REV2 = (nivel, lote) => `${BASE}
Você é um REVISOR PEDAGÓGICO E DE CLAREZA, independente do revisor anterior, lendo ${QD}/${nivel}-${lote}.rev1.json. Verifique em cada questão: há exatamente uma resposta defensável (tente argumentar por cada distrator — se algum também puder ser certo, reescreva)? O enunciado é claro, sem dupla negação, sem pegadinha injusta? Distratores plausíveis e sem pistas (a correta não é sempre a mais longa — verifique a distribuição de comprimentos e de posições corretas; equilibre)? A explicação ensina (diz por que cada errada está errada)? Referência presente e específica? PT-BR correto? Tema exatamente um dos temas válidos do nível? Duplicatas ou quase-duplicatas no lote → mantenha a melhor. Também refaça os cálculos uma última vez.
SAÍDA: escreva ${QD}/${nivel}-${lote}.rev2.json como {"questoes": [...], "log": [...]} e valide o JSON. Retorne o resumo.`

const RET = { type: 'object', properties: { arquivo: { type: 'string' }, total: { type: 'number' }, descartadas: { type: 'number' }, corrigidas: { type: 'number' }, por_tema: { type: 'object', additionalProperties: { type: 'number' } }, notas: { type: 'string' } }, required: ['arquivo', 'total', 'notas'] }

const LOTES = __LOTES__

phase('Geração')
const res = await pipeline(
  LOTES,
  L => agent(GEN(L.nivel, L.lote, L.n, L.temas, L.extra || ''), { label: `gen:${L.nivel}-${L.lote}`, phase: 'Geração', schema: RET }),
  (g, L) => g ? agent(REV1(L.nivel, L.lote), { label: `rev1:${L.nivel}-${L.lote}`, phase: 'Revisão técnica', schema: RET }) : null,
  (r1, L) => r1 ? agent(REV2(L.nivel, L.lote), { label: `rev2:${L.nivel}-${L.lote}`, phase: 'Revisão de clareza', schema: RET }).then(r2 => ({ lote: `${L.nivel}-${L.lote}`, rev1: r1 && { total: r1.total, desc: r1.descartadas, corr: r1.corrigidas }, rev2: r2 && { total: r2.total, desc: r2.descartadas, corr: r2.corrigidas, notas: (r2.notas || '').slice(0, 300) } })) : null,
)
return res
