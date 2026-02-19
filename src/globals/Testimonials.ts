import type { GlobalConfig } from 'payload'

export const Testimonials: GlobalConfig = {
  slug: 'testimonials',
  label: 'Testimonials & Logos',
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
      defaultValue: 'Where we deliver confidence',
    },
    {
      name: 'subheading',
      type: 'text',
      defaultValue: 'Discover how agencies leverage AiSC across their entire client lifecycle.',
    },
    {
      name: 'caseStudies',
      type: 'array',
      label: 'Case Studies',
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          required: true,
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'linkLabel',
          type: 'text',
          defaultValue: 'Open casestudy',
        },
        {
          name: 'linkHref',
          type: 'text',
          admin: {
            description: 'URL to the case study page',
          },
        },
      ],
    },
    {
      name: 'clientLogosHeading',
      type: 'text',
      label: 'Client Logos Heading',
      defaultValue: "Who's talking about us",
    },
    {
      name: 'clientLogos',
      type: 'array',
      label: 'Client Logos',
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
        },
        {
          name: 'link',
          type: 'text',
          admin: {
            description: 'Optional link to client website',
          },
        },
      ],
    },
  ],
}
