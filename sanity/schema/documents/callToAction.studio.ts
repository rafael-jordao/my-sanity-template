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
      name: 'linkType',
      title: 'Tipo de Link',
      type: 'string',
      options: {
        list: [
          { title: 'Página Interna', value: 'internal' },
          { title: 'URL Externa', value: 'external' },
          { title: 'Âncora HTML', value: 'anchor' },
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'internalPage',
      title: 'Página Interna',
      type: 'reference',
      to: AvailablePages.map((page) => {
        return { type: page?.name };
      }),

      hidden: ({ parent }) => parent?.linkType !== 'internal',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as CallToActionParent;
          if (parent?.linkType === 'internal' && !value) {
            return 'Página interna é obrigatória quando o tipo de link é "Página Interna"';
          }
          return true;
        }),
    }),
    defineField({
      name: 'externalUrl',
      title: 'URL Externa',
      type: 'url',
      description: 'URL completa (ex: https://exemplo.com)',
      hidden: ({ parent }) => parent?.linkType !== 'external',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as CallToActionParent;
          if (parent?.linkType === 'external' && !value) {
            return 'URL externa é obrigatória quando o tipo de link é "URL Externa"';
          }
          return true;
        }),
    }),
    defineField({
      name: 'anchor',
      title: 'Âncora HTML',
      type: 'string',
      description: 'ID do elemento na página (ex: #contato)',
      placeholder: '#section-id',
      hidden: ({ parent }) => parent?.linkType !== 'anchor',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as CallToActionParent;
          if (parent?.linkType === 'anchor' && !value) {
            return 'Âncora é obrigatória quando o tipo de link é "Âncora HTML"';
          }
          if (value && !value.startsWith('#')) {
            return 'Âncora deve começar com # (ex: #contato)';
          }
          return true;
        }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Abrir em Nova Aba',
      type: 'boolean',
      description: 'Aplicável apenas para URLs externas',
      initialValue: true,
      hidden: ({ parent }) => parent?.linkType !== 'external',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      buttonText: 'button.text',
      linkType: 'linkType',
    },
    prepare(selection) {
      const { title, buttonText, linkType } = selection;
      const linkTypeLabels = {
        internal: 'Página Interna',
        external: 'URL Externa',
        anchor: 'Âncora HTML',
      };

      return {
        title: title,
        subtitle: `${buttonText || 'Botão'} • ${
          linkTypeLabels[linkType as keyof typeof linkTypeLabels] || linkType
        }`,
      };
    },
  },
});
