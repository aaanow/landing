import type { GlobalConfig } from 'payload'
import { revalidateGlobalAfterChange } from '../hooks/revalidateOnChange'

export const ResearchStats: GlobalConfig = {
  slug: 'research-stats',
  label: 'Research Stats',
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
      name: 'ctaTitle',
      type: 'text',
      label: 'CTA Title',
      defaultValue: 'AiSC value;',
      admin: {
        description: 'Bold title displayed above the CTA button',
      },
    },
    {
      name: 'ctaSubtitle',
      type: 'text',
      label: 'CTA Subtitle',
      defaultValue: 'client confidence, agency revenue.',
      admin: {
        description: 'Text displayed below the bold title, above the CTA button',
      },
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
      defaultValue: '/images/58_21_17-Reveune_R02424_84ATA.pdf',
    },
  ],
}
