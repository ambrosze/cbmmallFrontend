export interface JewelryItem {
  id: string;
  barcode: string;
  sku: string;
  weight: string;
  category_id: string | null;
  colour_id: string | null;
  type_id: string;
  material: string;
  price: string | null;
  notes: string;
  options: any | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  inventory_sum_quantity: string;
  image: string | null;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface JewelryApiResponse {
  data: JewelryItem[];
  links: PaginationLinks;
  meta: PaginationMeta;
  status: string;
  message: string;
}
