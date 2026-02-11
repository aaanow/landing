import type { GlobalConfig } from 'payload'

export const Hero: GlobalConfig = {
  slug: 'hero',
  label: 'Hero',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'pillText',
      type: 'text',
      label: 'Pill Text',
      defaultValue: 'Latest news item',
      admin: {
        description: 'Text shown in the small pill/tag above the title',
      },
    },
    {
      name: 'pillLink',
      type: 'text',
      label: 'Pill Link',
      admin: {
        description: 'Optional URL the pill links to',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      defaultValue: 'Discover opportunities across your client accounts.',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      defaultValue: 'List your clients, analyse their sites, and generate actionable, costed plans you can use to win, retain, and expand accounts.',
    },
    {
      name: 'primaryButtonText',
      type: 'text',
      label: 'Primary Button Text',
      defaultValue: 'Get started',
    },
    {
      name: 'primaryButtonAction',
      type: 'select',
      label: 'Primary Button Action',
      defaultValue: 'modal',
      options: [
        { label: 'Open Get Started Modal', value: 'modal' },
        { label: 'Link', value: 'link' },
      ],
    },
    {
      name: 'primaryButtonLink',
      type: 'text',
      label: 'Primary Button Link',
      admin: {
        description: 'URL if action is set to Link',
        condition: (_, siblingData) => siblingData?.primaryButtonAction === 'link',
      },
    },
    {
      name: 'secondaryButtonText',
      type: 'text',
      label: 'Secondary Button Text',
      defaultValue: 'Talk to sales',
    },
    {
      name: 'secondaryButtonLink',
      type: 'text',
      label: 'Secondary Button Link',
      admin: {
        description: 'URL the secondary button links to',
      },
    },
  ],
}
