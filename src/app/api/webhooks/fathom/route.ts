export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { verifyWebhookSecret, getWebhookSecret } from '../verify'
import { analysisCache } from '@/lib/cache'

// ------------------------------------------------------------------
// Fathom Webhook Ingest
//
// Receives AI-notetaker completion events from Fathom.
// Expected payload: { callId, title, summary, transcript, actionItems }
// ------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-webhook-secret')
    if (!verifyWebhookSecret(secret, getWebhookSecret('fathom'))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as {
      callId: string
      title?: string
      summary?: string
      transcript?: string
      actionItems?: string[]
      participants?: string[]
    }

    logger.info('webhook', 'Fathom call received', { callId: body.callId, title: body.title })

    const cacheKey = `ingest:fathom:${body.callId}`
    analysisCache.set(cacheKey, {
      source: 'fathom',
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
    logger.error('webhook', 'Fathom webhook failed', { error: message })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
