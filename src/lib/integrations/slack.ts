import { z } from 'zod'
import { logger } from '@/lib/logger'
import { n8nSlackNotify, N8nNotConfiguredError } from '@/lib/n8n'

// ------------------------------------------------------------------
// Slack Integration — proxied through n8n workflows
//
// n8n handles webhook URL delivery and Block Kit formatting.
// Falls back to console log when n8n is not configured.
// ------------------------------------------------------------------

export const SlackMessagePayloadSchema = z.object({
  text: z.string().optional(),
  blocks: z.array(z.record(z.string(), z.unknown())).optional(),
})

export type SlackMessagePayload = z.infer<typeof SlackMessagePayloadSchema>

export interface SlackConfig {
  webhookUrl: string
}

export class SlackClient {
  constructor(private config: SlackConfig) {}

  async sendNotification(channel: string, text: string, blocks?: unknown[]): Promise<{ ok: boolean }> {
    try {
      await n8nSlackNotify(channel, text, blocks)
      return { ok: true }
    } catch (err) {
      if (err instanceof N8nNotConfiguredError) {
        logger.debug('slack', 'n8n not configured — logging to console', { channel, text })
        return { ok: true }
      }
      throw err
    }
  }
}

export function createSlackClient(config: SlackConfig): SlackClient {
  return new SlackClient(config)
}
