import groq from 'groq';
import { GROQPageSettingsQuery } from '../fragments/pageSettings';

export const GROQContactUsQuery = groq`
  *[_type == "contactUs" && _id == $id][0]{
  ${GROQPageSettingsQuery},
    content {
      title,
      description,
    }
  }
`;
