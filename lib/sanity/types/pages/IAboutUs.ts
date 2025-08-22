import { IPageSettings } from '../config/IPageSettings';

export interface IAboutUs extends IPageSettings {
  intro: {
    title?: string;
    description?: string;
  };
}
