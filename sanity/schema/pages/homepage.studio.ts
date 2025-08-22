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
      fields: [
        { name: 'backgroundImage', title: 'Background Image', type: 'image' },
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' },
      ],
    },
  ],
});
