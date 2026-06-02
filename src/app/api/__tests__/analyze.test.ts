/**
 * @jest-environment node
 */

import { GET } from '../analyze/route'
import { GET as StreamGET } from '../analyze/stream/route'

jest.mock('@/lib/logger', () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

describe('GET /api/analyze', () => {
  it('returns dashboard snapshot', async () => {
    const res = await GET({} as unknown as import('next/server').NextRequest)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.calls.length).toBeGreaterThan(0)
    expect(json.deals.length).toBeGreaterThan(0)
    expect(json.reps.length).toBeGreaterThan(0)
    expect(json.metrics).toBeDefined()
  })
})

describe('GET /api/analyze/stream', () => {
  it('streams analysis progress events', async () => {
    const res = await StreamGET({} as unknown as import('next/server').NextRequest)

    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('text/event-stream')

    const reader = res.body?.getReader()
    expect(reader).toBeDefined()

    if (reader) {
      const { value } = await reader.read()
      const text = new TextDecoder().decode(value)
      expect(text).toContain('data:')
      expect(text).toContain('ingest')
    }
  })
})
