import { logger } from '@/lib/logger'
import { AgentError } from '@/lib/errors'

// ------------------------------------------------------------------
// n8n Webhook Client
//
// Architecture: All integration management flows through n8n workflows.
// The Next.js app triggers n8n webhooks; n8n handles OAuth, rate limits,
// retries, and CRM API calls. Demo mode falls back to mock data when
// N8N_WEBHOOK_URL is unset.
// ------------------------------------------------------------------

const N8N_BASE_URL = process.env.N8N_WEBHOOK_URL || ''
const N8N_API_KEY = process.env.N8N_API_KEY || ''

export interface N8nWebhookPayload {
  workflow: string
  payload: Record<string, unknown>
}

export interface N8nWebhookResponse {
  success: boolean
  data?: unknown
  error?: string
}

function isN8nConfigured(): boolean {
  return Boolean(N8N_BASE_URL)
}

/**
 * Trigger an n8n workflow via webhook.
 * Returns demo fallback when n8n is not configured.
 */
export async function triggerWebhook<T = unknown>(
  workflowName: string,
  payload: Record<string, unknown>
): Promise<T> {
  if (!isN8nConfigured()) {
    logger.debug('n8n', 'n8n not configured — skipping webhook', { workflow: workflowName })
    throw new N8nNotConfiguredError(workflowName)
  }

  const url = `${N8N_BASE_URL}/${workflowName}`
  logger.info('n8n', 'Triggering workflow', { workflow: workflowName, url })

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(N8N_API_KEY ? { 'X-N8N-API-KEY': N8N_API_KEY } : {}),
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new AgentError(
        `n8n workflow "${workflowName}" returned ${response.status}: ${text}`,
        'n8n'
      )
    }

    const data = (await response.json()) as T
    logger.info('n8n', 'Workflow completed', { workflow: workflowName })
    return data
  } catch (err) {
    if (err instanceof N8nNotConfiguredError) throw err
    logger.error('n8n', 'Workflow failed', { workflow: workflowName, error: (err as Error).message })
    throw new AgentError(`n8n workflow "${workflowName}" failed: ${(err as Error).message}`, 'n8n', err)
  }
}

/**
 * Typed wrapper: Salesforce opportunity query
 */
export async function n8nSalesforceQuery(soql: string): Promise<unknown> {
  return triggerWebhook('salesforce-query', { soql })
}

/**
 * Typed wrapper: Salesforce opportunity update
 */
export async function n8nSalesforceUpdate(opportunityId: string, fields: Record<string, unknown>): Promise<unknown> {
  return triggerWebhook('salesforce-update', { opportunityId, fields })
}

/**
 * Typed wrapper: HubSpot deal search
 */
export async function n8nHubSpotSearch(query: string, limit?: number): Promise<unknown> {
  return triggerWebhook('hubspot-search', { query, limit: limit ?? 10 })
}

/**
 * Typed wrapper: HubSpot deal update
 */
export async function n8nHubSpotUpdate(dealId: string, properties: Record<string, unknown>): Promise<unknown> {
  return triggerWebhook('hubspot-update', { dealId, properties })
}

/**
 * Typed wrapper: Gong call fetch
 */
export async function n8nGongFetchCalls(filters?: Record<string, unknown>): Promise<unknown> {
  return triggerWebhook('gong-fetch-calls', { filters })
}

/**
 * Typed wrapper: Gong transcript fetch
 */
export async function n8nGongFetchTranscript(callId: string): Promise<unknown> {
  return triggerWebhook('gong-fetch-transcript', { callId })
}

/**
 * Typed wrapper: Slack notification
 */
export async function n8nSlackNotify(channel: string, text: string, blocks?: unknown[]): Promise<unknown> {
  return triggerWebhook('slack-notify', { channel, text, blocks })
}

/**
 * Typed wrapper: Gmail send
 */
export async function n8nGmailSend(to: string, subject: string, body: string, html?: string): Promise<unknown> {
  return triggerWebhook('gmail-send', { to, subject, body, html })
}

/**
 * Typed wrapper: CalendarFuel / calendar event create
 */
export async function n8nCalendarCreate(
  title: string,
  startTime: string,
  endTime: string,
  attendees: string[],
  description?: string
): Promise<unknown> {
  return triggerWebhook('calendar-create', { title, startTime, endTime, attendees, description })
}

// ------------------------------------------------------------------
// Errors
// ------------------------------------------------------------------

export class N8nNotConfiguredError extends Error {
  constructor(public readonly workflow: string) {
    super(`n8n workflow "${workflow}" skipped — N8N_WEBHOOK_URL not configured`)
    this.name = 'N8nNotConfiguredError'
  }
}
