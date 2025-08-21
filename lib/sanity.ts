import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: false, // Set to false for ISR
  token: process.env.SANITY_API_READ_TOKEN,
});

export const previewClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
});

// Configurações de revalidate personalizáveis por query
const REVALIDATE_CONFIGS = {
  default: 3600, // 1 hora
  pages: 1800, // 30 minutos para páginas
  home: 600, // 10 minutos para home
  static: false, // Não revalidar conteúdo estático
} as const;

type RevalidateTag = keyof typeof REVALIDATE_CONFIGS;

interface SanityFetchOptions {
  /** Tag para configuração de revalidate personalizada */
  revalidateTag?: RevalidateTag;
  /** Tempo de revalidate em segundos (sobrescreve a tag) */
  revalidate?: number | false;
  /** Se deve usar cache do Next.js */
  cache?: 'force-cache' | 'no-store';
  /** Tags para cache do Next.js */
  tags?: string[];
  /** Se está em modo preview/draft */
  preview?: boolean;
}

/**
 * Função otimizada para fazer fetch ao Sanity com gerenciamento de ISR
 *
 * @param query - Query GROQ para executar
 * @param params - Parâmetros da query
 * @param options - Opções de cache e revalidate
 * @returns Promise com os dados do Sanity
 */
export async function sanityFetch<T = any>({
  query,
  params = {},
  options = {},
}: {
  query: string;
  params?: Record<string, any>;
  options?: SanityFetchOptions;
}): Promise<T> {
  const {
    revalidateTag = 'default',
    revalidate: customRevalidate,
    cache = 'force-cache',
    tags = [],
    preview = false,
  } = options;

  // Determinar configuração de revalidate
  const revalidateValue =
    customRevalidate !== undefined
      ? customRevalidate
      : REVALIDATE_CONFIGS[revalidateTag];

  // Escolher cliente baseado no modo preview
  const clientToUse = preview ? previewClient : client;

  try {
    // Configurar fetch com cache do Next.js
    const fetchConfig: RequestInit = {};

    if (cache === 'force-cache' && revalidateValue !== false) {
      // ISR - cache com revalidation
      fetchConfig.next = {
        revalidate: revalidateValue,
        tags: ['sanity', ...tags],
      };
    } else if (cache === 'no-store') {
      // Sem cache
      fetchConfig.cache = 'no-store';
    }

    // Log em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      // console.log(`[Sanity Fetch] Query: ${query.slice(0, 100)}...`);
      // console.log(`[Sanity Fetch] Revalidate: ${revalidateValue}`);
      // console.log(`[Sanity Fetch] Tags: ${tags.join(', ')}`);
    }

    // Fazer fetch usando o cliente Sanity
    const data = await clientToUse.fetch<T>(query, params);

    return data;
  } catch (error) {
    // console.error('[Sanity Fetch] Error:', error);
    // console.error('[Sanity Fetch] Query:', query);
    // console.error('[Sanity Fetch] Params:', params);

    // Em caso de erro, retornar null ou valor padrão
    // Você pode personalizar este comportamento conforme necessário
    throw new Error(
      `Failed to fetch data from Sanity: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}
