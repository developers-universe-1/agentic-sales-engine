import { z } from 'zod'

// ------------------------------------------------------------------
// Zod schemas for structured LLM output
//
// These schemas define the exact shape we expect from GPT-4o when
// analyzing sales calls. Using Zod gives us runtime validation and
// clean TypeScript types.
// ------------------------------------------------------------------

export const SentimentSchema = z.enum(['positive', 'neutral', 'negative'])
export type Sentiment = z.infer<typeof SentimentSchema>

export const StageSchema = z.enum([
  'discovery',
  'demo',
  'proposal',
  'negotiation',
  'closed-won',
  'closed-lost',
])
export type Stage = z.infer<typeof StageSchema>

export const TalkRatioSchema = z.object({
  rep: z.number().min(0).max(100).describe('Percentage of time the rep spoke'),
  prospect: z.number().min(0).max(100).describe('Percentage of time the prospect spoke'),
})

export const CallAnalysisResultSchema = z.object({
  sentiment: SentimentSchema.describe('Overall sentiment of the call'),
  stage: StageSchema.describe('Inferred pipeline stage based on call content'),
  objection: z.string().nullable().describe('Primary objection raised, if any'),
  objectionCategory: z.enum(['budget', 'competition', 'security', 'timing', 'authority', 'other']).nullable(),
  nextSteps: z.string().describe('Clear next steps agreed upon'),
  talkRatio: TalkRatioSchema,
  keyQuotes: z.array(z.string()).describe('1-3 verbatim quotes that reveal intent or objection'),
  coachingNotes: z.string().describe('One coaching insight for the rep'),
})

export type CallAnalysisResult = z.infer<typeof CallAnalysisResultSchema>

export const RepScoreResultSchema = z.object({
  score: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  talkRatio: z.number().min(0).max(100),
  objectionHandling: z.enum(['excellent', 'good', 'fair', 'poor']),
})

export type RepScoreResult = z.infer<typeof RepScoreResultSchema>

export const FollowUpDraftResultSchema = z.object({
  subject: z.string().max(120),
  body: z.string().max(2000),
  tone: z.enum(['professional', 'friendly', 'urgent']),
  keyPoints: z.array(z.string()).describe('3 bullet points the email covers'),
})

export type FollowUpDraftResult = z.infer<typeof FollowUpDraftResultSchema>

export const BenchmarkComparisonResultSchema = z.object({
  segment: z.string(),
  winRate: z.number(),
  showRate: z.number(),
  avgCycleDays: z.number(),
  comparison: z.string().describe('One-sentence comparison to industry average'),
})

export type BenchmarkComparisonResult = z.infer<typeof BenchmarkComparisonResultSchema>
