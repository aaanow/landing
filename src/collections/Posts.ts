import type { CollectionConfig } from 'payload'

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', '_status', 'publishedAt'],
  },
  defaultSort: '-publishedAt',
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
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Main banner image',
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
      name: 'category',
      type: 'select',
      options: [
        { label: 'Category 1', value: 'category-1' },
        { label: 'Category 2', value: 'category-2' },
        { label: 'Category 3', value: 'category-3' },
        { label: 'Category 4', value: 'category-4' },
        { label: 'Category 5', value: 'category-5' },
        { label: 'Category 6', value: 'category-6' },
        { label: 'Category 7', value: 'category-7' },
        { label: 'Category 8', value: 'category-8' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Tag 1', value: 'tag-1' },
        { label: 'Tag 2', value: 'tag-2' },
        { label: 'Tag 3', value: 'tag-3' },
        { label: 'Tag 4', value: 'tag-4' },
        { label: 'Tag 5', value: 'tag-5' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'externalLink',
      type: 'text',
      admin: {
        description: 'External URL for this post',
      },
      validate: (value: unknown) => {
        if (!value) return true
        if (typeof value === 'string' && /^https?:\/\/.+/.test(value)) return true
        return 'Please enter a valid URL starting with http:// or https://'
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'group',
      name: 'meta',
      label: 'SEO',
      admin: {
        description: 'Override default SEO metadata',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'Defaults to post title if empty',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Defaults to excerpt if empty',
          },
        },
      ],
    },
  ],
}
