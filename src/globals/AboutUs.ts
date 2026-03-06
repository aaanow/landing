import type { GlobalConfig } from 'payload'
import { revalidateGlobalAfterChange } from '../hooks/revalidateOnChange'

export const AboutUs: GlobalConfig = {
  slug: 'about-us',
  label: 'About Us Banner',
  admin: {
    group: 'Site',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      revalidateGlobalAfterChange(['/'], 'layout'),
    ],
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
      defaultValue: 'About us',
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Body Text',
      required: true,
      defaultValue:
        'AAAnow is The Digital Confidence Company. We use AI to reduce manual effort across digital operations – from executive reporting to diagnostics and content correction.\n\nWith 25+ years of automation experience, we help organisations deliver faster, more compliant, continuously improving websites – giving you the clarity, control, and confidence to move forward.',
    },
    {
      name: 'image',
      type: 'text',
      label: 'Image URL',
      defaultValue: '/images/25anniversary.svg',
      admin: {
        description: 'Path to the banner image (e.g. /images/25anniversary.svg)',
      },
    },
    {
      name: 'imageAlt',
      type: 'text',
      label: 'Image Alt Text',
      defaultValue: '25 year anniversary',
    },
  ],
}
