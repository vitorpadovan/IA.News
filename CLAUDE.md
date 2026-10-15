# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Visão geral

Repositório de pesquisa/curadoria, **sem build ou testes** (apenas scripts Node sem dependências). Objetivo: manter uma conta de Instagram
publicando diariamente notícias sobre IA. O [README.md](README.md) lista as fontes (sites, canais do YouTube, RSS) e os
tópicos de interesse (claude-code, chat-gpt, claude, codex, anthropic, inteligencia-artificial, artificial-intelligence).
O trabalho aqui é coletar e filtrar notícias dessas fontes (seção abaixo), não desenvolver software.

## Estrutura

- `scripts/coletar.mjs`: lê `config/fontes.json` (feed/segmentos/palavras-chave do TecMundo, tags do Medium) e grava
  `noticias/AAAA-MM-DD/<fonte>/<titulo>.md` com cabeçalho YAML. Controle de duplicatas em `dados/coletadas.json`.
  Ao final faz `git add`/`commit`/`push` **apenas** dos arquivos que alterou; `--sem-git` desativa.
- `config/fontes.json` → `feeds[]`: feeds RSS/Atom genéricos (`nome`, `url`, `limite`, `topicos`); cada um vira uma pasta
  `noticias/<data>/<nome>/`. Atom (GitHub releases) vem com HTML escapado; o script trata. O feed da Anthropic é
  **não oficial** (comunidade, `Olshansk/rss-feeds`); DeepSeek só tem releases no GitHub e Google News (link `news.google.com`).
- Feeds com `"filtrar": true` (Tecnoblog, Olhar Digital, Simon Willison, Google Developers) só gravam itens que casam com
  `tecmundo.palavrasChave`. Os feeds do `hnrss.org` (pasta `hackernews`) dão 502 com frequência; o erro é isolado por feed.
- `.claude/commands/noticias-do-dia.md`: slash command `/noticias-do-dia [data] [qtd]`. Seleciona até 10 finalistas de
  `noticias/<data>/` (ignorando `dados/publicadas.json` e o que já virou rascunho), espera o usuário escolher e grava
  `posts/<data>/NN-<slug>.md` (legenda, hashtags, carrossel). Nunca publica nem marca como publicada.
- `scripts/marcar-publicada.mjs`: registra publicação em `dados/publicadas.json`.
- Comandos: `node scripts/coletar.mjs`, `node scripts/marcar-publicada.mjs <url|md> [url-do-post]`.

- `.mcp.json` + `scripts\playwright-mcp.cmd`: sobem o `@playwright/mcp` em modo `--extension`; o script carrega as
  variáveis do `.env` da raiz (ignorado pelo git) antes de iniciar. Sem `.env`, o script falha.
- `.playwright-mcp/`: logs e snapshots gerados pelo MCP (ignorado pelo git).

## MCP

- `.mcp.json` configura o MCP `playwright` via `scripts\playwright-mcp.cmd`.
- O navegador do MCP usa um perfil já logado no Medium (conta Vitor Padovan).

## TecMundo (preferida)

- Feed: `https://rss.tecmundo.com.br/feed` — 50 itens, ordem cronológica, **texto completo** em `content:encoded`.
- O feed **ignora** qualquer filtro (`?q=`, `?s=`, `/feed/<slug>`). Filtrar **localmente** pelo segmento da URL do artigo
  (`/tecmundo/inteligencia-artificial/`, `/tecmundo/big-techs/` etc.) e por palavras-chave no título/corpo.
- Feeds do Estadão por seção (`.../arc/outboundfeeds/feeds/rss/sections/tecmundo/<slug>/`) **não filtram**: devolvem
  sempre os mesmos 20 itens, com `?body=`, `?query=` ou `?size=`. Não usar.
- `tecmundo.com.br/rss` retorna 204 e `estadao.com.br/tecmundo/feed/` retorna 404.

## Medium

- Feed por tag: `https://medium.com/feed/tag/<tag>` — 10 itens, ordem cronológica, só snippet (sem texto completo).
- O RSS lista artigos para assinantes junto com os públicos e **não indica** quais são pagos.
- `/tag/<tag>/latest` redireciona para `/tag/<tag>` (ordem por relevância/personalizada) — preferir o RSS.
- Para texto completo ou checar paywall, abrir o link no Playwright (sessão logada).

## Google News RSS (complemento)

- Busca real: `https://news.google.com/rss/search?q=site:estadao.com.br/tecmundo+<termo>&hl=pt-BR&gl=BR&ceid=BR:pt-419` (até 100 itens).
- `<link>` e `<description>` apontam para `news.google.com/rss/articles/...`, **não** para o artigo original;
  `<source url>` traz só o domínio do veículo.
- `curl`/`fetch` não seguem o redirecionamento (feito por JavaScript). Resolver só com Playwright:
  `page.goto(url, {waitUntil: 'commit'})` + `waitForURL(u => !u.includes('news.google.com'))`.
  Custou ~7 s por item (100 itens ≈ 12 min); possível risco de rate limit.

## Decisão

Coletar o feed do TecMundo e filtrar localmente por tópico; Medium via feed por tag; Google News só para
achar matérias fora do TecMundo.

## Regra: descobrir novas fontes

Sempre que uma notícia (arquivos em `noticias/`) indicar que se baseia em, cita ou linka uma fonte — "segundo", "de acordo
com", "baseado em", "according to", "via", "source:", ou qualquer link de atribuição solto no texto —, adicione essa fonte
ao projeto, mesmo que seja um link isolado:

1. Conferir se já existe em `config/fontes.json` ou na seção "Fontes" do [README.md](README.md).
2. Procurar um feed RSS/Atom do site/repositório citado e **validar pelo conteúdo** (itens presentes), não só pelo status
   HTTP: vários sites devolvem 200 com página de "não encontrado".
3. Com feed válido: incluir em `feeds[]` (com `limite` e `topicos`) e listar no README. Sem feed: só listar no README,
   anotando que não há RSS.
4. Não adicionar apenas o que não é fonte de conteúdo: redes sociais pessoais, páginas de login/cadastro, links de
   afiliado e fontes já coletadas.
