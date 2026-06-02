/**
 * @jest-environment node
 */

import {
  analyzeCallWithLLM,
  draftFollowUpWithLLM,
  scoreRepWithLLM,
  getBenchmarksWithLLM,
  isConfigured,
} from '../llm'
import { startMockOpenAI } from './mocks/openai'

describe('LLM client', () => {
  it('returns false when OPENAI_API_KEY is missing', () => {
    expect(isConfigured()).toBe(false)
  })

  describe('with mock server', () => {
    let mock: Awaited<ReturnType<typeof startMockOpenAI>>
    let originalKey: string | undefined
    let originalBaseUrl: string | undefined

    beforeAll(async () => {
      mock = await startMockOpenAI()
      originalKey = process.env.OPENAI_API_KEY
      originalBaseUrl = process.env.OPENAI_BASE_URL
      process.env.OPENAI_API_KEY = 'test-key'
      process.env.OPENAI_BASE_URL = mock.baseUrl

      // Force re-import by clearing module cache
      jest.resetModules()
    })

    afterAll(async () => {
      process.env.OPENAI_API_KEY = originalKey
      process.env.OPENAI_BASE_URL = originalBaseUrl
      await mock.close()
    })

    it('analyzes a call and returns structured result', async () => {
      const result = await analyzeCallWithLLM(
        'Rep: Thanks for your time. Prospect: This looks good.',
        'Discovery Call',
        'Sarah Chen'
      )

      expect(result.sentiment).toBeDefined()
      expect(result.stage).toBeDefined()
      expect(result.talkRatio).toHaveProperty('rep')
      expect(result.talkRatio).toHaveProperty('prospect')
    })

    it('drafts a follow-up email', async () => {
      mock.setResponse({
        id: 'mock',
        choices: [{
          message: {
            content: JSON.stringify({
              subject: 'Great speaking with you',
              body: 'Hi, thanks for the time.',
              tone: 'professional',
              keyPoints: ['demo scheduled', 'materials sent'],
            }),
          },
        }],
      })

      const result = await draftFollowUpWithLLM(
        'Rep: Thanks. Prospect: Send me the proposal.',
        'Proposal Call',
        'Sarah Chen',
        'professional'
      )

      expect(result.subject).toBeDefined()
      expect(result.body).toBeDefined()
    })

    it('scores a rep', async () => {
      mock.setResponse({
        id: 'mock',
        choices: [{
          message: {
            content: JSON.stringify({
              score: 87,
              strengths: ['discovery', 'rapport'],
              gaps: ['closing'],
              talkRatio: 42,
              objectionHandling: 'good',
            }),
          },
        }],
      })

      const result = await scoreRepWithLLM('Sarah Chen', [
        { title: 'Call 1', sentiment: 'positive', stage: 'discovery', objection: null, talkRatio: { rep: 40, prospect: 60 } },
      ])

      expect(result.score).toBe(87)
      expect(result.strengths).toContain('discovery')
    })

    it('gets benchmarks', async () => {
      mock.setResponse({
        id: 'mock',
        choices: [{
          message: {
            content: JSON.stringify({
              segment: 'SaaS — Mid-Market',
              winRate: 0.28,
              showRate: 0.68,
              avgCycleDays: 45,
              comparison: 'Your win rate is on par with industry average.',
            }),
          },
        }],
      })

      const result = await getBenchmarksWithLLM('SaaS — Mid-Market', 0.28, 0.68, 42)

      expect(result.segment).toBe('SaaS — Mid-Market')
      expect(result.comparison).toBeDefined()
    })
  })
})
