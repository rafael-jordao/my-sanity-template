import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity';
import { structureTool } from 'sanity/structure';
import { AvailablePages } from './sanity/pages';

export default defineConfig({
  name: 'default',
  title: 'My Sanity Template',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  plugins: [
    structureTool({
      name: 'dashboard',
      title: 'Dashboard',
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Pages')
              .child(
                // Lista documentos cuja collection (_type) esteja entre esses tipos
                S.documentList()
                  .title('All pages')
                  .filter(
                    `_type in [${AvailablePages.map((type) => type.name)
                      .map((name) => `"${name}"`)
                      .toString()}]`
                  )
              ),

            // (opcionais) outras seções…
            // ...S.documentTypeListItem('post'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  basePath: '/studio',
});
