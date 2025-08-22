import groq from 'groq';
import { GROQSeoQuery } from './seo';

export const GROQPageSettingsQuery = groq`
  settings{
    title,
    "slug": slug.current,
    seo {
     ${GROQSeoQuery}
    }
  }
`;
