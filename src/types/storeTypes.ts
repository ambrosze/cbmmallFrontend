export interface IStoreTopLevel {
  data: IStoreDatum[];
  links: IStoreLinks;
  meta: IStoreMeta;
  status: string;
  message: string;
}

export interface IStoreDatum {
  id: string;
  name: string;
  address: string;
  is_headquarters: number;
  manager_staff_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  manager: IStoreManager;
}

export interface IStoreManager {
  id: string;
  user_id: string;
  staff_no: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  store_id: string;
}

export interface IStoreLinks {
  first: string;
  last: string;
  prev: null;
  next: null;
}

export interface IStoreMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: IStoreLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface IStoreLink {
  url: null | string;
  label: string;
  active: boolean;
}

// single store types
export interface ISingleStoreTopLevel {
  data: ISingleStoreData;
  message: string;
}

export interface ISingleStoreData {
  id: string;
  name: string;
  address: string;
  is_headquarters: number;
  manager_staff_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  manager: ISingleStoreManager;
}

export interface ISingleStoreManager {
  id: string;
  user_id: string;
  staff_no: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  user: ISingleStoreUser;
}

export interface ISingleStoreUser {
  id: string;
  first_name: string;
  middle_name: null;
  last_name: string;
  phone_number: string;
  phone_number_verified_at: string;
  email: string;
  email_verified_at: string;
  deactivated_at: null;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  profile_photo_url: string;
}
