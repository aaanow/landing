import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'
import path from 'path'

interface PostRow {
  title: string
  slug: string
  publishedAt: string
  category: string
  tag: string
  landing: boolean
  featured: boolean
  excerpt: string
  content: string
  externalLink: string
  featuredImage: string
  thumbnailImage: string
  author: string
  referenceArticle: string
  quote: string
  quoteImage: string
  quoteName: string
  quoteLogo: string
}

function parseCSV(content: string): PostRow[] {
  const lines = content.split('\n')
  const posts: PostRow[] = []

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

    // CSV columns: Name,Slug,Collection ID,Locale ID,Item ID,Archived,Draft,Created On,Updated On,Published On,
    //              Publication Date(10),Category(11),Tag(12),Landing(13),Featured(14),Snippet(15),Post Body(16),
    //              External Link(17),Main Image(18),Thumbnail image(19),Author(20),Reference Article(21),
    //              Quote(22),Quote Image(23),Quote Name(24),Quote Logo(25)
    const title = fields[0]
    const slug = fields[1]
    const publishedAt = fields[10] || ''
    const category = fields[11] || ''
    const tag = fields[12] || ''
    const landing = fields[13]?.toLowerCase() === 'true'
    const featured = fields[14]?.toLowerCase() === 'true'
    const excerpt = fields[15] || ''
    const content = fields[16] || ''
    const externalLink = fields[17] || ''
    const featuredImage = fields[18] || ''
    const thumbnailImage = fields[19] || ''
    const author = fields[20] || ''
    const referenceArticle = fields[21] || ''
    const quote = fields[22] || ''
    const quoteImage = fields[23] || ''
    const quoteName = fields[24] || ''
    const quoteLogo = fields[25] || ''

    if (title && slug) {
      posts.push({
        title,
        slug,
        publishedAt,
        category,
        tag,
        landing,
        featured,
        excerpt,
        content,
        externalLink,
        featuredImage,
        thumbnailImage,
        author,
        referenceArticle,
        quote,
        quoteImage,
        quoteName,
        quoteLogo,
      })
    }
  }

  return posts
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

async function seedPosts() {
  console.log('Starting Blog Posts seed...')

  const payload = await getPayload({ config })

  // Read and parse CSV
  const csvPath = path.resolve(
    process.cwd(),
    'exported cms/Copy of AAAnow - Blog Posts - 6981bc63d15449fd5f2c2941.csv',
  )
  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  const posts = parseCSV(csvContent)

  console.log(`Found ${posts.length} Blog Posts to import`)

  let created = 0
  let skipped = 0

  for (const post of posts) {
    try {
      // Check if post with this slug already exists
      const existing = await payload.find({
        collection: 'posts',
        where: { slug: { equals: post.slug } },
      })

      if (existing.docs.length > 0) {
        console.log(`Skipping existing Post: ${post.title}`)
        skipped++
        continue
      }

      await payload.create({
        collection: 'posts',
        data: {
          title: post.title,
          slug: post.slug,
          publishedAt: parseDate(post.publishedAt),
          category: post.category || undefined,
          tag: post.tag || undefined,
          landing: post.landing,
          featured: post.featured,
          excerpt: post.excerpt || undefined,
          content: post.content ? htmlToLexical(post.content) : undefined,
          externalLink: post.externalLink || undefined,
          featuredImage: post.featuredImage || undefined,
          thumbnailImage: post.thumbnailImage || undefined,
          author: post.author || undefined,
          referenceArticle: post.referenceArticle || undefined,
          quote: post.quote || undefined,
          quoteImage: post.quoteImage || undefined,
          quoteName: post.quoteName || undefined,
          quoteLogo: post.quoteLogo || undefined,
          status: 'published',
        },
      })

      created++
      console.log(`Created Post: ${post.title}`)
    } catch (error) {
      console.error(`Error creating Post "${post.title}":`, error)
    }
  }

  console.log(`Blog Posts seed completed! Created: ${created}, Skipped: ${skipped}`)
  process.exit(0)
}

seedPosts()
