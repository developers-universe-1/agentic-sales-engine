/**
 * Mock OpenAI Server
 *
 * A lightweight HTTP server that simulates OpenAI's chat.completions.create
 * endpoint for testing. Runs on a random port and returns predictable
 * JSON responses so tests don't need a real API key.
 *
 * Usage:
 *   const mock = await startMockOpenAI()
 *   process.env.OPENAI_API_KEY = 'test-key'
 *   process.env.OPENAI_BASE_URL = mock.baseUrl
 *   // run tests
 *   await mock.close()
 */

import { createServer, type Server } from 'http'

export interface MockOpenAI {
  baseUrl: string
  close: () => Promise<void>
  getRequests: () => unknown[]
  setResponse: (response: unknown) => void
}

export async function startMockOpenAI(): Promise<MockOpenAI> {
  const requests: unknown[] = []
  let customResponse: unknown | null = null

  const server = createServer((req, res) => {
    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body)
        requests.push(parsed)

        const response = customResponse ?? {
          id: 'mock-chatcmpl-' + Date.now(),
          object: 'chat.completion',
          created: Math.floor(Date.now() / 1000),
          model: 'gpt-4o-mock',
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: JSON.stringify({
                  sentiment: 'positive',
                  stage: 'discovery',
                  objection: null,
                  objectionCategory: null,
                  nextSteps: 'Schedule demo next week',
                  talkRatio: { rep: 45, prospect: 55 },
                  keyQuotes: ['This looks promising'],
                  coachingNotes: 'Ask more discovery questions',
                }),
              },
              finish_reason: 'stop',
            },
          ],
        }

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(response))
      } catch {
        res.writeHead(400)
        res.end(JSON.stringify({ error: 'bad request' }))
      }
    })
  })

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address()
      const port = typeof addr === 'object' && addr ? addr.port : 0
      resolve({
        baseUrl: `http://127.0.0.1:${port}/v1`,
        close: () => new Promise<void>((res) => server.close(() => res())),
        getRequests: () => requests,
        setResponse: (r: unknown) => { customResponse = r },
      })
    })
  })
}
