import type { GlobalConfig } from 'payload'

export const ResourceSidebar: GlobalConfig = {
  slug: 'resource-sidebar',
  admin: {
    group: 'Site',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Resource Items',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'document',
          options: [
            { label: 'Document', value: 'document' },
            { label: 'PDF', value: 'pdf' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            description: 'Link URL (leave empty for #)',
          },
        },
      ],
    },
  ],
}
