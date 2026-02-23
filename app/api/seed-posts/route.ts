import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { checkSeedAuth } from '@/lib/seed-auth'
import { parseCSV } from '@/lib/csv'
import { htmlToLexical } from '@/lib/lexical'
import fs from 'fs'
import path from 'path'

const CSV_PATH = 'exported cms/AAAnow - Blog Posts - 680f3b3c6ee18679cca949af.csv'

const CSV_COLUMNS = [
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

// Map CSV category values ("Category 1") to select values ("category-1")
function mapCategory(csvValue: string): string | undefined {
  if (!csvValue) return undefined
  const match = csvValue.match(/^Category (\d+)$/i)
  if (match) return `category-${match[1]}`
  return undefined
}

// Map CSV tag values ("Tag 2") to select values ("tag-2")
function mapTag(csvValue: string): string[] {
  if (!csvValue) return []
  const match = csvValue.match(/^Tag (\d+)$/i)
  if (match) return [`tag-${match[1]}`]
  return []
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

    // Extract filename from URL
    const urlPath = new URL(imageUrl).pathname
    const filename = urlPath.split('/').pop() || 'image.png'

    const media = await payload.create({
      collection: 'media',
      data: {
        alt: altText || 'Blog post image',
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

// DELETE: Clear all posts (run before re-seeding with new schema)
export async function DELETE(request: Request) {
  const authError = checkSeedAuth(request)
  if (authError) return authError

  try {
    const payload = await getPayload({ config })

    const allPosts = await payload.find({
      collection: 'posts',
      limit: 500,
    })

    let deleted = 0
    for (const post of allPosts.docs) {
      await payload.delete({ collection: 'posts', id: post.id })
      deleted++
    }

    return NextResponse.json({ success: true, deleted })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// GET: Seed posts from CSV with image uploads
export async function GET(request: Request) {
  const authError = checkSeedAuth(request)
  if (authError) return authError

  try {
    const payload = await getPayload({ config })
    const results: string[] = []

    const postsPath = path.resolve(process.cwd(), CSV_PATH)
    const postsContent = fs.readFileSync(postsPath, 'utf-8')
    const rows = parseCSV(postsContent, CSV_COLUMNS)

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

      // Upload featured image if present
      let featuredImageId: string | null = null
      const imageUrl = row['Main Image']?.trim()
      if (imageUrl && imageUrl.startsWith('http')) {
        featuredImageId = await uploadImageFromUrl(payload, imageUrl, row.Name)
        if (featuredImageId) {
          results.push(`  Uploaded image for: ${row.Name}`)
        }
      }

      const isDraft = row.Draft?.toLowerCase() === 'true'

      await payload.create({
        collection: 'posts',
        data: {
          title: row.Name,
          slug: row.Slug,
          excerpt: row.Snippet || null,
          content: row['Post Body'] ? htmlToLexical(row['Post Body']) : null,
          publishedAt: parseDate(row['Publication Date']),
          _status: isDraft ? 'draft' : 'published',
          category: mapCategory(row.Category),
          tags: mapTag(row.Tag),
          externalLink: row['External Link'] || null,
          ...(featuredImageId ? { featuredImage: featuredImageId } : {}),
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
