import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

function parseCSV(content: string, columns: string[]): Record<string, string>[] {
  const lines = content.split('\n')
  const rows: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const fields: string[] = []
    let current = ''
    let inQuotes = false

    for (let j = 0; j < line.length; j++) {
      const char = line[j]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        fields.push(current)
        current = ''
      } else {
        current += char
      }
    }
    fields.push(current)

    const row: Record<string, string> = {}
    columns.forEach((col, idx) => {
      row[col] = fields[idx] || ''
    })
    rows.push(row)
  }

  return rows
}

function htmlToLexical(html: string) {
  if (!html || html.trim() === '') {
    return {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: '', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    }
  }

  // Split by common block-level tags
  const blocks = html.split(/<\/(?:p|h[1-6]|blockquote|li|ul|ol|figure|figcaption)>/gi)

  const children = blocks
    .map((block) => {
      // Clean up the block
      const cleaned = block
        .replace(/<[^>]*>/g, '') // Remove all HTML tags
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim()

      if (!cleaned || cleaned === '‍') return null

      return {
        type: 'paragraph',
        children: [{ type: 'text', text: cleaned, version: 1 }],
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        version: 1,
      }
    })
    .filter(Boolean)

  if (children.length === 0) {
    children.push({
      type: 'paragraph',
      children: [{ type: 'text', text: '', version: 1 }],
      direction: 'ltr',
      format: '',
      indent: 0,
      textFormat: 0,
      version: 1,
    })
  }

  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

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

export async function GET() {
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

      // Skip if slug looks like HTML (parsing error)
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
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    )
  }
}
