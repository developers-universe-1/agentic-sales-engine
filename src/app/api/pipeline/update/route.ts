export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { mockDeals } from '@/lib/demo'
import { logger } from '@/lib/logger'

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { dealId: string; stage: string; reason?: string }
    const { dealId, stage, reason } = body

    const deal = mockDeals.find(d => d.id === dealId)
    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    const previousStage = deal.stage
    deal.stage = stage
    deal.lastActivity = reason ? `Stage moved: ${reason}` : deal.lastActivity
    const updatedAt = new Date().toISOString()

    logger.info('api', 'Pipeline updated', { dealId, previousStage, newStage: stage })

    return NextResponse.json({
      deal_id: dealId,
      previous_stage: previousStage,
      new_stage: stage,
      reason,
      updated_at: updatedAt,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    logger.error('api', 'Pipeline update failed', { error: message })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
