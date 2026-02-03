import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'
import path from 'path'

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

function parseCSV(content: string): ResourceRow[] {
  const lines = content.split('\n')
  const resources: ResourceRow[] = []

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

    // CSV columns: Name,Slug,Collection ID,Locale ID,Item ID,Archived,Draft,Created On,Updated On,Published On,Chapter,Snippet,Order,Rich Text,Quote,Tag,PDF,Icon,Blog Article,External Link,Type,Location
    const name = fields[0]
    const slug = fields[1]
    const chapterSlug = fields[10] || ''
    const snippet = fields[11] || ''
    const orderStr = fields[12]
    const richText = fields[13] || ''
    const quote = fields[14] || ''
    const tag = fields[15] || ''
    const pdf = fields[16] || ''
    const icon = fields[17] || ''
    const blogArticle = fields[18] || ''
    const externalLink = fields[19] || ''
    const typeValue = fields[20] || ''
    const location = fields[21] || ''

    if (name && slug) {
      resources.push({
        name,
        slug,
        chapterSlug,
        snippet,
        order: orderStr ? parseInt(orderStr, 10) : null,
        richText,
        quote,
        tag,
        pdf,
        icon,
        blogArticle,
        externalLink,
        type: typeValue,
        location,
      })
    }
  }

  return resources
}

function htmlToLexical(html: string) {
  if (!html) {
    return {
      root: {
        type: 'root',
        children: [],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    }
  }

  // Convert HTML to Lexical format - handling various HTML tags
  const paragraphs: string[] = []

  // Split by block-level tags
  const blockRegex = /<(p|h[1-6]|blockquote|ul|ol|li|div)[^>]*>([\s\S]*?)<\/\1>/gi
  let match
  let lastIndex = 0

  while ((match = blockRegex.exec(html)) !== null) {
    // Add any text between tags as a paragraph
    const textBefore = html.substring(lastIndex, match.index).trim()
    if (textBefore && textBefore !== '‍') {
      paragraphs.push(textBefore.replace(/<[^>]*>/g, ''))
    }

    const content = match[2].replace(/<[^>]*>/g, '').trim()
    if (content && content !== '‍') {
      paragraphs.push(content)
    }
    lastIndex = match.index + match[0].length
  }

  // Add any remaining text
  const remaining = html.substring(lastIndex).trim()
  if (remaining && remaining !== '‍') {
    const cleaned = remaining.replace(/<[^>]*>/g, '').trim()
    if (cleaned && cleaned !== '‍') {
      paragraphs.push(cleaned)
    }
  }

  // If no paragraphs found, treat whole content as one paragraph
  if (paragraphs.length === 0) {
    const cleaned = html.replace(/<[^>]*>/g, '').trim()
    if (cleaned && cleaned !== '‍') {
      paragraphs.push(cleaned)
    }
  }

  const children = paragraphs
    .filter((p) => p && p !== '‍')
    .map((text) => ({
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

function mapTypeValue(type: string): 'blog-post' | 'external-link' | 'resource' | null {
  const normalized = type.toLowerCase().trim()
  if (normalized === 'blog post') return 'blog-post'
  if (normalized === 'external link') return 'external-link'
  if (normalized === 'resource') return 'resource'
  return null
}

async function seedResources() {
  console.log('Starting Resources seed...')

  const payload = await getPayload({ config })

  // First, get all resource chapters to create a slug -> id map
  const chaptersResult = await payload.find({
    collection: 'resource-chapters',
    limit: 100,
  })

  const chapterMap = new Map<string, string | number>()
  for (const chapter of chaptersResult.docs) {
    chapterMap.set(chapter.slug as string, chapter.id)
  }
  console.log(`Found ${chapterMap.size} chapters in database`)

  // Read and parse CSV
  const csvPath = path.resolve(
    process.cwd(),
    'exported cms/Copy of AAAnow - Resources - 6981bc63d15449fd5f2c29e9.csv',
  )
  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  const resources = parseCSV(csvContent)

  console.log(`Found ${resources.length} Resources to import`)

  for (const resource of resources) {
    try {
      // Check if resource with this slug already exists
      const existing = await payload.find({
        collection: 'resources',
        where: { slug: { equals: resource.slug } },
      })

      if (existing.docs.length > 0) {
        console.log(`Skipping existing Resource: ${resource.name}`)
        continue
      }

      // Look up chapter ID from slug
      const chapterId = resource.chapterSlug ? chapterMap.get(resource.chapterSlug) : null

      await payload.create({
        collection: 'resources',
        data: {
          name: resource.name,
          slug: resource.slug,
          chapter: chapterId || undefined,
          snippet: resource.snippet || undefined,
          order: resource.order,
          richText: resource.richText ? htmlToLexical(resource.richText) : undefined,
          quote: resource.quote || undefined,
          tag: resource.tag || undefined,
          pdf: resource.pdf || undefined,
          icon: resource.icon || undefined,
          blogArticle: resource.blogArticle || undefined,
          externalLink: resource.externalLink || undefined,
          type: mapTypeValue(resource.type) || undefined,
          location: resource.location || undefined,
        },
      })

      console.log(`Created Resource: ${resource.name}`)
    } catch (error) {
      console.error(`Error creating Resource "${resource.name}":`, error)
    }
  }

  console.log('Resources seed completed!')
  process.exit(0)
}

seedResources()
