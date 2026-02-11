import type { GlobalConfig } from 'payload'

export const Testimonials: GlobalConfig = {
  slug: 'testimonials',
  label: 'Testimonials & Logos',
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
          type: 'text',
          admin: {
            description: 'URL/path to company logo image',
          },
        },
        {
          name: 'image',
          type: 'text',
          admin: {
            description: 'URL/path to testimonial image (e.g. headshot)',
          },
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
          type: 'text',
          required: true,
          admin: {
            description: 'URL/path to client logo image',
          },
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
