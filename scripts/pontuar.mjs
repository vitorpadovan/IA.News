// Pontua as notícias coletadas e gera posts/<data>/ranking.md com duas listas (geral e técnica).
// Uso: node scripts/pontuar.mjs [AAAA-MM-DD] [tamanho-da-lista, padrão 20]
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const hojeDir = (await readdir(join(raiz, 'noticias'))).sort().at(-1);
const data = process.argv[2] ?? hojeDir;
const TAM = Number(process.argv[3] ?? 20);
const LIMIAR_TEC = 40;

const norm = (s) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

// Autoridade da fonte (0-15): oficial > imprensa/análise > agregador.
const FONTE = {
  anthropic: 15, openai: 15, 'google-gemini': 15, 'google-ia': 13, 'google-developers': 14,
  'claude-code': 14, codex: 12, 'gemini-cli': 12, 'deepseek-github': 12,
  techcrunch: 10, theverge: 10, arstechnica: 10, 'mit-technology-review': 10, tecmundo: 10, canaltech: 10,
  olhardigital: 9, tecnoblog: 9, simonwillison: 10, 'latent-space': 10, 'import-ai': 10,
  hackernews: 7, 'deepseek-googlenews': 5, medium: 3,
};
const FONTE_TECNICA = new Set(['simonwillison', 'latent-space', 'import-ai', 'google-developers', 'claude-code', 'codex', 'gemini-cli', 'hackernews']);
const FEEDS_RELEASE = new Set(['claude-code', 'codex', 'gemini-cli']);
const RELEASE_INSTAVEL = /alpha|nightly|preview|beta|-rc|pre-release/i;

// Tópicos do projeto (README): peso maior se aparece no título.
const TOPICOS = ['claude', 'anthropic', 'openai', 'chatgpt', 'gpt', 'gemini', 'deepseek', 'codex', 'copilot', 'llm',
  'inteligencia artificial', 'ia', 'ai', 'agente', 'agentes', 'agent', 'agents', 'modelo', 'model'];
const TECNICAS = ['api', 'sdk', 'benchmark', 'inference', 'inferencia', 'token', 'tokens', 'context', 'contexto', 'mcp',
  'open weight', 'open-weight', 'gpu', 'tpu', 'training', 'treinamento', 'post-training', 'architecture', 'arquitetura',
  'git', 'source control', 'python', 'codebase', 'code', 'codigo', 'harness', 'evaluation', 'avaliacao', 'latency',
  'latencia', 'workflow', 'workflows', 'orchestration', 'orquestracao', 'rag', 'fine-tuning', 'edge', 'quantization',
  'prompt', 'prompts', 'transformer', 'embedding', 'embeddings', 'retrieval', 'recuperacao', 'autonomous', 'compiler'];
const RUIDO = /oferta|promocao|mercado livre|\boff\b|% off|review|disrupt|cupom|desconto|save \d+%|melhor preco|ingresso|ticket/i;
const LANCAMENTO = /launch|introduc|announc|releas|unveil|lanca|anuncia|apresenta|now available|rolling out|comes to|v?\d+\.\d+/i;
const RISCO = /arrest|preso|prende|sue[sd]?|lawsuit|processa|hack|breach|vazamento|invad|ban(s|ned)?|proib|warn|alert|advert|multa|fine/i;
const MICROPOST = /^(quoting|llm-|web-edit|ttok|hello python|python \d)|0\.\d+(a|b)?\d*$/i;
const SEMANTICA_NEGOCIO = /\braises?\b|valuation|rodada|aporte|financiamento|demite|layoff|fatura|ipo\b/i;

const re = (lista) => lista.map((t) => new RegExp(`(^|[^a-z0-9])${t.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}($|[^a-z0-9])`));
const reTop = re(TOPICOS), reTec = re(TECNICAS);

