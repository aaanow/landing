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
  const blocks = html.split(/<\/(?:p|h[1-6]|blockquote|li|ul|ol|figure|figcaption|div)>/gi)

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

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const results: string[] = []

    const legalsPath = path.resolve(
      process.cwd(),
      'exported cms/Copy of AAAnow - Legals - 6981bc63d15449fd5f2c2a46.csv',
    )
    const legalsContent = fs.readFileSync(legalsPath, 'utf-8')

    // CSV columns: Name,Slug,Collection ID,Locale ID,Item ID,Archived,Draft,Created On,Updated On,Published On,Rich Text,Order
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
      'Rich Text',
      'Order',
    ]

    const rows = parseCSV(legalsContent, columns)

    for (const row of rows) {
      if (!row.Name || !row.Slug) continue

      // Skip if slug looks like HTML (parsing error)
      if (row.Slug.includes('<') || row.Slug.includes('>')) continue

      const existing = await payload.find({
        collection: 'legals',
        where: { slug: { equals: row.Slug } },
      })

      if (existing.docs.length > 0) {
        results.push(`Skipped: ${row.Name}`)
        continue
      }

      const isDraft = row.Draft?.toLowerCase() === 'true'

      await payload.create({
        collection: 'legals',
        data: {
          name: row.Name,
          slug: row.Slug,
          content: row['Rich Text'] ? htmlToLexical(row['Rich Text']) : null,
          order: row.Order ? parseInt(row.Order, 10) : null,
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
