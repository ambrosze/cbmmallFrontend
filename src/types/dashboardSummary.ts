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