// Carrega notícias.
const itens = [];
for (const fonte of await readdir(join(raiz, 'noticias', data))) {
  for (const arq of await readdir(join(raiz, 'noticias', data, fonte))) {
    const t = await readFile(join(raiz, 'noticias', data, fonte, arq), 'utf8');
    const campo = (k) => (t.match(new RegExp(`^${k}: (.*)$`, 'm')) ?? [])[1] ?? '';
    const corpo = t.split(/^---\s*$/m).slice(2).join('\n');
    const titulo = JSON.parse(campo('titulo') || '""');
    itens.push({
      fonte, arquivo: `noticias/${data}/${fonte}/${arq}`, titulo, url: campo('url'),
      data: campo('data_publicacao') ? new Date(campo('data_publicacao')) : null,
      corpo: corpo.replace(/\[Continue reading on Medium[^\n]*/g, '').trim(),
    });
  }
}

// Releases: só a estável mais recente de cada feed; o resto é ruído.
const ultimaEstavel = {};
for (const i of itens.filter((x) => FEEDS_RELEASE.has(x.fonte) && !RELEASE_INSTAVEL.test(x.titulo) && x.data)) {
  if (!ultimaEstavel[i.fonte] || i.data > ultimaEstavel[i.fonte].data) ultimaEstavel[i.fonte] = i;
}
const ref0 = Math.max(...itens.filter((i) => i.data).map((i) => +i.data));
const base = itens.filter((i) => (!FEEDS_RELEASE.has(i.fonte) || ultimaEstavel[i.fonte] === i) && (!i.data || (ref0 - i.data) / 36e5 <= 168));

const ref = new Date(Math.max(...itens.filter((i) => i.data).map((i) => +i.data)));

// Agrupa o mesmo fato em várias fontes (similaridade de palavras do título).
const STOP = new Set('the and for with from that this have will your you are not but can has was how what why who now new para com uma que dos das como mais por nao sua seu sobre apos ate entre pelo pela sao foi ser tem ter into over after about says say said'.split(' '));
const tokens = (s) => new Set(norm(s).split(/[^a-z0-9]+/).filter((w) => w.length >= 4 && !STOP.has(w)));
const jaccard = (a, b) => { let c = 0; for (const x of a) if (b.has(x)) c++; return c / (a.size + b.size - c || 1); };
base.forEach((i) => { i.tok = tokens(i.titulo); i.grupo = i; });
for (let a = 0; a < base.length; a++) for (let b = a + 1; b < base.length; b++) {
  const comuns = [...base[a].tok].filter((x) => base[b].tok.has(x)).length;
  if (comuns >= 2 && jaccard(base[a].tok, base[b].tok) >= 0.4) base[b].grupo = base[a].grupo.grupo ?? base[a].grupo;
}
// Agrupamentos manuais do mesmo fato (config/mesmo-fato.json): trechos de título, sem acento, em minúsculas.
const manuais = JSON.parse(await readFile(join(raiz, 'config', 'mesmo-fato.json'), 'utf8'));
for (const trechos of manuais) {
  const membros = base.filter((i) => trechos.some((t) => norm(i.titulo).includes(t)));
  for (const m of membros) m.grupo = membros[0].grupo;
}
const cobertura = new Map();
for (const i of base) {
  if (!cobertura.has(i.grupo)) cobertura.set(i.grupo, new Set());
  cobertura.get(i.grupo).add(i.fonte);
}

// Pontuação (0-100) e índice técnico (0-100).
for (const i of base) {
  const t = norm(i.titulo), c = norm(i.corpo.slice(0, 1500));
  const horas = i.data ? (ref - i.data) / 36e5 : null;
  const frescor = horas === null ? 10 : Math.max(0, Math.round(30 - horas * 0.3));
  const noTitulo = reTop.some((r) => r.test(t)), noCorpo = reTop.some((r) => r.test(c));
  const topico = noTitulo ? 25 : noCorpo ? 12 : 0;
  const n = cobertura.get(i.grupo).size;
  const cob = n >= 3 ? 20 : n === 2 ? 10 : 0;
  const fonte = FONTE[i.fonte] ?? 5;
  const len = i.corpo.length;
  const subst = len > 1500 ? 10 : len > 600 ? 6 : 2;
  const sinal = Math.min(10, (LANCAMENTO.test(i.titulo) ? 6 : 0) + (RISCO.test(i.titulo) ? 5 : 0) + (/[$€]|R\$|\d+ ?(bi|mi|milh|bilh|million|billion)/i.test(i.titulo) ? 3 : 0));
  let pen = 0;
  if (MICROPOST.test(i.titulo.trim())) pen -= 25;
  if (RUIDO.test(i.titulo)) pen -= 40;
  if (!noTitulo && !noCorpo) pen -= 20;
  i.pontos = Math.max(0, Math.min(100, Math.round(((frescor + topico + cob + fonte + subst + sinal) / 110) * 100) + pen));
  i.detalhe = { frescor, topico, cobertura: cob, fonte, substancia: subst, sinal, penalidade: pen };
  i.semData = horas === null;
  const hitsT = reTec.filter((r) => r.test(t)).length * 2;
  const hitsC = reTec.filter((r) => r.test(c)).length;
  i.tec = Math.min(100, (hitsT + hitsC) * 12 + (FONTE_TECNICA.has(i.fonte) ? 25 : 0) - (SEMANTICA_NEGOCIO.test(i.titulo) ? 25 : 0));
  i.apoio = [...cobertura.get(i.grupo)].filter((f) => f !== i.fonte);
}

// Um representante por grupo (maior pontuação, desempate por autoridade da fonte).
const reps = new Map();
for (const i of base) {
  const r = reps.get(i.grupo);
  if (!r || i.pontos > r.pontos || (i.pontos === r.pontos && (FONTE[i.fonte] ?? 0) > (FONTE[r.fonte] ?? 0))) reps.set(i.grupo, i);
}
const ranking = [...reps.values()].sort((a, b) => b.pontos - a.pontos);
const tecnicas = ranking.filter((i) => i.tec >= LIMIAR_TEC);
const gerais = ranking.filter((i) => i.tec < LIMIAR_TEC);
// Diversidade: no máximo N itens por fonte em cada lista.
const limitar = (lista, max) => {
  const cont = {};
  return lista.filter((i) => (cont[i.fonte] = (cont[i.fonte] ?? 0) + 1) <= max).slice(0, TAM);
};
const listaGeral = limitar(gerais, 5);
let listaTec = limitar(tecnicas, 4);
if (listaTec.length < TAM) {
  // Complemento: itens com algum viés técnico (25+) que ficaram de fora das duas listas.
  const usados = new Set([...listaGeral, ...listaTec]);
  const extra = ranking.filter((i) => !usados.has(i) && i.tec >= 25).sort((x, y) => y.tec - x.tec || y.pontos - x.pontos);
  listaTec = [...listaTec, ...extra].slice(0, TAM).sort((x, y) => y.pontos - x.pontos);
}

const linha = (i, n) => `| ${n} | **${i.pontos}** | ${i.tec} | ${i.titulo.replaceAll('|', '/')} | ${i.fonte}${i.apoio.length ? ` (+${i.apoio.join(', ')})` : ''} | ${i.data ? i.data.toISOString().slice(5, 10) : 'sem data'} | \`${i.arquivo}\` |`;
const d = (i) => Object.entries(i.detalhe).map(([k, v]) => `${k} ${v}`).join(' · ');
const tabela = (lista) => ['| # | Pontos | Téc. | Título | Fonte (apoio) | Data | Arquivo |', '|---|---|---|---|---|---|---|', ...lista.map((i, k) => linha(i, k + 1))].join('\n');
const md = `# Ranking ${data}

Gerado por \`node scripts/pontuar.mjs\`. Pontos (0–100) = frescor (0–30) + tópico (0–25) + cobertura em várias fontes (0–20)
+ autoridade da fonte (0–15) + substância do texto (0–10) + sinal de lançamento/risco (0–10), normalizado para 100, − penalidades (ruído/promoção −40, fora do tema −20).
"Téc." (0–100) mede o nível técnico; ≥ ${LIMIAR_TEC} vai para a lista técnica. Data de referência: ${ref.toISOString()}.

## Geral (${listaGeral.length})

${tabela(listaGeral)}

## Técnica (${listaTec.length})

${tabela(listaTec)}

## Detalhe da pontuação

${[...listaGeral.map((i) => ['G', i]), ...listaTec.map((i) => ['T', i])].map(([l, i]) => `- [${l}] ${i.pontos}: ${i.titulo} — ${d(i)}${i.semData ? ' (SEM DATA)' : ''}`).join('\n')}
`;
await mkdir(join(raiz, 'posts', data), { recursive: true });
await writeFile(join(raiz, 'posts', data, 'ranking.md'), md, 'utf8');
console.log(`${itens.length} notícias, ${ranking.length} fatos distintos, ${tecnicas.length} técnicos / ${gerais.length} gerais`);
console.log(`posts/${data}/ranking.md`);
