import type { CollectionConfig } from 'payload'

export const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
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
      name: 'chapter',
      type: 'relationship',
      relationTo: 'resource-chapters',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'snippet',
      type: 'textarea',
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'richText',
      type: 'richText',
    },
    {
      name: 'quote',
      type: 'textarea',
    },
    {
      name: 'tag',
      type: 'text',
    },
    {
      name: 'pdf',
      type: 'text',
    },
    {
      name: 'icon',
      type: 'text',
    },
    {
      name: 'blogArticle',
      type: 'text',
    },
    {
      name: 'externalLink',
      type: 'text',
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Blog Post', value: 'blog-post' },
        { label: 'External Link', value: 'external-link' },
        { label: 'Resource', value: 'resource' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'location',
      type: 'text',
    },
  ],
}
