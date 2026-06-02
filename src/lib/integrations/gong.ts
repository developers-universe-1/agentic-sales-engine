import { z } from 'zod'
import { logger } from '@/lib/logger'
import { n8nGongFetchCalls, n8nGongFetchTranscript, N8nNotConfiguredError } from '@/lib/n8n'
import { mockCalls } from '@/lib/demo'

// ------------------------------------------------------------------
// Gong Integration — proxied through n8n workflows
//
// n8n handles API key auth, pagination, and transcript fetching.
// Falls back to demo calls when n8n is not configured.
// ------------------------------------------------------------------

export const GongCallSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  duration: z.number().optional(),
  started: z.string().optional(),
})

export type GongCall = z.infer<typeof GongCallSchema>

export interface GongConfig {
  apiKey: string
}

export class GongClient {
  constructor(private config: GongConfig) {}

  async fetchCalls(filters?: Record<string, unknown>): Promise<GongCall[]> {
    try {
      const result = await n8nGongFetchCalls(filters)
      return (result as { calls: GongCall[] }).calls ?? []
    } catch (err) {
      if (err instanceof N8nNotConfiguredError) {
        logger.debug('gong', 'n8n not configured — returning demo calls')
        return mockCalls.map(c => ({
          id: c.id,
          title: c.title,
          duration: c.duration,
          started: c.createdAt,
        })) as GongCall[]
      }
      throw err
    }
  }

  async fetchTranscript(callId: string): Promise<{ callId: string; transcript: string }> {
    try {
      return (await n8nGongFetchTranscript(callId)) as { callId: string; transcript: string }
    } catch (err) {
      if (err instanceof N8nNotConfiguredError) {
        logger.debug('gong', 'n8n not configured — returning demo transcript')
        const call = mockCalls.find(c => c.id === callId)
        return {
          callId,
          transcript: call?.transcript ?? 'Transcript not available.',
        }
      }
      throw err
    }
  }
}

export function createGongClient(config: GongConfig): GongClient {
  return new GongClient(config)
}
