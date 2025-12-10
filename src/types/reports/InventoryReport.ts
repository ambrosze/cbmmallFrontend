export interface InventoryReportResponse {
  status: string;
  message: string;
  data: InventoryReportData;
}

export interface InventoryReportData {
  summary: InventoryReportSummary;
  inventory_items: InventoryReportInventoryItem[];
}

export interface InventoryReportInventoryItem {
  id: string;
  product: InventoryReportProduct;
  variant: InventoryReportVariant;
  store: InventoryReportProduct;
  quantity: number;
  status: InventoryReportStatus;
  serial_number: null;
  batch_number: null;
  stock_value: number;
  updated_at: string;
}

export interface InventoryReportProduct {
  id: string;
  name: string;
}

export enum InventoryReportStatus {
  Available = "available",
  OutOfStock = "out_of_stock",
}

export interface InventoryReportVariant {
  id: string;
  name: string;
  sku: string;
}

export interface InventoryReportSummary {
  total_items: number;
  low_stock_items: number;
  out_of_stock_items: number;
  total_stock_value: number;
}
