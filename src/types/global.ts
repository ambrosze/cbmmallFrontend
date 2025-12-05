export interface ICountryTopLevel {
  success: boolean;
  message: string;
  data: ICountryDatum[];
  response_time: string;
}

export interface ICountryDatum {
  id: number;
  iso2: string;
  iso3: string;
  name: string;
  phone_code: string;
}

export interface StateTopLevel {
  data: StateDatum[];
  links: Links;
  meta: Meta;
  status: string;
  message: string;
}

export interface StateDatum {
  id: string;
  name: string;
  code: string;
  capital: string;
  country_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
}
export interface Links {
  first: string;
  last: string;
  prev: null;
  next: string;
}

export interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: Link[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface Link {
  url: null | string;
  label: string;
  active: boolean;
}
