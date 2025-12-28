export interface IRevenueAnalyticsReportResponse {
  status: string;
  message: string;
  data: IRevenueAnalyticsReportData;
}

export interface IRevenueAnalyticsReportData {
  revenue_by_period: IRevenueAnalyticsReportRevenueByPeriod[];
  revenue_by_payment_method: IRevenueAnalyticsReportRevenueByPaymentMethod[];
  growth_rate: number;
}

export interface IRevenueAnalyticsReportRevenueByPaymentMethod {
  payment_method: null | string;
  revenue: string;
  count: number;
}

export interface IRevenueAnalyticsReportRevenueByPeriod {
  period: string;
  sales_count: number;
  revenue: string;
  subtotal: string;
  tax: string;
  discount: string;
}
