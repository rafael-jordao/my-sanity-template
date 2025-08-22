import groq from 'groq';

export const GROQSeoQuery = groq`
  title,
  description,
  keywords[],
`;
