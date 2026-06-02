import OpenAI from 'openai'
import { z } from 'zod'
import { logger } from '@/lib/logger'
import { AgentError } from '@/lib/errors'
import {
  CallAnalysisResultSchema,
  RepScoreResultSchema,
  FollowUpDraftResultSchema,
  BenchmarkComparisonResultSchema,
  type CallAnalysisResult,
  type RepScoreResult,
  type FollowUpDraftResult,
  type BenchmarkComparisonResult,
} from './schemas'
import {
  buildCallAnalysisPrompt,
  buildRepScorePrompt,
  buildFollowUpPrompt,
  buildBenchmarkPrompt,
} from './prompts'

// ------------------------------------------------------------------
// OpenAI LLM Client
//
// Wraps the OpenAI SDK with:
// - Structured JSON output via response_format
// - Zod validation on every response
// - Demo fallback when OPENAI_API_KEY is missing
// - Consistent error handling
// ------------------------------------------------------------------

function getClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null
  return new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL,
  })
}

function isConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY
}

async function callLLM<T>(
  system: string,
  user: string,
  schema: z.ZodSchema<T>,
  temperature = 0.3
): Promise<T> {
  const openai = getClient()
  if (!openai) {
    throw new AgentError('OpenAI client not configured — set OPENAI_API_KEY', 'llm')
  }

  logger.info('llm', 'Sending prompt to OpenAI', { model: 'gpt-4o', temperature })

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      response_format: { type: 'json_object' },
      temperature,
      max_tokens: 2048,
    })

    const raw = response.choices[0]?.message?.content ?? '{}'
    const parsed = JSON.parse(raw)
    const validated = schema.parse(parsed)

    logger.info('llm', 'Received structured response')
    return validated
  } catch (err) {
    if (err instanceof z.ZodError) {
      logger.error('llm', 'LLM response failed Zod validation', { errors: err.flatten() })
      throw new AgentError('LLM response shape mismatch — check prompt', 'llm', err)
    }
    logger.error('llm', 'LLM call failed', { error: (err as Error).message })
    throw new AgentError(`LLM call failed: ${(err as Error).message}`, 'llm', err)
  }
}

// ------------------------------------------------------------------
// Public API
// ------------------------------------------------------------------

export async function analyzeCallWithLLM(
  transcript: string,
  callTitle: string,
  repName: string,
  prospectName?: string,
  dealValue?: number | null
): Promise<CallAnalysisResult> {
  const { system, user } = buildCallAnalysisPrompt({
    transcript,
    callTitle,
    repName,
    prospectName,
    dealValue,
  })
  return callLLM(system, user, CallAnalysisResultSchema, 0.2)
}

export async function scoreRepWithLLM(
  repName: string,
  calls: Parameters<typeof buildRepScorePrompt>[0]['calls']
): Promise<RepScoreResult> {
  const { system, user } = buildRepScorePrompt({ repName, calls })
  return callLLM(system, user, RepScoreResultSchema, 0.3)
}

export async function draftFollowUpWithLLM(
  transcript: string,
  callTitle: string,
  repName: string,
  tone: 'professional' | 'friendly' | 'urgent',
  prospectName?: string
): Promise<FollowUpDraftResult> {
  const { system, user } = buildFollowUpPrompt({
    transcript,
    callTitle,
    repName,
    prospectName,
    tone,
  })
  return callLLM(system, user, FollowUpDraftResultSchema, 0.4)
}

export async function getBenchmarksWithLLM(
  segment: string,
  teamWinRate: number,
  teamShowRate: number,
  teamCycleDays: number
): Promise<BenchmarkComparisonResult> {
  const { system, user } = buildBenchmarkPrompt({ segment, teamWinRate, teamShowRate, teamCycleDays })
  return callLLM(system, user, BenchmarkComparisonResultSchema, 0.2)
}

export { isConfigured }
