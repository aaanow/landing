import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'
import path from 'path'
import { parseCSV } from '@/lib/csv'
import { htmlToLexical } from '@/lib/lexical'

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

function mapCategory(csvValue: string): string | undefined {
  if (!csvValue) return undefined
  const match = csvValue.match(/^Category (\d+)$/i)
  if (match) return `category-${match[1]}`
  return undefined
}

function mapTag(csvValue: string): string[] {
  if (!csvValue) return []
  const match = csvValue.match(/^Tag (\d+)$/i)
  if (match) return [`tag-${match[1]}`]
  return []
}

function parseDate(dateStr: string): string | undefined {
  if (!dateStr) return undefined
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return undefined
    return date.toISOString()
  } catch {
    return undefined
  }
}

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

async function seedPosts() {
  console.log('Starting Blog Posts seed...')

  const payload = await getPayload({ config })

  const csvPath = path.resolve(process.cwd(), CSV_PATH)
  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  const rows = parseCSV(csvContent, CSV_COLUMNS)

  console.log(`Found ${rows.length} Blog Posts to import`)

  let created = 0
  let skipped = 0

  for (const row of rows) {
    if (!row.Name || !row.Slug) continue
    if (row.Slug.includes('<') || row.Slug.includes('>')) continue

    try {
      const existing = await payload.find({
        collection: 'posts',
        where: { slug: { equals: row.Slug } },
      })

      if (existing.docs.length > 0) {
        console.log(`Skipping existing Post: ${row.Name}`)
        skipped++
        continue
      }

      // Upload featured image if present
      let featuredImageId: string | null = null
      const imageUrl = row['Main Image']?.trim()
      if (imageUrl && imageUrl.startsWith('http')) {
        featuredImageId = await uploadImageFromUrl(payload, imageUrl, row.Name)
        if (featuredImageId) {
          console.log(`  Uploaded image for: ${row.Name}`)
        }
      }

      const isDraft = row.Draft?.toLowerCase() === 'true'

      await payload.create({
        collection: 'posts',
        data: {
          title: row.Name,
          slug: row.Slug,
          publishedAt: parseDate(row['Publication Date']),
          category: mapCategory(row.Category),
          tags: mapTag(row.Tag),
          excerpt: row.Snippet || undefined,
          content: row['Post Body'] ? htmlToLexical(row['Post Body']) : undefined,
          externalLink: row['External Link'] || undefined,
          _status: isDraft ? 'draft' : 'published',
          ...(featuredImageId ? { featuredImage: featuredImageId } : {}),
        },
      })

      created++
      console.log(`Created Post: ${row.Name}`)
    } catch (error) {
      console.error(`Error creating Post "${row.Name}":`, error)
    }
  }

  console.log(`Blog Posts seed completed! Created: ${created}, Skipped: ${skipped}`)
  process.exit(0)
}

seedPosts()
