import { z } from 'zod'

// ------------------------------------------------------------------
// Runtime Environment Validation
//
// Validates env vars at startup so the app fails fast with a clear
// error message instead of cryptic runtime failures.
// All fields are optional — demo mode works without any of them.
// ------------------------------------------------------------------

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  OPENAI_API_KEY: z.string().optional(),
  DATABASE_URL: z.string().url().optional(),
  MCP_TRANSPORT: z.enum(['stdio', 'sse']).default('sse'),
  N8N_WEBHOOK_URL: z.string().url().optional(),
  N8N_API_KEY: z.string().optional(),
  SALESFORCE_CLIENT_ID: z.string().optional(),
  SALESFORCE_CLIENT_SECRET: z.string().optional(),
  SALESFORCE_REDIRECT_URI: z.string().url().optional(),
  HUBSPOT_PRIVATE_APP_TOKEN: z.string().optional(),
  GONG_API_KEY: z.string().optional(),
  SLACK_WEBHOOK_URL: z.string().url().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  OUTLOOK_CLIENT_ID: z.string().optional(),
  OUTLOOK_CLIENT_SECRET: z.string().optional(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data
