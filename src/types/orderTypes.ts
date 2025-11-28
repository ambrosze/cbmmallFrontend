export interface IOrdersResponse {
  data: IOrdersDatum[];
  links: IOrdersLinks;
  meta: IOrdersMeta;
  status: string;
  message: string;
}

export interface IOrdersDatum {
  id: string;
  reference: string;
  user_id: null | string;
  store_id: string;
  full_name: string;
  phone_number: string;
  email: string;
  delivery_method: null;
  delivery_address: IOrdersDeliveryAddress;
  delivery_cost: string;
  pickup_address: null;
  status: IOrdersStatus;
  payment_method: null;
  coupon_id: null;
  discount_amount: string;
  tax: string;
  subtotal_price: string;
  total_price: string;
  metadata: null;
  created_at: string;
  updated_at: string;
  user: { [key: string]: null | string } | null;
}

export interface IOrdersDeliveryAddress {
  full_name: string;
  phone_number: string;
  email: string;
  address: string;
  country: IOrdersCountry;
  state: IOrdersCity;
  city: IOrdersCity;
}

export interface IOrdersCity {
  id: number;
  country_id: number;
  state_id?: number;
  name: string;
  country_code: IOrdersCountryCode;
}

export enum IOrdersCountryCode {
  Ng = "NG",
}

export interface IOrdersCountry {
  id: number;
  iso2: IOrdersCountryCode;
  name: IOrdersName;
  status: number;
  phone_code: string;
  iso3: IOrdersIso3;
  region: IOrdersRegion;
  subregion: IOrdersSubregion;
}

export enum IOrdersIso3 {
  Nga = "NGA",
}

export enum IOrdersName {
  Nigeria = "Nigeria",
}

export enum IOrdersRegion {
  Africa = "Africa",
}

export enum IOrdersSubregion {
  WesternAfrica = "Western Africa",
}

export enum IOrdersStatus {
  Pending = "pending",
}

export interface IOrdersLinks {
  first: string;
  last: string;
  prev: null;
  next: string;
}

export interface IOrdersMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: IOrdersLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface IOrdersLink {
  url: null | string;
  label: string;
  active: boolean;
}

// Single Order Response Types
export interface ISingleOrderResponse {
  data: ISingleOrderData;
  status: string;
  message: string;
}

export interface ISingleOrderData extends IOrdersDatum {
  items?: IOrderItem[];
  payables?: IOrderPayable[];
}

export interface IOrderItem {
  id: string;
  order_id: string;
  name: string;
  price: string;
  quantity: number;
  options: IOrderItemOptions;
  created_at: string;
  updated_at: string;
}

export interface IOrderItemOptions {
  image_url?: string;
  itemable_id?: string;
  itemable_type?: string;
  price?: string;
}

export interface IOrderPayable {
  id: string;
  payment_id: string;
  payable_type: string;
  payable_id: string;
  amount: string;
  metadata: any;
  verifier_id: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
  payable?: IOrdersDatum;
}
