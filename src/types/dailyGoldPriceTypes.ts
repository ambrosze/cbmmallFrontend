export interface IDailyGoldPriceTopLevel {
  data: IDailyGoldPriceDatum[];
  links: IDailyGoldPriceLinks;
  meta: IDailyGoldPriceMeta;
  status: string;
  message: string;
}

export interface IDailyGoldPriceDatum {
  id: string;
  category_id: string;
  price_per_gram: string;
  recorded_on: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  category: IDailyGoldPriceCategory;
}

export interface IDailyGoldPriceCategory {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  parent_category_id: null;
}

export interface IDailyGoldPriceLinks {
  first: string;
  last: string;
  prev: null;
  next: null;
}

export interface IDailyGoldPriceMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: IDailyGoldPriceLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface IDailyGoldPriceLink {
  url: null | string;
  label: string;
  active: boolean;
}

// This interface is used for the single daily gold price

export interface IDailyGoldSinglePriceTopLevel {
  data: IDailyGoldSinglePriceData;
  message: string;
}

export interface IDailyGoldSinglePriceData {
  id: string;
  category_id: string;
  price_per_gram: string;
  recorded_on: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  category: IDailyGoldSinglePriceCategory;
}

export interface IDailyGoldSinglePriceCategory {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  parent_category_id: null;
}
