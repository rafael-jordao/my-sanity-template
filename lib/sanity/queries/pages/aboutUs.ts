import groq from 'groq';
import { GROQPageSettingsQuery } from '../fragments/pageSettings';

export const GROQAboutUsQuery = groq`
  *[_type == "aboutUs" && _id == $id][0]{
    ${GROQPageSettingsQuery},
    intro{
      title,
      description
    }
  }
`;
