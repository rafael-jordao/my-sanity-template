import groq from 'groq';
import { GROQMenuQuery } from './menu';
import { GROQCallToActionQuery } from './callToAction';
import { GROQSanityImage } from './sanityImage';

export const GROQHeaderQuery = groq`
  title,
  "logo": {
    ${GROQSanityImage}
  },
  navigation->{${GROQMenuQuery}},
  enableCta,
  "callToAction": cta->{${GROQCallToActionQuery}}
`;
