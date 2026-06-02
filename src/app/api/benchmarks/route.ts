export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getBenchmarks } from '@/lib/agent/analyzer'
import { logger } from '@/lib/logger'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const segment = searchParams.get('segment') ?? 'SaaS — Mid-Market'

    const benchmark = await getBenchmarks(segment)

    logger.info('api', 'Benchmarks served', { segment })
    return NextResponse.json(benchmark)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    logger.error('api', 'Benchmarks failed', { error: message })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
