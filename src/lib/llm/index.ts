export {
  analyzeCallWithLLM,
  scoreRepWithLLM,
  draftFollowUpWithLLM,
  getBenchmarksWithLLM,
  isConfigured,
} from './client'

export {
  CallAnalysisResultSchema,
  RepScoreResultSchema,
  FollowUpDraftResultSchema,
  BenchmarkComparisonResultSchema,
} from './schemas'

export type {
  CallAnalysisResult,
  RepScoreResult,
  FollowUpDraftResult,
  BenchmarkComparisonResult,
  Sentiment,
  Stage,
} from './schemas'
