import { z } from 'zod'
import { logger } from '@/lib/logger'
import { n8nHubSpotSearch, n8nHubSpotUpdate, N8nNotConfiguredError } from '@/lib/n8n'
import { mockDeals } from '@/lib/demo'

// ------------------------------------------------------------------
// HubSpot Integration — proxied through n8n workflows
//
// n8n handles private app token auth, Search API, and rate limits.
// Falls back to demo data when n8n is not configured.
// ------------------------------------------------------------------

export const HubSpotDealSchema = z.object({
  id: z.string(),
  properties: z.record(z.string(), z.unknown()),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type HubSpotDeal = z.infer<typeof HubSpotDealSchema>

export interface HubSpotConfig {
  privateAppToken: string
}

export class HubSpotClient {
  constructor(private config: HubSpotConfig) {}

  async searchDeals(query: string, limit = 10): Promise<HubSpotDeal[]> {
    try {
      const result = await n8nHubSpotSearch(query, limit)
      return (result as { results: HubSpotDeal[] }).results ?? []
    } catch (err) {
      if (err instanceof N8nNotConfiguredError) {
        logger.debug('hubspot', 'n8n not configured — returning demo deals')
        return mockDeals.slice(0, limit).map(d => ({
          id: d.id,
          properties: {
            dealname: d.name,
            dealstage: d.stage,
            amount: d.value,
          },
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
        })) as HubSpotDeal[]
      }
      throw err
    }
  }

  async updateDeal(dealId: string, properties: Record<string, unknown>): Promise<unknown> {
    try {
      return await n8nHubSpotUpdate(dealId, properties)
    } catch (err) {
      if (err instanceof N8nNotConfiguredError) {
        logger.debug('hubspot', 'n8n not configured — returning demo update')
        return {
          id: dealId,
          success: true,
          properties,
          updated_at: new Date().toISOString(),
        }
      }
      throw err
    }
  }
}

export function createHubSpotClient(config: HubSpotConfig): HubSpotClient {
  return new HubSpotClient(config)
}
