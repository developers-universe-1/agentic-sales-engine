export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { logger } from '@/lib/logger'
import { verifyWebhookSecret, getWebhookSecret } from '../verify'
import { analysisCache } from '@/lib/cache'

const FathomWebhookSchema = z.object({
  callId: z.string().min(1),
  title: z.string().optional(),
  summary: z.string().optional(),
  transcript: z.string().optional(),
  actionItems: z.array(z.string()).optional(),
  participants: z.array(z.string()).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-webhook-secret')
    if (!verifyWebhookSecret(secret, getWebhookSecret('fathom'))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validated = FathomWebhookSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: validated.error.flatten() },
        { status: 400 }
      )
    }

    const { callId, title, summary, transcript, actionItems, participants } = validated.data

    logger.info('webhook', 'Fathom call received', { callId, title })

    const cacheKey = `ingest:fathom:${callId}`
    analysisCache.set(cacheKey, {
      source: 'fathom',
      receivedAt: new Date().toISOString(),
      callId,
      title,
      summary,
      transcript,
      actionItems,
      participants,
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
    logger.error('webhook', 'Fathom webhook failed', { error: message })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
