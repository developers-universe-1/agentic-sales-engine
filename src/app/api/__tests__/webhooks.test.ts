/**
 * @jest-environment node
 */

import { POST as gongPOST } from '../webhooks/gong/route'
import { POST as fathomPOST } from '../webhooks/fathom/route'
import { POST as firefliesPOST } from '../webhooks/fireflies/route'

jest.mock('@/lib/logger', () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

describe('Webhook endpoints', () => {
  const createRequest = (body: unknown, secret?: string) => {
    const headers = new Headers()
    if (secret) headers.set('x-webhook-secret', secret)

    return new Request('http://localhost/api/webhooks/test', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
  }

  describe('Gong', () => {
    it('accepts call data without secret in dev mode', async () => {
      const req = createRequest({ callId: 'call-123', title: 'Test Call' })
      const res = await gongPOST(req)
      const json = await res.json()

      expect(res.status).toBe(202)
      expect(json.received).toBe(true)
      expect(json.callId).toBe('call-123')
    })
  })

  describe('Fathom', () => {
    it('accepts call data without secret in dev mode', async () => {
      const req = createRequest({ callId: 'call-456', summary: 'Test summary' })
      const res = await fathomPOST(req)
      const json = await res.json()

      expect(res.status).toBe(202)
      expect(json.received).toBe(true)
      expect(json.callId).toBe('call-456')
    })
  })

  describe('Fireflies', () => {
    it('accepts meeting data without secret in dev mode', async () => {
      const req = createRequest({ meetingId: 'meet-789', title: 'Test Meeting' })
      const res = await firefliesPOST(req)
      const json = await res.json()

      expect(res.status).toBe(202)
      expect(json.received).toBe(true)
      expect(json.meetingId).toBe('meet-789')
    })
  })
})
