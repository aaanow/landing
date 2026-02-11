import type { GlobalConfig } from 'payload'

export const HowItWorks: GlobalConfig = {
  slug: 'how-it-works',
  label: 'How It Works',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      defaultValue: '',
    },
    {
      name: 'tabs',
      type: 'array',
      label: 'Tabs',
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          name: 'number',
          type: 'text',
          label: 'Number',
          required: true,
          admin: { description: 'e.g. "01"' },
        },
        {
          name: 'timeLabel',
          type: 'text',
          label: 'Time Label',
          required: true,
          admin: { description: 'e.g. "in 1 Day"' },
        },
        {
          name: 'outcomeLabel',
          type: 'text',
          label: 'Outcome Label',
          required: true,
          admin: { description: 'e.g. "Grow Client Revenue"' },
        },
        {
          name: 'actionTitle',
          type: 'text',
          label: 'Action Title',
          required: true,
        },
        {
          name: 'actionDescription',
          type: 'textarea',
          label: 'Action Description',
        },
        {
          name: 'steps',
          type: 'array',
          label: 'Steps',
          minRows: 1,
          maxRows: 6,
          fields: [
            { name: 'label', type: 'text', label: 'Label', required: true },
            { name: 'title', type: 'text', label: 'Title', required: true },
            { name: 'description', type: 'textarea', label: 'Description' },
          ],
        },
        {
          name: 'outcomeTitle',
          type: 'text',
          label: 'Outcome Title',
        },
        {
          name: 'outcomeDescription',
          type: 'textarea',
          label: 'Outcome Description',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image',
        },
      ],
    },
  ],
}
