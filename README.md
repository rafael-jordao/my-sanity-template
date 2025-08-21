# My Sanity Template

Template de Next.js 15 com Sanity CMS integrado, utilizando ISR (Incremental Static Regeneration) para geração de páginas dinâmicas.

## 🚀 Recursos

- **Next.js 15** com App Router
- **Sanity CMS** integrado
- **ISR** para performance otimizada
- **TypeScript** configurado
- **Tailwind CSS** para estilização
- **Sistema de Seções Flexível**:
  - Seção Hero
  - Seção de Texto (com rich text)
  - Seção de Imagem
- **SEO** configurado dinamicamente
- **Studio do Sanity** acessível em `/studio`

## 📋 Pré-requisitos

- Node.js 18+
- pnpm (recomendado)

## 🛠️ Função sanityFetch

A função `sanityFetch` é o coração do sistema de ISR, oferecendo:

### Características

- **Cache Inteligente**: Configurações de revalidate por tipo de conteúdo
- **ISR Otimizado**: Gerenciamento automático de cache do Next.js
- **Modo Preview**: Suporte a conteúdo draft/preview
- **Error Handling**: Tratamento robusto de erros
- **Logging**: Logs detalhados em desenvolvimento

### Configurações de Revalidate

```typescript
const REVALIDATE_CONFIGS = {
  default: 3600, // 1 hora
  pages: 1800, // 30 minutos para páginas
  home: 600, // 10 minutos para home
  static: false, // Não revalidar conteúdo estático
};
```

### Uso

```typescript
// Busca básica
const data = await sanityFetch(query, params);

// Com configurações específicas
const page = await sanityFetch(query, params, {
  revalidateTag: 'pages',
  tags: ['page', 'about'],
});

// Usando wrappers
const homePage = await sanityFetchHome(query);
const staticData = await sanityFetchStatic(query);
```

### Webhooks de Revalidação

Configure webhooks no Sanity para revalidação automática:

1. No Sanity Studio, vá em API > Webhooks
2. Adicione: `https://seusite.com/api/revalidate`
3. Configure o secret: `SANITY_WEBHOOK_SECRET`

## 🛠️ Instalação

1. Clone o projeto
2. Instale as dependências:

   ```bash
   pnpm install
   ```

3. Configure as variáveis de ambiente no `.env.local`:
   ```
   SANITY_API_READ_TOKEN=your_token_here
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_ORGANIZATION_ID=your_org_id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2023-08-01
   ```

## 🚦 Como usar

### Desenvolvimento

```bash
pnpm dev
```

O projeto estará disponível em:

- **Site**: `http://localhost:3000`
- **Studio Sanity**: `http://localhost:3000/studio`

### Criar uma Página

1. Acesse `/studio`
2. Crie um novo documento do tipo "Página"
3. Preencha:
   - Título da página
   - Slug (gerado automaticamente)
     - Para a homepage, use `home`
     - Para outras páginas, use qualquer slug desejado
   - SEO (opcional)
   - Seções (adicione quantas quiser)
4. Marque como "Publicado"
5. Sua página estará disponível:
   - Homepage: `/` (slug = `home`)
   - Outras páginas: `/{slug}`

## 🏗️ Arquitetura

### Schemas Sanity

- **Page**: Documento principal que contém todas as informações da página
- **SEO**: Objeto para configurações de SEO
- **Seções**: Integradas diretamente no schema de página
  - Hero Section
  - Text Section
  - Image Section

### Componentes Next.js

- `components/SectionRenderer.tsx`: Renderizador principal das seções
- `components/sections/`: Componentes individuais para cada tipo de seção
- `app/[[...slug]]/page.tsx`: Rota catch-all que gerencia todas as páginas incluindo homepage
- `app/studio/page.tsx`: Studio do Sanity
- `lib/sanityFetch`: Função otimizada para fetch com ISR

### ISR Configuration

- Revalidação gerenciada pela função `sanityFetch`
- Configurações personalizáveis por tipo de conteúdo
- `generateStaticParams` para páginas estáticas incluindo homepage
- `generateMetadata` para SEO dinâmico

## 🎨 Customização

### Adicionar Nova Seção

1. Edite `schemas/documents/page.ts`
2. Adicione novo tipo de seção no array `sections`
3. Crie componente correspondente em `components/sections/`
4. Adicione no `SectionRenderer.tsx`
5. Atualize tipos em `lib/types.ts`

### Configurar SEO

O SEO é configurado dinamicamente através do Sanity. Cada página pode ter:

- Título SEO personalizado
- Descrição meta
- Palavras-chave
- Imagem Open Graph
- Configuração noIndex

## 📁 Estrutura do Projeto

```
├── app/
│   ├── [[...slug]]/       # Rota catch-all para todas as páginas
│   ├── api/revalidate/    # Webhook para revalidação
│   ├── studio/            # Studio Sanity
│   └── layout.tsx
├── components/
│   ├── sections/          # Componentes das seções
│   └── SectionRenderer.tsx
├── lib/
│   ├── queries.ts         # Queries GROQ
│   ├── sanity.ts          # Cliente Sanity + sanityFetch
│   ├── revalidate.ts      # Utilitários de revalidação
│   └── types.ts           # TypeScript types
├── schemas/
│   ├── documents/         # Schemas de documentos
│   ├── objects/           # Schemas de objetos
│   └── index.ts
├── .env.local
├── sanity.config.ts
└── next.config.ts
```

## 🚀 Deploy

Para deploy em produção, certifique-se de:

1. Configurar as variáveis de ambiente na plataforma
2. Fazer build do projeto: `pnpm build`
3. As páginas serão geradas estaticamente com ISR

## 📖 Documentação

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

Template criado com Next.js 15 + Sanity CMS 🚀
