// Coleta notícias (TecMundo + Medium), grava um .md por notícia e atualiza dados/coletadas.json.
// Uso: node scripts/coletar.mjs [--sem-git]
// Por padrão, faz commit só do que o script alterou (novos .md + dados/coletadas.json) e dá push.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const cfg = JSON.parse(await readFile(join(raiz, 'config', 'fontes.json'), 'utf8'));
const arqColetadas = join(raiz, 'dados', 'coletadas.json');
const coletadas = JSON.parse(await readFile(arqColetadas, 'utf8'));
const semGit = process.argv.includes('--sem-git');
const alterados = [];
const usados = new Set();
const hoje = new Date().toISOString().slice(0, 10);

const norm = (s) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
const slug = (s) => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'sem-titulo';
const entidades = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ', '&apos;': "'" };
const decodificar = (s) => s.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&[a-z#0-9]+;/gi, (e) => entidades[e] ?? e);
const aspas = (s) => JSON.stringify(s ?? '');

function tag(bloco, nome) {
  const m = bloco.match(new RegExp(`<${nome}[^>]*>([\\s\\S]*?)</${nome}>`, 'i'));
  return m ? m[1].replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, '$1').trim() : '';
}
function itens(xml) {
  // Suporta RSS (<item>) e Atom (<entry>).
  return [...xml.matchAll(/<(item|entry)[ >]([\s\S]*?)<\/\1>/g)].map(([, tipo, b]) => ({
    titulo: decodificar(tag(b, 'title').replace(/<[^>]+>/g, '')),
    url: tipo === 'item' ? tag(b, 'link') : (b.match(/<link[^>]*href="([^"]+)"/) ?? [])[1] ?? '',
    data: tag(b, 'pubDate') || tag(b, 'published') || tag(b, 'updated'),
    categorias: [...b.matchAll(/<category[^>]*>([\s\S]*?)<\/category>/g)].map((c) =>
      decodificar(c[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim())),
    html: tag(b, 'content:encoded') || tag(b, 'content') || tag(b, 'description') || tag(b, 'summary'),
  }));
}
function htmlParaMd(html) {
  if (!html.includes('<') && html.includes('&lt;')) html = decodificar(html); // Atom entrega HTML escapado
  return decodificar(
    html
      .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<figure[\s\S]*?<\/figure>/gi, '')
      .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, n, t) => `\n\n${'#'.repeat(+n)} ${t}\n\n`)
      .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
      .replace(/<li[^>]*>/gi, '\n- ')
      .replace(/<\/(p|div|ul|ol|blockquote)>|<br\s*\/?>/gi, '\n\n')
      .replace(/<[^>]+>/g, ''),
  ).replace(/\n{3,}/g, '\n\n').trim();
}
async function baixar(url) {
  const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 IA.News' } });
  if (!r.ok) throw new Error(`${url} -> HTTP ${r.status}`);
  return r.text();
}
async function gravar(fonte, n, topicos) {
  if (!n.url || coletadas[n.url]) return false;
  const pasta = join('noticias', hoje, fonte);
  let arquivo = join(pasta, `${slug(n.titulo)}.md`);
  for (let i = 2; usados.has(arquivo); i++) arquivo = join(pasta, `${slug(n.titulo)}-${i}.md`);
  usados.add(arquivo);
  const cab = [
    '---',
    `titulo: ${aspas(n.titulo)}`,
    `fonte: ${fonte}`,
    `url: ${n.url}`,
    `data_publicacao: ${n.data ? new Date(n.data).toISOString() : ''}`,
    `coletado_em: ${new Date().toISOString()}`,
    `topicos: ${JSON.stringify(topicos)}`,
    '---',
    '',
  ].join('\n');
  await mkdir(join(raiz, pasta), { recursive: true });
  await writeFile(join(raiz, arquivo), `${cab}# ${n.titulo}\n\n${htmlParaMd(n.html)}\n`, 'utf8');
  alterados.push(arquivo.replaceAll(String.fromCharCode(92), '/'));
  coletadas[n.url] = { arquivo: arquivo.replaceAll('\\', '/'), titulo: n.titulo, fonte, coletadoEm: new Date().toISOString() };
  return true;
}

let novas = 0;
// TecMundo: feed ignora filtros, então filtra localmente por segmento da URL e palavras-chave.
const tm = cfg.tecmundo;
const regexes = tm.palavrasChave.map((k) => new RegExp(`\\b${norm(k)}\\b`));
for (const n of itens(await baixar(tm.feed))) {
  const seg = tm.segmentosUrl.find((s) => n.url.includes(s));
  const texto = norm(`${n.titulo} ${n.html}`);
  const achadas = tm.palavrasChave.filter((_, i) => regexes[i].test(texto));
  if (!seg && !achadas.length) continue;
  if (await gravar('tecmundo', n, [...new Set([...(seg ? [seg.split('/').filter(Boolean).pop()] : []), ...achadas])])) novas++;
}
// Medium: um feed por tag (só snippet; checar paywall exige Playwright logado).
for (const t of cfg.medium.tags) {
  try {
    for (const n of itens(await baixar(`https://medium.com/feed/tag/${t}`))) {
      n.url = n.url.split('?')[0];
      if (await gravar('medium', n, [...new Set([t, ...n.categorias])])) novas++;
    }
  } catch (e) { console.error(`medium/${t}: ${e.message}`); }
}
// Feeds genéricos (RSS/Atom): um por entrada em cfg.feeds, limitados aos N mais recentes.
for (const f of cfg.feeds ?? []) {
  try {
    // `filtrar: true` aplica as palavras-chave do TecMundo (feeds gerais, como Tecnoblog).
    const lista = itens(await baixar(f.url))
      .filter((n) => !f.filtrar || regexes.some((r) => r.test(norm(`${n.titulo} ${n.html}`))))
      .sort((x, y) => new Date(y.data || 0) - new Date(x.data || 0))
      .slice(0, f.limite ?? 15);
    for (const n of lista) if (await gravar(f.nome, n, f.topicos ?? [])) novas++;
  } catch (e) { console.error(`${f.nome}: ${e.message}`); }
}
await writeFile(arqColetadas, JSON.stringify(coletadas, null, 2) + '\n', 'utf8');
console.log(`${novas} notícia(s) nova(s) em noticias/${hoje}/`);
if (novas && !semGit) {
  const git = (...args) => execFileSync('git', args, { cwd: raiz, stdio: 'inherit' });
  const arquivos = [...alterados, 'dados/coletadas.json'];
  git('add', '--', ...arquivos);
  // `-- <paths>` limita o commit a estes arquivos, ignorando o que mais estiver no índice.
  git('commit', '-m', `Coleta de notícias ${hoje}: ${novas} nova(s)`, '--', ...arquivos);
  try { git('push'); } catch { console.error('Commit feito, mas o push falhou. Rode `git push` manualmente.'); }
}
