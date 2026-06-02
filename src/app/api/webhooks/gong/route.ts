export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { logger } from '@/lib/logger'
import { verifyWebhookSecret, getWebhookSecret } from '../verify'
import { analysisCache } from '@/lib/cache'

const GongWebhookSchema = z.object({
  callId: z.string().min(1),
  title: z.string().optional(),
  duration: z.number().optional(),
  transcript: z.string().optional(),
  participants: z.array(z.string()).optional(),
  recordingUrl: z.string().url().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-webhook-secret')
    if (!verifyWebhookSecret(secret, getWebhookSecret('gong'))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validated = GongWebhookSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: validated.error.flatten() },
        { status: 400 }
      )
    }

    const { callId, title, duration, transcript, participants, recordingUrl } = validated.data

    logger.info('webhook', 'Gong call received', { callId, title })

    const cacheKey = `ingest:gong:${callId}`
    analysisCache.set(cacheKey, {
      source: 'gong',
      receivedAt: new Date().toISOString(),
      callId,
      title,
      duration,
      transcript,
      participants,
      recordingUrl,
    }, 5 * 60 * 1000)

    return NextResponse.json(
      {
        received: true,
        callId,
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
