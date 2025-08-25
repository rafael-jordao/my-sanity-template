import groq from 'groq';
import { GROQPageSettingsQuery } from '../fragments/pageSettings';

export const GROQPageLegalQuery = groq`
  *[_type == "pageLegal" && _id == $id][0]{
    ${GROQPageSettingsQuery},
    content {
      title,
      description,
    }
  }
`;
