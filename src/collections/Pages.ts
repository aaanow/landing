import type { CollectionConfig } from 'payload'

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status'],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (data && !data.slug && data.title && operation === 'create') {
          data.slug = slugify(data.title)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from title if left empty',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'quote',
      type: 'textarea',
      admin: {
        description: 'Featured quote displayed on the page',
      },
    },
    {
      name: 'quoteAuthor',
      type: 'text',
      admin: {
        description: 'Attribution for the quote',
      },
    },
    {
      name: 'popups',
      type: 'relationship',
      relationTo: 'popups',
      hasMany: true,
      admin: {
        description: 'Related popups displayed on this page',
      },
    },
    {
      name: 'sidebarImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Image displayed in the sidebar',
      },
    },
    {
      name: 'sidebarQuote',
      type: 'textarea',
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      admin: {
        description: 'Override default SEO metadata',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'Defaults to page title if empty',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Defaults to subheading if empty',
          },
        },
      ],
    },
  ],
}
