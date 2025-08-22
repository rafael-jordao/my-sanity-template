import groq from 'groq';
import { GROQPageSettingsQuery } from '../fragments/pageSettings';

export const GROQHomepageQuery = groq`
  *[_type == "homepage" && _id == $id][0]{
    ${GROQPageSettingsQuery},
    hero{ 
      title, 
      description 
    }
  }
`;
