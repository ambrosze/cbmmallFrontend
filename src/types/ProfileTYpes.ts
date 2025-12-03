import { PermissionGuardName, PermissionName } from "./permissionTypes";

export interface IPermissionsResponse {
  data: IPermissionsData;
  message: string;
}

export interface IPermissionsData {
  id: string;
  first_name: string;
  middle_name: null;
  last_name: string;
  phone_number: string;
  phone_number_verified_at: null;
  email: string;
  email_verified_at: null;
  username: null;
  deactivated_at: null;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
  profile_photo_url: string;
  is_admin: boolean;
  roles: IPermissionsRole[];
  staff: null;
  store: IPermissionsStore;
  permissions: IPermission[];
}

export interface IPermission {
  id: string;
  name: PermissionName;
  guard_name: PermissionGuardName;
  created_at: string;
  updated_at: string;
  label: string;
  pivot: IPermissionsPermissionPivot;
}

export interface IPermissionsPermissionPivot {
  role_id: string;
  permission_id: string;
}

export interface IPermissionsRole {
  id: string;
  name: string;
  guard_name: PermissionGuardName;
  created_at: string;
  updated_at: string;
  pivot: IPermissionsRolePivot;
}

export interface IPermissionsRolePivot {
  model_type: string;
  model_id: string;
  role_id: string;
}

export interface IPermissionsStore {
  id: string;
  name: string;
  slug: string;
  country: string;
  city: string;
  address: string;
  is_warehouse: number;
  phone_number: null;
  email: string;
  deactivated_at: null;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  laravel_through_key: string;
}
