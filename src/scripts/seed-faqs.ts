import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'
import path from 'path'

interface FAQRow {
  question: string
  slug: string
  answer: string
  order: number | null
  showOnLanding: boolean
}

function parseCSV(content: string): FAQRow[] {
  const lines = content.split('\n')
  const faqs: FAQRow[] = []

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

    // CSV columns: Question,Slug,Collection ID,Locale ID,Item ID,Archived,Draft,Created On,Updated On,Published On,Answer,Order,Show on landing
    const question = fields[0]
    const slug = fields[1]
    const answer = fields[10] || ''
    const orderStr = fields[11]
    const showOnLanding = fields[12]?.toLowerCase() === 'true'

    if (question && slug && answer) {
      faqs.push({
        question,
        slug,
        answer,
        order: orderStr ? parseInt(orderStr, 10) : null,
        showOnLanding,
      })
    }
  }

  return faqs
}

function htmlToLexical(html: string) {
  // Convert simple HTML paragraphs to Lexical format
  const paragraphs = html
    .split(/<\/?p>/)
    .map((p) => p.trim())
    .filter((p) => p && p !== '‍') // Filter out empty and zero-width chars

  const children = paragraphs.map((text) => ({
    type: 'paragraph',
    children: [{ type: 'text', text, version: 1 }],
    direction: 'ltr',
    format: '',
    indent: 0,
    textFormat: 0,
    version: 1,
  }))

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

async function seedFAQs() {
  console.log('Starting FAQ seed...')

  const payload = await getPayload({ config })

  // Read and parse CSV
  const csvPath = path.resolve(
    process.cwd(),
    'exported cms/Copy of AAAnow - Frequently Asked Questions - 6981bc63d15449fd5f2c2a49.csv',
  )
  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  const faqs = parseCSV(csvContent)

  console.log(`Found ${faqs.length} FAQs to import`)

  for (const faq of faqs) {
    try {
      // Check if FAQ with this slug already exists
      const existing = await payload.find({
        collection: 'faqs',
        where: { slug: { equals: faq.slug } },
      })

      if (existing.docs.length > 0) {
        console.log(`Skipping existing FAQ: ${faq.question}`)
        continue
      }

      await payload.create({
        collection: 'faqs',
        data: {
          question: faq.question,
          slug: faq.slug,
          answer: htmlToLexical(faq.answer),
          order: faq.order,
          showOnLanding: faq.showOnLanding,
        },
      })

      console.log(`Created FAQ: ${faq.question}`)
    } catch (error) {
      console.error(`Error creating FAQ "${faq.question}":`, error)
    }
  }

  console.log('FAQ seed completed!')
  process.exit(0)
}

seedFAQs()
