import { type Sentiment, type Stage } from './schemas'

// ------------------------------------------------------------------
// Structured prompts for sales call analysis
//
// Each prompt is designed to be sent to GPT-4o with JSON mode enabled.
// The system prompt establishes the persona; the user prompt provides
// the transcript and context.
// ------------------------------------------------------------------

export interface CallAnalysisPromptInput {
  transcript: string
  callTitle: string
  repName: string
  prospectName?: string
  dealValue?: number | null
}

export function buildCallAnalysisPrompt(input: CallAnalysisPromptInput): {
  system: string
  user: string
} {
  return {
    system: `You are an expert sales call analyst with 10+ years of B2B SaaS experience. Your job is to analyze sales call transcripts and extract structured insights.

Analyze the transcript objectively. Focus on:
1. Sentiment — overall tone (positive / neutral / negative)
2. Stage inference — what pipeline stage this call represents
3. Objections — any pushback, concerns, or blockers
4. Talk ratio — estimate rep vs prospect speaking time
5. Next steps — what was explicitly agreed
6. Key quotes — verbatim moments that reveal intent or risk
7. Coaching — one actionable insight for the rep

Respond ONLY with valid JSON matching the requested schema. No markdown, no explanations outside the JSON.`,

    user: `Call Title: ${input.callTitle}
Rep: ${input.repName}
${input.prospectName ? `Prospect: ${input.prospectName}` : ''}
${input.dealValue ? `Deal Value: $${input.dealValue.toLocaleString()}` : ''}

Transcript:
---
${input.transcript}
---

Analyze this call and return structured JSON.`,
  }
}

export interface RepScorePromptInput {
  repName: string
  calls: Array<{
    title: string
    sentiment: Sentiment
    stage: Stage
    objection: string | null
    talkRatio: { rep: number; prospect: number }
  }>
}

export function buildRepScorePrompt(input: RepScorePromptInput): {
  system: string
  user: string
} {
  return {
    system: `You are a sales coaching director. Score this rep based on their recent calls. Be specific and constructive. Return valid JSON only.`,
    user: `Rep: ${input.repName}
Recent Calls:
${input.calls.map((c, i) => `${i + 1}. ${c.title} | ${c.sentiment} | ${c.stage} | objection: ${c.objection ?? 'none'} | talk ratio ${c.talkRatio.rep}% rep / ${c.talkRatio.prospect}% prospect`).join('\n')}

Score this rep (0-100), list 2-3 strengths, 2-3 gaps, and rate objection handling.`,
  }
}

export interface FollowUpPromptInput {
  transcript: string
  callTitle: string
  repName: string
  prospectName?: string
  tone: 'professional' | 'friendly' | 'urgent'
}

export function buildFollowUpPrompt(input: FollowUpPromptInput): {
  system: string
  user: string
} {
  return {
    system: `You are a sales copywriter who drafts follow-up emails from actual call transcripts. Never fabricate details. Use only what was actually discussed. Match the requested tone. Return valid JSON only.`,
    user: `Draft a ${input.tone} follow-up email from this call.

Call: ${input.callTitle}
Rep: ${input.repName}
${input.prospectName ? `Prospect: ${input.prospectName}` : ''}
Tone: ${input.tone}

Transcript:
---
${input.transcript}
---

Write subject (max 120 chars), body (max 2000 chars), and 3 key points covered.`,
  }
}

export interface BenchmarkPromptInput {
  segment: string
  teamWinRate: number
  teamShowRate: number
  teamCycleDays: number
}

export function buildBenchmarkPrompt(input: BenchmarkPromptInput): {
  system: string
  user: string
} {
  return {
    system: `You are a sales operations analyst. Compare team metrics to industry benchmarks. Be concise. Return valid JSON only.`,
    user: `Segment: ${input.segment}
Team Metrics:
- Win Rate: ${(input.teamWinRate * 100).toFixed(1)}%
- Show Rate: ${(input.teamShowRate * 100).toFixed(1)}%
- Avg Cycle: ${input.teamCycleDays} days

Provide realistic benchmark numbers for this segment and a one-sentence comparison.`,
  }
}
