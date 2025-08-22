import { Metadata } from 'next';

import { stegaClean } from 'next-sanity';

import { AVAILABLE_PAGE_TYPES, PageTypeMap } from '@/lib/routing/pageTypes';
import { createElement } from 'react';
import { sanityFetch } from '@/lib/sanity/fetch';
import { GROQPageSettingsQuery } from '@/lib/sanity/queries/fragments/pageSettings';

export const dynamicParams = false;

type SanityPageSlugResult = { _type: string; slug: string };

// ISR params
export async function generateStaticParams() {
  const pages = await sanityFetch({
    query: `
      *[_type in ${JSON.stringify(AVAILABLE_PAGE_TYPES)}]{
        _type,
        "slug": settings.slug.current
      }
    `,
  });

  return (pages as SanityPageSlugResult[]).map((p) =>
    !p.slug || p.slug === '/'
      ? { slug: [] }
      : { slug: p.slug.split('/').filter(Boolean) }
  );
}

// Metadata dinâmico
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const awaited = await params;
  const slug = '/' + (awaited?.slug?.join('/') ?? '');

  const data = await sanityFetch({
    query: `*[settings.slug.current == $slug]{ _type, _id }`,
    params: { slug },
  });

  if (!data?.length) return { title: '404' };

  const { _type, _id } = data[0];

  const pageData = await sanityFetch({
    query: `
      *[_id == $id && _type == $type][0]{
        ${GROQPageSettingsQuery}
      }
    `,
    params: { id: _id, type: _type },
  });

  return {
    title: stegaClean(pageData?.settings?.title ?? 'No title found'),
    description: stegaClean(
      pageData?.settings?.description ?? 'No description found'
    ),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const awaited = await params;
  const slug = '/' + (awaited?.slug?.join('/') ?? '');

  const docMeta = await sanityFetch({
    query: `*[settings.slug.current == $slug][0]{ _type, _id }`,
    params: { slug },
  });

  const { query, component } = PageTypeMap[docMeta._type];
  const pageData = await sanityFetch({ query, params: { id: docMeta._id } });

  return <>{createElement(component, { data: pageData ?? {} })}</>;
}
