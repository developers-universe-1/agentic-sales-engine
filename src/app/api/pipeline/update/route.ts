export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { mockDeals } from '@/lib/demo'
import { logger } from '@/lib/logger'
import { withValidation } from '@/lib/middleware/validate'
import { rateLimit } from '@/lib/middleware/rateLimit'

const UpdatePipelineSchema = z.object({
  dealId: z.string().min(1, 'Deal ID is required'),
  stage: z.enum(['Prospecting', 'Qualification', 'Proposal', 'Closed-Won', 'Closed-Lost']),
  reason: z.string().optional(),
})

const checkLimit = rateLimit({ windowMs: 60_000, maxRequests: 30 })

export async function POST(req: NextRequest) {
  const limited = await checkLimit(req)
  if (limited) return limited

  return withValidation(UpdatePipelineSchema, async (_req, body) => {
    const { dealId, stage, reason } = body

    const deal = mockDeals.find(d => d.id === dealId)
    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    const previousStage = deal.stage
    deal.stage = stage.toLowerCase()
    deal.lastActivity = reason ? `Stage moved: ${reason}` : deal.lastActivity

    logger.info('api', 'Pipeline updated', { dealId, previousStage, newStage: stage })

    return NextResponse.json({
      deal_id: dealId,
      previous_stage: previousStage,
      new_stage: stage,
      reason,
      updated_at: new Date().toISOString(),
    })
  })(req)
}
