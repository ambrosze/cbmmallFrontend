export interface InventoryTopLevel {
  data: InventoryDatum[];
  links: InventoryLinks;
  meta: InventoryMeta;
  status: string;
  message: string;
}

export interface InventoryDatum {
  id: string;
  product_variant_id: string;
  store_id: string;
  serial_number: null;
  batch_number: null | string;
  quantity: number;
  status: string;
  condition_status: string;
  received_date: null;
  warranty_expiry_date: null;
  expiration_date: null;
  metadata: null;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  store: InventoryStore;
  product_variant: InventoryProductVariant;
}

export interface InventoryProductVariant {
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
  product: InventoryProduct;
  images: InventoryImage[];
}

export interface InventoryImage {
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

export interface InventoryProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  display_price: string;
  display_compare_price: string;
  is_serialized: number;
  metadata: null;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  attribute_values: InventoryAttributeValue[];
}

export interface InventoryAttributeValue {
  id: string;
  attribute_id: string;
  value: string;
  display_value: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  pivot: InventoryPivot;
}

export interface InventoryPivot {
  attributable_type: string;
  attributable_id: string;
  attribute_value_id: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryStore {
  id: string;
  name: string;
  slug: string;
  country: string;
  city: string;
  address: string;
  is_warehouse: number;
  phone_number: string;
  email: string;
  deactivated_at: null;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}

export interface InventoryLinks {
  first: string;
  last: string;
  prev: null;
  next: null;
}

export interface InventoryMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: InventoryLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface InventoryLink {
  url: null | string;
  label: string;
  active: boolean;
}
