#!/usr/bin/env ts-node
/**
 * Demo Mode Verification Script
 *
 * Runs without any API keys, database, or n8n to verify the entire
 * framework works in zero-config demo mode.
 *
 * Usage:
 *   npx ts-node --transpile-only scripts/verify-demo-mode.ts
 */

import { getDashboardSnapshot, analyzeSingleCall, draftFollowUp, scoreRep, getBenchmarks } from '../src/lib/agent/analyzer'
import { triggerWebhook, N8nNotConfiguredError } from '../src/lib/n8n/client'

async function assert(name: string, fn: () => Promise<unknown>) {
  try {
    const result = await fn()
    console.log(`  ✅ ${name}`)
    return result
  } catch (err) {
    console.log(`  ❌ ${name}: ${(err as Error).message}`)
    process.exitCode = 1
    throw err
  }
}

async function main() {
  console.log('\n🔍 Verifying Demo Mode (zero-config)\n')

  console.log('Environment:')
  console.log(`  OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET'} (expected: NOT SET)`)
  console.log(`  N8N_WEBHOOK_URL: ${process.env.N8N_WEBHOOK_URL ? 'SET' : 'NOT SET'} (expected: NOT SET)`)
  console.log(`  DATABASE_URL: ${process.env.DATABASE_URL ? 'SET' : 'NOT SET'} (expected: NOT SET)`)
  console.log()

  await assert('Dashboard snapshot returns mock data', async () => {
    const snapshot = await getDashboardSnapshot()
    if (snapshot.calls.length === 0) throw new Error('No calls')
    if (snapshot.deals.length === 0) throw new Error('No deals')
    return snapshot
  })

  await assert('analyzeSingleCall falls back to mock', async () => {
    const call = await analyzeSingleCall('call-1')
    if (!call.id) throw new Error('No call ID')
    return call
  })

  await assert('draftFollowUp falls back to mock', async () => {
    const email = await draftFollowUp('call-1', 'professional')
    if (!email.subject) throw new Error('No subject')
    return email
  })

  await assert('scoreRep falls back to mock', async () => {
    const score = await scoreRep('Sarah Chen')
    if (!score.name) throw new Error('No rep name')
    return score
  })

  await assert('getBenchmarks falls back to mock', async () => {
    const bench = await getBenchmarks('SaaS — Mid-Market')
    if (!bench.segment) throw new Error('No segment')
    return bench
  })

  await assert('n8n triggerWebhook throws N8nNotConfiguredError', async () => {
    try {
      await triggerWebhook('test', {})
      throw new Error('Should have thrown')
    } catch (err) {
      if (!(err instanceof N8nNotConfiguredError)) throw err
      return true
    }
  })

  await assert('analyzePipelineStream yields progress', async () => {
    const { analyzePipelineStream } = await import('../src/lib/agent/analyzer')
    const gen = analyzePipelineStream()
    const chunks: unknown[] = []
    for await (const chunk of gen) {
      chunks.push(chunk)
      if (chunk.stage === 'complete') break
    }
    if (chunks.length < 3) throw new Error('Stream too short')
    return chunks
  })

  console.log('\n✅ All demo mode checks passed. Framework works without any credentials.\n')
}

main().catch((err) => {
  console.error('\n❌ Verification failed:', err.message, '\n')
  process.exit(1)
})
