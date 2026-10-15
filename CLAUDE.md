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
