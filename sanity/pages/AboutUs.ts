import { groq } from 'next-sanity';
import { definePage } from '../documents/page';
import { IPageSettings } from '../types/definitions';
import { Image } from 'sanity';
import { GROQPageSettingsQuery } from '../objects/pageSettings';

export const aboutUsType = definePage({
  name: 'aboutUs',
  title: 'About Us',
  fields: [
    {
      name: 'intro',
      title: 'Intro',
      type: 'object',
      fields: [
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

export interface IAboutUs extends IPageSettings {
  hero: {
    title: string;
    image: Image;
  };
}
export const GROQAboutUsQuery = groq`
  *[_type == "aboutUs"][0]{
    ${GROQPageSettingsQuery},
    intro{
      title,
      description,
    }
  }
`;
