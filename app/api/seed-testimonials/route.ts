import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { checkSeedAuth } from '@/lib/seed-auth'

export async function GET(request: Request) {
  const authError = checkSeedAuth(request)
  if (authError) return authError

  try {
    const payload = await getPayload({ config })

    await payload.updateGlobal({
      slug: 'testimonials',
      data: {
        heading: 'Where we deliver confidence',
        subheading: 'Discover how agencies leverage AiSC across their entire client lifecycle.',
        caseStudies: [],
        clientLogosHeading: "Who's talking about us",
        clientLogos: [],
      },
    })

    return NextResponse.json({ success: true, message: 'Testimonials global seeded successfully' })
  } catch (error) {
    console.error('Seed testimonials error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
