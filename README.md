# My Sanity Template

Template de Next.js 15 com Sanity CMS integrado, utilizando ISR (Incremental Static Regeneration) para geração de páginas dinâmicas baseado em tipos de página.

## 🚀 Recursos

- **Next.js 15** com App Router e React 19
- **Sanity CMS** integrado com Studio
- **ISR** para performance otimizada
- **TypeScript** totalmente configurado
- **Tailwind CSS v4** para estilização
- **Sistema de Páginas Tipadas**:
  - Página Homepage
  - Página About Us
  - Sistema extensível para novos tipos
- **SEO** configurado dinamicamente por página
- **Studio do Sanity** acessível em `/studio`
- **Portable Text** para conteúdo rico

## 📋 Pré-requisitos

- Node.js 20+
- pnpm (recomendado)

## 🛠️ Função sanityFetch

A função `sanityFetch` é uma abstração limpa e tipada para buscar dados do Sanity com suporte a ISR nativo do Next.js.

### Características

- **TypeScript Genérico**: Suporte a tipos personalizados para o retorno
- **ISR Nativo**: Usa o sistema `next` do Next.js 15 para cache e revalidação
- **Server-Only**: Executado apenas no servidor para segurança
- **Error Handling**: Tratamento robusto de erros com logs detalhados
- **CDN Desabilitado**: Configurado para ISR otimizado

### Interface da Função

```typescript
type SanityFetchOptions = {
  query: string; // Query GROQ
  params?: QueryParams; // Parâmetros da query
  revalidate?: number | false; // Tempo de revalidação (padrão: 60s)
  tags?: string[]; // Tags para cache do Next.js
};

// Uso genérico com tipagem
await sanityFetch<TipoRetorno>(options);
```

### Exemplos de Uso

```typescript
// Busca básica com revalidação padrão (60s)
const data = await sanityFetch<IHomepage>({
  query: homepageQuery,
  params: { id: 'homepage' },
});

// Cache estático (sem revalidação)
const staticData = await sanityFetch({
  query: '*[_type == "settings"][0]',
  revalidate: false,
});

// Com tags para invalidação seletiva
const pageData = await sanityFetch({
  query: pageQuery,
  params: { slug },
  revalidate: 3600, // 1 hora
  tags: ['pages', `page-${slug}`],
});

// Revalidação rápida para dados dinâmicos
const liveData = await sanityFetch({
  query: '*[_type == "news"] | order(_createdAt desc)',
  revalidate: 60, // 1 minuto
  tags: ['news'],
});
```

## � Script create-schema.sh

O projeto inclui um script automatizado para gerar schemas, interfaces TypeScript e queries GROQ de forma consistente.

### Como Usar

```bash
# Tornar o script executável (apenas uma vez)
chmod +x create-schema.sh

# Criar um object (para reutilização)
./create-schema.sh --type object --name testimonial

# Criar um document (entidade standalone)
./create-schema.sh --type document --name blogPost

# Criar uma page (página tipada)
./create-schema.sh --type page --name contactPage
```

### O que o Script Faz

**Para cada tipo, cria automaticamente:**

1. **Schema Sanity**: Arquivo `.studio.ts` na pasta apropriada
2. **Interface TypeScript**: Arquivo `I[Nome].ts` com tipos adequados
3. **Query GROQ**: Fragment ou query completa dependendo do tipo

### Tipos Disponíveis

| Tipo       | Onde cria                  | Exemplo              | Uso                       |
| ---------- | -------------------------- | -------------------- | ------------------------- |
| `object`   | `sanity/schema/objects/`   | `button`, `seo`      | Componentes reutilizáveis |
| `document` | `sanity/schema/documents/` | `blogPost`, `author` | Entidades independentes   |
| `page`     | `sanity/schema/pages/`     | `contact`, `about`   | Páginas do site           |

### Estrutura Gerada

