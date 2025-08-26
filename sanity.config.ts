import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schema';
import { structureTool } from 'sanity/structure';
import { AvailablePages } from './sanity/schema/pages/index.studio';

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
                S.documentList()
                  .title('All pages')
                  .filter(
                    `_type in [${AvailablePages.map((type) => type.name)
                      .map((name) => `"${name}"`)
                      .toString()}]`
                  )
              ),
            S.listItem()
              .title('Call To Actions')
              .child(
                S.documentList()
                  .title('All CTAs')
                  .filter(`_type in ["callToAction"]`)
              ),
            S.listItem()
              .title('Menus')
              .child(
                S.documentList().title('All menus').filter(`_type in ["menu"]`)
              ),
            S.listItem()
              .title('Headers')
              .child(
                S.documentList()
                  .title('All headers')
                  .filter(`_type in ["header"]`)
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
