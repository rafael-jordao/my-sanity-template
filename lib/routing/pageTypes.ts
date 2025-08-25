import { JSX } from 'react';
import PageHome from '@/components/pages/PageHome';
import PageAboutUs from '@/components/pages/PageAboutUs';
import { GROQHomepageQuery } from '../sanity/queries/pages/homepage';
import { GROQAboutUsQuery } from '../sanity/queries/pages/aboutUs';
import { GROQPageLegalQuery } from '../sanity/queries/pages/pageLegal';
import PageLegal from '@/components/pages/PageLegal';

export const AVAILABLE_PAGE_TYPES = [
  'homepage',
  'aboutUs',
  'pageLegal',
] as const;

export const PageTypeMap: Record<
  string,
  { query: string; component: (props: { data: any }) => JSX.Element }
> = {
  homepage: { query: GROQHomepageQuery, component: PageHome },
  aboutUs: { query: GROQAboutUsQuery, component: PageAboutUs },
  pageLegal: { query: GROQPageLegalQuery, component: PageLegal },
};
