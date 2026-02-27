import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { checkSeedAuth } from '@/lib/seed-auth'

export async function POST(request: Request) {
  const authError = checkSeedAuth(request)
  if (authError) return authError

  const body = await request.json().catch(() => null)
  if (!body?.email || !body?.password) {
    return NextResponse.json(
      { error: 'Provide { "email": "...", "password": "..." } in request body' },
      { status: 400 },
    )
  }

  const { email, password } = body

  try {
    const payload = await getPayload({ config })

    const users = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
    })

    if (users.docs.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await payload.update({
      collection: 'users',
      id: users.docs[0].id,
      data: { password },
    })

    return NextResponse.json({ success: true, message: 'Password updated successfully' })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ success: false, error: 'Password reset failed' }, { status: 500 })
  }
}
