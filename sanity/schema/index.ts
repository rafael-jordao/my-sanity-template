// Studio-only

// Objetos
import { pageSettingsType } from './objects/pageSettings.studio';
import { seoType } from './objects/seo.studio';
import { buttonType } from './objects/button.studio';

// Documents
import { callToActionType } from './documents/callToAction.studio';

// Páginas
import { AvailablePages } from './pages/index.studio';

// Exporte tudo que o Studio precisa conhecer
export const schemaTypes = [
  // Objects
  pageSettingsType,
  seoType,
  buttonType,

  // Documents
  callToActionType,

  // Pages (documents)
  ...AvailablePages,
];
