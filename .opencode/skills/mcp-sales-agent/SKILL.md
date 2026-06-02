---
name: mcp-sales-agent
description: "MCP-native sales intelligence framework with CRM integrations, call analysis, and pipeline automation."
version: "1.0.0"
author: "developers-universe-1"
license: "MIT"
tags:
  - mcp
  - sales
  - crm
  - nextjs
  - typescript
---

# MCP Sales Agent

## Overview

A Model Context Protocol (MCP) server for sales teams. Built with Next.js 15 + TypeScript. Exposes sales tools as discoverable MCP tools that AI agents can invoke. Includes an observability dashboard and zero-config demo mode.

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev        # Dashboard at http://localhost:3000
npx ts-node src/mcp/server.ts   # MCP stdio server
```

## Architecture

- `src/mcp/server.ts` — MCP stdio transport and tool registry
- `src/app/api/` — REST + SSE endpoints
- `src/lib/integrations/` — Salesforce, HubSpot, Gong, Slack clients
- `src/lib/agent/` — Analysis engine with streaming
- `src/lib/demo/` — Mock data for zero-config demo

## MCP Tools

| Tool | Description |
|---|---|
| `analyze_call` | Extract sentiment, objections, talk ratios from call recordings |
| `update_pipeline` | Move deals between pipeline stages |
| `draft_followup` | Generate post-call emails |
| `get_benchmarks` | Compare metrics against industry benchmarks |

## Adding a Tool

1. Add schema to `TOOLS` in `src/mcp/server.ts`
2. Add handler in `handleToolCall()`
3. Implement logic in `src/lib/` (not in server file)
4. Return `{ content: [{ type: "text", text: JSON.stringify(result) }], isError: false }`
5. Add test
6. Run `npm test && npm run typecheck`

## Key Conventions

- TypeScript strict mode
- Zod for all runtime validation
- Demo mode must work without API keys
- Typed error hierarchy in `src/lib/errors.ts`
- Tailwind + Framer Motion for UI
- Jest for testing

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm test` | Run tests |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run build` | Production build |
| `docker build -t mcp-sales-agent .` | Docker image |
