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

      await payload.create({
        collection: 'pages',
        data: {
          title: row.Name,
          slug: row.Slug,
          subheading: row.Subheading || null,
          content: row['Rich Text 1'] ? htmlToLexical(row['Rich Text 1']) : null,
          quote: row['Quote 1'] || null,
          quoteAuthor: row['Quote Author'] || null,
          order: row.Order ? parseInt(row.Order, 10) : null,
          footerIndent: row['Footer Indent']?.toLowerCase() === 'true',
          popups: row.Popups || null,
          footerCategory: row['Footer Category'] || null,
          sidebarImage: row['Sidebar Image'] || null,
          sidebarQuote: row['Sidebar Quote'] || null,
          status: isDraft ? 'draft' : 'published',
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
