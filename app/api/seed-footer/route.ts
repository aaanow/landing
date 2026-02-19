import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { checkSeedAuth } from '@/lib/seed-auth'

export async function GET(request: Request) {
  const authError = checkSeedAuth(request)
  if (authError) return authError

  try {
    const payload = await getPayload({ config })

    // Fetch existing collection data to build footer links
    const [popupsResult, scorecardsResult, resourcesResult, legalsResult] = await Promise.all([
      payload.find({ collection: 'popups', where: { status: { equals: 'published' } }, limit: 100 }),
      payload.find({ collection: 'scorecards', where: { status: { equals: 'published' } }, limit: 100 }),
      payload.find({ collection: 'resources', limit: 100, sort: 'order' }),
      payload.find({ collection: 'legals', where: { status: { equals: 'published' } }, limit: 100, sort: 'order' }),
    ])

    const popups = popupsResult.docs
    const scorecards = scorecardsResult.docs
    const resources = resourcesResult.docs
    const legals = legalsResult.docs

    const aboutPopups = popups.filter((p: any) => p.aboutPage === 'about-us')
    const aiscPopups = popups.filter((p: any) =>
      ['aisc', 'aod---ai-for-agency-growth', 'lifecycle-alignment'].includes(p.aboutPage || '')
    )
    const footerResources = resources
      .filter((r: any) => r.type === 'external-link' || r.type === 'blog-post' || r.externalLink || r.blogArticle)
      .slice(0, 8)

    await payload.updateGlobal({
      slug: 'footer',
      data: {
        linkGroups: [
          {
            title: 'About AAAnow',
            links: [
              { label: 'About us', href: '/about/about-us', external: false, indent: false },
              ...aboutPopups.map((p: any) => ({
                label: p.name,
                href: `/about/${p.slug}`,
                external: false,
                indent: true,
              })),
              { label: 'Our capability', href: '/our-capability', external: false, indent: false },
              { label: 'LinkedIn', href: 'https://www.linkedin.com/company/aaanow', external: true, indent: false },
            ],
          },
          {
            title: 'AiSC',
            links: [
              { label: 'AiSC Introduction', href: '/about/aisc', external: false, indent: false },
              ...aiscPopups.map((p: any) => ({
                label: p.name,
                href: `/about/${p.slug}`,
                external: false,
                indent: true,
              })),
            ],
          },
          {
            title: 'Public scorecards',
            links: [
              { label: 'Introduction', href: '/scorecards', external: false, indent: false },
              ...scorecards.map((s: any) => ({
                label: s.name,
                href: s.link || `/scorecards/${s.slug}`,
                external: false,
                indent: true,
              })),
            ],
          },
          {
            title: 'Resources',
            links: [
              { label: 'All Reference Materials', href: '/reference-material', external: false, indent: false },
              ...footerResources.map((r: any) => ({
                label: r.name,
                href: r.externalLink || r.blogArticle || `/resources/${r.slug}`,
                external: false,
                indent: true,
              })),
              { label: 'I want to...', href: '/reference-material#i-want-to', external: false, indent: false },
            ],
          },
          {
            title: 'Legal',
            links: legals.map((l: any) => ({
              label: l.name,
              href: `/legal/${l.slug}`,
              external: false,
            })),
          },
        ],
        disclaimerText:
          'This website, all of its content and any/all documents offered directly or otherwise, should be considered as introduction, an overview and a starting point only \u2013 it should not be used as a single, sole authoritative guide. You should not consider this legal guidance.\n\nThe services provided by AAAnow are based on general best practices and on audits of the available areas of websites at a point in time. Sections of the site that are not open to public access or are not being served (possibly due to site errors or downtime) may not be covered by our reports.\n\nWhere matters of legal compliance are concerned you should always take independent advice from appropriately qualified individuals or firms.',
        copyrightText: '\u00a9 2026 AAAnow.al Limited All rights reserved.',
        logo: '/images/aaanow_logo.svg',
        attributionText: 'Website by SOWN',
        attributionLink: 'https://willneeteson.com',
      },
    })

    return NextResponse.json({ success: true, message: 'Footer global seeded successfully' })
  } catch (error) {
    console.error('Seed footer error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
