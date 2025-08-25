import groq from 'groq';
import { GROQButtonQuery } from './button';

export const GROQCallToActionQuery = groq`
  "targetType": select(
    defined(internalPage) => "internal",
    defined(externalUrl) => "external",
    defined(anchor) => "anchor",
    "none"
  ),
  internalPage->{
    "slug": settings.slug.current,
    "title": settings.title
  },
  externalUrl,
  anchor,
  button {
    ${GROQButtonQuery}
  }
`;
