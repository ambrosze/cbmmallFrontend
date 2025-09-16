export interface CountryTopLevel {
  data: CountryDatum[];
  links: Links;
  meta: Meta;
  status: string;
  message: string;
}

export interface CountryDatum {
  id: string;
  name: string;
  iso_alpha2: string;
  iso_alpha3: string;
  iso_numeric: number;
  currency_name: string;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit_name: string;
  currency_minor_unit_code: string;
  currency_minor_unit_symbol: string;
  continent: null;
  region: null;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
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
