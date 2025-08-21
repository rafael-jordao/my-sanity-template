import { Image } from 'sanity';

export interface ISEO {
  title: string;
  description: string;
  keywords: string[];
  ogImage: Image;
  noIndex: boolean;
}

export interface IPageSettings {
  settings: {
    title: string;
    slug: { current: string };
    seo: ISEO;
  };
}
