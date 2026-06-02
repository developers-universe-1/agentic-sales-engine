export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { analyzeSingleCall } from '@/lib/agent/analyzer'
import { logger } from '@/lib/logger'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const call = await analyzeSingleCall(id)

    logger.info('api', 'Call analysis served', { callId: id, sentiment: call.sentiment, stage: call.stage })
    return NextResponse.json(call)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Analysis failed'
    logger.error('api', 'Call analysis failed', { error: message })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
