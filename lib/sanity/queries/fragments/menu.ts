import groq from 'groq';

export const GROQMenuQuery = groq`
  title,
  items[]{
    title,
    link,
  },
`;
