export interface AdminDiscountTopLevel {
  data: AdminDiscountDatum[];
  links: AdminDiscountLinks;
  meta: AdminDiscountMeta;
  status: string;
  message: string;
}

export interface AdminDiscountDatum {
  id: string;
  code: string;
  description: null;
  percentage: string;
  expires_at: null;
  is_active: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}

export interface AdminDiscountLinks {
  first: string;
  last: string;
  prev: null;
  next: null;
}

export interface AdminDiscountMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: AdminDiscountLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface AdminDiscountLink {
  url: null | string;
  label: string;
  active: boolean;
}
export interface CreateDiscountAdminType {
  code: string;
  description: string;
  percentage: string;
  expires_at: string;
  is_active: string;
}

export interface AdminDiscountSingleTopLevel {
  data: AdminDiscountSingleData;
  message: string;
}

export interface AdminDiscountSingleData {
  id: string;
  code: string;
  description: string;
  percentage: string;
  expires_at: string;
  is_active: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}
