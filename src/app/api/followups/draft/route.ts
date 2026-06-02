export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { draftFollowUp } from '@/lib/agent/analyzer'
import { logger } from '@/lib/logger'

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { callId: string; tone?: 'professional' | 'friendly' | 'urgent' }
    const { callId, tone = 'professional' } = body

    const result = await draftFollowUp(callId, tone)

    logger.info('api', 'Follow-up drafted', { callId, tone, subject: result.subject })
    return NextResponse.json({
      call_id: callId,
      ...result,
      tone,
      generated_at: new Date().toISOString(),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    logger.error('api', 'Follow-up draft failed', { error: message })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
