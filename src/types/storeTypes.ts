export interface IStoreTopLevel {
  data: IStoreDatum[];
  links: IStoreLinks;
  meta: IStoreMeta;
  status: string;
  message: string;
}

export interface IStoreDatum {
  id: string;
  name: string;
  address: string;
  is_warehouse: number;
  email: string;
  country: string;
  city: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}


export interface IStoreLinks {
  first: string;
  last: string;
  prev: null;
  next: null;
}

export interface IStoreMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: IStoreLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface IStoreLink {
  url: null | string;
  label: string;
  active: boolean;
}

// single store types
export interface ISingleStoreTopLevel {
  data: ISingleStoreData;
  message: string;
}

export interface ISingleStoreData {
  id: string;
  name: string;
  address: string;
  is_warehouse: number;
  email: string;
  country: string;
  city: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}
