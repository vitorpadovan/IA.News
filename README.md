# AI News

Repositório responsável por pesquisa, estudos e notícias de IA.

## Objetivo

Manter atualizada uma conta do Instagram, publicando diariamente notícias sobre IA.

## Fluxo

1. `node scripts/coletar.mjs` — baixa as fontes configuradas em [config/fontes.json](config/fontes.json), filtra por
   tópico e grava **um `.md` por notícia** (com cabeçalho YAML) em `noticias/AAAA-MM-DD/<fonte>/<titulo>.md`.
   URLs já coletadas ficam em `dados/coletadas.json` e não são gravadas de novo. Ao final, faz commit e push só do
   que o script alterou (use `--sem-git` para pular).
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
- https://openai.com/news/rss.xml
- https://blog.google/products/gemini/rss/ e https://blog.google/technology/ai/rss/
- https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_anthropic_news.xml (não oficial)
- https://github.com/anthropics/claude-code/releases.atom
- https://github.com/deepseek-ai/DeepSeek-V3/releases.atom e Google News (busca `deepseek`)
- https://github.com/openai/codex/releases.atom e https://github.com/google-gemini/gemini-cli/releases.atom
- Em português: Canaltech (IA), Tecnoblog, Olhar Digital
- Em inglês: TechCrunch, The Verge, Ars Technica, MIT Technology Review (IA), Simon Willison, Latent Space, Import AI,
  Google Developers Blog
- Hacker News via https://hnrss.org (busca por claude, openai, gemini, anthropic, deepseek; `points=50`)

## Tópicos

- claude-code
- chat-gpt
- claude
- codex
- anthropic
- inteligencia-artificial
- artificial-intelligence
