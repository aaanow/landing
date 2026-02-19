import type { GlobalConfig } from 'payload'

export const ResearchStats: GlobalConfig = {
  slug: 'research-stats',
  label: 'Research Stats',
  admin: {
    group: 'Landing Page',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
      defaultValue: 'How agencies turn insight into measurable growth.',
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Stats',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'value',
          type: 'text',
          label: 'Value',
          required: true,
          admin: {
            description: 'e.g. "58%"',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: true,
        },
      ],
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'CTA Text',
      defaultValue: 'Read the research',
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'CTA Link',
      defaultValue: '#',
    },
  ],
}
