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
      defaultValue: 'Uncover What Your Clients Need and the Revenue You\'re Missing',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      defaultValue: 'List your clients, analyse their sites, and generate actionable, costed plans you can use to win, retain, and expand accounts.',
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      minRows: 0,
      maxRows: 6,
      admin: {
        description: 'Small badge tags shown below the subtitle',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
        },
      ],
    },
    {
      name: 'slides',
      type: 'array',
      label: 'Carousel Slides',
      minRows: 1,
      maxRows: 10,
      admin: {
        description: 'Images for the hero carousel',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Alt Text',
          admin: {
            description: 'Accessible description of the image',
          },
        },
      ],
    },
    {
      name: 'autoplayDuration',
      type: 'number',
      label: 'Autoplay Duration (ms)',
      defaultValue: 5000,
      admin: {
        description: 'How long each slide is shown before auto-advancing',
      },
    },
  ],
}
