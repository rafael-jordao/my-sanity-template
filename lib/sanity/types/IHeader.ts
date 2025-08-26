import { ICallToAction } from './ICallToAction';
import { IMenu } from './IMenu';

export interface IHeader {
  title: string;
  logo: string;
  navigation: IMenu;
  enableCta: boolean;
  callToAction: ICallToAction;
}
