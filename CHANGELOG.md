# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] — 2026-06-02

### Added
- **Real LLM wiring** — `src/lib/llm/client.ts` uses GPT-4o with structured JSON output
- `src/lib/llm/schemas.ts` — Zod schemas for call analysis, rep scoring, follow-ups, benchmarks
- `src/lib/llm/prompts.ts` — Structured prompts with system + user messages
- `analyzeSingleCall()`, `draftFollowUp()`, `scoreRep()`, `getBenchmarks()` — LLM-powered with demo fallback
- **Webhook ingest endpoints** — `src/app/api/webhooks/gong/`, `fathom/`, `fireflies/`
- `src/app/api/webhooks/verify.ts` — Shared webhook secret verification
- Webhook secrets in `.env.example` (`GONG_WEBHOOK_SECRET`, `FATHOM_WEBHOOK_SECRET`, `FIREFLIES_WEBHOOK_SECRET`)

### Changed
- `src/lib/agent/analyzer.ts` — Now attempts real LLM analysis when `OPENAI_API_KEY` is set
- `src/app/api/analyze/call/[id]/route.ts` — Returns LLM-enriched analysis
- `src/app/api/followups/draft/route.ts` — Uses LLM when configured
- `src/app/api/benchmarks/route.ts` — Uses LLM when configured
- `README.md` — Roadmap items checked off
- `AGENTS.md` — Updated architecture and roadmap

## [1.1.0] — 2026-06-02

### Added
- **n8n integration orchestrator** — All CRM/call/email integrations proxy through n8n workflows
- `src/lib/n8n/client.ts` — Typed webhook client with demo fallback
- `n8n/workflows/` — 9 pre-built workflow templates (Salesforce, HubSpot, Gong, Slack, Gmail, Calendar)
- Missing REST endpoints: `/api/analyze/call/[id]`, `/api/pipeline/update`, `/api/followups/draft`, `/api/benchmarks`
- **Hermes Agent cron skills** — Daily briefs, weekly coaching, hourly pipeline sync
- `docker-compose.yml` — Full stack with PostgreSQL + n8n + app
- `Makefile` — Common dev commands (`make dev`, `make test`, `make docker-up`)
- `src/app/api/health/route.ts` — Health check endpoint
- `src/lib/env.ts` — Runtime environment validation with Zod
- `prisma/seed.ts` — Database seeding with demo data
- `.prettierrc` — Code formatting config
- `ARCHITECTURE.md` — Architecture Decision Records (ADRs)
- `QUICKSTART.md` — 60-second and 5-minute quick starts
- `llms.txt` + `.well-known/llms.txt` — LLM-friendly repo context
- **Agent skills** for Claude/Codex/Hermes, Kimi, and Opencode
- Integration ecosystem docs including CalendarFuel

### Changed
- `tsconfig.json` — Excludes `n8n/` and nested agentic-* repos from typecheck
- `README.md` — Updated architecture diagram, integrations table, recommended tools
- `AGENTS.md` — Universal agent index with n8n architecture
- `.cursorrules` — n8n + Hermes conventions
- `.env.example` — Added `N8N_WEBHOOK_URL` and `N8N_API_KEY`

## [1.0.0] — 2026-06-01

### Added
- MCP stdio server with 4 tools: `analyze_call`, `update_pipeline`, `draft_followup`, `get_benchmarks`
- Next.js 15 observability dashboard (9 views)
- Zero-config demo mode with rich mock data
- Type-safe CRM clients: Salesforce (OAuth2 + SOQL), HubSpot (private app), Gong (pagination), Slack (Block Kit)
- In-memory TTL cache with typed error hierarchy
- SSE streaming analysis pipeline
- n8n custom node package
- MCP registry metadata: `server.json`, `smithery.yaml`, `glama.json`
- GitHub Actions CI (lint, typecheck, test with coverage)
- Multi-stage Dockerfile
- `.cursorrules`, `CONTRIBUTING.md`, `QUICK_TEST_QUERIES.md`, `TROUBLESHOOTING.md`
