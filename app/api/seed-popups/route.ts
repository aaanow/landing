import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { checkSeedAuth } from '@/lib/seed-auth'
import { parseCSV } from '@/lib/csv'
import { htmlToLexical } from '@/lib/lexical'
import fs from 'fs'
import path from 'path'

export async function GET(request: Request) {
  const authError = checkSeedAuth(request)
  if (authError) return authError

  try {
    const payload = await getPayload({ config })
    const results: string[] = []

    const popupsPath = path.resolve(
      process.cwd(),
      'exported cms/Copy of AAAnow - Popups - 6981bc63d15449fd5f2c2a48.csv',
    )
    const popupsContent = fs.readFileSync(popupsPath, 'utf-8')

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
      'Icon',
      'Image',
      'Short Description',
      'Rich Text',
      'Link',
      'About',
    ]

    const rows = parseCSV(popupsContent, columns)

    for (const row of rows) {
      if (!row.Name || !row.Slug) continue

      if (row.Slug.includes('<') || row.Slug.includes('>')) continue

      const existing = await payload.find({
        collection: 'popups',
        where: { slug: { equals: row.Slug } },
      })

      if (existing.docs.length > 0) {
        results.push(`Skipped: ${row.Name}`)
        continue
      }

      const isDraft = row.Draft?.toLowerCase() === 'true'

      await payload.create({
        collection: 'popups',
        draft: isDraft,
        data: {
          name: row.Name,
          slug: row.Slug,
          shortDescription: row['Short Description'] || null,
          content: row['Rich Text'] ? htmlToLexical(row['Rich Text']) : null,
          link: row.Link || null,
          aboutPage: row.About || null,
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
