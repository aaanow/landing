import type { GlobalConfig } from 'payload'
import { revalidateGlobalAfterChange } from '../hooks/revalidateOnChange'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: {
    group: 'Site',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      revalidateGlobalAfterChange(['/'], 'layout'),
    ],
  },
  fields: [
    {
      name: 'links',
      type: 'array',
      label: 'Navigation Links',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'CTA Button Label',
      defaultValue: 'Get Started',
    },
  ],
}
