import { logger } from '@/lib/logger'
import { AgentError } from '@/lib/errors'
import { analysisCache } from '@/lib/cache'
import {
  analyzeCallWithLLM,
  scoreRepWithLLM,
  draftFollowUpWithLLM,
  getBenchmarksWithLLM,
  isConfigured as isLLMConfigured,
} from '@/lib/llm'
import {
  mockCalls,
  mockDeals,
  mockReps,
  mockBenchmarks,
  mockFollowUps,
  mockBriefs,
  teamMetrics,
  type CallAnalysis,
  type Deal,
  type RepScorecard,
  type BenchmarkSegment,
  type FollowUp,
  type PreCallBrief,
} from '@/lib/demo'

export interface DashboardSnapshot {
  calls: CallAnalysis[]
  deals: Deal[]
  reps: RepScorecard[]
  benchmarks: BenchmarkSegment[]
  followUps: FollowUp[]
  briefs: PreCallBrief[]
  metrics: typeof teamMetrics
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  const cacheKey = 'dashboard:v1'
  const cached = analysisCache.get(cacheKey) as DashboardSnapshot | undefined
  if (cached) {
    logger.debug('analyzer', 'Dashboard cache hit')
    return cached
  }

  logger.info('analyzer', 'Building dashboard snapshot')

  // If LLM is configured, enrich mock calls with real analysis
  let enrichedCalls = mockCalls
  if (isLLMConfigured()) {
    enrichedCalls = await enrichCallsWithLLM(mockCalls)
  }

  const snapshot: DashboardSnapshot = {
    calls: enrichedCalls,
    deals: mockDeals,
    reps: mockReps,
    benchmarks: mockBenchmarks,
    followUps: mockFollowUps,
    briefs: mockBriefs,
    metrics: teamMetrics,
  }

  analysisCache.set(cacheKey, snapshot, 60 * 1000)
  return snapshot
}

export interface AnalysisProgress {
  stage: string
  message: string
  progress: number
  data?: Partial<DashboardSnapshot>
}

export async function* analyzePipelineStream(): AsyncGenerator<AnalysisProgress> {
  logger.info('analyzer', 'Starting pipeline analysis stream')

  try {
    yield { stage: 'ingest', message: 'Ingesting call recordings from connected sources', progress: 10 }
    await delay(400)

    const calls = isLLMConfigured() ? await enrichCallsWithLLM(mockCalls) : mockCalls
    yield { stage: 'ingest', message: `Ingested ${calls.length} calls in the last 7 days`, progress: 25, data: { calls } }
    await delay(400)

    yield { stage: 'analyze', message: 'Running sentiment and objection classification', progress: 40, data: { calls } }
    await delay(isLLMConfigured() ? 1500 : 500) // LLM takes longer

    yield { stage: 'analyze', message: 'Identified objection categories across active deals', progress: 55, data: { calls, deals: mockDeals } }
    await delay(400)

    yield { stage: 'enrich', message: 'Updating pipeline stages from call content', progress: 70, data: { deals: mockDeals } }
    await delay(400)

    yield { stage: 'enrich', message: 'Generating rep scorecards and coaching insights', progress: 85, data: { reps: mockReps } }
    await delay(400)

    const snapshot = await getDashboardSnapshot()
    yield { stage: 'complete', message: 'Analysis complete — dashboard refreshed', progress: 100, data: snapshot }

    logger.info('analyzer', 'Pipeline analysis stream complete')
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    logger.error('analyzer', 'Analysis stream failed', { error: message })
    throw new AgentError('Pipeline analysis failed', 'analyze', err)
  }
}

/**
 * Analyze a single call with LLM when configured, otherwise return mock data.
 */
export async function analyzeSingleCall(callId: string): Promise<CallAnalysis> {
  const call = mockCalls.find(c => c.id === callId)
  if (!call) {
    throw new AgentError(`Call ${callId} not found`, 'analyze')
  }

  if (!isLLMConfigured()) {
    logger.debug('analyzer', 'LLM not configured — returning mock call data')
    return call
  }

  logger.info('analyzer', 'Analyzing call with LLM', { callId })

  try {
    const result = await analyzeCallWithLLM(
      call.transcript,
      call.title,
      call.repName,
      undefined, // prospect name not in mock data
      call.dealValue
    )

    return {
      ...call,
      sentiment: result.sentiment,
      stage: result.stage,
      objection: result.objection,
      objectionCategory: result.objectionCategory,
      nextSteps: result.nextSteps,
      talkRatio: result.talkRatio,
    }
  } catch (err) {
    logger.warn('analyzer', 'LLM analysis failed — falling back to mock data', { callId, error: (err as Error).message })
    return call
  }
}

/**
 * Draft a follow-up email using LLM when configured.
 */
