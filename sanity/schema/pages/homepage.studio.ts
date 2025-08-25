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
