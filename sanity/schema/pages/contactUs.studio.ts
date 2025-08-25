// Studio-only
import { definePage } from '../documents/page.studio';

export const contactUsType = definePage({
  name: 'contactUs',
  title: 'ContactUs',
  fields: [
    {
      name: 'content',
      title: 'Content',
      type: 'object',
      options: {
        collapsible: true,
      },
      fields: [
        { name: 'title', title: 'Title', type: 'string' },
      ],
    },
  ],
});
