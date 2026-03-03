import type { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/constants'
import { getPayloadClient } from '@/src/payload'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/about-aisc`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/articles`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/pricing`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/reference-material`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/discover`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/documentation`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/our-capability`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/scorecards-map`, changeFrequency: 'monthly', priority: 0.6 },
  ]

  // Dynamic blog posts
  try {
    const payload = await getPayloadClient()
    const posts = await payload.find({ collection: 'posts', limit: 1000, select: { slug: true, updatedAt: true } })

    const postRoutes: MetadataRoute.Sitemap = posts.docs.map((post) => ({
      url: `${baseUrl}/posts/${post.slug}`,
      lastModified: new Date((post.updatedAt as string) ?? Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Dynamic CMS pages
    const pages = await payload.find({ collection: 'pages', limit: 1000, select: { slug: true, updatedAt: true } })

    const pageRoutes: MetadataRoute.Sitemap = pages.docs.map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: new Date((page.updatedAt as string) ?? Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    // Dynamic product pages
    const products = await payload.find({ collection: 'products', limit: 1000, select: { slug: true, updatedAt: true } })

    const productRoutes: MetadataRoute.Sitemap = products.docs.map((product) => ({
      url: `${baseUrl}/${product.slug}`,
      lastModified: new Date((product.updatedAt as string) ?? Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

    return [...staticRoutes, ...postRoutes, ...pageRoutes, ...productRoutes]
  } catch {
    return staticRoutes
  }
}
