export interface UserResponseTopLevel {
  status: string;
  message: string;
  user: UserResponseUser;
  token: string;
}

export interface UserResponseUser {
  id: string;
  first_name: string;
  middle_name: null;
  last_name: string;
  phone_number: string;
  phone_number_verified_at: null;
  email: string;
  email_verified_at: null;
  deactivated_at: null;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
  all_permissions: any[];
  profile_photo_url: string;
  is_admin: boolean;
  is_staff: boolean;
  is_store_manager: boolean;
  permissions: any[];
  roles: UserResponseRole[];
  staff: UserResponseStaff;
}

export interface UserResponseRole {
  id: string;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: Pivot;
  permissions: any[];
}

export interface Pivot {
  model_type: string;
  model_id: string;
  role_id: string;
}

export interface UserResponseStaff {
  id: string;
  user_id: string;
  staff_no: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  store_id: string;
}
