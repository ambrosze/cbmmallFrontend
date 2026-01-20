export interface IContentBlocksTopLevel {
  data: IContentBlocksDatum[];
  links: IContentBlocksLinks;
  meta: IContentBlocksMeta;
  status: string;
  message: string;
}

export interface IContentBlocksDatum {
  id: string;
  key: string;
  group: string;
  sort_order: number;
  title: string;
  short_description: string;
  description: string;
  link_text: string;
  link_url: string;
  image_path: null;
  is_active: number;
  metadata: null;
  created_at: string;
  updated_at: string;
  image_url: null;
}

export interface IContentBlocksLinks {
  first: string;
  last: string;
  prev: null;
  next: null;
}

export interface IContentBlocksMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: IContentBlocksLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface IContentBlocksLink {
  url: null | string;
  label: string;
  active: boolean;
}

// single content block types
export interface ISingleContentBlockTopLevel {
  data: IContentBlocksDatum;
  message: string;
  status: string;
}
