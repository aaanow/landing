import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { checkSeedAuth } from '@/lib/seed-auth'
import { parseCSV } from '@/lib/csv'
import { htmlToLexical } from '@/lib/lexical'
import fs from 'fs'
import path from 'path'

const faqColumns = [
  'Name', 'Slug', 'Collection ID', 'Locale ID', 'Item ID',
  'Archived', 'Draft', 'Created On', 'Updated On', 'Published On',
  'Answer', 'Order', 'Show on Landing',
]

export async function GET(request: Request) {
  const authError = checkSeedAuth(request)
  if (authError) return authError

  try {
    const payload = await getPayload({ config })

    const csvPath = path.resolve(
      process.cwd(),
      'exported cms/Copy of AAAnow - Frequently Asked Questions - 6981bc63d15449fd5f2c2a49.csv',
    )
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const rows = parseCSV(csvContent, faqColumns)

    const results: string[] = []

    for (const row of rows) {
      if (!row.Name || !row.Slug || !row.Answer) continue

      const existing = await payload.find({
        collection: 'faqs',
        where: { slug: { equals: row.Slug } },
      })

      if (existing.docs.length > 0) {
        results.push(`Skipped: ${row.Name}`)
        continue
      }

      await payload.create({
        collection: 'faqs',
        data: {
          question: row.Name,
          slug: row.Slug,
          answer: htmlToLexical(row.Answer),
          order: row.Order ? parseInt(row.Order, 10) : null,
          showOnLanding: row['Show on Landing']?.toLowerCase() === 'true',
        },
      })

      results.push(`Created: ${row.Name}`)
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    )
  }
}
