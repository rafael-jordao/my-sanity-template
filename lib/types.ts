export interface SEO {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: {
    asset: {
      url: string;
    };
  };
  noIndex?: boolean;
}

export interface PageSettings {
  _id: string;
  title: string;
  slug: string;
  seo?: SEO;
}
