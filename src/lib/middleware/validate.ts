import { NextRequest, NextResponse } from 'next/server'
import { z, type ZodSchema } from 'zod'
import { logger } from '@/lib/logger'

// ------------------------------------------------------------------
// Input Validation Middleware
//
// Wraps API route handlers with Zod schema validation.
// Returns 400 with structured error details on invalid input.
// ------------------------------------------------------------------

export class ValidationError extends Error {
  constructor(public readonly flattened: z.typeToFlattenedError<unknown, string>) {
    super('Validation failed')
    this.name = 'ValidationError'
  }
}

export async function validateBody<T>(schema: ZodSchema<T>, req: NextRequest): Promise<T> {
  try {
    const body = await req.json()
    return schema.parse(body)
  } catch (err) {
    if (err instanceof z.ZodError) {
      logger.warn('api', 'Request validation failed', { errors: err.flatten() })
      throw new ValidationError(err.flatten())
    }
    throw err
  }
}

export function withValidation<T>(
  schema: ZodSchema<T>,
  handler: (req: NextRequest, body: T) => Promise<Response> | Response
) {
  return async (req: NextRequest): Promise<Response> => {
    try {
      const body = await validateBody<T>(schema, req)
      return handler(req, body)
    } catch (err) {
      if (err instanceof ValidationError) {
        return NextResponse.json(
          { error: 'Validation failed', details: err.flattened },
          { status: 400 }
        )
      }
      throw err
    }
  }
}
