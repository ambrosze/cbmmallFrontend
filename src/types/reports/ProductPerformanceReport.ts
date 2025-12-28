export interface IProductPerformanceReportResponse {
  status: string;
  message: string;
  data: IProductPerformanceReportData;
}

export interface IProductPerformanceReportData {
  products: IProductPerformanceReportProduct[];
}

export interface IProductPerformanceReportProduct {
  id: string;
  name: string;
  slug: string;
  display_price: string;
  total_sold: number;
  available_quantity: number;
  created_at: string;
}
