import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { checkSeedAuth } from '@/lib/seed-auth'
import { parseCSV } from '@/lib/csv'
import { htmlToLexical } from '@/lib/lexical'
import fs from 'fs'
import path from 'path'

// Download an image from URL and create a Media document in Payload
async function uploadImageFromUrl(
  payload: Awaited<ReturnType<typeof getPayload>>,
  imageUrl: string,
  altText: string,
): Promise<string | null> {
  try {
    const response = await fetch(imageUrl)
    if (!response.ok) return null

    const buffer = Buffer.from(await response.arrayBuffer())
    const contentType = response.headers.get('content-type') || 'image/png'

    const urlPath = new URL(imageUrl).pathname
    const filename = urlPath.split('/').pop() || 'image.png'

    const media = await payload.create({
      collection: 'media',
      data: {
        alt: altText || 'Page sidebar image',
      },
      file: {
        data: buffer,
        mimetype: contentType,
        name: filename,
        size: buffer.length,
      },
    })

    return media.id as string
  } catch (error) {
    console.error(`Failed to upload image ${imageUrl}:`, error)
    return null
  }
}

// Resolve semicolon-separated popup slugs to relationship IDs
async function resolvePopupSlugs(
  payload: Awaited<ReturnType<typeof getPayload>>,
  popupString: string,
): Promise<string[]> {
  const slugs = popupString.split(';').map((s) => s.trim()).filter(Boolean)
  const ids: string[] = []

  for (const slug of slugs) {
    const found = await payload.find({
      collection: 'popups',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    if (found.docs[0]) {
      ids.push(found.docs[0].id as string)
    }
  }

  return ids
}

// DELETE: Clear all pages (run before re-seeding)
export async function DELETE(request: Request) {
  const authError = checkSeedAuth(request)
  if (authError) return authError

  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'pages',
      limit: 500,
    })

    let deleted = 0
    for (const doc of result.docs) {
      await payload.delete({ collection: 'pages', id: doc.id })
      deleted++
    }

    return NextResponse.json({ success: true, deleted })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// GET: Seed pages from CSV with proper field mapping
export async function GET(request: Request) {
  const authError = checkSeedAuth(request)
  if (authError) return authError

  try {
    const payload = await getPayload({ config })
    const results: string[] = []

    const pagesPath = path.resolve(
      process.cwd(),
      'exported cms/Copy of AAAnow - About Pages - 6981bc63d15449fd5f2c2a47.csv',
    )
    const pagesContent = fs.readFileSync(pagesPath, 'utf-8')

    const columns = [
      'Name',
      'Slug',
      'Collection ID',
      'Locale ID',
      'Item ID',
      'Archived',
      'Draft',
      'Created On',
      'Updated On',
      'Published On',
      'Subheading',
      'Rich Text 1',
      'Quote 1',
      'Quote Author',
      'Order',
      'Footer Indent',
      'Popups',
      'Footer Category',
      'Sidebar Image',
      'Sidebar Quote',
    ]

    const rows = parseCSV(pagesContent, columns)

    for (const row of rows) {
      if (!row.Name || !row.Slug) continue
      if (row.Slug.includes('<') || row.Slug.includes('>')) continue

      const existing = await payload.find({
        collection: 'pages',
        where: { slug: { equals: row.Slug } },
      })

      if (existing.docs.length > 0) {
        results.push(`Skipped: ${row.Name}`)
        continue
      }

      const isDraft = row.Draft?.toLowerCase() === 'true'

      // Resolve popup slugs → relationship IDs
      let popupIds: string[] | null = null
      if (row.Popups) {
        popupIds = await resolvePopupSlugs(payload, row.Popups)
        if (popupIds.length === 0) popupIds = null
      }

      // Upload sidebar image → media relation
      let sidebarImageId: string | null = null
      const imageUrl = row['Sidebar Image']?.trim()
      if (imageUrl && imageUrl.startsWith('http')) {
        sidebarImageId = await uploadImageFromUrl(payload, imageUrl, row.Name)
        if (sidebarImageId) {
          results.push(`  Uploaded sidebar image for: ${row.Name}`)
        }
      }

      await payload.create({
        collection: 'pages',
        draft: isDraft,
        data: {
          title: row.Name,
          slug: row.Slug,
          subheading: row.Subheading || null,
          content: row['Rich Text 1'] ? htmlToLexical(row['Rich Text 1']) : null,
          quote: row['Quote 1'] || null,
          quoteAuthor: row['Quote Author'] || null,
          popups: popupIds,
          sidebarImage: sidebarImageId,
          sidebarQuote: row['Sidebar Quote'] || null,
          _status: isDraft ? 'draft' : 'published',
        },
      })

      results.push(`Created: ${row.Name}`)
    }

    return NextResponse.json({ success: true, count: results.length, results })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
