import { NextResponse } from 'next/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  if (!body?.email) {
    return NextResponse.json(
      { error: 'Email is required' },
      { status: 400 },
    )
  }

  if (typeof body.email !== 'string' || !EMAIL_RE.test(body.email)) {
    return NextResponse.json(
      { error: 'Please provide a valid email address' },
      { status: 400 },
    )
  }

  // TODO: Connect to your email service / CRM (e.g. Mailchimp, HubSpot, etc.)
  // For now this just logs the submission and returns success.
  console.log('Signup submission:', {
    name: body.name,
    email: body.email,
    organisationType: body.organisationType,
  })

  return NextResponse.json({ success: true })
}
