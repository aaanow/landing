import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'f9zjmgqvvmcuey8j.public.blob.vercel-storage.com',
      },
    ],
  },
}

export default withPayload(nextConfig)
