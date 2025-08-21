import { groq } from 'next-sanity';
import { defineType } from 'sanity';
import { GROQSeoQuery } from './seo';
import { isUniqueAcrossAllPages } from '../lib/isUniqueAcrossAllPages';

export const pageSettingsType = defineType({
  name: 'pageSettings',
  title: 'Page Settings',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Page Title (Internal)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        isUnique: isUniqueAcrossAllPages,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare({ title, slug }) {
      return {
        title: title,
        subtitle: `${slug}`,
      };
    },
  },
});

export const GROQPageSettingsQuery = groq`
  settings{
    title,
    "slug": slug.current,
    ${GROQSeoQuery}
  }
`;
