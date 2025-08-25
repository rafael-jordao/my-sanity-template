// Studio-only
import { isUniqueAcrossAllPages } from '@/sanity/lib/isUniqueAcrossAllPages';
import { defineType } from 'sanity';

export const pageSettingsType = defineType({
  name: 'pageSettings',
  title: 'Page Settings',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: false,
  },
  fields: [
    {
      name: 'title',
      title: 'Page Title (Internal)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        isUnique: isUniqueAcrossAllPages,
      },
    },
    { name: 'seo', title: 'SEO', type: 'seo' },
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current' },
    prepare({ title, slug }) {
      return { title, subtitle: `${slug}` };
    },
  },
});
