export interface IStaffTopLevel {
  data: IStaffDatum[];
  links: IStaffLinks;
  meta: IStaffMeta;
  status: string;
  message: string;
}

export interface IStaffDatum {
  id: string;
  user_id: string;
  staff_no: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  store_id: null | string;
  user: IStaffUser;
  managed_store: IStaffStore | null;
  store: IStaffStore | null;
}

export interface IStaffStore {
  id: string;
  name: string;
  address: string;
  is_warehouse: number;
  manager_staff_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}

export interface IStaffUser {
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

export interface IStaffLinks {
  first: string;
  last: string;
  prev: null;
  next: string;
}

export interface IStaffMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: IStaffLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface IStaffLink {
  url: null | string;
  label: string;
  active: boolean;
}

// single staff
export interface ISingleStaffTopLevel {
  data: ISingleStaffData;
  message: string;
}

export interface ISingleStaffData {
  id: string;
  user_id: string;
  staff_no: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  user: ISingleStaffUser;
  managed_store: null;
}

export interface ISingleStaffUser {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone_number: string;
  phone_number_verified_at: null;
  email: string;
  email_verified_at: null;
  deactivated_at: null;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  profile_photo_url: string;
}
