export interface IColourTopLevel {
  data: IColourDatum[];
  links: IColourLinks;
  meta: IColourMeta;
  status: string;
  message: string;
}

export interface IColourDatum {
  id: string;
  name: string;
  hex: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  items_count: number;
}

export interface IColourLinks {
  first: string;
  last: string;
  prev: null;
  next: null;
}

export interface IColourMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: IColourLinks[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface Link {
  url: null | string;
  label: string;
  active: boolean;
}
// single colours types
export interface ISingleColoursTopLevel {
  data: ISingleColoursData;
  message: string;
}

export interface ISingleColoursData {
  id: string;
  name: string;
  hex: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  items_count: number;
}
