export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getBenchmarks } from '@/lib/agent/analyzer'
import { logger } from '@/lib/logger'
import { rateLimit } from '@/lib/middleware/rateLimit'

const SegmentQuerySchema = z.string().min(1).max(100).optional()

const checkLimit = rateLimit({ windowMs: 60_000, maxRequests: 60 })

export async function GET(req: NextRequest) {
  const limited = await checkLimit(req)
  if (limited) return limited

  try {
    const { searchParams } = new URL(req.url)
    const rawSegment = searchParams.get('segment') ?? 'SaaS — Mid-Market'

    const segment = SegmentQuerySchema.parse(rawSegment) ?? 'SaaS — Mid-Market'
    const benchmark = await getBenchmarks(segment)

    logger.info('api', 'Benchmarks served', { segment })
    return NextResponse.json(benchmark)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid segment parameter', details: err.flatten() },
        { status: 400 }
      )
    }
    const message = err instanceof Error ? err.message : 'Unknown error'
    logger.error('api', 'Benchmarks failed', { error: message })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
