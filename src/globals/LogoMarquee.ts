import type { GlobalConfig } from 'payload'
import { revalidateGlobalAfterChange } from '../hooks/revalidateOnChange'

export const LogoMarquee: GlobalConfig = {
  slug: 'logo-marquee',
  label: 'Logo Marquee',
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
      defaultValue: 'Trusted by',
      admin: {
        description: 'Optional heading displayed above the logo marquee',
      },
    },
    {
      name: 'logos',
      type: 'array',
      label: 'Logos',
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          defaultValue: '',
          admin: {
            description: 'Alt text for accessibility',
          },
        },
        {
          name: 'link',
          type: 'text',
          admin: {
            description: 'Optional link to company website',
          },
        },
      ],
    },
    {
      name: 'speed',
      type: 'number',
      label: 'Scroll Speed',
      defaultValue: 1,
      admin: {
        description: 'Auto-scroll speed multiplier (1 = default, 2 = double speed)',
        step: 0.1,
      },
    },
    {
      name: 'direction',
      type: 'select',
      label: 'Scroll Direction',
      defaultValue: 'forward',
      options: [
        { label: 'Forward (left to right)', value: 'forward' },
        { label: 'Backward (right to left)', value: 'backward' },
      ],
    },
  ],
}
