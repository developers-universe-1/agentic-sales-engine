# Contributing

Thanks for helping make this the best MCP server in the sales stack. Whether you're fixing a bug, adding a new tool, or improving docs — every PR matters.

## Quick Start for Contributors

```bash
git clone https://github.com/developers-universe-1/agentic-sales-engine.git
cd agentic-sales-engine
npm install
npx ts-node src/mcp/server.ts  # start the MCP server locally
```

### Verify Everything Works (No API Keys)

```bash
npm test                           # 21 tests with mock servers
npm run typecheck                  # TypeScript strict mode
npx ts-node --transpile-only scripts/verify-demo-mode.ts  # End-to-end demo verification
```

## How to Add a New MCP Tool

The fastest way to get a PR merged: add a new tool.

### 1. Define the tool schema in `src/mcp/server.ts`

Add a schema entry to the `TOOLS` array:

```typescript
{
  name: "your_tool_name",
  description: "What it does in one sentence.",
  inputSchema: {
    type: "object" as const,
    properties: {
      param: { type: "string", description: "What this param does" }
    },
    required: ["param"]
  }
}
```

### 2. Implement the handler in `handleToolCall()`

```typescript
case "your_tool_name":
  // Call your real logic from src/lib/your-module.ts
  return {
    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    isError: false,
  };
```

### 3. Add a test in `src/lib/__tests__/`

```typescript
test("your_tool_name returns expected shape", () => {
  const result = handleToolCall("your_tool_name", { param: "value" });
  expect(result.isError).toBe(false);
});
```

### 4. Update the README tool table

Add one row to the MCP Tools table in `README.md`.

### 5. Open a PR

Title format: `feat: add <tool_name> tool`

## Code Style

- **TypeScript strict mode** — no `any` without a comment explaining why
- **Zod** for all runtime validation
- **Jest** for testing (`npm test`)
- **Tailwind** for UI components

## Ideas for First Contributions

- [ ] Wire `analyze_call` to real OpenAI streaming completion
- [ ] Add `get_deal_history` tool (timeline of all touches on a deal)
- [ ] Add `get_rep_coaching_gap` tool (compare rep vs. team benchmark)
- [ ] Add MCP `resources/list` endpoint for deal lookup by ID
- [ ] Add SSE transport alongside stdio

## Questions?

Open an issue or DM on X. We respond within 24h.
