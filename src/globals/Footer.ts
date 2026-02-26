import type { GlobalConfig } from 'payload'
import { revalidateGlobalAfterChange } from '../hooks/revalidateOnChange'

export const Footer: GlobalConfig = {
  slug: 'footer',
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
              name: 'linkType',
              type: 'select',
              defaultValue: 'internal',
              options: [
                { label: 'Internal Page', value: 'internal' },
                { label: 'External URL', value: 'external' },
              ],
              admin: {
                description: 'Internal links let you pick a CMS page; external links use a manual URL',
              },
            },
            {
              name: 'reference',
              type: 'relationship',
              relationTo: ['pages', 'popups', 'legals', 'scorecards', 'posts'],
              admin: {
                condition: (_, siblingData) => siblingData?.linkType !== 'external',
                description: 'Select a page to link to',
              },
            },
            {
              name: 'url',
              type: 'text',
              admin: {
                condition: (_, siblingData) => siblingData?.linkType === 'external',
                description: 'Full URL (e.g. https://example.com)',
              },
            },
            {
              name: 'indent',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Indent this link with a left border (sub-item style)',
              },
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
