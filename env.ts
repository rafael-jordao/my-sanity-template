import z from 'zod';
import { createEnv } from './lib/createEnv';

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    SANITY_API_READ_TOKEN: z.string().min(1, 'Obrigatório no servidor'),
  },
  client: {
    NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_SANITY_DATASET: z.string().min(1),
    NEXT_PUBLIC_SANITY_API_VERSION: z.string().min(1),
  },
});
