// Studio-only
import { definePage } from '../documents/page.studio';

export const aboutUsType = definePage({
  name: 'aboutUs',
  title: 'About Us',
  fields: [
    {
      name: 'intro',
      title: 'Intro',
      type: 'object',
      fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' },
      ],
    },
  ],
});
