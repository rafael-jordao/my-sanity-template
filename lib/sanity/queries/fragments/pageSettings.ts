import groq from 'groq';
import { GROQSeoQuery } from './seo';
import { GROQHeaderQuery } from './header';

export const GROQPageSettingsQuery = groq`
  settings{
    title,
    "slug": slug.current,
    seo {
     ${GROQSeoQuery}
    },
    header->{
      ${GROQHeaderQuery}
    }
  }
`;
