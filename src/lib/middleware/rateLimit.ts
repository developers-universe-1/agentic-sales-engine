import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

// ------------------------------------------------------------------
// In-Memory Rate Limiter
//
// Simple sliding-window rate limiter for API routes.
// Production deployments should use Redis for distributed rate limiting.
// ------------------------------------------------------------------

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

export interface RateLimitOptions {
  windowMs?: number
  maxRequests?: number
  keyGenerator?: (req: NextRequest) => string
}

const DEFAULT_WINDOW_MS = 60 * 1000 // 1 minute
const DEFAULT_MAX_REQUESTS = 100

function defaultKeyGenerator(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() ?? 'anonymous'
  return `${req.method}:${req.url}:${ip}`
}

export function rateLimit(options: RateLimitOptions = {}) {
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS
  const maxRequests = options.maxRequests ?? DEFAULT_MAX_REQUESTS
  const keyGenerator = options.keyGenerator ?? defaultKeyGenerator

  return async (req: NextRequest): Promise<NextResponse | null> => {
    const key = keyGenerator(req)
    const now = Date.now()

    const entry = store.get(key)
    if (entry && entry.resetAt > now) {
      if (entry.count >= maxRequests) {
        logger.warn('rateLimit', 'Rate limit exceeded', { key, count: entry.count })
        return NextResponse.json(
          { error: 'Rate limit exceeded', retryAfter: Math.ceil((entry.resetAt - now) / 1000) },
          { status: 429, headers: { 'Retry-After': String(Math.ceil((entry.resetAt - now) / 1000)) } }
        )
      }
      entry.count++
    } else {
      store.set(key, { count: 1, resetAt: now + windowMs })
    }

    return null
  }
}

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key)
    }
  }
}, 5 * 60 * 1000)
