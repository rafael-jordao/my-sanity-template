import { IHeader } from '../IHeader';
import { ISEO } from './ISeo';

export interface IPageSettings {
  settings: {
    title: string; // settings.title
    slug: string; // settings.slug (já vem como string do GROQ: "slug": slug.current)
    seo: ISEO;
    header: IHeader;
  };
}
