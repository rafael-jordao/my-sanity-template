import { IPageSettings } from '../config/IPageSettings';

export interface IContactUs extends IPageSettings {
  content: {
    title?: string;
  };
}
