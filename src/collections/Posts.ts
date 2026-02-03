import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
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
      },
    },
    {
      name: 'featuredImage',
      type: 'text',
      admin: {
        description: 'URL to the main image',
      },
    },
    {
      name: 'thumbnailImage',
      type: 'text',
      admin: {
        description: 'URL to the thumbnail image',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tag',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'landing',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show on landing page',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'externalLink',
      type: 'text',
    },
    {
      name: 'author',
      type: 'text',
    },
    {
      name: 'referenceArticle',
      type: 'text',
      admin: {
        description: 'Slug of related article',
      },
    },
    {
      name: 'quote',
      type: 'textarea',
    },
    {
      name: 'quoteImage',
      type: 'text',
    },
    {
      name: 'quoteName',
      type: 'text',
    },
    {
      name: 'quoteLogo',
      type: 'text',
    },
  ],
}
