import { Metadata } from 'next';
import { sanityFetch } from '@/lib/sanity';

import { AvailablePages, PageTypeMap } from '@/sanity/pages';
import { stegaClean } from 'next-sanity';
import { GROQPageSettingsQuery } from '@/sanity/objects/pageSettings';

import { createElement } from 'react';

export const dynamicParams = false;

// Gerar parâmetros estáticos para ISR - incluindo homepage
export async function generateStaticParams() {
  const pages = await sanityFetch<{ slug: string; _type: string }[]>({
    query: `
      *[_type in [${AvailablePages.map((type) => type.name)
        .map((name) => `"${name}"`)
        .toString()}]]{
        _type,
        "slug": settings.slug.current,
      }
    `,
  });

  const params = pages.map((page) => {
    if (!page.slug || page.slug === '/') {
      return { slug: [] }; // homepage
    }
    return { slug: page.slug.split('/').filter(Boolean) };
  });

  // console.log('Generated static params:', params);
  return params;
}

// Gerar metadados dinâmicos
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const awaitedParams = await params;
  const slug = '/' + (awaitedParams?.slug?.join('/') ?? '');

  const data = await sanityFetch({
    query: `
      *[settings.slug.current == $slug]{
        _type,
        _id,
      }
    `,
    params: {
      slug: slug,
    },
  });

  if (data?.length === 0) {
    return {
      title: '404',
    };
  }

  const documentType = data?.[0]?._type;
  const id = data?.[0]?._id;

  const pageData = await sanityFetch({
    query: `
    *[_id == $id && _type == $type][0]{
      ${GROQPageSettingsQuery}
    }
  `,
    params: { id, type: documentType },
  });

  return {
    title: stegaClean(pageData?.settings?.title ?? 'No title found'),
    description: stegaClean(
      pageData?.settings?.description ?? 'No description found'
    ),
  };
}

export default async function Page({ params }: any) {
  const slug = '/' + (params?.slug?.join('/') ?? '');

  const docMeta = await sanityFetch({
    query: `
      *[settings.slug.current == $slug][0]{
        _type,
        _id
      }
    `,
    params: { slug },
  });

  const query = PageTypeMap[docMeta._type].query;
  const component = PageTypeMap[docMeta._type].component;

  const pageData = await sanityFetch<any>({
    query,
  });

  return <>{createElement(component, { data: pageData ?? {} })}</>;
}
