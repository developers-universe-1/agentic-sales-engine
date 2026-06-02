export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { analyzeSingleCall } from '@/lib/agent/analyzer'
import { logger } from '@/lib/logger'
import { rateLimit } from '@/lib/middleware/rateLimit'

const CallIdSchema = z.string().min(1).max(100)

const checkLimit = rateLimit({ windowMs: 60_000, maxRequests: 60 })

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await checkLimit(_req)
  if (limited) return limited

  try {
    const { id } = await params
    const validatedId = CallIdSchema.parse(id)
    const call = await analyzeSingleCall(validatedId)

    logger.info('api', 'Call analysis served', { callId: id, sentiment: call.sentiment, stage: call.stage })
    return NextResponse.json(call)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid call ID', details: err.flatten() },
        { status: 400 }
      )
    }
    const message = err instanceof Error ? err.message : 'Analysis failed'
    logger.error('api', 'Call analysis failed', { error: message })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