```bash
# Para: ./create-schema.sh --type document --name product

# ✅ Schema
sanity/schema/documents/product.studio.ts
export const productType = defineType({ ... })

# ✅ Interface
lib/sanity/types/IProduct.ts
export interface IProduct { ... }

# ✅ Query
lib/sanity/queries/fragments/product.ts
export const GROQProductQuery = groq`...`
```

### Passos Manuais Após Execução

O script exibe instruções sobre os passos manuais necessários:

- **Objects/Documents**: Adicionar ao `sanity/schema/index.ts`
- **Pages**: Adicionar ao `sanity/schema/pages/index.studio.ts` e `lib/routing/pageTypes.ts`
- **Pages**: Criar componente em `components/pages/Page[Nome].tsx`

## �🛠️ Instalação

1. Clone o projeto
2. Instale as dependências:

   ```bash
   pnpm install
   ```

3. Configure as variáveis de ambiente no `.env.local`:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2023-08-01
   SANITY_API_READ_TOKEN=your_read_token_here
   ```

## 🚦 Como usar

### Desenvolvimento

```bash
# Servidor de desenvolvimento Next.js com Turbopack
pnpm dev

# Ou executar apenas o Sanity Studio
pnpm sanity
```

O projeto estará disponível em:

- **Site**: `http://localhost:3000`
- **Studio Sanity**: `http://localhost:3000/studio`

### Criar uma Nova Página

1. Acesse `/studio`
2. Escolha o tipo de página que deseja criar:
   - **Homepage**: Para página inicial
   - **About Us**: Para página sobre
3. Preencha os campos obrigatórios:
   - Título da página
   - Slug (gerado automaticamente, mas editável)
     - Para homepage: deixe vazio ou use `/`
     - Para outras páginas: use o path desejado (ex: `/about`, `/contact`)
   - Configurações de SEO (opcional)
   - Conteúdo específico do tipo de página
4. Publique a página
5. Sua página estará disponível no caminho configurado no slug

## 🏗️ Arquitetura

### Sistema de Tipos de Página

O projeto utiliza um sistema tipado e modular para diferentes tipos de páginas:

- **Tipos Disponíveis**: Configurados em `lib/routing/pageTypes.ts`
- **Schemas Sanity**: Localizados em `sanity/schema/pages/`
- **Componentes**: Localizados em `components/pages/`
- **Queries**: Organizadas em `lib/sanity/queries/`
- **Tipos TypeScript**: Definidos em `lib/sanity/types/`

### Schemas Sanity

- **Homepage**: Schema específico para página inicial (`homepage.studio.ts`)
- **About Us**: Schema para página sobre (`aboutUs.studio.ts`)
- **Page Settings**: Configurações comuns (título, slug, SEO)
- **SEO Object**: Configurações de meta tags e Open Graph
- **Fragmentos**: Queries reutilizáveis para configurações comuns

### Componentes Next.js

- `app/[[...slug]]/page.tsx`: Rota catch-all que gerencia todas as páginas
- `components/pages/`: Componentes específicos para cada tipo de página
- `app/studio/[[...index]]/page.tsx`: Studio do Sanity incorporado
- `lib/sanity/fetch.ts`: Função otimizada para fetch com ISR
- `app/layout.tsx`: Layout global com fontes Geist

### ISR e Roteamento

- **generateStaticParams**: Gera páginas estáticas baseadas nos tipos disponíveis
- **generateMetadata**: SEO dinâmico baseado em configurações do Sanity
- **Roteamento Dinâmico**: Suporte a slugs personalizados com catch-all routes
- **Revalidação**: Configurável por tipo de conteúdo através do `sanityFetch`

## 🎨 Customização

### Adicionar Novo Tipo de Página

1. **Criar Schema**: Adicione um novo arquivo em `sanity/schema/pages/`
2. **Registrar Schema**: Inclua no array `AvailablePages` em `sanity/schema/pages/index.studio.ts`
3. **Criar Componente**: Adicione componente correspondente em `components/pages/`
4. **Definir Query**: Crie query GROQ em `lib/sanity/queries/pages/`
5. **Criar Tipos**: Defina interfaces TypeScript em `lib/sanity/types/pages/`
6. **Registrar Rota**: Adicione ao `PageTypeMap` em `lib/routing/pageTypes.ts`

