export interface ICustomersReportResponse {
  status: string;
  message: string;
  data: ICustomersReportData;
}

export interface ICustomersReportData {
  customers: ICustomersReportCustomer[];
}

export interface ICustomersReportCustomer {
  id: string;
  name: string;
  email: string;
  phone_number: null;
  country: null;
  city: null;
  purchase_count: number;
  total_spent: number;
  average_order_value: number;
  created_at: string;
}
