---
titulo: "web-edit 0.1a0"
fonte: simonwillison
url: https://simonwillison.net/2026/Oct/12/web-edit/
data_publicacao: 2026-10-12T15:54:36.000Z
coletado_em: 2026-10-15T01:07:48.742Z
topicos: []
---
# web-edit 0.1a0

Release: [web-edit 0.1a0](https://github.com/simonw/web-edit/releases/tag/0.1a0)

        I was working on a project from my phone using Codex Remote when I found myself wanting to edit a credentials file without round-tripping those credentials through the LLM itself.

So... I had Codex and GPT-6 Astra Extra High build this Python web app which provides a web UI for viewing and editing files in a folder. It's intended to be run over Tailscale, so I can have an agent start this running and then edit files via my Tailscale network directly from my phone.

Here's the interface for browsing files in a folder:

Editing uses [CodeMirror 6](https://codemirror.net) - I was going to use [Monaco](https://microsoft.github.io/monaco-editor/) but that still doesn't have a great mobile experience yet.

    
    
        Tags: [projects](https://simonwillison.net/tags/projects), [python](https://simonwillison.net/tags/python), [ai](https://simonwillison.net/tags/ai), [tailscale](https://simonwillison.net/tags/tailscale), [generative-ai](https://simonwillison.net/tags/generative-ai), [llms](https://simonwillison.net/tags/llms), [codex](https://simonwillison.net/tags/codex)
