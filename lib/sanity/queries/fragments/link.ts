import groq from 'groq';

export const GROQLinkQuery = groq`
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
`;
