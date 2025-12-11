export interface IStaffPerformanceReportResponse {
  status: string;
  message: string;
  data: IStaffPerformanceReportData;
}

export interface IStaffPerformanceReportData {
  staff_performance: IStaffPerformanceReportStaffPerformance[];
}

export interface IStaffPerformanceReportStaffPerformance {
  staff: IStaffPerformanceReportStaff;
  performance: IStaffPerformanceReportPerformance;
}

export interface IStaffPerformanceReportPerformance {
  sales_count: number;
  total_revenue: number;
  average_transaction_value: number;
}

export interface IStaffPerformanceReportStaff {
  id: string;
  staff_no: string;
  name: string;
  email: string;
  store: string;
}
