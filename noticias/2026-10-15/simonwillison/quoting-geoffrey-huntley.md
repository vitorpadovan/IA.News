---
titulo: "Quoting Geoffrey Huntley"
fonte: simonwillison
url: https://simonwillison.net/2026/Oct/13/geoffrey-huntley/
data_publicacao: 2026-10-13T13:32:00.000Z
coletado_em: 2026-10-15T01:07:48.736Z
topicos: []
---
# Quoting Geoffrey Huntley

If the agent isn't using my diagnostics library, I could introspect and update AGENTS.md, but there's still a delta, and it'll drift. Instead, I write a pre-commit hook that checks the git diff for direct calls to observability modules that bypass my diagnostics module. Boom: fail the commit, inject a prompt telling the agent to use the diagnostics library. All of a sudden it's ten out of ten.

&mdash; [Geoffrey Huntley](https://ghuntley.com/agency/), nobody should type code by hand anymore. here's what's left.

    Tags: [coding-agents](https://simonwillison.net/tags/coding-agents), [generative-ai](https://simonwillison.net/tags/generative-ai), [git](https://simonwillison.net/tags/git), [agentic-engineering](https://simonwillison.net/tags/agentic-engineering), [ai](https://simonwillison.net/tags/ai), [geoffrey-huntley](https://simonwillison.net/tags/geoffrey-huntley), [llms](https://simonwillison.net/tags/llms)
