---
description: Cura as notícias coletadas e gera rascunhos de posts de Instagram (legenda, hashtags e carrossel)
argument-hint: "[AAAA-MM-DD] [quantidade, padrão 10] [todos]"
---

Faça a curadoria das notícias coletadas e gere rascunhos de posts para o Instagram.

Argumentos: `$ARGUMENTS` (data da coleta, padrão = hoje; quantidade de finalistas, padrão 10, entre 3 e 10; a palavra
`todos` gera o rascunho de todas as finalistas sem esperar a escolha do usuário).

## 1. Candidatas

1. Liste os `.md` de `noticias/<data>/` (todas as subpastas). Cada arquivo tem cabeçalho YAML (`titulo`, `fonte`, `url`,
   `data_publicacao`, `topicos`).
2. Descarte as URLs que já estão em `dados/publicadas.json`.
3. Descarte também o que já virou rascunho em `posts/` (procure a `url` nos arquivos de lá).
4. Se a pasta do dia não existir ou ficar vazia, avise e sugira rodar `node scripts/coletar.mjs`. Não rode sozinho.

## 2. Finalistas (até 10 itens)

Critérios, em ordem:
- **Relevância** para os tópicos do projeto (claude-code, chatgpt, claude, codex, anthropic, openai, gemini, deepseek,
  inteligência artificial) e impacto real: lançamento, mudança de preço/política, pesquisa relevante.
- **Frescor**: prefira o que foi publicado nas últimas 48 h.
- **Fonte**: prefira fonte primária/oficial (blog da empresa, release) a texto que só a comenta. Se várias notícias falam
  do mesmo fato, escolha uma só, a de fonte mais próxima da origem.
- **Variedade**: não repita a mesma empresa em todos os posts.
- **Público brasileiro**: dê preferência a algo que faça sentido para quem lê em pt-BR.

Descarte conteúdo promocional, tutorial genérico de baixa qualidade e itens sem informação (só título).
Fontes com só snippet (Medium, Hacker News): leia o artigo original antes de usar. Se não conseguir ler, **não invente
detalhes**; use só o que está confirmado.

## 3. Escolha do usuário

Apresente as finalistas numeradas (tabela: nº, título, fonte, data, uma linha dizendo por que entrou) e **pare**
esperando o usuário indicar quais virarão post (ex.: "1, 3, 7"). Só pule essa pausa se `todos` foi passado.

## 4. Rascunho de cada post escolhido

Grave em `posts/<data>/NN-<slug>.md` (NN = ordem de prioridade), em português, com este cabeçalho:

```
---
titulo: "<título interno>"
status: rascunho
noticia: <caminho do .md em noticias/>
url: <url da notícia original>
fontes: ["<url principal>", "<outras fontes usadas>"]
---
```

Corpo:
- **Gancho** (1 linha que prende a atenção).
- **Legenda**: até ~1.500 caracteres, parágrafos curtos, tom informativo, sem exagero; termina com a fonte
  ("Fonte: <veículo>") e uma pergunta ou chamada leve.
- **Hashtags**: 8 a 12, relevantes (misture amplas e específicas).
- **Carrossel**: capa + 4 a 6 slides, cada um com título curto e no máximo ~25 palavras, e um slide final com a fonte.
- **Texto alternativo** da imagem de capa.

Regras de conteúdo: não afirme nada que não esteja na fonte; mantenha números, datas e nomes exatamente como na fonte;
marque `[CONFIRMAR]` onde houver dúvida.

## 5. Fechamento

Mostre ao usuário uma tabela com os posts gerados (título, fonte, por que foi escolhido) e as notícias descartadas mais
relevantes com o motivo. **Não publique nem marque como publicada.** Depois da aprovação do usuário, a marcação é feita com
`node scripts/marcar-publicada.mjs <url|md> [url-do-post]`.
