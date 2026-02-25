import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  if (!body?.name || !body?.email || !body?.message) {
    return NextResponse.json(
      { error: 'Name, email, and message are required' },
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
