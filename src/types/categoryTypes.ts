export interface CategoryTopLevel {
  data: CategoryDatum[];
  links: CategoryLinks;
  meta: CategoryMeta;
  status: string;
  message: string;
}

export interface CategoryDatum {
  id: string;
  name: string;
  created_at: String;
  updated_at: String;
  parent_category_id: null;
}

export interface CategoryLinks {
  first: string;
  last: string;
  prev: null;
  next: null;
}

export interface CategoryMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: CategoryLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface CategoryLink {
  url: null | string;
  label: string;
  active: boolean;
}
// single category
export interface ISingleCategoryTopLevel {
  data: ISingleCategoryData;
  message: string;
}

export interface ISingleCategoryData {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  parent_category_id: string;
  parent_category?: ISingleCategoryData;
}
