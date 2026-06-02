---
name: mcp-sales-agent-cron-pipeline-sync
description: "Use when scheduling or running the hourly CRM pipeline sync for the MCP Sales Agent."
version: "1.0.0"
author: "developers-universe-1"
license: "MIT"
metadata:
  hermes:
    tags: ["mcp", "sales", "cron", "pipeline", "crm", "sync"]
    related_skills: ["mcp-sales-agent", "mcp-sales-agent-cron-daily-briefs"]
---

# Pipeline Sync — Hermes Cron Job

## Overview

Every hour, sync deal stages from CRM (Salesforce / HubSpot) into the MCP Sales Agent dashboard. Auto-move stages based on call content when configured.

## Trigger

```cron
0 * * * *
```

## Workflow

1. Query Salesforce opportunities (n8n workflow `salesforce-query`)
2. Query HubSpot deals (n8n workflow `hubspot-search`)
3. Map external stages to internal pipeline stages
4. Update dashboard deals in cache / database
5. Log sync metrics

## Hermes Commands

```bash
hermes run skill mcp-sales-agent-cron-pipeline-sync
```

## Verification

- [ ] Salesforce opportunities fetched successfully
- [ ] HubSpot deals fetched successfully
- [ ] Stage mapping accurate (no drift)
- [ ] Dashboard reflects latest CRM state
