import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidateOnChange'

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

export const Products: CollectionConfig = {
  slug: 'products',
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
    afterChange: [
      revalidateAfterChange((doc) => [`/${doc.slug}`]),
    ],
    afterDelete: [
      revalidateAfterDelete((doc) => [`/${doc.slug}`]),
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
      name: 'panels',
      type: 'array',
      label: 'Panels',
      admin: {
        description: 'Content panels displayed as sections on the product page',
      },
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
        },
        {
          name: 'buttonLabel',
          type: 'text',
          admin: {
            description: 'Text displayed on the button',
          },
        },
        {
          name: 'buttonLink',
          type: 'text',
          admin: {
            description: 'URL or path the button links to',
          },
        },
        {
          name: 'mediaType',
          type: 'select',
          defaultValue: 'image',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_, siblingData) => siblingData?.mediaType !== 'video',
            description: 'Image displayed on the right side of the panel',
          },
        },
        {
          name: 'videoUrl',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.mediaType === 'video',
            description: 'Video URL (YouTube, Vimeo, etc.)',
          },
        },
      ],
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
            description: 'Defaults to product title if empty',
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
