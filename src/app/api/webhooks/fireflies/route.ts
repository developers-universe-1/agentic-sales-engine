export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { logger } from '@/lib/logger'
import { verifyWebhookSecret, getWebhookSecret } from '../verify'
import { analysisCache } from '@/lib/cache'

const FirefliesWebhookSchema = z.object({
  meetingId: z.string().min(1),
  title: z.string().optional(),
  transcript: z.string().optional(),
  speakers: z.array(z.string()).optional(),
  duration: z.number().optional(),
  summary: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-webhook-secret')
    if (!verifyWebhookSecret(secret, getWebhookSecret('fireflies'))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validated = FirefliesWebhookSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: validated.error.flatten() },
        { status: 400 }
      )
    }

    const { meetingId, title, transcript, speakers, duration, summary } = validated.data

    logger.info('webhook', 'Fireflies call received', { meetingId, title })

    const cacheKey = `ingest:fireflies:${meetingId}`
    analysisCache.set(cacheKey, {
      source: 'fireflies',
      receivedAt: new Date().toISOString(),
      meetingId,
      title,
      transcript,
      speakers,
      duration,
      summary,
    }, 5 * 60 * 1000)

    return NextResponse.json(
      {
        received: true,
        meetingId,
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
