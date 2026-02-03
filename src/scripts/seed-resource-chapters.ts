import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'
import path from 'path'

interface ResourceChapterRow {
  name: string
  slug: string
  order: number | null
}

function parseCSV(content: string): ResourceChapterRow[] {
  const lines = content.split('\n')
  const chapters: ResourceChapterRow[] = []

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Parse CSV line handling quoted fields
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

    // CSV columns: Name,Slug,Collection ID,Locale ID,Item ID,Archived,Draft,Created On,Updated On,Published On,Order
    const name = fields[0]
    const slug = fields[1]
    const orderStr = fields[10]

    if (name && slug) {
      chapters.push({
        name,
        slug,
        order: orderStr ? parseInt(orderStr, 10) : null,
      })
    }
  }

  return chapters
}

async function seedResourceChapters() {
  console.log('Starting Resource Chapters seed...')

  const payload = await getPayload({ config })

  // Read and parse CSV
  const csvPath = path.resolve(
    process.cwd(),
    'exported cms/Copy of AAAnow - Resource Chapters - 6981bc63d15449fd5f2c2a12.csv',
  )
  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  const chapters = parseCSV(csvContent)

  console.log(`Found ${chapters.length} Resource Chapters to import`)

  for (const chapter of chapters) {
    try {
      // Check if chapter with this slug already exists
      const existing = await payload.find({
        collection: 'resource-chapters',
        where: { slug: { equals: chapter.slug } },
      })

      if (existing.docs.length > 0) {
        console.log(`Skipping existing Resource Chapter: ${chapter.name}`)
        continue
      }

      await payload.create({
        collection: 'resource-chapters',
        data: {
          name: chapter.name,
          slug: chapter.slug,
          order: chapter.order,
        },
      })

      console.log(`Created Resource Chapter: ${chapter.name}`)
    } catch (error) {
      console.error(`Error creating Resource Chapter "${chapter.name}":`, error)
    }
  }

  console.log('Resource Chapters seed completed!')
  process.exit(0)
}

seedResourceChapters()
