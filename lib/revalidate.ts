import { revalidateTag, revalidatePath } from 'next/cache';

/**
 * Utilitários para revalidação de cache do Sanity
 */

// Tags padrão para revalidação
export const CACHE_TAGS = {
  PAGES: 'pages',
  PAGES_LIST: 'pages-list',
  PAGE_SLUGS: 'page-slugs',
  HOME: 'home',
  STATIC: 'static',
  SANITY: 'sanity',
} as const;

/**
 * Revalidar todas as páginas
 */
export function revalidateAllPages() {
  revalidateTag(CACHE_TAGS.PAGES);
  revalidateTag(CACHE_TAGS.PAGES_LIST);
  revalidateTag(CACHE_TAGS.PAGE_SLUGS);
}

/**
 * Revalidar página específica
 */
export function revalidatePage(slug: string) {
  revalidateTag(`page-${slug}`);
  revalidatePath(`/${slug}`);
}

/**
 * Revalidar tudo relacionado ao Sanity
 */
export function revalidateAllSanity() {
  revalidateTag(CACHE_TAGS.SANITY);
  revalidateAllPages();
}

/**
 * Função para usar em webhooks do Sanity
 */
export function handleSanityWebhook(documentType: string, slug?: string) {
  switch (documentType) {
    case 'page':
      if (slug) {
        revalidatePage(slug);
      }
      revalidateAllPages();
      break;

    default:
      // Para outros tipos de documento, revalidar tudo
      revalidateAllSanity();
      break;
  }
}
