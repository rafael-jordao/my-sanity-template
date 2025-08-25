import { Metadata } from 'next';

import { stegaClean } from 'next-sanity';

import { AVAILABLE_PAGE_TYPES, PageTypeMap } from '@/lib/routing/pageTypes';
import { createElement } from 'react';
import { sanityFetch } from '@/lib/sanity/fetch';
import { GROQPageSettingsQuery } from '@/lib/sanity/queries/fragments/pageSettings';
import { notFound } from 'next/navigation';

export const dynamicParams = true;

type SanityPageSlugResult = { _type: string; slug: string };

export async function generateStaticParams() {
  const pages = await sanityFetch({
    query: `
      *[
        _type in ${JSON.stringify(AVAILABLE_PAGE_TYPES)} &&
        defined(settings.slug.current) &&
        !(_id in path("drafts.**"))
      ]{
        _type,
        "slug": settings.slug.current
      }
    `,
  });

  const result = (pages as SanityPageSlugResult[]).map((p) => {
    if (!p.slug || p.slug === '/') return { slug: [] };
    return { slug: p.slug.split('/').filter(Boolean) };
  });

  return result;
}

// Metadata dinâmico
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const awaited = await params;
  const slugArray = awaited?.slug ?? [];
  const slug = '/' + slugArray.join('/');

  const data = await sanityFetch<
    [
      {
        _type: string;
        _id: string;
      }
    ]
  >({
    query: `
      *[
        settings.slug.current == $slug &&
        !(_id in path("drafts.**"))
      ]{
        _type,
        _id
      }
    `,
    params: { slug: slug },
  });

  if (!data?.length) return { title: '404: Page Not Found' };

  const { _type, _id } = data[0];

  const pageData = await sanityFetch<{
    settings: {
      seo: {
        title: string;
        description: string;
      };
    };
  }>({
    query: `
      *[
        _id == $id &&
        _type == $type &&
        !(_id in path("drafts.**"))
      ][0]{
        ${GROQPageSettingsQuery}
      }
    `,
    params: { id: _id, type: _type },
  });

  return {
    title: stegaClean(pageData?.settings?.seo?.title ?? 'No title found'),
    description: stegaClean(
      pageData?.settings?.seo?.description ?? 'No description found'
    ),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const awaited = await params;
  const slugArray = awaited?.slug ?? []; // fallback seguro
  const slug = '/' + slugArray.join('/');

  const docMeta = await sanityFetch<{
    _type: string;
    _id: string;
  }>({
    query: `
      *[
        settings.slug.current == $slug &&
        !(_id in path("drafts.**"))
      ][0]{
        _type,
        _id
      }
    `,
    params: { slug },
  });

  if (!docMeta) return notFound();

  const { query, component } = PageTypeMap[docMeta._type] || {};

  if (!component || !query) {
    console.warn(`No entry in PageTypeMap for type ${docMeta._type}`);
    return notFound();
  }

  const pageData = await sanityFetch({
    query,
    params: { id: docMeta._id },
  });

  return <>{createElement(component, { data: pageData ?? {} })}</>;
}
