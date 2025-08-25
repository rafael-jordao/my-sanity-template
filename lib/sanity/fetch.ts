'use server';

import { QueryParams } from 'sanity';
import { client } from './client';

type SanityFetchOptions = {
  query: string;
  params?: QueryParams;

  revalidate?: number | false;

  tags?: string[];
};

export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
  tags,
}: SanityFetchOptions): Promise<T> {
  try {
    return await client.fetch<T>(query, params, { next: { revalidate, tags } });
  } catch (error) {
    console.error('[Sanity Fetch] Error:', error);

    throw new Error(
      `[Sanity Fetch] Query failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
