---
titulo: "ttok 1.0"
fonte: simonwillison
url: https://simonwillison.net/2026/Oct/9/ttok/
data_publicacao: 2026-10-09T00:34:43.000Z
coletado_em: 2026-10-15T01:07:48.748Z
topicos: []
---
# ttok 1.0

Release: [ttok 1.0](https://github.com/simonw/ttok/releases/tag/1.0)

        I released [ttok 0.4](https://simonwillison.net/2026/Oct/8/ttok/), ran uv tool upgrade ttok, piped a file into the new version... and realized that it was defaulting to the GPT-4 tokenizer when it should very clearly default to GPT-5/GPT-6 instead!

I figured switching the default was a reasonable excuse to finally ship a 1.0.

OpenAI haven't actually confirmed that GPT-6 uses the same tokenizer as the GPT-5 family yet - there's an [angry issue about it](https://github.com/openai/tiktoken/issues/608) - but I found [this commit](https://github.com/williamliu-ai/token-count-compare/commit/8d8a2178538bb37beb548fc37378135e4ff4b0c8) by William Liu which reports on an experiment he ran confirming that the tokenizers are likely the same:

All seven GPT models (5.5, 5.6 Sol/Terra/Luna, 6 Astra/Sol/Luna) report 44,794 tokens and match each other on every one of the 31 fixtures. GPT-6 introduces no input-count change on this corpus.

    
    
        Tags: [projects](https://simonwillison.net/tags/projects), [ai](https://simonwillison.net/tags/ai), [openai](https://simonwillison.net/tags/openai), [generative-ai](https://simonwillison.net/tags/generative-ai), [llms](https://simonwillison.net/tags/llms), [tokenization](https://simonwillison.net/tags/tokenization)
