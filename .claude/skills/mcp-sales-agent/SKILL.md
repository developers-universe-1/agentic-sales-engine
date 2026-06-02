---
name: mcp-sales-agent
description: "Use when building, extending, or debugging an MCP-native sales intelligence server with CRM integrations, call analysis, pipeline automation, or rep coaching."
version: "1.0.0"
author: "developers-universe-1"
license: "MIT"
metadata:
  hermes:
    tags:
      - mcp
      - model-context-protocol
      - sales
      - crm
      - salesforce
      - hubspot
      - gong
      - nextjs
      - typescript
      - ai-agent
    related_skills:
      - mcp-server-setup
      - github-repo-management
      - salesforce-api
      - docker-deploy
---

# MCP Sales Agent

## Overview

An MCP-native sales intelligence framework built on Next.js 15 + TypeScript. It exposes sales tools (call analysis, pipeline updates, follow-up drafting, benchmarks) as typed MCP tools that any MCP host (Claude, Cursor, Copilot, Kimi) can discover and invoke. Ships with rich mock data so the full dashboard works without API keys.

## When to Use

- Setting up an MCP server for sales / GTM automation
- Adding a new CRM integration (Salesforce, HubSpot) or call recorder (Gong)
- Wiring pipeline stage transitions to call content
- Building rep coaching scorecards with talk-time ratios
- Extending the demo data set or adding new dashboard views
- Dockerizing or deploying the observability dashboard

## When NOT to Use

- Don't use for general-purpose CRM ETL — this is MCP-tool-first, not batch-sync
- Don't use if you need real-time call streaming ingest — webhooks are roadmap only

## Quick Start

```bash
# 1. Install
cd agentic-sales-engine
npm install

# 2. Zero-config demo mode
cp .env.example .env
npm run dev

# 3. Open dashboard
open http://localhost:3000

# 4. Run MCP server (stdio transport)
npx ts-node src/mcp/server.ts
```

## Architecture

```
src/
├── mcp/server.ts           # MCP stdio server entry point
├── app/api/                # REST + SSE endpoints
├── lib/
│   ├── agent/              # AI analysis engine (streaming, scoring)
│   ├── integrations/       # CRM clients (Salesforce, HubSpot, Gong, Slack)
│   ├── demo/               # Rich mock data for zero-config demo
│   └── cache.ts            # In-memory TTL cache
├── components/             # Reusable UI components
└── prisma/schema.prisma    # PostgreSQL schema
```

## MCP Tool Reference

| Tool | Input Schema | What It Returns |
|---|---|---|
| `analyze_call` | `{ call_id: string }` | Sentiment, objections, talk ratios, stage inference |
| `update_pipeline` | `{ deal_id: string, stage: enum, reason?: string }` | Updated deal with previous → new stage |
| `draft_followup` | `{ call_id: string, tone?: enum }` | Post-call email subject + body |
| `get_benchmarks` | `{ segment: string }` | Win rate, show rate, cycle length vs. industry |

**Add a new tool:**
1. Append to `TOOLS` array in `src/mcp/server.ts`
2. Add handler branch in `handleToolCall()`
3. Delegate business logic to `src/lib/` — never put logic in the server
4. Return `{ content: [{ type: "text", text: JSON.stringify(result) }], isError: false }`
5. Add a Jest test

## Integration Wiring

| Integration | File | Auth Pattern |
|---|---|---|
| Salesforce | `src/lib/integrations/salesforce.ts` | OAuth2 refresh flow + SOQL |
| HubSpot | `src/lib/integrations/hubspot.ts` | Private app token + Search API |
| Gong | `src/lib/integrations/gong.ts` | Pagination-aware call + transcript client |
| Slack | `src/lib/integrations/slack.ts` | Webhook URL + Block Kit formatting |

All integrations use Zod validation, typed error hierarchies (`src/lib/errors.ts`), and graceful fallbacks to demo mode when env vars are missing.

## Testing

```bash
npm test                 # Jest — cache, streaming, errors, clustering
npm run typecheck        # tsc --noEmit
npm run lint             # ESLint
```

## Common Pitfalls

1. **Forgetting demo mode.** All tools must work when `SALESFORCE_URL`, `HUBSPOT_TOKEN`, etc. are empty. Check `src/lib/demo/` before adding real API calls.
2. **Putting logic in `server.ts`.** The MCP server is a thin transport layer. Business logic belongs in `src/lib/agent/` or `src/lib/integrations/`.
3. **Missing Zod validation.** Every tool input must be validated before use. See existing handlers for the pattern.
4. **No test for new tools.** Every new MCP tool needs at minimum a unit test in `src/mcp/__tests__/` or `src/lib/__tests__/`.
5. **Skipping `npm run typecheck`.** TypeScript strict mode is enforced in CI.

## Verification Checklist

- [ ] `npm install` completes without audit failures
- [ ] `npm run dev` starts and dashboard loads at `localhost:3000`
- [ ] `npm test` passes
- [ ] `npm run typecheck` passes
- [ ] New tool appears in `tools/list` response from `src/mcp/server.ts`
- [ ] New tool works in demo mode without API keys
- [ ] Integration client has typed error handling
- [ ] `.cursorrules` updated if code style changed

## One-Shot Recipes

**Add a Salesforce SOQL query tool:**
```bash
# 1. Edit src/mcp/server.ts — add TOOLS entry + handler branch
# 2. Edit src/lib/integrations/salesforce.ts — add query function
# 3. Add test in src/lib/integrations/__tests__/salesforce.test.ts
# 4. npm test && npm run typecheck
```

**Docker deploy:**
```bash
docker build -t mcp-sales-agent .
docker run -p 3000:3000 mcp-sales-agent
```
