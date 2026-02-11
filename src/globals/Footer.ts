import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'linkGroups',
      type: 'array',
      label: 'Link Groups',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'links',
          type: 'array',
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
            {
              name: 'external',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
      ],
    },
    {
      name: 'disclaimerText',
      type: 'textarea',
      label: 'Disclaimer Text',
    },
    {
      name: 'copyrightText',
      type: 'text',
      label: 'Copyright Text',
    },
    {
      name: 'logo',
      type: 'text',
      label: 'Logo URL',
      admin: {
        description: 'Path to the footer logo image (e.g. /images/aaanow_logo.svg)',
      },
    },
    {
      name: 'attributionText',
      type: 'text',
      label: 'Attribution Text',
    },
    {
      name: 'attributionLink',
      type: 'text',
      label: 'Attribution Link',
    },
  ],
}
