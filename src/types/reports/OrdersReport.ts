export interface IOrdersReportResponse {
  status: string;
  message: string;
  data: IOrdersReportData;
}

export interface IOrdersReportData {
  summary: IOrdersReportSummary;
  status_breakdown: IOrdersReportStatusBreakdown[];
  delivery_method_breakdown: IOrdersReportDeliveryMethodBreakdown[];
  recent_orders: IOrdersReportRecentOrder[];
}

export interface IOrdersReportDeliveryMethodBreakdown {
  delivery_method: string;
  count: number;
}

export interface IOrdersReportRecentOrder {
  id: string;
  reference: string;
  customer: IOrdersReportCustomer;
  store: IOrdersReportRecentOrderStore;
  status: string;
  delivery_method: string;
  payment_method: null;
  subtotal_price: number;
  discount_amount: number;
  total_price: number;
  items_count: number;
  items: IOrdersReportItem[];
  created_at: string;
}

export interface IOrdersReportCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface IOrdersReportItem {
  id: string;
  order_id: string;
  name: string;
  price: string;
  quantity: number;
  options: IOrdersReportOptions;
  created_at: string;
  updated_at: string;
}

export interface IOrdersReportOptions {
  image_url: string;
  itemable_id: string;
  itemable_type: string;
  itemable: IOrdersReportItemable;
  price: string;
}

export interface IOrdersReportItemable {
  id: string;
  product_variant_id: string;
  store_id: string;
  serial_number: null;
  batch_number: null;
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
  store: IOrdersReportItemableStore;
  product_variant: IOrdersReportProductVariant;
}

export interface IOrdersReportProductVariant {
  id: string;
  product_id: string;
  sku: string;
  name: string;
  slug: string;
  barcode: string;
  price: string;
  compare_price: null;
  cost_price: string;
  status: null;
  is_serialized: number;
  metadata: null;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  available_quantity: null;
  product: IOrdersReportProduct;
}

export interface IOrdersReportProduct {
  id: string;
  name: string;
  slug: string;
  description: null;
  short_description: null;
  display_price: string;
  display_compare_price: null;
  is_serialized: number;
  metadata: null;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  available_quantity: null;
}

export interface IOrdersReportItemableStore {
  id: string;
  name: string;
  slug: string;
  country: string;
  city: string;
  address: string;
  is_warehouse: number;
  phone_number: null;
  email: null;
  deactivated_at: null;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}

export interface IOrdersReportRecentOrderStore {
  id: string;
  name: string;
}

export interface IOrdersReportStatusBreakdown {
  status: string;
  count: number;
  revenue: string;
}

export interface IOrdersReportSummary {
  total_orders: number;
  total_revenue: number;
  average_order_value: number;
}
