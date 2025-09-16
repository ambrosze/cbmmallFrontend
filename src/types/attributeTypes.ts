export interface ITypesTopLevel {
  data: ITypesDatum[];
  links: ITypesLinks;
  meta: ITypesMeta;
  status: string;
  message: string;
}

export interface ITypesDatum {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  parent_type_id: null | string;
  parent_type?: ITypesDatum | null;
}

export interface ITypesLinks {
  first: string;
  last: string;
  prev: null;
  next: null;
}

export interface ITypesMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: ITypesLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface ITypesLink {
  url: null | string;
  label: string;
  active: boolean;
}
// single attribute
export interface ISingleAttributeTopLevel {
  data: ISingleAttributeData;
  message: string;
}

export interface ISingleAttributeData {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  parent_type_id: null;
  parent_type: null;
}
