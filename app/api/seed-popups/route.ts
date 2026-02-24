import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { checkSeedAuth } from '@/lib/seed-auth'
import { parseCSV } from '@/lib/csv'
import { htmlToLexical } from '@/lib/lexical'
import fs from 'fs'
import path from 'path'

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

    const urlPath = new URL(imageUrl).pathname
    const filename = urlPath.split('/').pop() || 'image.png'

    const media = await payload.create({
      collection: 'media',
      data: {
        alt: altText || 'Popup image',
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

// DELETE: Clear all popups (run before re-seeding)
export async function DELETE(request: Request) {
  const authError = checkSeedAuth(request)
  if (authError) return authError

  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'popups',
      limit: 500,
    })

    let deleted = 0
    for (const doc of result.docs) {
      await payload.delete({ collection: 'popups', id: doc.id })
      deleted++
    }

    return NextResponse.json({ success: true, deleted })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// GET: Seed popups from CSV with proper field mapping
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

      // Upload icon image → media relation
      let iconId: string | null = null
      const iconUrl = row.Icon?.trim()
      if (iconUrl && iconUrl.startsWith('http')) {
        iconId = await uploadImageFromUrl(payload, iconUrl, `${row.Name} icon`)
        if (iconId) {
          results.push(`  Uploaded icon for: ${row.Name}`)
        }
      }

      // Upload featured image → media relation
      let imageId: string | null = null
      const imageUrl = row.Image?.trim()
      if (imageUrl && imageUrl.startsWith('http')) {
        imageId = await uploadImageFromUrl(payload, imageUrl, `${row.Name} image`)
        if (imageId) {
          results.push(`  Uploaded image for: ${row.Name}`)
        }
      }

      await payload.create({
        collection: 'popups',
        draft: isDraft,
        data: {
          name: row.Name,
          slug: row.Slug,
          icon: iconId,
          image: imageId,
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
