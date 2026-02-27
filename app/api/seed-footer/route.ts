import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { checkSeedAuth } from '@/lib/seed-auth'

interface SeedDoc {
  id: string
  slug?: string
  name?: string
  aboutPage?: string
  type?: string
  externalLink?: string
  blogArticle?: string
  link?: string
}

// Helper to create an internal link referencing a CMS page
function internalLink(
  label: string,
  relationTo: string,
  docId: string,
  indent = false,
) {
  return { label, linkType: 'internal', reference: { relationTo, value: docId }, indent }
}

// Helper to create an external/manual URL link
function externalLink(label: string, url: string, indent = false) {
  return { label, linkType: 'external', url, indent }
}

export async function GET(request: Request) {
  const authError = checkSeedAuth(request)
  if (authError) return authError

  try {
    const payload = await getPayload({ config })

    // Fetch existing collection data to build footer links
    const [popupsResult, scorecardsResult, resourcesResult, legalsResult] = await Promise.all([
      payload.find({ collection: 'popups', where: { _status: { equals: 'published' } }, limit: 100 }),
      payload.find({ collection: 'scorecards', where: { _status: { equals: 'published' } }, limit: 100 }),
      payload.find({ collection: 'resources', limit: 100, sort: 'order' }),
      payload.find({ collection: 'legals', where: { _status: { equals: 'published' } }, limit: 100, sort: 'order' }),
    ])

    const popups = popupsResult.docs
    const scorecards = scorecardsResult.docs
    const resources = resourcesResult.docs
    const legals = legalsResult.docs

    const aboutUsPopup = popups.find((p) => (p as SeedDoc).slug === 'about-us')
    const aboutPopups = popups.filter((p) => (p as SeedDoc).aboutPage === 'about-us')
    const aiscPopup = popups.find((p) => (p as SeedDoc).slug === 'aisc')
    const aiscPopups = popups.filter((p) =>
      ['aisc', 'aod---ai-for-agency-growth', 'lifecycle-alignment'].includes((p as SeedDoc).aboutPage || '')
    )
    const footerResources = resources
      .filter((r) => {
        const doc = r as SeedDoc
        return doc.type === 'external-link' || doc.type === 'blog-post' || doc.externalLink || doc.blogArticle
      })
      .slice(0, 8)

    await payload.updateGlobal({
      slug: 'footer',
      data: {
        linkGroups: [
          {
            title: 'About AAAnow',
            links: [
              aboutUsPopup
                ? internalLink('About us', 'popups', aboutUsPopup.id as string)
                : externalLink('About us', '/about-us'),
              ...aboutPopups.map((p) => { const d = p as SeedDoc; return internalLink(d.name || '', 'popups', d.id, true) }),
              externalLink('Our capability', '/our-capability'),
              externalLink('LinkedIn', 'https://www.linkedin.com/company/aaanow'),
            ],
          },
          {
            title: 'AiSC',
            links: [
              aiscPopup
                ? internalLink('AiSC Introduction', 'popups', aiscPopup.id as string)
                : externalLink('AiSC Introduction', '/aisc'),
              ...aiscPopups.map((p) => { const d = p as SeedDoc; return internalLink(d.name || '', 'popups', d.id, true) }),
            ],
          },
          {
            title: 'Public scorecards',
            links: [
              externalLink('Introduction', '/scorecards'),
              ...scorecards.map((s) => { const d = s as SeedDoc; return internalLink(d.name || '', 'scorecards', d.id, true) }),
            ],
          },
          {
            title: 'Resources',
            links: [
              externalLink('All Reference Materials', '/reference-material'),
              ...footerResources.map((r) => {
                const d = r as SeedDoc
                return externalLink(d.name || '', d.externalLink || d.blogArticle || `/resources/${d.slug}`, true)
              }),
              externalLink('I want to...', '/reference-material#i-want-to'),
            ],
          },
          {
            title: 'Legal',
            links: legals.map((l) => { const d = l as SeedDoc; return internalLink(d.name || '', 'legals', d.id) }),
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