### Personalizar SEO

O SEO é configurado através do objeto `pageSettings` em cada tipo de página:

- **Título**: Título da página e SEO
- **Descrição**: Meta description
- **Slug**: URL personalizada
- **Configurações adicionais**: Extensível conforme necessário

### Modificar Estilos

O projeto usa **Tailwind CSS v4** com:

- Fontes Geist Sans e Geist Mono
- Configuração em `postcss.config.mjs`
- Classes utilitárias modernas
- Suporte a CSS customizado em `app/globals.css`

## 📁 Estrutura do Projeto

```
├── app/
│   ├── [[...slug]]/           # Rota catch-all para todas as páginas
│   │   └── page.tsx           # Componente principal de roteamento
│   ├── studio/
│   │   └── [[...index]]/      # Studio Sanity incorporado
│   │       └── page.tsx
│   ├── layout.tsx             # Layout global
│   ├── globals.css            # Estilos globais Tailwind
│   └── favicon.ico
├── components/
│   └── pages/                 # Componentes específicos por tipo de página
│       ├── PageHome.tsx
│       └── PageAboutUs.tsx
├── lib/
│   ├── routing/
│   │   └── pageTypes.ts       # Mapeamento de tipos de página
│   └── sanity/
│       ├── client.ts          # Cliente Sanity
│       ├── fetch.ts           # Função sanityFetch otimizada
│       ├── queries/           # Queries GROQ organizadas
│       │   ├── fragments/     # Fragmentos reutilizáveis
│       │   └── pages/         # Queries específicas por página
│       └── types/             # TypeScript interfaces
│           ├── config/        # Tipos de configuração
│           └── pages/         # Tipos específicos por página
├── public/                    # Assets estáticos
├── sanity/
│   ├── lib/
│   │   └── isUniqueAcrossAllPages.ts  # Validadores
│   └── schema/
│       ├── index.ts           # Exportação principal dos schemas
│       ├── documents/         # Schemas de documentos
│       │   └── page.studio.ts
│       ├── objects/           # Schemas de objetos
│       │   ├── pageSettings.studio.ts
│       │   └── seo.studio.ts
│       └── pages/             # Schemas específicos por tipo
│           ├── index.studio.ts
│           ├── homepage.studio.ts
│           └── aboutUs.studio.ts
├── .env.local                 # Variáveis de ambiente
├── sanity.config.ts           # Configuração do Sanity
├── next.config.ts             # Configuração do Next.js
├── tailwind.config.ts         # Configuração do Tailwind
└── tsconfig.json              # Configuração do TypeScript
```

## 🚀 Deploy

Para deploy em produção:

1. **Build**: Execute `pnpm build` para gerar a versão otimizada
2. **Variáveis**: Configure as mesmas variáveis de ambiente na plataforma de deploy
3. **ISR**: As páginas serão geradas estaticamente com revalidação automática
4. **Webhooks**: Configure webhooks do Sanity para revalidação em tempo real (opcional)

### Plataformas Recomendadas

- **Vercel**: Integração nativa com Next.js e ISR
- **Netlify**: Suporte completo ao App Router
- **Railway**: Deploy simples com variáveis de ambiente

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento com Turbopack (mais rápido)
pnpm dev

# Build para produção
pnpm build

# Iniciar servidor de produção
pnpm start

# Lint do código
pnpm lint

# Executar apenas Sanity Studio
pnpm sanity
```

## 📖 Documentação e Recursos

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Sanity CMS Documentation](https://www.sanity.io/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Portable Text React](https://github.com/portabletext/react-portabletext)
- [next-sanity Package](https://github.com/sanity-io/next-sanity)

## 🤝 Contribuição

Para contribuir com melhorias:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas alterações (`git commit -am 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

**Template criado com Next.js 15 + Sanity CMS + TypeScript + Tailwind CSS v4** 🚀
