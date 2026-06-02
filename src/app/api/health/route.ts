export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export async function GET() {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? '1.0.0',
    environment: process.env.NODE_ENV ?? 'development',
    integrations: {
      n8n: Boolean(process.env.N8N_WEBHOOK_URL),
      database: Boolean(process.env.DATABASE_URL),
      openai: Boolean(process.env.OPENAI_API_KEY),
    },
  }

  logger.debug('api', 'Health check', checks)

  return NextResponse.json(checks, { status: 200 })
}
