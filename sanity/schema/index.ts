// Studio-only

// Objetos
import { pageSettingsType } from './objects/pageSettings.studio';
import { seoType } from './objects/seo.studio';
import { buttonType } from './objects/button.studio';
import { linkType } from './objects/link.studio';
// Documents
import { callToActionType } from './documents/callToAction.studio';
import { menuType } from './documents/menu.studio';
import { headerType } from './documents/header.studio';
// Páginas
import { AvailablePages } from './pages/index.studio';

// Exporte tudo que o Studio precisa conhecer
export const schemaTypes = [
  // Objects
  pageSettingsType,
  seoType,
  buttonType,
  linkType,

  // Documents
  callToActionType,
  menuType,
  headerType,

  // Pages (documents)
  ...AvailablePages,
];
