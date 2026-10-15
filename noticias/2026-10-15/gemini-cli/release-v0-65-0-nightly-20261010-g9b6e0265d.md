---
titulo: "Release v0.65.0-nightly.20261010.g9b6e0265d"
fonte: gemini-cli
url: https://github.com/google-gemini/gemini-cli/releases/tag/v0.65.0-nightly.20261010.g9b6e0265d
data_publicacao: 2026-10-10T01:38:44.000Z
coletado_em: 2026-10-15T01:07:50.807Z
topicos: ["gemini","google"]
---
# Release v0.65.0-nightly.20261010.g9b6e0265d

## What's Changed

- fix(cli): handle JSON parse and response stream errors in fetchJson by [@jesussamuel-byte](https://github.com/jesussamuel-byte) in [#29658](https://github.com/google-gemini/gemini-cli/pull/29658)

- fix(core): preserve line terminators in truncateString by [@diegogodinezr](https://github.com/diegogodinezr) in [#29673](https://github.com/google-gemini/gemini-cli/pull/29673)

- fix(vscode-ide-companion): make IdeServer.stop() resolve while MCP sessions are open by [@elberthc-byte](https://github.com/elberthc-byte) in [#29674](https://github.com/google-gemini/gemini-cli/pull/29674)

- fix(core): retain ask_user question text in the tool result display by [@elberthc-byte](https://github.com/elberthc-byte) in [#29677](https://github.com/google-gemini/gemini-cli/pull/29677)

- fix(core): eliminate false positives on untrusted command flags and compound loops by [@DavidAPierce](https://github.com/DavidAPierce) in [#29672](https://github.com/google-gemini/gemini-cli/pull/29672)

- fix(cli): clear cached credentials when re-selecting Google login by [@urielefrenvirtusa](https://github.com/urielefrenvirtusa) in [#29643](https://github.com/google-gemini/gemini-cli/pull/29643)

- fix(cli): resolve hang on Enter keypress in interactive mode ([#23297](https://github.com/google-gemini/gemini-cli/issues/23297)) by [@elberthc-byte](https://github.com/elberthc-byte) in [#29476](https://github.com/google-gemini/gemini-cli/pull/29476)

- perf(core): optimize ignore filtering and enable subtree pruning ([#29077](https://github.com/google-gemini/gemini-cli/issues/29077)) by [@amelidev](https://github.com/amelidev) in [#29582](https://github.com/google-gemini/gemini-cli/pull/29582)

- fix(a2a-server): isolate tool rejection to active call in sequential batches by [@jvargassanchez-dot](https://github.com/jvargassanchez-dot) in [#29683](https://github.com/google-gemini/gemini-cli/pull/29683)

- fix(cli): skip eager recursive file reading for @ references by [@jvargassanchez-dot](https://github.com/jvargassanchez-dot) in [#29617](https://github.com/google-gemini/gemini-cli/pull/29617)

Full Changelog: [v0.65.0-nightly.20261008.g44d764ee5...v0.65.0-nightly.20261010.g9b6e0265d](https://github.com/google-gemini/gemini-cli/compare/v0.65.0-nightly.20261008.g44d764ee5...v0.65.0-nightly.20261010.g9b6e0265d)
