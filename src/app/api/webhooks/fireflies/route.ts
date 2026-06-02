export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { verifyWebhookSecret, getWebhookSecret } from '../verify'
import { analysisCache } from '@/lib/cache'

// ------------------------------------------------------------------
// Fireflies Webhook Ingest
//
// Receives meeting transcription completion events from Fireflies.
// Expected payload: { meetingId, title, transcript, speakers, duration }
// ------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-webhook-secret')
    if (!verifyWebhookSecret(secret, getWebhookSecret('fireflies'))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as {
      meetingId: string
      title?: string
      transcript?: string
      speakers?: string[]
      duration?: number
      summary?: string
    }

    logger.info('webhook', 'Fireflies call received', {
      meetingId: body.meetingId,
      title: body.title,
    })

    const cacheKey = `ingest:fireflies:${body.meetingId}`
    analysisCache.set(cacheKey, {
      source: 'fireflies',
      receivedAt: new Date().toISOString(),
      ...body,
    }, 5 * 60 * 1000)

    return NextResponse.json(
      {
        received: true,
        meetingId: body.meetingId,
        message: 'Meeting queued for analysis',
      },
      { status: 202 }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook processing failed'
    logger.error('webhook', 'Fireflies webhook failed', { error: message })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
