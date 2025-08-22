import { JSX } from 'react';
import PageHome from '@/components/pages/PageHome';
import PageAboutUs from '@/components/pages/PageAboutUs';
import { GROQHomepageQuery } from '../sanity/queries/pages/homepage';
import { GROQAboutUsQuery } from '../sanity/queries/pages/aboutUs';

export const AVAILABLE_PAGE_TYPES = ['homepage', 'aboutUs'] as const;

export const PageTypeMap: Record<
  string,
  { query: string; component: (props: { data: any }) => JSX.Element }
> = {
  homepage: { query: GROQHomepageQuery, component: PageHome },
  aboutUs: { query: GROQAboutUsQuery, component: PageAboutUs },
};
