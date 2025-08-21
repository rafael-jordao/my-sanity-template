import { groq } from 'next-sanity';
import { defineType, FieldDefinition } from 'sanity';
export interface IDefinePage {
  name: string;
  title: string;
  fields: FieldDefinition[];
}
export const definePage = ({ name, title, fields }: IDefinePage) => {
  return defineType({
    name: name,
    title: title,
    type: 'document',
    preview: {
      select: { title: 'settings.title', subtitle: 'settings.slug.current' },
    },
    fields: [
      { name: 'settings', title: 'Settings', type: 'pageSettings' },
      ...fields,
    ],
  });
};
