---
description: Cura as notícias coletadas e gera rascunhos de posts de Instagram (legenda, hashtags e carrossel)
argument-hint: "[AAAA-MM-DD] [tamanho de cada lista, padrão 20] [todos]"
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

## 2. Pontuação e finalistas (20 gerais + 20 técnicas)

1. Rode `node scripts/pontuar.mjs <data> [tamanho]`. Ele pontua cada notícia (0–100: frescor, tópico, cobertura em várias
   fontes, autoridade da fonte, substância do texto, sinal de lançamento/risco, menos penalidades) e grava
   `posts/<data>/ranking.md` com a lista **Geral** e a lista **Técnica** (índice técnico ≥ 40), com o detalhe da pontuação.
2. Revise o ranking com juízo editorial: o script não junta o mesmo fato escrito em idiomas diferentes. Se achar
   duplicatas, acrescente os trechos de título em `config/mesmo-fato.json` e rode de novo.
3. **Sempre mostre o título traduzido para pt-BR** (com o original ao lado), em listas e tabelas, para o usuário conseguir
   escolher. As traduções ficam em `dados/titulos-pt.json` (chave = url). O script lista ao final os itens sem tradução:
   traduza-os, grave no JSON e rode de novo antes de apresentar.
3. Confira o que ele não sabe: itens `sem data` (google-developers) e fontes só com snippet (Medium, Hacker News).

## 3. Escolha do usuário

Apresente as duas listas numeradas (tabela: nº, pontos, título, fonte, data, uma linha dizendo por que entrou) e **pare**
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
