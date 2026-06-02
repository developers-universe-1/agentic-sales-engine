# MCP Sales Agent — Kimi Code Skill

## Overview

An MCP-native sales intelligence framework built on Next.js 15 + TypeScript. Exposes sales tools as typed MCP tools any MCP host can discover and invoke. Ships with zero-config demo mode — works without API keys.

## When to Use

- Building or extending an MCP server for sales / CRM automation
- Adding integrations (Salesforce, HubSpot, Gong, Slack)
- Creating new MCP tools for pipeline, coaching, or follow-ups
- Debugging demo-mode fallback logic
- Dockerizing or deploying the dashboard

## Project Structure

```
src/
├── mcp/server.ts           # MCP stdio server — add tools here
├── app/api/                # REST + SSE endpoints
├── lib/
│   ├── agent/              # Analysis engine (streaming, scoring)
│   ├── integrations/       # CRM clients with Zod + error handling
│   ├── demo/               # Mock data for zero-config demo
│   └── cache.ts            # In-memory TTL cache
├── components/             # UI components (Tailwind + Framer Motion)
└── prisma/schema.prisma    # PostgreSQL schema
```

## Quick Commands

| Command | Purpose |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start Next.js dev server + dashboard |
| `npm test` | Run Jest tests |
| `npm run typecheck` | TypeScript strict check |
| `npm run lint` | ESLint |
| `npx ts-node src/mcp/server.ts` | Run MCP stdio server |
| `docker build -t mcp-sales-agent .` | Build production image |

## MCP Tools

- `analyze_call` — sentiment, objections, talk ratios, stage inference
- `update_pipeline` — move deal stage (Prospecting → Closed-Won/Lost)
- `draft_followup` — generate post-call email (professional / friendly / urgent)
- `get_benchmarks` — industry benchmark comparison

## Adding a New MCP Tool

1. **Schema** — Add entry to `TOOLS` array in `src/mcp/server.ts`
2. **Handler** — Add branch in `handleToolCall()`
3. **Logic** — Implement in `src/lib/agent/` or `src/lib/integrations/` (not in server)
4. **Return format** — `{ content: [{ type: "text", text: JSON.stringify(result) }], isError: false }`
5. **Test** — Add Jest test in `src/lib/__tests__/` or `src/mcp/__tests__/`
6. **Verify** — `npm test && npm run typecheck`

## Integration Patterns

All CRM integrations follow the same pattern:
- **Zod validation** on every request/response
- **Typed errors** via `src/lib/errors.ts`
- **Demo fallback** when env vars are empty
- **Rate-limit handling** with exponential backoff

| Integration | File | Auth |
|---|---|---|
| Salesforce | `src/lib/integrations/salesforce.ts` | OAuth2 + SOQL |
| HubSpot | `src/lib/integrations/hubspot.ts` | Private app token |
| Gong | `src/lib/integrations/gong.ts` | Call + transcript pagination |
| Slack | `src/lib/integrations/slack.ts` | Webhook + Block Kit |

## Demo Mode Rules

Every tool must work without API keys. When env vars are missing, fall back to:
- `src/lib/demo/calls.ts` for call data
- `src/lib/demo/deals.ts` for pipeline data
- `src/lib/demo/reps.ts` for coaching data
- `src/lib/demo/followups.ts` for email drafts
- `src/lib/demo/benchmarks.ts` for industry benchmarks

## Testing Checklist

- [ ] `npm test` passes
- [ ] `npm run typecheck` passes
- [ ] New tool responds correctly to `tools/list`
- [ ] New tool works in demo mode (no env vars)
- [ ] Integration client handles errors gracefully
