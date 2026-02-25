import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidateOnChange'

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

export const Popups: CollectionConfig = {
  slug: 'popups',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'aboutPage', '_status'],
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
        if (data && !data.slug && data.name && operation === 'create') {
          data.slug = slugify(data.name)
        }
        return data
      },
    ],
    afterChange: [
      revalidateAfterChange((doc) => {
        const paths = [`/${doc.slug}`]
        if (doc.aboutPage) paths.push(`/${doc.aboutPage}`)
        return paths
      }),
    ],
    afterDelete: [
      revalidateAfterDelete((doc) => {
        const paths = [`/${doc.slug}`]
        if (doc.aboutPage) paths.push(`/${doc.aboutPage}`)
        return paths
      }),
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
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Icon image',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Featured image',
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
  ],
}
