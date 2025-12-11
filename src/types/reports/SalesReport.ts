export interface ISalesReportResponse {
  status: string;
  message: string;
  data: ISalesReportData;
}

export interface ISalesReportData {
  summary: ISalesReportSummary;
  sales_by_period: ISalesReportSalesByPeriod[];
  payment_method_breakdown: ISalesReportPaymentMethodBreakdown[];
  recent_sales: ISalesReportRecentSale[];
}

export interface ISalesReportPaymentMethodBreakdown {
  payment_method: string;
  count: number;
  revenue: number;
}

export interface ISalesReportRecentSale {
  id: string;
  invoice_number: string;
  cashier: ISalesReportCashier;
  payment_method: string;
  subtotal_price: number;
  tax: number;
  discount_amount: number;
  total_price: number;
  created_at: string;
}

export interface ISalesReportCashier {
  id: string;
  staff_no: string;
  name: string;
}

export interface ISalesReportSalesByPeriod {
  period: string;
  count: number;
  revenue: number;
  average_value: number;
}

export interface ISalesReportSummary {
  total_sales: number;
  total_revenue: number;
  average_order_value: number;
  total_discount: number;
}
