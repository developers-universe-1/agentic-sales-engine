---
name: mcp-sales-agent-cron-weekly-coaching
description: "Use when scheduling or running the weekly rep coaching report for the MCP Sales Agent."
version: "1.0.0"
author: "developers-universe-1"
license: "MIT"
metadata:
  hermes:
    tags: ["mcp", "sales", "cron", "coaching", "reports"]
    related_skills: ["mcp-sales-agent", "mcp-sales-agent-cron-daily-briefs"]
---

# Weekly Coaching Report — Hermes Cron Job

## Overview

Every Monday at 9 AM, generate per-rep scorecards with weekly trend lines, talk-time ratios, objection-resolution rates, and coaching gaps. Post summary to Slack #sales-coaching.

## Trigger

```cron
0 9 * * 1
```

## Workflow

1. Fetch all calls from the last 7 days (MCP `analyze_call` or Gong fetch)
2. Score each rep via MCP `score_rep`
3. Aggregate team benchmarks via MCP `get_benchmarks`
4. Post scorecards to Slack (MCP `slack-notify`)

## Hermes Commands

```bash
hermes run skill mcp-sales-agent-cron-weekly-coaching
```

## Verification

- [ ] Scorecards generated for every active rep
- [ ] Team comparison radar chart updated
- [ ] Slack notification sent to #sales-coaching
