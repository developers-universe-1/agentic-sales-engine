export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { draftFollowUp } from '@/lib/agent/analyzer'
import { logger } from '@/lib/logger'
import { withValidation } from '@/lib/middleware/validate'
import { rateLimit } from '@/lib/middleware/rateLimit'

const DraftFollowUpSchema = z.object({
  callId: z.string().min(1, 'Call ID is required'),
  tone: z.enum(['professional', 'friendly', 'urgent']).optional(),
})

const checkLimit = rateLimit({ windowMs: 60_000, maxRequests: 30 })

export async function POST(req: NextRequest) {
  const limited = await checkLimit(req)
  if (limited) return limited

  return withValidation(DraftFollowUpSchema, async (_req, body) => {
    const { callId, tone = 'professional' } = body

    const result = await draftFollowUp(callId, tone)

    logger.info('api', 'Follow-up drafted', { callId, tone, subject: result.subject })
    return NextResponse.json({
      call_id: callId,
      ...result,
      tone,
      generated_at: new Date().toISOString(),
    })
  })(req)
}
