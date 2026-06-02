export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { mockFollowUps, mockCalls } from '@/lib/demo'
import { logger } from '@/lib/logger'

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { callId: string; tone?: 'professional' | 'friendly' | 'urgent' }
    const { callId, tone = 'professional' } = body

    const call = mockCalls.find(c => c.id === callId)
    const followUp = mockFollowUps.find(f => f.callId === callId)

    if (!call) {
      return NextResponse.json({ error: 'Call not found' }, { status: 404 })
    }

    const result = {
      call_id: callId,
      subject: followUp?.subject ?? `Following up — ${call.title}`,
      body: followUp?.body ?? `Hi,\n\nThanks for the time on ${call.title}. Looking forward to next steps.\n\nBest,`,
      tone,
      generated_at: new Date().toISOString(),
    }

    logger.info('api', 'Follow-up drafted', { callId, tone })
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    logger.error('api', 'Follow-up draft failed', { error: message })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
