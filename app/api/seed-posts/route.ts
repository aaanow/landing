import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { checkSeedAuth } from '@/lib/seed-auth'
import { parseCSV } from '@/lib/csv'
import { htmlToLexical } from '@/lib/lexical'
import fs from 'fs'
import path from 'path'

function parseDate(dateStr: string): string | null {
  if (!dateStr) return null
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return null
    return date.toISOString()
  } catch {
    return null
  }
}

export async function GET(request: Request) {
  const authError = checkSeedAuth(request)
  if (authError) return authError

  try {
    const payload = await getPayload({ config })
    const results: string[] = []

    const postsPath = path.resolve(
      process.cwd(),
      'exported cms/Copy of AAAnow - Blog Posts - 6981bc63d15449fd5f2c2941.csv',
    )
    const postsContent = fs.readFileSync(postsPath, 'utf-8')

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
      'Publication Date',
      'Category',
      'Tag',
      'Landing',
      'Featured',
      'Snippet',
      'Post Body',
      'External Link',
      'Main Image',
      'Thumbnail image',
      'Author',
      'Reference Article',
      'Quote',
      'Quote Image',
      'Quote Name',
      'Quote Logo',
    ]

    const rows = parseCSV(postsContent, columns)

    for (const row of rows) {
      if (!row.Name || !row.Slug) continue

      if (row.Slug.includes('<') || row.Slug.includes('>')) continue

      const existing = await payload.find({
        collection: 'posts',
        where: { slug: { equals: row.Slug } },
      })

      if (existing.docs.length > 0) {
        results.push(`Skipped: ${row.Name}`)
        continue
      }

      const isDraft = row.Draft?.toLowerCase() === 'true'

      await payload.create({
        collection: 'posts',
        data: {
          title: row.Name,
          slug: row.Slug,
          featuredImage: row['Main Image'] || null,
          thumbnailImage: row['Thumbnail image'] || null,
          excerpt: row.Snippet || null,
          content: row['Post Body'] ? htmlToLexical(row['Post Body']) : null,
          publishedAt: parseDate(row['Publication Date']),
          status: isDraft ? 'draft' : 'published',
          category: row.Category || null,
          tag: row.Tag || null,
          landing: row.Landing?.toLowerCase() === 'true',
          featured: row.Featured?.toLowerCase() === 'true',
          externalLink: row['External Link'] || null,
          author: row.Author || null,
          referenceArticle: row['Reference Article'] || null,
          quote: row.Quote || null,
          quoteImage: row['Quote Image'] || null,
          quoteName: row['Quote Name'] || null,
          quoteLogo: row['Quote Logo'] || null,
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
