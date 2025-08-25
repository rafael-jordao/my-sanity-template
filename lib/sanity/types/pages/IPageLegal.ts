import { IPageSettings } from '../config/IPageSettings';

export interface IPageLegal extends IPageSettings {
  content: {
    title?: string;
  };
}
