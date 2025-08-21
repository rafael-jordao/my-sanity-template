import PageHome from '@/components/pages/PageHome';
import { aboutUsType, GROQAboutUsQuery } from './AboutUs';
import { GROQHomepageQuery, homepageType } from './Homepage';
import { JSX } from 'react';
import PageAboutUs from '@/components/pages/PageAboutUs';

export const AvailablePages = [homepageType, aboutUsType];

export const PageTypeMap: Record<
  string,
  {
    query: string;
    component: (props: { data: any }) => JSX.Element;
  }
> = {
  homepage: {
    query: GROQHomepageQuery,
    component: PageHome,
  },
  aboutUs: {
    query: GROQAboutUsQuery,
    component: PageAboutUs,
  },
};
