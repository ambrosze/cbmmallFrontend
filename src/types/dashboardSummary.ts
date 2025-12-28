export interface SummaryTopLevel {
  data: SummaryData;
  message: string;
  status: string;
}

export interface SummaryData {
  users: SummaryUsers;
  staff: SummaryStaff;
  sales: SummarySales;
  products: SummaryProducts;
}

export interface SummaryProducts {
  total: number;
  available: number;
  low_stock: number;
  out_of_stock: SummaryOutOfStockProduct[];
  new_products: number;
  top_selling_products: SummaryTopSellingProduct[];
}

export interface SummaryOutOfStockProduct {
  product_variant: SummaryProductVariant;
  quantity: number;
  last_updated: string;
}

export interface SummaryTopSellingProduct {
  product_variant: SummaryProductVariant;
  sales_count: number;
  total_revenue: number;
}

export interface SummaryProductVariant {
  id: string;
  slug: string;
  product_id: string;
  sku: string | null;
  name: string;
  barcode: string;
  price: string | null;
  compare_price: string | null;
  cost_price: string | null;
  status: string | null;
  is_serialized: number;
  metadata: SummaryMetadata;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  available_quantity: string | number;
  weight: string;
  material: string;
  type: SummaryType;
  colour: SummaryType | null;
  category: SummaryType | null;
  product: SummaryProduct;
}

export interface SummaryProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  display_price: string;
  display_compare_price: string | null;
  is_serialized: number;
  metadata: SummaryMetadata;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  available_quantity: string | number;
}

export interface SummaryMetadata {
  stores: Record<string, SummaryStoreAvailability>;
  available_quantity: string | number;
}

export interface SummaryStoreAvailability {
  id: string;
  available_quantity: string | number;
}

export interface SummaryType {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  parent_category_id?: null;
  hex?: string;
  parent_type_id?: null | string;
}

export interface SummarySales {
  total: number;
  new_sales: number;
  total_amount: string;
  average_amount: string;
}

export interface SummaryStaff {
  total: number;
  active: number;
  inactive?: number;
  in_active?: number;
  new_staff: number;
}

export interface SummaryUsers {
  total: number;
  active: number;
  inactive: number;
  new_signups: number;
}
export interface SummaryTopLevel {
  data: SummaryData;
  message: string;
  status: string;
}

export interface SummaryData {
  users: SummaryUsers;
  staff: SummaryStaff;
  sales: SummarySales;
  products: SummaryProducts;
}

export interface SummaryProducts {
  total: number;
  available: number;
  low_stock: number;
  out_of_stock: SummaryOutOfStockProduct[];
  new_products: number;
  top_selling_products: SummaryTopSellingProduct[];
}

export interface SummaryOutOfStockProduct {
  product_variant: SummaryProductVariant;
  quantity: number;
  last_updated: string;
}

export interface SummaryTopSellingProduct {
  product_variant: SummaryProductVariant;
  sales_count: number;
  total_revenue: number;
}

export interface SummaryProductVariant {
  id: string;
  slug: string;
  product_id: string;
  sku: string | null;
  name: string;
  barcode: string;
  price: string | null;
  compare_price: string | null;
  cost_price: string | null;
  status: string | null;
  is_serialized: number;
  metadata: SummaryMetadata;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  available_quantity: string | number;
  weight: string;
  material: string;
  type: SummaryType;
  colour: SummaryType | null;
  category: SummaryType | null;
  product: SummaryProduct;
}

export interface SummaryProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  display_price: string;
  display_compare_price: string | null;
  is_serialized: number;
  metadata: SummaryMetadata;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  available_quantity: string | number;
}

export interface SummaryMetadata {
  stores: Record<string, SummaryStoreAvailability>;
  available_quantity: string | number;
}

export interface SummaryStoreAvailability {
  id: string;
  available_quantity: string | number;
}

export interface SummaryType {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  parent_category_id?: null;
  hex?: string;
  parent_type_id?: null | string;
}

export interface SummarySales {
  total: number;
  new_sales: number;
  total_amount: string;
  average_amount: string;
}

export interface SummaryStaff {
  total: number;
  active: number;
  inactive?: number;
  in_active?: number;
  new_staff: number;
}

export interface SummaryUsers {
  total: number;
  active: number;
  inactive: number;
  new_signups: number;
}
export interface SummaryTopLevel {
  data: SummaryData;
  message: string;
  status: string;
}

export interface SummaryData {
  users: SummaryUsers;
  staff: SummaryStaff;
  sales: SummarySales;
  items: SummaryItems;
}

export interface SummaryItems {
  total: number;
  available: number;
  low_stock: number;
  out_of_stock: any[];
  new_items: number;
  top_selling_items: SummaryTopSellingItem[];
}

export interface SummaryTopSellingItem {
  item: Item;
  sales_count: number;
  total_revenue: number;
}

export interface Item {
  id: string;
  barcode: string;
  sku: null;
  weight: string;
  category_id: null | string;
  colour_id: null | string;
  type_id: string;
  material: string;
  price: null | string;
  notes: string;
  options: null;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  image: null;
  type: SummaryType;
  colour: SummaryType | null;
  category: SummaryType | null;
}

export interface SummaryType {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  parent_category_id?: null;
  hex?: string;
  parent_type_id?: null | string;
}

export interface SummarySales {
  total: number;
  new_sales: number;
  total_amount: string;
  average_amount: string;
}

export interface SummaryStaff {
  total: number;
  active: number;
  new_staff: number;
}

export interface SummaryUsers {
  total: number;
  active: number;
  inactive: number;
  new_signups: number;
}
