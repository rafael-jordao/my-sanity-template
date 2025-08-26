// Interface para página interna referenciada
export interface IInternalPageReference {
  _type: string;
  slug: string;
  title: string;
}

export interface ILink {
  linkType: 'internal' | 'external' | 'anchor';
  internalPage?: IInternalPageReference;
  externalUrl?: string;
  anchor?: string;
  openInNewTab?: boolean;
}
