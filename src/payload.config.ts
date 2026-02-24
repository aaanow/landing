import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor, EXPERIMENTAL_TableFeature } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Pages } from './collections/Pages'
import { FAQs } from './collections/FAQs'
import { ResourceChapters } from './collections/ResourceChapters'
import { Resources } from './collections/Resources'
import { Popups } from './collections/Popups'
import { Legals } from './collections/Legals'
import { Scorecards } from './collections/Scorecards'
import { Footer } from './globals/Footer'
import { Navigation as NavigationGlobal } from './globals/Navigation'
import { Testimonials } from './globals/Testimonials'
import { LogoMarquee } from './globals/LogoMarquee'
import { Hero } from './globals/Hero'
import { CTA } from './globals/CTA'
import { HowItWorks } from './globals/HowItWorks'
import { ResearchStats } from './globals/ResearchStats'
import { ResourceSidebar } from './globals/ResourceSidebar'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Posts, Pages, FAQs, ResourceChapters, Resources, Popups, Legals, Scorecards],
  globals: [Footer, NavigationGlobal, Testimonials, LogoMarquee, Hero, CTA, HowItWorks, ResearchStats, ResourceSidebar],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures, EXPERIMENTAL_TableFeature()],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
