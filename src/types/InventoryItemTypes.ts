export interface InventoryItemTopLevel {
  data: InventoryItemDatum[];
  links: InventoryItemLinks;
  meta: InventoryItemMeta;
  status: string;
  message: string;
}

export interface InventoryItemDatum {
  id: string;
  item_id: string;
  store_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  item: { [key: string]: null | string };
  store: InventoryItemStore;
}

export interface InventoryItemStore {
  id: string;
  name: string;
  address: string;
  is_headquarters: number;
  manager_staff_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}

export interface InventoryItemLinks {
  first: string;
  last: string;
  prev: null;
  next: string;
}

export interface InventoryItemMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: InventoryItemLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface InventoryItemLink {
  url: null | string;
  label: string;
  active: boolean;
}
