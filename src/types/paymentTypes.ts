export interface IPaymentGatewayResponse {
  data: IPaymentGatewayDatum[];
  links: IPaymentGatewayLinks;
  meta: IPaymentGatewayMeta;
  status: string;
  message: string;
}

export interface IPaymentGatewayDatum {
  id: string;
  code: string;
  name: string;
  description: string;
  logo_path: string;
  logo_url: string;
  sort_order: number;
  is_default: number;
  mode: string;
  supported_currencies: string[];
  credential_schema: IPaymentGatewaySchema;
  setting_schema: IPaymentGatewaySchema;
  disabled_at: null;
  created_at: string;
  updated_at: string;
  is_disabled: boolean;
}

export interface IPaymentGatewaySchema {
  fields: IPaymentGatewayField[];
}

export interface IPaymentGatewayField {
  key: string;
  label: string;
  input: string;
  hint: string;
  required: boolean;
  sensitive: boolean;
  validation: string;
}

export interface IPaymentGatewayLinks {
  first: string;
  last: string;
  prev: null;
  next: null;
}

export interface IPaymentGatewayMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: IPaymentGatewayLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface IPaymentGatewayLink {
  url: null | string;
  label: string;
  active: boolean;
}

// single payment gateway response
export interface ISinglePaymentGatewayResponse {
  data: IPaymentGatewayDatum;
  status: string;
  message: string;
}
