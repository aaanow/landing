import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidateOnChange'

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

export const Legals: CollectionConfig = {
  slug: 'legals',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order', '_status'],
  },
  defaultSort: 'order',
  versions: {
    drafts: true,
  },
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
    afterChange: [
      revalidateAfterChange((doc) => [`/${doc.slug}`]),
    ],
    afterDelete: [
      revalidateAfterDelete((doc) => [`/${doc.slug}`]),
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
      name: 'content',
      type: 'richText',
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
