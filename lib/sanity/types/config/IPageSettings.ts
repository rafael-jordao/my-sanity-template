import { ISEO } from './ISeo';

export interface IPageSettings extends ISEO {
  settings: {
    title: string; // settings.title
    slug: string; // settings.slug (já vem como string do GROQ: "slug": slug.current)
  };
}
