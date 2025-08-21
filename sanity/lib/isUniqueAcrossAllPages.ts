// /sanity/isUniqueAcrossAllPages.ts

// Tipagem mínima só para não depender de tipos internos do Sanity
type IsUniqueContext = {
  document?: { _id?: string };
  getClient: (opts?: { apiVersion?: string }) => {
    fetch: <T = unknown>(
      query: string,
      params?: Record<string, unknown>
    ) => Promise<T>;
  };
};

/**
 * Garante unicidade GLOBAL de slug para documentos que usam `settings.slug.current`.
 * Ignora o próprio documento (draft e published).
 */
export async function isUniqueAcrossAllPages(
  slug: string,
  context: IsUniqueContext
) {
  const { document, getClient } = context;
  const client = getClient({ apiVersion: '2024-05-01' });

  const id = document?._id?.replace(/^drafts\./, '');

  const query = `
    !defined(
      *[
        defined(settings.slug.current) &&
        settings.slug.current == $slug &&
        !(_id in [$draftId, $publishedId])
      ][0]._id
    )
  `;

  const params = {
    slug,
    draftId: `drafts.${id}`,
    publishedId: id,
  };

  return client.fetch<boolean>(query, params);
}
