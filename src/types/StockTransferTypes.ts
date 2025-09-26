export interface StockTransferTopLevel {
  data: StockTransferDatum[];
  links: StockTransferLinks;
  meta: StockTransferMeta;
  status: string;
  message: string;
}

export interface StockTransferDatum {
  id: string;
  reference_no: string;
  sender_id: string;
  comment: string;
  driver_name: string;
  driver_phone_number: string;
  from_store_id: string;
  to_store_id: string;
  receiver_id: string;
  status: StockTransferStatus;
  dispatched_at: null;
  accepted_at: string | null;
  rejected_at: null;
  rejection_reason: null;
  created_at: string;
  updated_at: string;
  sender: { [key: string]: null | string };
  receiver: { [key: string]: null | string };
  from_store: StockTransferStore;
  to_store: StockTransferStore;
}

export interface StockTransferStore {
  id: string;
  name: string;
  address: string;
  is_warehouse: string;
  manager_staff_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}

export enum StockTransferStatus {
  Accepted = "accepted",
  New = "new",
  Rejected = "rejected",
  Dispatched = "dispatched",
}

export interface StockTransferLinks {
  first: string;
  last: string;
  prev: null;
  next: string;
}

export interface StockTransferMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: StockTransferLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface StockTransferLink {
  url: null | string;
  label: string;
  active: boolean;
}

export interface SingleStockTransferTopLevel {
  data: SingleStockTransferData;
  message: string;
}

export interface SingleStockTransferData {
  id: string;
  reference_no: string;
  sender_id: string;
  comment: string;
  driver_name: string;
  driver_phone_number: string;
  from_store_id: string;
  to_store_id: string;
  receiver_id: string;
  status: string;
  dispatched_at: string;
  accepted_at: null;
  rejected_at: string;
  rejection_reason: string;
  created_at: string;
  updated_at: string;
  inventories_count: string;
  stock_transfer_inventories_count: string;
  receiver: SingleStockTransferReceiver;
  sender: { [key: string]: null | string };
  from_store: SingleStockTransferStore;
  to_store: SingleStockTransferStore;
  stock_transfer_inventories: StockTransferInventory[];
}

export interface SingleStockTransferStore {
  id: string;
  name: string;
  address: string;
  is_warehouse: string;
  manager_staff_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}

export interface SingleStockTransferReceiver {
  id: string;
  first_name: string;
  middle_name: null;
  last_name: string;
  phone_number: string;
  phone_number_verified_at: null;
  email: string;
  email_verified_at: null;
  deactivated_at: null;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  profile_photo_url: string;
}

export interface StockTransferInventory {
  id: string;
  inventory_id: string;
  stock_transfer_id: string;
  quantity: string;
  created_at: string;
  updated_at: string;
  inventory: SingleStockTransferInventory;
}

export interface SingleStockTransferInventory {
  id: string;
  item_id: string;
  store_id: string;
  quantity: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  item: SingleStockTransferItem;
}

export interface SingleStockTransferItem {
  id: string;
  barcode: string;
  sku: null;
  weight: string;
  category_id: string;
  colour_id: string;
  type_id: string;
  material: string;
  price: null;
  notes: string;
  options: null;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  image: null;
  category: SingleStockTransferCategory;
  type: SingleStockTransferCategory;
  colour: SingleStockTransferCategory;
}

export interface SingleStockTransferCategory {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  parent_category_id?: null;
  hex?: string;
  parent_type_id?: string;
}
