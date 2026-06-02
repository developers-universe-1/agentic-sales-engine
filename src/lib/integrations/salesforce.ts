import { z } from 'zod'
import { AgentError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { n8nSalesforceQuery, n8nSalesforceUpdate, N8nNotConfiguredError } from '@/lib/n8n'
import { mockDeals } from '@/lib/demo'

// ------------------------------------------------------------------
// Salesforce Integration — proxied through n8n workflows
//
// When n8n is configured, triggers n8n webhooks that handle OAuth2,
// SOQL, and rate limiting. Falls back to demo data when n8n is not
// configured (zero-config demo mode).
// ------------------------------------------------------------------

export const SalesforceOpportunitySchema = z.object({
  Id: z.string(),
  Name: z.string(),
  StageName: z.string(),
  Amount: z.number().nullable().optional(),
  CloseDate: z.string().optional(),
  Probability: z.number().nullable().optional(),
  AccountId: z.string().nullable().optional(),
  OwnerId: z.string().optional(),
  LastModifiedDate: z.string().optional(),
  CreatedDate: z.string().optional(),
  Description: z.string().nullable().optional(),
  NextStep: z.string().nullable().optional(),
})

export type SalesforceOpportunity = z.infer<typeof SalesforceOpportunitySchema>

export interface SalesforceConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
}

export class SalesforceClient {
  constructor(private config: SalesforceConfig) {}

  async queryOpportunities(stage?: string): Promise<SalesforceOpportunity[]> {
    try {
      const soql = stage
        ? `SELECT Id, Name, StageName, Amount, CloseDate, Probability FROM Opportunity WHERE StageName = '${stage}' LIMIT 50`
        : `SELECT Id, Name, StageName, Amount, CloseDate, Probability FROM Opportunity LIMIT 50`

      const result = await n8nSalesforceQuery(soql)
      // n8n returns raw Salesforce response; we trust the workflow to return valid shape
      return (result as { records: SalesforceOpportunity[] }).records ?? []
    } catch (err) {
      if (err instanceof N8nNotConfiguredError) {
        logger.debug('salesforce', 'n8n not configured — returning demo deals')
        return mockDeals.map(d => ({
          Id: d.id,
          Name: d.company,
          StageName: d.stage,
          Amount: d.value,
          CloseDate: d.createdAt,
          Probability: d.probability,
        })) as SalesforceOpportunity[]
      }
      throw err
    }
  }

  async updateStage(opportunityId: string, stageName: string, reason?: string): Promise<unknown> {
    try {
      return await n8nSalesforceUpdate(opportunityId, {
        StageName: stageName,
        Description: reason ? `Stage moved: ${reason}` : undefined,
      })
    } catch (err) {
      if (err instanceof N8nNotConfiguredError) {
        logger.debug('salesforce', 'n8n not configured — returning demo update')
        return {
          id: opportunityId,
          success: true,
          errors: [],
          stage: stageName,
          updated_at: new Date().toISOString(),
        }
      }
      throw err
    }
  }
}

export function createSalesforceClient(config: SalesforceConfig): SalesforceClient {
  return new SalesforceClient(config)
}
