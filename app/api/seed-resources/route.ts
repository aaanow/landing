import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface ChapterRow {
  name: string
  slug: string
  order: number | null
}

interface ResourceRow {
  name: string
  slug: string
  chapterSlug: string
  snippet: string
  order: number | null
  richText: string
  quote: string
  tag: string
  pdf: string
  icon: string
  blogArticle: string
  externalLink: string
  type: string
  location: string
}

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

  const paragraphs = html
    .split(/<\/?p[^>]*>/)
    .map((p) => p.trim())
    .filter((p) => p && p !== '‍')

  const children = paragraphs.map((text) => ({
    type: 'paragraph',
    children: [{ type: 'text', text: text.replace(/<[^>]*>/g, ''), version: 1 }],
    direction: 'ltr',
    format: '',
    indent: 0,
    textFormat: 0,
    version: 1,
  }))

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

    // Seed Resource Chapters first
    const chaptersPath = path.resolve(
      process.cwd(),
      'exported cms/Copy of AAAnow - Resource Chapters - 6981bc63d15449fd5f2c2a12.csv',
    )
    const chaptersContent = fs.readFileSync(chaptersPath, 'utf-8')
    const chapterColumns = [
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
      'Order',
    ]
    const chapterRows = parseCSV(chaptersContent, chapterColumns)

    const chapterMap: Record<string, string> = {} // slug -> id

    for (const row of chapterRows) {
      if (!row.Name || !row.Slug) continue

      const existing = await payload.find({
        collection: 'resource-chapters',
        where: { slug: { equals: row.Slug } },
      })

      if (existing.docs.length > 0) {
        chapterMap[row.Slug.toLowerCase()] = existing.docs[0].id as string
        results.push(`Skipped chapter: ${row.Name}`)
        continue
      }

      const created = await payload.create({
        collection: 'resource-chapters',
        data: {
          name: row.Name,
          slug: row.Slug,
          order: row.Order ? parseInt(row.Order, 10) : null,
        },
      })

      chapterMap[row.Slug.toLowerCase()] = created.id as string
      results.push(`Created chapter: ${row.Name}`)
    }

    // Seed Resources
    const resourcesPath = path.resolve(
      process.cwd(),
      'exported cms/Copy of AAAnow - Resources - 6981bc63d15449fd5f2c29e9.csv',
    )
    const resourcesContent = fs.readFileSync(resourcesPath, 'utf-8')
    const resourceColumns = [
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
      'Chapter',
      'Snippet',
      'Order',
      'Rich Text',
      'Quote',
      'Tag',
      'PDF',
      'Icon',
      'Blog Article',
      'External Link',
      'Type',
      'Location',
    ]
    const resourceRows = parseCSV(resourcesContent, resourceColumns)

    for (const row of resourceRows) {
      if (!row.Name || !row.Slug) continue

      const existing = await payload.find({
        collection: 'resources',
        where: { slug: { equals: row.Slug } },
      })

      if (existing.docs.length > 0) {
        results.push(`Skipped resource: ${row.Name}`)
        continue
      }

      // Find chapter ID from slug
      const chapterSlug = row.Chapter?.toLowerCase()
      const chapterId = chapterSlug ? chapterMap[chapterSlug] : null

      // Map type value
      let typeValue: string | null = null
      if (row.Type === 'Blog Post') typeValue = 'blog-post'
      else if (row.Type === 'External Link') typeValue = 'external-link'
      else if (row.Type) typeValue = 'resource'

      await payload.create({
        collection: 'resources',
        data: {
          name: row.Name,
          slug: row.Slug,
          chapter: chapterId,
          snippet: row.Snippet || null,
          order: row.Order ? parseInt(row.Order, 10) : null,
          richText: row['Rich Text'] ? htmlToLexical(row['Rich Text']) : null,
          quote: row.Quote || null,
          tag: row.Tag || null,
          pdf: row.PDF || null,
          icon: row.Icon || null,
          blogArticle: row['Blog Article'] || null,
          externalLink: row['External Link'] || null,
          type: typeValue,
          location: row.Location || null,
        },
      })

      results.push(`Created resource: ${row.Name}`)
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
