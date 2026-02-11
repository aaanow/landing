import { NextResponse } from 'next/server'

/**
 * Verify that the request has a valid SEED_API_KEY in the Authorization header.
 * Returns a 401 NextResponse if auth fails, or null if auth succeeds.
 *
 * Usage in a route:
 *   const authError = checkSeedAuth(request)
 *   if (authError) return authError
 */
export function checkSeedAuth(request: Request): NextResponse | null {
  const key = process.env.SEED_API_KEY
  if (!key) {
    return NextResponse.json(
      { error: 'SEED_API_KEY is not configured on the server' },
      { status: 500 },
    )
  }

  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${key}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return null
}
