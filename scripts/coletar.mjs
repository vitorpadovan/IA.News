// Coleta notícias (TecMundo + Medium), grava um .md por notícia e atualiza dados/coletadas.json.
// Uso: node scripts/coletar.mjs
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const cfg = JSON.parse(await readFile(join(raiz, 'config', 'fontes.json'), 'utf8'));
const arqColetadas = join(raiz, 'dados', 'coletadas.json');
const coletadas = JSON.parse(await readFile(arqColetadas, 'utf8'));
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
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => ({
    titulo: decodificar(tag(m[1], 'title')),
    url: tag(m[1], 'link'),
    data: tag(m[1], 'pubDate'),
    categorias: [...m[1].matchAll(/<category[^>]*>([\s\S]*?)<\/category>/g)].map((c) =>
      decodificar(c[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim())),
    html: tag(m[1], 'content:encoded') || tag(m[1], 'description'),
  }));
}
function htmlParaMd(html) {
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
  const arquivo = join(pasta, `${slug(n.titulo)}.md`);
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
await writeFile(arqColetadas, JSON.stringify(coletadas, null, 2) + '\n', 'utf8');
console.log(`${novas} notícia(s) nova(s) em noticias/${hoje}/`);
