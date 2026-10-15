---
titulo: "Turn your REST APIs into MCP tools with Google Cloud API Gateway"
fonte: google-developers
url: https://developers.googleblog.com/turn-your-rest-apis-into-mcp-tools-with-google-cloud-api-gateway/
data_publicacao: 
coletado_em: 2026-10-15T01:07:51.737Z
topicos: ["google"]
---
# Turn your REST APIs into MCP tools with Google Cloud API Gateway

Google Cloud API Gateway now acts as a native remote Model Context Protocol (MCP) server, eliminating the need to build and maintain custom middleware to expose REST APIs to AI agents. By simply adding specific annotations (like x-google-api-management.mcp) to existing OpenAPI 3.x specifications, developers can instantly convert standard REST operations into discoverable, agent-ready tools. The gateway automatically transcodes incoming MCP JSON-RPC requests into REST calls, ensuring that your existing authentication, quotas, and logging policies apply seamlessly to agent traffic without requiring new infrastructure.
