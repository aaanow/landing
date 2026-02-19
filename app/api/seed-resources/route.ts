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
        // Update existing resource with chapter if it's missing
        const existingResource = existing.docs[0]
        const chapterSlugForUpdate = row.Chapter?.toLowerCase()
        const chapterIdForUpdate = chapterSlugForUpdate ? chapterMap[chapterSlugForUpdate] : null

        if (chapterIdForUpdate && !existingResource.chapter) {
          await payload.update({
            collection: 'resources',
            id: existingResource.id as string,
            data: {
              chapter: chapterIdForUpdate,
            },
          })
          results.push(`Updated resource with chapter: ${row.Name}`)
        } else {
          results.push(`Skipped resource: ${row.Name}`)
        }
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
