---
titulo: "Agent Anomaly Detection, now in Private Preview on the Gemini Enterprise Agent Platform"
fonte: google-developers
url: https://developers.googleblog.com/agent-anomaly-detection-now-in-private-preview-on-the-gemini-enterprise-agent-platform/
data_publicacao: 
coletado_em: 2026-10-15T01:07:51.740Z
topicos: ["google"]
---
# Agent Anomaly Detection, now in Private Preview on the Gemini Enterprise Agent Platform

Agent Anomaly Detection is a new, out-of-band oversight layer for the Gemini Enterprise Agent Platform that analyzes OpenTelemetry traces and tool calls to catch behavioral risks without adding runtime latency to live requests. It utilizes a multi-tiered detection pipeline—combining lightweight statistical scanning with deep LLM-based reasoning—to identify logical anomalies and policy violations grounded in the OWASP Agentic Top 10. Developers can triage these automated findings within Security Command Center or leverage the exposed API to programmatically block subsequent tool calls when an agent breaches defined risk thresholds.
