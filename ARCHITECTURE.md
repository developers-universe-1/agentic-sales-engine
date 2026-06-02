# Architecture Decisions

## ADR-001: n8n as Integration Orchestrator

**Status:** Accepted

**Context:** The app needs to connect to Salesforce, HubSpot, Gong, Slack, Gmail, and calendar APIs. Building custom OAuth clients, refresh-token logic, rate-limit handling, and retry logic for each integration creates maintenance burden.

**Decision:** All integrations proxy through n8n workflows. The Next.js app triggers n8n webhooks; n8n handles auth, retries, pagination, and API calls.

**Consequences:**
- ✅ No OAuth refresh logic in the app
- ✅ Visual workflow debugging in n8n UI
- ✅ Swap CRMs by changing workflow, not app code
- ✅ n8n community has 400+ pre-built nodes
- ❌ Requires running n8n instance for live integrations
- ❌ Extra network hop (mitigated by caching)

**Fallback:** When `N8N_WEBHOOK_URL` is unset, all integrations fall back to demo mode using `src/lib/demo/` mock data.

---

## ADR-002: Hermes Agent for Cron Jobs

**Status:** Accepted

**Context:** The app needs scheduled jobs (daily briefs, weekly coaching, hourly pipeline sync). Building a cron system inside Next.js requires either a separate worker process or complex Vercel Cron setup.

**Decision:** Cron jobs are handled by Hermes Agent. Hermes loads repo-centric skills from `.claude/skills/mcp-sales-agent/cron/` and executes them on schedule.

**Consequences:**
- ✅ Agent can reason about job failures and retry with context
- ✅ Jobs are defined as skills — versioned in git
- ✅ No infra to maintain beyond the agent runtime
- ❌ Requires Hermes Agent deployment

---

## ADR-003: Zero-Config Demo Mode

**Status:** Accepted

**Context:** Open source projects die when the first `npm install` fails. Requiring API keys, database setup, or external services before seeing the dashboard kills contributor momentum.

**Decision:** The entire dashboard and all MCP tools work without any configuration. Mock data in `src/lib/demo/` provides realistic sales scenarios.

**Consequences:**
- ✅ Clone → install → dev in under 60 seconds
- ✅ Contributors can validate architecture instantly
- ✅ Demo data is rich enough for screenshots and pitches
- ❌ Need to ensure mock data stays realistic as features grow

---

## ADR-004: MCP stdio Transport First

**Status:** Accepted

**Context:** MCP supports stdio and SSE transports. SSE is easier for web dashboards; stdio is required for Claude Desktop, Cursor, and CLI tools.

**Decision:** Primary transport is stdio. SSE endpoints exist for the dashboard but the canonical integration is stdio.

**Consequences:**
- ✅ Works with Claude Desktop, Cursor, Copilot out of the box
- ✅ One-line install: `npx ts-node src/mcp/server.ts`
- ❌ Stdio is harder to debug than HTTP

---

## ADR-005: Input Validation + Rate Limiting

**Status:** Accepted

**Context:** API routes accepting untrusted input need validation and abuse protection. Without this, malformed payloads crash handlers and bad actors can overwhelm the service.

**Decision:** All API routes use Zod validation middleware (`src/lib/middleware/validate.ts`) and sliding-window rate limiting (`src/lib/middleware/rateLimit.ts`). Webhooks skip rate limits (external services need reliability) but validate signatures.

**Consequences:**
- ✅ Consistent 400 responses with field-level error details
- ✅ 429 responses with Retry-After headers
- ✅ No route handler sees untrusted input
- ❌ In-memory rate limiter doesn't work across multiple server instances (use Redis in production)

---

## ADR-006: Repo-Centric Agent Skills

**Status:** Accepted

**Context:** AI agents (Claude Code, Hermes, Codex) need to understand the repo to contribute. Global skill directories (`~/.hermes/skills/`) are invisible to other agents and not versioned.

**Decision:** All agent skills live inside the repo under `.claude/skills/`, `.kimi/skills/`, and `.opencode/skills/`. This enables multi-agent coordination and git-versioned capabilities.

**Consequences:**
- ✅ Any agent cloning the repo gets full context
- ✅ Skills evolve with the codebase
- ✅ Resume-worthy: "Authored Hermes-compatible skills for MCP framework"
