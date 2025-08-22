import { IPageSettings } from '../config/IPageSettings';

export interface IHomepage extends IPageSettings {
  hero: {
    title?: string;
    description?: string;
  };
}
