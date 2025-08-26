// src/env.ts
import { z } from 'zod';

type InferClient<C> = C extends z.ZodRawShape
  ? z.infer<z.ZodObject<C>>
  : Record<never, never>; // <- substitui {}

/**
 * Utilitária para validar envs de forma tipada.
 * - Valida servidor e cliente (NEXT_PUBLIC_*)
 * - Converte string vazia para undefined (evita "definiu mas esqueceu o valor")
 * - Em caso de erro, imprime quais variáveis faltam e encerra o processo.
 */
export function createEnv<
  S extends z.ZodRawShape,
  C extends z.ZodRawShape | undefined = undefined
>(config: {
  server: S;
  client?: C; // apenas chaves que começam com NEXT_PUBLIC_
  runtimeEnv?: Record<string, string | undefined>;
  emptyStringAsUndefined?: boolean;
}) {
  const {
    server,
    client,
    runtimeEnv = process.env,
    emptyStringAsUndefined = true,
  } = config;

  const scrub = (obj: Record<string, string | undefined>) =>
    Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        k,
        emptyStringAsUndefined && v === '' ? undefined : v,
      ])
    );

  // Se houver shape de client, garanta prefixo NEXT_PUBLIC_
  if (client) {
    for (const key of Object.keys(client)) {
      if (!key.startsWith('NEXT_PUBLIC_')) {
        throw new Error(
          `Variável de client inválida: "${key}". Todas do client devem começar com "NEXT_PUBLIC_".`
        );
      }
    }
  }

  const serverSchema = z.object(server);
  const clientSchema = client ? z.object(client) : undefined;

  const parsedServer = serverSchema.safeParse(scrub(runtimeEnv));
  const parsedClient = clientSchema
    ? clientSchema.safeParse(scrub(runtimeEnv))
    : undefined;

  const hasServerErr = !parsedServer.success;
  const hasClientErr = Boolean(
    clientSchema && parsedClient && !parsedClient.success
  );

  if (hasServerErr || hasClientErr) {
    let message = '\n❌ Falha na validação das variáveis de ambiente:\n';

    if (hasServerErr) {
      message += `\n[Servidor]\n${formatIssues(parsedServer.error.issues)}\n`;
    }

    // 👇 Narrowing garante que parsedClient existe e é o caso "error"
    if (hasClientErr && parsedClient && !parsedClient.success) {
      message += `\n[Client]\n${formatIssues(parsedClient.error.issues)}\n`;
    }

    // const keys = Object.keys(runtimeEnv).sort().join(', ');
    // message += `\nChaves visíveis em process.env: ${keys || '(nenhuma)'}\n`;

    console.error(message);
    process.exit(1);
  }
  // Merge tipado
  return {
    ...parsedServer.data,
    ...(clientSchema ? parsedClient!.data : {}),
  } as z.infer<typeof serverSchema> & InferClient<C>;
}

function formatIssues(issues: z.ZodIssue[]): string {
  return issues
    .map((issue) => {
      const path = issue.path.length ? issue.path.join('.') : '(root)';
      return `- ${path}: ${issue.message}`;
    })
    .join('\n');
}
