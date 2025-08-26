import groq from 'groq';

export const GROQSanityImage = groq`
  "url": logo.asset->url,
  "name": logo.asset->originalFilename,
  "width": logo.asset->metadata.dimensions.width,
  "height": logo.asset->metadata.dimensions.height,
`;
