import type { GlobalConfig } from 'payload'
import { revalidateGlobalAfterChange } from '../hooks/revalidateOnChange'

export const VideoShowcase: GlobalConfig = {
  slug: 'video-showcase',
  label: 'Video Showcase',
  admin: {
    group: 'Landing Page',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      revalidateGlobalAfterChange(['/']),
    ],
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
      defaultValue: 'Can we have 2mins. of your time please?',
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'YouTube Video URL',
      required: true,
      defaultValue: 'https://www.youtube.com/embed/AO94RR1HNE0',
      admin: {
        description: 'YouTube embed URL (e.g. https://www.youtube.com/embed/VIDEO_ID)',
      },
    },
  ],
}
