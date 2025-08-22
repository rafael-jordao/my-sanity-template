import { defineType } from 'sanity';

export const seoType = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Título SEO',
      type: 'string',
      description: 'Título para SEO (meta title)',
      validation: (Rule) =>
        Rule.max(60).warning('O título deve ter no máximo 60 caracteres'),
    },
    {
      name: 'description',
      title: 'Description SEO',
      type: 'text',
      description: 'Descrição para SEO (meta description)',
      validation: (Rule) =>
        Rule.max(160).warning('A descrição deve ter no máximo 160 caracteres'),
    },
    {
      name: 'keywords',
      title: 'Palavras-chave',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Palavras-chave para SEO',
    },
    {
      name: 'ogImage',
      title: 'Imagem Open Graph',
      type: 'image',
      description: 'Imagem para compartilhamento em redes sociais',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'noIndex',
      title: 'No Index',
      type: 'boolean',
      description:
        'Impedir que a página seja indexada pelos mecanismos de busca',
      initialValue: false,
    },
  ],
});
