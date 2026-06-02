---
name: mcp-sales-agent-cron-daily-briefs
description: "Use when scheduling or running the daily pre-call brief generation job for the MCP Sales Agent."
version: "1.0.0"
author: "developers-universe-1"
license: "MIT"
metadata:
  hermes:
    tags: ["mcp", "sales", "cron", "briefs", "calendar"]
    related_skills: ["mcp-sales-agent", "mcp-sales-agent-cron-pipeline-sync"]
---

# Daily Pre-Call Briefs — Hermes Cron Job

## Overview

Every morning at 8 AM, generate pre-call briefs for every rep with meetings that have a prior call on record. Surfaces: last call summary, open commitments, recurring objections, and winning patterns.

## Trigger

```cron
0 8 * * *
```

## Workflow

1. Fetch today's calendar events (via MCP `calendar-create` or Google Calendar API)
2. For each meeting with a prior call, invoke MCP tool `generate_brief`
3. Send briefs to reps via Slack (MCP `slack-notify`)
4. Log completion

## Hermes Commands

```bash
# Run manually
hermes run skill mcp-sales-agent-cron-daily-briefs

# Or via cron goal
curl -X POST $HERMES_GATEWAY/cron \
  -H "Content-Type: application/json" \
  -d '{"skill": "mcp-sales-agent-cron-daily-briefs", "schedule": "0 8 * * *"}'
```

## Verification

- [ ] Briefs generated for all meetings with prior calls
- [ ] Slack notifications delivered
- [ ] Dashboard shows updated briefs view
