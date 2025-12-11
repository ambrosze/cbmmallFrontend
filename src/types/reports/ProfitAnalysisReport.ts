export interface IProfitAnalysisReportResponse {
  status: string;
  message: string;
  data: IProfitAnalysisReportData;
}

export interface IProfitAnalysisReportData {
  summary: IProfitAnalysisReportSummary;
  product_profits: IProfitAnalysisReportProductProfit[];
}

export interface IProfitAnalysisReportProductProfit {
  product: IProfitAnalysisReportProduct;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
  quantity_sold: number;
}

export interface IProfitAnalysisReportProduct {
  id: string;
  name: string;
}

export interface IProfitAnalysisReportSummary {
  total_revenue: number;
  total_cost: number;
  total_profit: number;
  overall_margin: number;
}
