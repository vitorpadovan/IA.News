// Marca uma notícia coletada como publicada em dados/publicadas.json.
// Uso: node scripts/marcar-publicada.mjs <url-da-noticia | caminho-do-md> [url-do-post]
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const [alvo, post = ''] = process.argv.slice(2);
if (!alvo) { console.error('Uso: node scripts/marcar-publicada.mjs <url | caminho.md> [url-do-post]'); process.exit(1); }

const coletadas = JSON.parse(await readFile(join(raiz, 'dados', 'coletadas.json'), 'utf8'));
const arqPub = join(raiz, 'dados', 'publicadas.json');
const publicadas = JSON.parse(await readFile(arqPub, 'utf8'));

const alvoNorm = alvo.replaceAll(String.fromCharCode(92), '/');
const url = coletadas[alvo] ? alvo : Object.keys(coletadas).find((u) => coletadas[u].arquivo === alvoNorm);
if (!url) { console.error('Notícia não encontrada em dados/coletadas.json'); process.exit(1); }

publicadas[url] = { ...coletadas[url], publicadoEm: new Date().toISOString(), post };
await writeFile(arqPub, JSON.stringify(publicadas, null, 2) + '\n', 'utf8');
console.log(`Marcada como publicada: ${coletadas[url].titulo}`);
