import type { GlobalConfig } from 'payload'
import { revalidateGlobalAfterChange } from '../hooks/revalidateOnChange'

export const Hero: GlobalConfig = {
  slug: 'hero',
  label: 'Hero',
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
      name: 'pillText',
      type: 'text',
      label: 'Pill Text',
      defaultValue: 'For Agencies',
      admin: {
        description: 'Text shown in the small pill above the title (e.g. "For Agencies")',
      },
    },
    {
      name: 'pillIcon',
      type: 'upload',
      relationTo: 'media',
      label: 'Pill Icon',
      admin: {
        description: 'Small icon image shown in the pill above the title',
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
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'Icon',
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
