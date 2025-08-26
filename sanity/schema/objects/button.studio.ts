// Studio-only
import { defineType } from 'sanity';

export const buttonType = defineType({
  name: 'button',
  title: 'Button',
  type: 'object',
  fields: [
    {
      name: 'variant',
      title: 'Button Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
          { title: 'Outline', value: 'outline' },
          { title: 'Ghost', value: 'ghost' },
          { title: 'Link', value: 'link' },
        ],
      },
      initialValue: 'primary',
    },
  ],
  preview: {
    select: {
      title: 'variant',
    },
    prepare(selection) {
      const { title } = selection;
      return {
        title: title || 'Button',
      };
    },
  },
});
