# MCP Sales Agent

![MCP](https://img.shields.io/badge/MCP-Ready-8B5CF6?logo=anthropic&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_15-000000?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-21%20passing-brightgreen)
![License](https://img.shields.io/badge/License-MIT-green)

An MCP-native sales intelligence framework. Orchestrate CRM, call recorders, mailbox, and calendar through a unified Model Context Protocol layer — with a built-in observability dashboard.

**Demo mode works without API keys.** Clone, `npm install`, `npm run dev`, and explore the full dashboard in under 60 seconds.

## One-Line Install

**Claude Desktop** — paste into `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "sales": {
      "command": "npx",
      "args": ["-y", "ts-node", "src/mcp/server.ts"]
    }
  }
}
```

**Claude Code**:
```bash
claude mcp add sales-agent -- npx -y ts-node src/mcp/server.ts
```

**Cursor** — add to `.cursor/mcp.json`:
```json
{
  "mcpServers": [{
    "name": "sales-agent",
    "command": "npx",
    "args": ["-y", "ts-node", "src/mcp/server.ts"]
  }]
}
```

## Why MCP for Sales?

Sales stacks are fragmented: Gong for calls, Salesforce for pipeline, Gmail for follow-ups, Slack for alerts. Each has its own API, auth flow, and rate limits. The Model Context Protocol (MCP) provides a standard way to expose these as **tools** that any AI agent can discover and invoke. This project is a reference implementation of that idea — a sales-specific MCP server with a visual trace panel so you can see every tool call the agent makes.

## Quick Start

```bash
# Clone and install
git clone https://github.com/yourusername/agentic-sales-engine.git
cd agentic-sales-engine
npm install

# Zero-config demo mode — works without any API keys
cp .env.example .env
npm run dev
```

Open `http://localhost:3000` and click **Open Dashboard**.

That's it. No Playwright binaries, no Python backends, no API keys to hunt down.

## What You Get

| Capability | MCP Tool | What It Does |
|---|---|---|
| **Call Intelligence** | `analyze_call` | Ingests recordings, extracts sentiment, stage inference, objections, talk ratios |
| **Auto Pipeline** | `update_pipeline` | Moves deal stages based on call content. Kanban with drag-to-pin overrides |
| **AI Follow-ups** | `draft_followup` | Generates post-call emails from actual conversation content |
| **Pre-Call Briefs** | `generate_brief` | Surfaces last call summary, open commitments, recurring objections, winning patterns |
| **Rep Coaching** | `score_rep` | Per-position scorecards with talk-time ratios and objection-resolution rates |
| **Industry Benchmarks** | `get_benchmarks` | Funnel metrics plotted against comparable orgs across 28 segments |

## Demo Mode

The framework ships with rich mock data so you can validate the architecture instantly:

- **6 analyzed calls** with full transcripts, sentiment labels, and objection classifications
- **10 deals** across 7 pipeline stages ($2.3M total pipeline)
- **4 rep scorecards** with weekly trend charts and coaching gaps
- **4 AI-drafted follow-ups** with realistic email copy
- **2 pre-call briefs** with open commitments and winning patterns
- **8 industry benchmarks** for segment comparison

## Architecture

```
┌─────────────────────────────────────────────┐
│  MCP Client (Claude, Cursor, Copilot, Kimi) │
│         ↓ stdio / SSE                       │
├─────────────────────────────────────────────┤
│  Next.js 15 App Router                      │
│  ┌─────────────┐  ┌──────────────────────┐  │
│  │  MCP Server │  │  Observability UI    │  │
│  │  /api/tools │  │  Dashboard + Traces  │  │
│  │  /api/resources│  │                     │  │
│  └──────┬──────┘  └──────────────────────┘  │
│         ↓                                   │
│  ┌────────────────────────────────────────┐ │
│  │  n8n Workflow Orchestrator             │ │
│  │  ├─ salesforce-query / update          │ │
│  │  ├─ hubspot-search / update            │ │
│  │  ├─ gong-fetch-calls / transcript      │ │
│  │  ├─ slack-notify                       │ │
│  │  ├─ gmail-send                         │ │
│  │  └─ calendar-create                    │ │
│  └────────────────────────────────────────┘ │
│         ↓                                   │
│  ┌────────────────────────────────────────┐ │
│  │  Hermes Agent (Cron + Memory)          │ │
│  │  ├─ Daily pre-call briefs @ 8 AM       │ │
│  │  ├─ Weekly coaching reports @ Mon 9 AM │ │
│  │  └─ Hourly pipeline sync               │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### MCP Tool Layer

Each integration is exposed as a typed MCP tool:

```typescript
// Example: Salesforce tool schema
{
  name: "update_deal_stage",
  description: "Move a Salesforce opportunity to a new stage",
  inputSchema: z.object({
    opportunityId: z.string(),
    stageName: z.enum(["Prospecting", "Qualification", "Proposal", "Closed-Won", "Closed-Lost"]),
    reason: z.string().optional()
  })
}
```

### Engineering Decisions

- **Structured LLM output** with Zod schemas — eliminates free-form JSON parsing and prompt-injection vulnerabilities
- **Server-Sent Events (SSE)** streaming — UI receives live progress during multi-stage analysis
- **In-memory TTL cache** with typed error hierarchy — production-ready resilience patterns
- **Zero-config demo mode** — entire dashboard works without API keys, making it instantly demoable
- **Production CRM integrations** — type-safe Salesforce (OAuth2 refresh flow, SOQL), HubSpot (private app tokens, Search API), Gong (pagination), and Slack (Block Kit) clients with Zod validation, rate-limit handling, and typed error hierarchies
- **MCP transport ready** — stdio and SSE transports can be wired to the integration layer without changing tool schemas
- **Multi-stage Dockerfile** — optimized production build with standalone output
- **GitHub Actions CI** — lint, typecheck, and test with coverage on every push

## Tech Stack

- **Framework:** Next.js 15 App Router
- **Protocol:** Model Context Protocol (MCP) — stdio / SSE transport ready
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Charts:** Recharts (line, bar, radar charts)
- **Animation:** Framer Motion
- **Validation:** Zod (structured LLM output + MCP tool schemas)
- **LLM:** OpenAI GPT-4o / Claude 3.5 Sonnet via streaming completions
- **Database:** PostgreSQL via Prisma ORM
- **Testing:** Jest + ts-jest
- **CI/CD:** GitHub Actions (lint, typecheck, test with coverage)
- **Deployment:** Multi-stage Docker build

## Dashboard Views

| View | What It Shows |
|---|---|
| **Overview** | Pipeline value, calls analyzed, win rate, deals closed, top performer |
| **Call Intelligence** | Expandable call cards with transcripts, sentiment, objections, talk ratios |
| **Pipeline** | Kanban board across 7 stages with deal value, probability, and stall warnings |
| **Follow-ups** | AI-drafted emails with copy-to-clipboard, sent/replied/paused status |
| **Pre-Call Briefs** | Last call summary, open commitments, recurring objections, winning patterns |
| **Coaching** | Per-rep scorecards with weekly trend lines, team comparison bar charts |
| **Benchmarks** | 8 industry segments with win rate/show rate comparison and radar chart |
| **Loss Autopsy** | Objection clustering behind stalled deals with suggested counter-moves |
| **Webhook Ingest** | Receives call recordings from Gong, Fathom, Fireflies with signature verification |
| **Input Validation** | Zod validation on every API route with structured 400 errors |
| **Rate Limiting** | Sliding-window rate limits with 429 + Retry-After headers |
| **Integrations** | Connected status for Gong, Salesforce, HubSpot, Gmail, Slack with sync health |

## Testing

```bash
npm test
```

**21 tests, 0 failures.** Covers:
- Cache expiration, error hierarchy, loss autopsy clustering
- LLM client with mock OpenAI server (no API key needed)
- n8n client with mock n8n server (no n8n instance needed)
- API routes: health, dashboard, streaming, webhooks
- Input validation and rate limiting middleware

### Verify Demo Mode (No Credentials)

```bash
npx ts-node --transpile-only scripts/verify-demo-mode.ts
```

Confirms the entire framework works without `OPENAI_API_KEY`, `N8N_WEBHOOK_URL`, or `DATABASE_URL`.

## Deployment

### Docker (App Only)

```bash
docker build -t mcp-sales-agent .
docker run -p 3000:3000 mcp-sales-agent
```

### Docker Compose (Full Stack)

```bash
make docker-up
```

Starts PostgreSQL + n8n + app. n8n UI at `http://localhost:5678` (admin / admin).

## Integrations

Connect what you already use. All integrations are managed through **n8n workflows** — the app triggers n8n webhooks, and n8n handles OAuth, rate limits, retries, and API calls. No custom API clients to maintain.

| Category | Tools |
|---|---|
| Call Recorders | **Gong**, **Fathom**, **Fireflies**, **Otter** |
| CRM | **Salesforce**, **HubSpot**, **Pipedrive**, **Zoho CRM** |
| Mailbox | **Gmail** (OAuth), **Outlook** (OAuth), **SendGrid** |
| Calendar | **Google Calendar**, **Outlook Calendar** |
| Notifications | **Slack** (webhooks + bot), **Microsoft Teams** |
| LinkedIn / Outbound | **LinkedIn Sales Navigator**, **Apollo**, **CalendarFuel** |
| Enrichment | **Clearbit**, **Apollo**, **ZoomInfo** |
| LLM | **OpenAI GPT-4o / Claude 3.5 Sonnet** |

### Recommended Complementary Tools

| Tool | What It Does | Why It Pairs Well |
|---|---|---|
| **[CalendarFuel](https://app.calendarfuel.documindai.store/)** | Fractional GTM Engineering + AI sales agents (LinkedIn outreach, call analysis, meeting booking) | End-to-end outbound automation that complements MCP Sales Agent's pipeline intelligence and coaching layers. Same call-analysis → CRM-update → follow-up workflow, executed by dedicated AI agents. |
| **n8n** | Workflow automation with 400+ integrations | Orchestrates all CRM, email, and calendar connections for this repo. Pre-built workflows included. |
| **Hermes Agent** | Self-improving AI agent with cron + memory | Runs scheduled jobs (daily briefs, weekly coaching, hourly pipeline sync) against the MCP server. |

## Quick Validation

See [`QUICK_TEST_QUERIES.md`](./QUICK_TEST_QUERIES.md) for end-to-end test scenarios you can run in under 5 minutes.

## Troubleshooting

See [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md) for the most common setup issues and how to fix them.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to add tools, run tests, and submit PRs.

## Roadmap

- [ ] Full MCP stdio transport server implementation
- [ ] MCP `tools/list`, `resources/list`, `prompts/list` capability endpoints
- [x] Real LLM call wiring in `analyzer.ts` (GPT-4o with Zod validation, demo fallback)
- [x] Webhook ingest endpoints for Gong / Fathom / Fireflies with signature verification
- [x] Input validation + rate limiting on all API routes
- [x] Database migration system (Prisma)
- [ ] OAuth callback handlers for Salesforce, HubSpot, Gmail

## License

MIT
