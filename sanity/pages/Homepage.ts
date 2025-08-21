import { groq } from 'next-sanity';
import { definePage } from '../documents/page';
import { IPageSettings } from '../types/definitions';
import { Image } from 'sanity';
import { GROQPageSettingsQuery } from '../objects/pageSettings';

export const homepageType = definePage({
  name: 'homepage',
  title: 'Homepage',
  fields: [
    {
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'image',
        },
        {
          name: 'title',
          title: 'Title',
          type: 'string',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
        },
      ],
    },
  ],
});

export interface IHomepage extends IPageSettings {
  hero: {
    title: string;
    image: Image;
  };
}

export const GROQHomepageQuery = groq`
  *[_type == "homepage"][0]{
    ${GROQPageSettingsQuery},
    hero{
      title,
      description,
    }
  }
`;
