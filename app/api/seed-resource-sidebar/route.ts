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
      slug: 'resource-sidebar',
      data: {
        items: [
          { name: 'Agency Growth Platform', icon: 'pdf' },
          { name: 'AiSC - 60secs... WHY', icon: 'document' },
          { name: 'AISC - Agency pricing', icon: 'pdf' },
          { name: 'AISC - The Application', icon: 'pdf' },
          { name: 'Agency revenue, client confidence', icon: 'document' },
          { name: 'IN|SITE', icon: 'document' },
          { name: 'OVER|SITE', icon: 'document' },
          { name: 'WORK|PACK', icon: 'document' },
          { name: 'AOD', icon: 'document' },
          { name: 'Try /CONFIRM', icon: 'document' },
        ],
      },
    })

    return NextResponse.json({ success: true, message: 'Resource sidebar seeded' })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Failed to seed resource sidebar' }, { status: 500 })
  }
}
