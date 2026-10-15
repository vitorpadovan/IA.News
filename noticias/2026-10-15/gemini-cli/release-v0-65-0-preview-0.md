---
titulo: "Release v0.65.0-preview.0"
fonte: gemini-cli
url: https://github.com/google-gemini/gemini-cli/releases/tag/v0.65.0-preview.0
data_publicacao: 2026-10-13T20:27:55.000Z
coletado_em: 2026-10-15T01:07:50.804Z
topicos: ["gemini","google"]
---
# Release v0.65.0-preview.0

## What's Changed

- fix(cli): enforce read-only workspace settings in untrusted folders by [@jvargassanchez-dot](https://github.com/jvargassanchez-dot) in [#29583](https://github.com/google-gemini/gemini-cli/pull/29583)

- fix(core): avoid duplicate tool response turns when resuming sessions by [@diegogodinezr](https://github.com/diegogodinezr) in [#29618](https://github.com/google-gemini/gemini-cli/pull/29618)

- fix(core): prevent deletion of resumed session history on quick exit ([#29198](https://github.com/google-gemini/gemini-cli/issues/29198)) by [@villahernandez-coder](https://github.com/villahernandez-coder) in [#29584](https://github.com/google-gemini/gemini-cli/pull/29584)

- Changelog for v0.64.0-preview.0 by [@gemini-cli-robot](https://github.com/gemini-cli-robot) in [#29656](https://github.com/google-gemini/gemini-cli/pull/29656)

- Changelog for v0.63.0 by [@gemini-cli-robot](https://github.com/gemini-cli-robot) in [#29659](https://github.com/google-gemini/gemini-cli/pull/29659)

- fix(core): align OAuth callback iss parameter validation with RFC 9207 metadata by [@luisfelipe-alt](https://github.com/luisfelipe-alt) in [#29616](https://github.com/google-gemini/gemini-cli/pull/29616)

- fix(cli): prevent unnecessary terminal clears and scroll resets when expanding with Ctrl+O by [@jesussamuel-byte](https://github.com/jesussamuel-byte) in [#29640](https://github.com/google-gemini/gemini-cli/pull/29640)

- chore(release): bump version to 0.65.0-nightly.20261006.gfb972b2f8 by [@gemini-cli-robot](https://github.com/gemini-cli-robot) in [#29657](https://github.com/google-gemini/gemini-cli/pull/29657)

- fix(ci): add missing loop in unassign-inactive-assignees workflow by [@ugorla-dev](https://github.com/ugorla-dev) in [#29609](https://github.com/google-gemini/gemini-cli/pull/29609)

- fix(core): enforce terminal user turn invariant and normalize request contents by [@luisfelipe-alt](https://github.com/luisfelipe-alt) in [#29612](https://github.com/google-gemini/gemini-cli/pull/29612)

- feat(telemetry): support custom OTLP headers in telemetry configuration by [@jesussamuel-byte](https://github.com/jesussamuel-byte) in [#29641](https://github.com/google-gemini/gemini-cli/pull/29641)

- fix(auth): prevent infinite verification and OAuth retry loops by [@villahernandez-coder](https://github.com/villahernandez-coder) in [#29655](https://github.com/google-gemini/gemini-cli/pull/29655)

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

- fix(cli): keep loading other extensions when one fails the allowlist check by [@jesussamuel-byte](https://github.com/jesussamuel-byte) in [#29720](https://github.com/google-gemini/gemini-cli/pull/29720)

- fix(cli): correct reverse search highlight index for expanding unicode characters by [@diegogodinezr](https://github.com/diegogodinezr) in [#29699](https://github.com/google-gemini/gemini-cli/pull/29699)

- fix(core): treat whitespace-only UTF-16 and UTF-32 files as empty by [@jesussamuel-byte](https://github.com/jesussamuel-byte) in [#29722](https://github.com/google-gemini/gemini-cli/pull/29722)

- fix(cli): restore debounced static UI refresh on terminal width changes by [@jvargassanchez-dot](https://github.com/jvargassanchez-dot) in [#29644](https://github.com/google-gemini/gemini-cli/pull/29644)

- fix(cli): prevent session poisoning on rapid Ctrl-C interruption by [@villahernandez-coder](https://github.com/villahernandez-coder) in [#29728](https://github.com/google-gemini/gemini-cli/pull/29728)

Full Changelog: [v0.64.0-preview.1...v0.65.0-preview.0](https://github.com/google-gemini/gemini-cli/compare/v0.64.0-preview.1...v0.65.0-preview.0)
