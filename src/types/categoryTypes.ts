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
  slug: string;
  description: null;
  image_path: null | string;
  is_active: null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  parent_id: null | string;
  image_url: string;
  // Optional relations when included from API
  parent_category?: CategoryDatum | null;
  sub_categories?: CategoryDatum[];
}

export interface CategoryLinks {
  first: string;
  last: string;
  prev: null;
  next: string;
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

// single category types
export interface ISingleCategoryTopLevel {
  data: CategoryDatum;
  message: string;
  status: string;
}
