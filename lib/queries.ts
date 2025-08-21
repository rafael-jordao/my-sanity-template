import { groq } from 'next-sanity';

// Query para buscar todas as páginas publicadas
export const getAllPagesQuery = groq`
  *[_type == "page"] {
    _id,
    title,
    slug,
  }
`;
