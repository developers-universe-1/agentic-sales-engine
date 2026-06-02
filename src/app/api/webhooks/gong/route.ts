export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { verifyWebhookSecret, getWebhookSecret } from '../verify'
import { analysisCache } from '@/lib/cache'

// ------------------------------------------------------------------
// Gong Webhook Ingest
//
// Receives call recording completion events from Gong.
// Expected payload: { callId, title, duration, transcript, participants }
//
// Demo mode: accepts any payload and stores in cache for analysis.
// ------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-webhook-secret')
    if (!verifyWebhookSecret(secret, getWebhookSecret('gong'))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as {
      callId: string
      title?: string
      duration?: number
      transcript?: string
      participants?: string[]
      recordingUrl?: string
    }

    logger.info('webhook', 'Gong call received', { callId: body.callId, title: body.title })

    // Store in cache for async analysis (or queue for real processing)
    const cacheKey = `ingest:gong:${body.callId}`
    analysisCache.set(cacheKey, {
      source: 'gong',
      receivedAt: new Date().toISOString(),
      ...body,
    }, 5 * 60 * 1000)

    return NextResponse.json(
      {
        received: true,
        callId: body.callId,
        message: 'Call queued for analysis',
      },
      { status: 202 }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook processing failed'
    logger.error('webhook', 'Gong webhook failed', { error: message })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
