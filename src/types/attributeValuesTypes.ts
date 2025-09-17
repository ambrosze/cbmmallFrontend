export interface IAttributesValuesTopLevel {
  data: IAttributesValuesDatum[];
  links: IAttributesValuesLinks;
  meta: IAttributesValuesMeta;
  status: string;
  message: string;
}

export interface IAttributesValuesDatum {
  id: string;
  attribute_id: string;
  value: string;
  display_value: null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  attribute: IAttributesValuesAttribute;
}

export interface IAttributesValuesAttribute {
  id: string;
  name: string;
  slug: string;
  type: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}

export interface IAttributesValuesLinks {
  first: string;
  last: string;
  prev: null;
  next: null;
}

export interface IAttributesValuesMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: IAttributesValuesLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface IAttributesValuesLink {
  url: null | string;
  label: string;
  active: boolean;
}

// single attribute value response
export interface ISingleAttributeValueTopLevel {
  data: IAttributesValuesDatum;
  status: string;
  message: string;
}