export async function draftFollowUp(callId: string, tone: 'professional' | 'friendly' | 'urgent' = 'professional'): Promise<Pick<FollowUp, 'subject' | 'body'>> {
  const call = mockCalls.find(c => c.id === callId)
  if (!call) {
    throw new AgentError(`Call ${callId} not found`, 'draft')
  }

  if (!isLLMConfigured()) {
    const fallback = mockFollowUps.find(f => f.dealId === callId)
    return {
      subject: fallback?.subject ?? `Following up — ${call.title}`,
      body: fallback?.body ?? `Hi,\n\nThanks for the time on ${call.title}. Looking forward to next steps.\n\nBest,`,
    }
  }

  logger.info('analyzer', 'Drafting follow-up with LLM', { callId, tone })

  try {
    const result = await draftFollowUpWithLLM(call.transcript, call.title, call.repName, tone)
    return {
      subject: result.subject,
      body: result.body,
    }
  } catch (err) {
    logger.warn('analyzer', 'LLM follow-up failed — falling back to mock', { callId, error: (err as Error).message })
    const fallback = mockFollowUps.find(f => f.dealId === callId)
    return {
      subject: fallback?.subject ?? `Following up — ${call.title}`,
      body: fallback?.body ?? `Hi,\n\nThanks for the time on ${call.title}. Looking forward to next steps.\n\nBest,`,
    }
  }
}

/**
 * Score a rep using LLM when configured.
 */
export async function scoreRep(repName: string): Promise<Partial<RepScorecard>> {
  const repCalls = mockCalls.filter(c => c.repName === repName)

  if (!isLLMConfigured() || repCalls.length === 0) {
    const rep = mockReps.find(r => r.name === repName)
    if (!rep) throw new AgentError(`Rep ${repName} not found`, 'score')
    return rep
  }

  logger.info('analyzer', 'Scoring rep with LLM', { repName })

  try {
    const result = await scoreRepWithLLM(
      repName,
      repCalls.map(c => ({
        title: c.title,
        sentiment: c.sentiment,
        stage: c.stage,
        objection: c.objection,
        talkRatio: c.talkRatio,
      }))
    )

    return {
      name: repName,
      score: result.score,
      strengths: result.strengths,
      gaps: result.gaps,
      avgTalkRatio: result.talkRatio,
    }
  } catch (err) {
    logger.warn('analyzer', 'LLM scoring failed — falling back to mock', { repName, error: (err as Error).message })
    const rep = mockReps.find(r => r.name === repName)
    if (!rep) throw new AgentError(`Rep ${repName} not found`, 'score')
    return rep
  }
}

/**
 * Get benchmarks using LLM when configured.
 */
export async function getBenchmarks(segment: string): Promise<BenchmarkSegment> {
  const benchmark = mockBenchmarks.find(b => b.segment === segment) ?? mockBenchmarks[0]

  if (!isLLMConfigured()) {
    return benchmark
  }

  logger.info('analyzer', 'Getting benchmarks with LLM', { segment })

  try {
    const result = await getBenchmarksWithLLM(
      segment,
      benchmark.winRate,
      benchmark.showRate,
      benchmark.avgSalesCycle
    )

    return {
      segment: result.segment,
      showRate: result.showRate,
      contractRate: result.winRate,
      avgSalesCycle: result.avgCycleDays,
      avgDealSize: benchmark.avgDealSize,
      winRate: result.winRate,
    }
  } catch (err) {
    logger.warn('analyzer', 'LLM benchmarks failed — falling back to mock', { segment, error: (err as Error).message })
    return benchmark
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function enrichCallsWithLLM(calls: CallAnalysis[]): Promise<CallAnalysis[]> {
  const enriched: CallAnalysis[] = []

  for (const call of calls) {
    try {
      const result = await analyzeCallWithLLM(
        call.transcript,
        call.title,
        call.repName,
        undefined,
        call.dealValue
      )

      enriched.push({
        ...call,
        sentiment: result.sentiment,
        stage: result.stage,
        objection: result.objection,
        objectionCategory: result.objectionCategory,
        nextSteps: result.nextSteps,
        talkRatio: result.talkRatio,
      })
    } catch {
      enriched.push(call)
    }
  }

  return enriched
}

export function getLossAutopsy(): { category: string; count: number; deals: Deal[] }[] {
  const lost = mockDeals.filter(d => d.stage === 'closed-lost')
  const grouped = new Map<string, Deal[]>()

  for (const deal of lost) {
    const category = deal.lastActivity?.includes('budget') ? 'budget'
      : deal.lastActivity?.includes('competition') ? 'competition'
      : deal.lastActivity?.includes('security') ? 'security'
      : deal.lastActivity?.includes('timing') ? 'timing'
      : 'other'

    if (!grouped.has(category)) grouped.set(category, [])
    grouped.get(category)!.push(deal)
  }

  return Array.from(grouped.entries())
    .map(([category, deals]) => ({ category, count: deals.length, deals }))
    .sort((a, b) => b.count - a.count)
}
