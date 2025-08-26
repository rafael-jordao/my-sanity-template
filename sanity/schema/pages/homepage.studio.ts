// Studio-only
import { definePage } from '../documents/page.studio';

export const homepageType = definePage({
  name: 'homepage',
  title: 'Homepage',
  fields: [
    {
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      options: {
        collapsible: true,
      },
      fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' },
        {
          name: 'callToAction',
          title: 'Call To Action',
          type: 'reference',
          to: [{ type: 'callToAction' }],
        },
      ],
    },

    {
      name: 'intro',
      title: 'Intro Section',
      type: 'object',
      options: {
        collapsible: true,
      },
      fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' },
      ],
    },
  ],
});
