@echo off
rem Carrega as variaveis do .env (raiz do repo) e inicia o Playwright MCP em modo extensao.
for /f "usebackq eol=# tokens=1,* delims==" %%A in ("%~dp0..\.env") do set "%%A=%%B"
npx -y @playwright/mcp@latest --extension
