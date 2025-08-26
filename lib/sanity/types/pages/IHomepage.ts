import { IPageSettings } from '../config/IPageSettings';
import { ICallToAction } from '../ICallToAction';

export interface IHomepage extends IPageSettings {
  hero: {
    title: string;
    description: string;
    callToAction: ICallToAction;
  };

  intro: {
    title: string;
    description: string;
  };
}
