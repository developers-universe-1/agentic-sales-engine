import { logger } from '@/lib/logger'
import { AgentError } from '@/lib/errors'

// ------------------------------------------------------------------
// Webhook Verification
//
// Simple shared secret verification for webhook endpoints.
// Production setups should use HMAC signatures (Gong, Fathom, and
// Fireflies all support signature verification).
// ------------------------------------------------------------------

export function verifyWebhookSecret(
  providedSecret: string | null,
  expectedSecret: string
): boolean {
  if (!expectedSecret) {
    logger.warn('webhook', 'No webhook secret configured — accepting all requests')
    return true
  }

  if (!providedSecret) {
    logger.error('webhook', 'Missing webhook secret header')
    return false
  }

  const isValid = providedSecret === expectedSecret
  if (!isValid) {
    logger.error('webhook', 'Invalid webhook secret')
  }
  return isValid
}

export function getWebhookSecret(provider: 'gong' | 'fathom' | 'fireflies'): string {
  const envVar =
    provider === 'gong'
      ? 'GONG_WEBHOOK_SECRET'
      : provider === 'fathom'
        ? 'FATHOM_WEBHOOK_SECRET'
        : 'FIREFLIES_WEBHOOK_SECRET'

  return process.env[envVar] ?? ''
}
