import { NextResponse } from 'next/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  if (!body?.name || !body?.email || !body?.message) {
    return NextResponse.json(
      { error: 'Name, email, and message are required' },
      { status: 400 },
    )
  }

  if (typeof body.email !== 'string' || !EMAIL_RE.test(body.email)) {
    return NextResponse.json(
      { error: 'Please provide a valid email address' },
      { status: 400 },
    )
  }

  if (typeof body.message !== 'string' || body.message.length < 2 || body.message.length > 5000) {
    return NextResponse.json(
      { error: 'Message must be between 2 and 5000 characters' },
      { status: 400 },
    )
  }

  // TODO: Connect to your email service / CRM (e.g. SendGrid, HubSpot, etc.)
  console.log('Contact form submission:', {
    name: body.name,
    email: body.email,
    organization: body.organization,
    message: body.message,
    wantsDemo: body.wantsDemo,
    wantsProposal: body.wantsProposal,
  })

  return NextResponse.json({ success: true })
}
