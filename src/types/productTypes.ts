export interface IProductListResponse {
  data: ProductListDatum[];
  links: ProductListLinks;
  meta: ProductListMeta;
  status: string;
  message: string;
}

export interface IProductListVariant {
  id: string;
  product_id: string;
  sku: string;
  name: string;
  barcode: string;
  price: string;
  compare_price: string;
  cost_price: string;
  status: null;
  is_serialized: number;
  metadata: null;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  product?: ProductListDatum;
}

export interface ProductListDatum {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  display_price: null | string;
  display_compare_price: null | string;
  is_serialized: number;
  metadata: null;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  variants?: IProductListVariant[];
  images?: ProductListImage[];
  attribute_values?: ProductListAttributeValue[];
}

export interface ProductListAttributeValue {
  id: string;
  attribute_id: string;
  value: string;
  display_value: null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  pivot: ProductListPivot;
}

export interface ProductListPivot {
  attributable_type: string;
  attributable_id: string;
  attribute_value_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProductListImage {
  id: string;
  name: string;
  path: string;
  url: string;
  type: string;
  mime_type: string;
  extension: string;
  size: number;
  storage: string;
  attachable_type: string;
  attachable_id: string;
  user_id: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}

export interface ProductListLinks {
  first: string;
  last: string;
  prev: null;
  next: string;
}

export interface ProductListMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: ProductListLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface ProductListLink {
  url: null | string;
  label: string;
  active: boolean;
}

// single product response
export interface ISingleProductResponse {
  data: IProductListVariant;
  status: string;
  message: string;
}
