# Quick Start

## 60-Second Demo

```bash
git clone https://github.com/developers-universe-1/agentic-sales-engine.git
cd agentic-sales-engine
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:3000` → click **Open Dashboard**.

No API keys. No database. No n8n. It just works.

## Verify Demo Mode (No Credentials)

```bash
npx ts-node --transpile-only scripts/verify-demo-mode.ts
```

Confirms the entire framework works without any external services.

## 5-Minute Full Stack

```bash
# 1. Clone & install
git clone https://github.com/developers-universe-1/agentic-sales-engine.git
cd agentic-sales-engine
npm install

# 2. Start everything (PostgreSQL + n8n + app)
make docker-up

# 3. Run migrations & seed database
npm run db:migrate
npx prisma db seed

# 4. Open dashboard
open http://localhost:3000
```

n8n UI: `http://localhost:5678` (admin / admin)

## MCP Server (stdio)

```bash
npx ts-node src/mcp/server.ts
```

**Claude Desktop config:**
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

## Add Your First Tool

```bash
# 1. Edit src/mcp/server.ts — add TOOLS entry + handler
# 2. Implement logic in src/lib/your-module.ts
# 3. Add Zod validation schema in src/lib/llm/schemas.ts (if LLM output)
# 4. Add test in src/lib/__tests__/your-module.test.ts
# 5. npm test && npm run typecheck
```

See `CONTRIBUTING.md` for full guide.
