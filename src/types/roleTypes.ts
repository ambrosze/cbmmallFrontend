export interface IRolesTopLevel {
  data: IRolesDatum[];
  links: IRolesLinks;
  meta: IRolesMeta;
  status: string;
  message: string;
}

export interface IRolesDatum {
  id: string;
  name: string;
  guard_name: string;
  permissions?: IRolesPermissionsDatum[];
  created_at: string;
  updated_at: string;
}

export interface IRolesLinks {
  first: string;
  last: string;
  prev: null;
  next: null;
}

export interface IRolesMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: IRolesLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface IRolesLink {
  url: null | string;
  label: string;
  active: boolean;
}

// single roles types

export interface ISingleRolesTopLevel {
  data: ISingleRolesDatum[];
  links: ISingleRolesLinks;
  meta: ISingleRolesMeta;
  status: string;
  message: string;
}

export interface ISingleRolesDatum {
  id: string;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface ISingleRolesLinks {
  first: string;
  last: string;
  prev: null;
  next: null;
}

export interface ISingleRolesMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: ISingleRolesLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface ISingleRolesLink {
  url: null | string;
  label: string;
  active: boolean;
}

export interface IRolesPermissionsResponse {
  data: IRolesPermissionsDatum[];
  status: string;
  message: string;
}

export interface IRolesPermissionsDatum {
  id: string;
  name: string;
  guard_name: IRolesPermissionsGuardName;
  created_at: string;
  updated_at: string;
  label: string;
}

export enum IRolesPermissionsGuardName {
  Web = "web",
}

