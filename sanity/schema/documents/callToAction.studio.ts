// Studio-only
import { defineType, defineField } from 'sanity';
import { AvailablePages } from '../pages/index.studio';

interface CallToActionParent {
  linkType?: 'internal' | 'external' | 'anchor';
}

export const callToActionType = defineType({
  name: 'callToAction',
  title: 'Call To Action',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título do CTA',
      type: 'string',
      description: 'Título interno para identificar este Call To Action',
      validation: (Rule) => Rule.required().min(3).max(100),
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'text',
      description: 'Descrição opcional para contexto adicional',
      rows: 3,
    }),
    defineField({
      name: 'button',
      title: 'Botão',
      type: 'button',
      description: 'Configurações do botão do Call To Action',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'link',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      buttonText: 'button.text',
      linkType: 'linkType',
    },
    prepare(selection) {
      const { title } = selection;

      return {
        title: title,
      };
    },
  },
});
