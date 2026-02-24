import type { CollectionConfig } from 'payload'

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

export const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'chapter', 'type', 'order'],
  },
  defaultSort: 'order',
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (data && !data.slug && data.name && operation === 'create') {
          data.slug = slugify(data.name)
        }
        return data
      },
    ],
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
        description: 'Auto-generated from name if left empty',
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
      admin: {
        description: 'Short description shown in resource lists',
      },
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
      admin: {
        description: 'URL to PDF file',
      },
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Icon identifier for the resource',
      },
    },
    {
      name: 'blogArticle',
      type: 'text',
      admin: {
        description: 'Slug of related blog post',
      },
    },
    {
      name: 'externalLink',
      type: 'text',
      admin: {
        description: 'External URL for this resource',
      },
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
      admin: {
        description: 'Storage location identifier',
      },
    },
  ],
}
