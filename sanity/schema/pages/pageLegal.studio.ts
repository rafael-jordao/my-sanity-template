// Studio-only
import { definePage } from '../documents/page.studio';

export const pageLegalType = definePage({
  name: 'pageLegal',
  title: 'PageLegal',
  fields: [
    {
      name: 'content',
      title: 'Content',
      type: 'object',
      options: {
        collapsible: true,
      },
      fields: [{ name: 'title', title: 'Title', type: 'string' }],
    },
  ],
});
