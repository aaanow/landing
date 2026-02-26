import type { GlobalConfig } from 'payload'
import { revalidateGlobalAfterChange } from '../hooks/revalidateOnChange'

export const CTA: GlobalConfig = {
  slug: 'cta',
  label: 'CTA Section',
  admin: {
    group: 'Landing Page',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      revalidateGlobalAfterChange(['/']),
    ],
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
      defaultValue: 'Ready to Transform Client Retention?',
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Body Text',
      defaultValue:
        'Join agencies who are turning oversight into revenue.\nStart monitoring fundamentals, showing value, and converting insights into paid work.',
    },
    {
      name: 'buttonText',
      type: 'text',
      label: 'Button Text',
      defaultValue: 'Get Started',
    },
    {
      name: 'buttonAction',
      type: 'select',
      label: 'Button Action',
      defaultValue: 'modal',
      options: [
        { label: 'Open Get Started Modal', value: 'modal' },
        { label: 'Link', value: 'link' },
      ],
    },
    {
      name: 'buttonLink',
      type: 'text',
      label: 'Button Link',
      admin: {
        description: 'URL if action is set to Link',
        condition: (_, siblingData) => siblingData?.buttonAction === 'link',
      },
    },
  ],
}
