export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { mockCalls } from '@/lib/demo'
import { logger } from '@/lib/logger'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const call = mockCalls.find(c => c.id === id) || null

    if (!call) {
      return NextResponse.json({ error: 'Call not found' }, { status: 404 })
    }

    logger.info('api', 'Call detail served', { callId: id })
    return NextResponse.json(call)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    logger.error('api', 'Call detail failed', { error: message })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
