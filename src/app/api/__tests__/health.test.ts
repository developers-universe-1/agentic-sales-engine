/**
 * @jest-environment node
 */

import { GET } from '../health/route'

jest.mock('@/lib/logger', () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

describe('GET /api/health', () => {
  it('returns healthy status with integration flags', async () => {
    const res = await GET()
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.status).toBe('healthy')
    expect(json.version).toBeDefined()
    expect(json.environment).toBeDefined()
    expect(json.integrations).toEqual({
      n8n: false,
      database: false,
      openai: false,
    })
  })
})
