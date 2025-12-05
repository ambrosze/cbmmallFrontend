export interface IDeliveryLocationListResponse {
  data: IDeliveryLocation[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    next: string | null;
    prev: string | null;
  };
}

export interface IDeliveryLocation {
  id: string;
  store_id: string;
  country_id: number;
  state_id: number;
  city_id: number;
  delivery_fee: string;
  estimated_delivery_days: number;
  created_at: string;
  updated_at: string;
  country: IDeliveryLocationCountry;
  state: IDeliveryLocationState;
  city: IDeliveryLocationCity;
}

export interface IDeliveryLocationResponse {
  id: string;
  store_id: string;
  country_id: number;
  state_id: number;
  city_id: number;
  delivery_fee: string;
  estimated_delivery_days: number;
  created_at: string;
  updated_at: string;
  country: IDeliveryLocationCountry;
  state: IDeliveryLocationState;
  city: IDeliveryLocationCity;
}

export interface IDeliveryLocationCity {
  id: number;
  country_id: number;
  state_id?: number;
  name: string;
  country_code: string;
}
export interface IDeliveryLocationState {
  id: number;
  country_id: number;
  name: string;
  country_code: string;
}

export interface IDeliveryLocationCountry {
  id: number;
  iso2: string;
  name: string;
  status: number;
  phone_code: string;
  iso3: string;
  region: string;
  subregion: string;
}
