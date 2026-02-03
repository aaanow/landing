import type { CollectionConfig } from 'payload'

export const Popups: CollectionConfig = {
  slug: 'popups',
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
      name: 'icon',
      type: 'text',
      admin: {
        description: 'URL to icon image',
      },
    },
    {
      name: 'image',
      type: 'text',
      admin: {
        description: 'URL to image',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'link',
      type: 'text',
      admin: {
        description: 'URL or path for the link',
      },
    },
    {
      name: 'aboutPage',
      type: 'text',
      admin: {
        description: 'Slug of the related About page',
        position: 'sidebar',
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
  ],
}
