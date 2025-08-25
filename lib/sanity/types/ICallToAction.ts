// Interface para o objeto Button
export interface IButton {
  text: string;
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
}

// Interface para página interna referenciada
export interface IInternalPageReference {
  _type: string;
  slug: string;
  title: string;
}

// Interface para o documento Call To Action
export interface ICallToAction {
  _id: string;
  _type: 'callToAction';
  title: string;
  description?: string;
  button: IButton;
  linkType: 'internal' | 'external' | 'anchor';
  internalPage?: IInternalPageReference;
  externalUrl?: string;
  anchor?: string;
  openInNewTab?: boolean;
}
