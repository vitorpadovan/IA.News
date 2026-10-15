# AI News

Repositório responsável por pesquisa, estudos e notícias de IA.

## Objetivo

Manter atualizada uma conta do Instagram, publicando diariamente notícias sobre IA.

## Fluxo

1. `node scripts/coletar.mjs` — baixa as fontes configuradas em [config/fontes.json](config/fontes.json), filtra por
   tópico e grava **um `.md` por notícia** (com cabeçalho YAML) em `noticias/AAAA-MM-DD/<fonte>/<titulo>.md`.
   URLs já coletadas ficam em `dados/coletadas.json` e não são gravadas de novo.
2. Curadoria e geração do post (legenda, hashtags, carrossel).
3. `node scripts/marcar-publicada.mjs <url | caminho.md> [url-do-post]` — registra em `dados/publicadas.json`.

Requer Node 18+ e não tem dependências. O `.env` (modelo em `.env.example`) só é usado pelo Playwright MCP.

## Fontes

### Sites

- https://code.claude.com/docs/en/whats-new
- https://www.estadao.com.br/tecmundo/

### YouTube

- https://www.youtube.com/@codigofontetv
- https://www.youtube.com/@anwarhermuche
- https://www.youtube.com/@attekitadev
- https://www.youtube.com/@RenatoAsse

### RSS

- https://rss.tecmundo.com.br/feed
- https://medium.com/feed/tag/artificial-intelligence

## Tópicos

- claude-code
- chat-gpt
- claude
- codex
- anthropic
- inteligencia-artificial
- artificial-intelligence
