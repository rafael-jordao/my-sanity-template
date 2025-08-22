// Studio-only

// Objetos
import { pageSettingsType } from './objects/pageSettings.studio';
import { seoType } from './objects/seo.studio';

// Páginas
import { AvailablePages } from './pages/index.studio';

// Exporte tudo que o Studio precisa conhecer
export const schemaTypes = [
  // Objects
  pageSettingsType,
  seoType,

  // Pages (documents)
  ...AvailablePages,
];
