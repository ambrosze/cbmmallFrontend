export interface SalesTopLevel {
  data: SalesDatum[];
  links: SalesLinks;
  meta: SalesMeta;
  status: string;
  message: string;
}

export interface SalesDatum {
  id: string;
  invoice_number: string;
  cashier_user_id: string;
  customer_user_id: null;
  customer_name: string;
  customer_email: string;
  customer_phone_number: string;
  payment_method: string;
  subtotal_price: string;
  tax: string;
  discount_id: null;
  total_price: string;
  metadata: SalesMetadata;
  created_at: string;
  updated_at: string;
  sale_inventories: SaleInventory[];
}

export interface SalesMetadata {
  discount: null;
}

export interface SaleInventory {
  inventory: any;
  id: string;
  sale_id: string;
  inventory_id: string;
  weight: string;
  price_per_gram: string;
  quantity: number;
  total_price: string;
  daily_gold_price_id: string;
  created_at: string;
  updated_at: string;
}

export interface SalesLinks {
  first: string;
  last: string;
  prev: null;
  next: null;
}

export interface SalesMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: SalesLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface SalesLink {
  url: null | string;
  label: string;
  active: boolean;
}
//single  sales details types
export interface SingleSalesTopLevel {
  data: SingleSalesData;
  message: string;
}

export interface SingleSalesData {
  id: string;
  invoice_number: string;
  cashier_user_id: string;
  customer_user_id: null;
  customer_name: string;
  customer_email: string;
  customer_phone_number: string;
  payment_method: string;
  subtotal_price: string;
  tax: string;
  discount_id: null;
  total_price: string;
  metadata: SingleSalesMetadata;
  created_at: string;
  updated_at: string;
  sale_inventories: SingleSalesInventory[];
}

export interface SingleSalesInventory {
  id: string;
  sale_id: string;
  inventory_id: string;
  weight: string;
  price_per_gram: string;
  quantity: number;
  total_price: string;
  daily_gold_price_id: string;
  created_at: string;
  updated_at: string;
}

export interface SingleSalesMetadata {
  discount: null;
}
