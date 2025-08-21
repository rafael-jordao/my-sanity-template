import { pageSettingsType } from './objects/pageSettings';
import { seoType } from './objects/seo';
import { AvailablePages } from './pages';

export const schemaTypes = [
  // Documents

  //Pages
  ...AvailablePages,

  // Objects
  pageSettingsType,
  seoType,
];
