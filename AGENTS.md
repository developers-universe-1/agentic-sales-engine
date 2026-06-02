# Agent Guide — MCP Sales Agent

This file is optimized for AI agents (Claude Code, Codex, Kimi, Hermes, Opencode) that need to understand, build, or extend this repo.

## One-Line Summary

MCP-native sales intelligence framework. Next.js 15 + TypeScript. Exposes sales tools as typed MCP tools. Zero-config demo mode.

## Quick Commands

```bash
npm install              # Install
npm run dev              # Dev server + dashboard @ localhost:3000
npm test                 # Jest
npm run typecheck        # tsc --noEmit
npm run lint             # ESLint
npx ts-node src/mcp/server.ts   # MCP stdio server
```

## Where Things Live

| Concern | Path |
|---|---|
| MCP server / tool registry | `src/mcp/server.ts` |
| REST + SSE API | `src/app/api/` |
| Analysis engine | `src/lib/agent/` |
| CRM integrations | `src/lib/integrations/` |
| Demo mock data | `src/lib/demo/` |
| Typed errors | `src/lib/errors.ts` |
| Cache layer | `src/lib/cache.ts` |
| UI components | `src/components/` |
| Database schema | `prisma/schema.prisma` |

## MCP Tool Registry

Current tools (defined in `src/mcp/server.ts`):

- `analyze_call` — sentiment, objections, talk ratios, stage inference
- `update_pipeline` — move deal to new stage
- `draft_followup` — post-call email generation
- `get_benchmarks` — industry benchmark lookup

**To add a tool:**
1. Add `TOOLS` entry in `src/mcp/server.ts`
2. Add `handleToolCall()` branch
3. Implement in `src/lib/` — server is thin transport only
4. Return `{ content: [{ type: "text", text: JSON.stringify(result) }], isError: false }`
5. Add Jest test
6. Verify `npm test && npm run typecheck`

## Integration Patterns

All integrations (Salesforce, HubSpot, Gong, Slack) follow:
- Zod validation on request/response
- Typed error hierarchy (`src/lib/errors.ts`)
- Demo fallback when env vars empty
- Rate-limit handling with backoff

| Integration | File | Auth |
|---|---|---|
| Salesforce | `src/lib/integrations/salesforce.ts` | OAuth2 + SOQL |
| HubSpot | `src/lib/integrations/hubspot.ts` | Private app token |
| Gong | `src/lib/integrations/gong.ts` | Pagination-aware |
| Slack | `src/lib/integrations/slack.ts` | Webhook + Block Kit |

## Demo Mode Rule

**Every tool must work without API keys.** When env vars are missing, fall back to:
- `src/lib/demo/calls.ts`
- `src/lib/demo/deals.ts`
- `src/lib/demo/reps.ts`
- `src/lib/demo/followups.ts`
- `src/lib/demo/benchmarks.ts`
- `src/lib/demo/briefs.ts`

## Tech Stack

- Framework: Next.js 15 App Router
- Protocol: Model Context Protocol (MCP)
- Language: TypeScript (strict)
- Styling: Tailwind CSS
- Charts: Recharts
- Animation: Framer Motion
- Validation: Zod
- LLM: OpenAI GPT-4o / Claude 3.5 Sonnet
- Database: PostgreSQL via Prisma
- Testing: Jest + ts-jest
- CI: GitHub Actions

## Agent-Specific Skills

- **Claude Code / Codex / Hermes**: `.claude/skills/mcp-sales-agent/SKILL.md`
- **Kimi Code**: `.kimi/skills/mcp-sales-agent/SKILL.md`
- **Opencode**: `.opencode/skills/mcp-sales-agent/SKILL.md`

## Cursor Rules

See `.cursorrules` for code-style conventions specific to this MCP server.

## Common Tasks

**Add a new Salesforce SOQL query:**
```bash
# Edit src/lib/integrations/salesforce.ts
# Add test in src/lib/integrations/__tests__/salesforce.test.ts
npm test && npm run typecheck
```

**Add a dashboard view:**
```bash
# Create page in src/app/dashboard/<view>/page.tsx
# Add nav link in src/components/Sidebar.tsx
# Use src/components/ for shared UI
```

**Docker deploy:**
```bash
docker build -t mcp-sales-agent .
docker run -p 3000:3000 mcp-sales-agent
```

## Roadmap (Next Contributions)

- [ ] Full MCP stdio transport with `resources/list` and `prompts/list`
- [x] Real LLM wiring in `analyzer.ts` (GPT-4o with Zod validation, demo fallback)
- [x] Webhook ingest endpoints for Gong / Fathom / Fireflies with signature verification
- [x] Input validation + rate limiting on all API routes
- [x] Database migration system (Prisma)
- [ ] OAuth callback handlers for Salesforce, HubSpot, Gmail
- [ ] Hermes Agent auto-skill generation from repo commits
- [ ] CalendarFuel native integration workflow

## Top Integration Ecosystem

Tools that work well alongside MCP Sales Agent:

| Tool | Category | Why It Fits |
|---|---|---|
| **[CalendarFuel](https://app.calendarfuel.documindai.store/)** | Outbound AI Agent | Fractional GTM team + AI agents for LinkedIn, email, voice, call analysis, and meeting booking. Same pipeline → CRM → follow-up loop, run by dedicated agents. |
| **n8n** | Workflow Automation | Orchestrates all CRM, email, calendar connections. Pre-built workflows included in `n8n/workflows/`. |
| **Hermes Agent** | Autonomous AI Agent | Cron jobs, memory, and self-improving skills that interact with the MCP server. |
| **Apollo** | Lead Enrichment | Warm lead database + sequencing that feeds into the pipeline. |
| **Pipedrive** | CRM | Lightweight CRM alternative to Salesforce/HubSpot with great API. |
| **Fathom** | Call Recorder | AI-notetaker that generates transcripts for `analyze_call`. |
| **Fireflies** | Call Recorder | Meeting transcription with speaker diarization. |
