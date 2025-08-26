import { defineType } from 'sanity';

export const headerType = defineType({
  name: 'header',
  title: 'Header',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
    },
    {
      name: 'navigation',
      title: 'Navigation',
      type: 'reference',
      to: [{ type: 'menu' }],
    },
    {
      name: 'enableCta',
      title: 'Enable Call to Action',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'cta',
      title: 'Call to Action',
      type: 'reference',
      to: [{ type: 'callToAction' }],
      hidden: ({ document }) => !document?.enableCta,
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'logo',
    },
  },
});
