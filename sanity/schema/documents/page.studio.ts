// Studio-only
import { defineType, type FieldDefinition } from 'sanity';

export interface IDefinePage {
  name: string;
  title: string;
  fields: FieldDefinition[];
}

export const definePage = ({ name, title, fields }: IDefinePage) => {
  return defineType({
    name,
    title,
    type: 'document',
    preview: {
      select: { title: 'settings.title', subtitle: 'settings.slug.current' },
    },
    fields: [
      { name: 'settings', title: 'Page Settings', type: 'pageSettings' },
      ...fields,
    ],
  });
};
