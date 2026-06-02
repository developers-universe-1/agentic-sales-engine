/**
 * Mock n8n Server
 *
 * Simulates n8n webhook endpoints for testing. Returns predictable
 * responses so integration tests don't need a real n8n instance.
 */

import { createServer, type Server } from 'http'

export interface MockN8n {
  baseUrl: string
  close: () => Promise<void>
  getRequests: () => Array<{ workflow: string; payload: unknown }>
  setResponse: (workflow: string, response: unknown) => void
}

export async function startMockN8n(): Promise<MockN8n> {
  const requests: Array<{ workflow: string; payload: unknown }> = []
  const responses = new Map<string, unknown>()

  const server = createServer((req, res) => {
    const url = req.url ?? '/'
    const workflow = url.replace('/', '')

    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', () => {
      try {
        const payload = JSON.parse(body)
        requests.push({ workflow, payload })

        const response = responses.get(workflow) ?? { success: true, workflow }

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
        baseUrl: `http://127.0.0.1:${port}`,
        close: () => new Promise<void>((res) => server.close(() => res())),
        getRequests: () => requests,
        setResponse: (workflow: string, response: unknown) => {
          responses.set(workflow, response)
        },
      })
    })
  })
}
