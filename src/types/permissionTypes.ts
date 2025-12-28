export type PermissionName =
  | "customers.create"
  | "customers.delete"
  | "customers.update"
  | "customers.view"
  | "customers.viewAny"
  | "inventories.update-stock"
  | "inventories.view"
  | "inventories.viewAny"
  | "orders.update"
  | "orders.view"
  | "orders.viewAny"
  | "pos.checkout"
  | "products.viewAny"
  | "products.create"
  | "products.delete"
  | "products.update"
  | "roles.assign-permissions"
  | "roles.create"
  | "roles.delete"
  | "roles.update"
  | "roles.view"
  | "roles.viewAny"
  | "staff.create"
  | "staff.delete"
  | "staff.update"
  | "staff.view"
  | "staff.viewAny"
  | "stock_transfers.create"
  | "stock_transfers.delete"
  | "stock_transfers.receive"
  | "stock_transfers.update"
  | "stock_transfers.view"
  | "stock_transfers.viewAny"
  | "stock_transfers.viewOwn"
  | "suppliers.create"
  | "suppliers.delete"
  | "suppliers.update"
  | "suppliers.view"
  | "suppliers.viewAny"
  | "users.create"
  | "users.delete"
  | "users.update"
  | "users.update-password"
  | "users.view"
  | "users.viewAny"
  | "delivery_locations.create"
  | "delivery_locations.update"
  | "delivery_locations.delete"
  | "payment_gateways.view"
  | "payment_gateways.update"
  | "reports.view-sales"
  | "reports.view-orders"
  | "reports.view-customers"
  | "reports.view-inventory"
  | "reports.view-staff"
  | "reports.view-products"
  | "reports.view-financial";

export enum PermissionGuardName {
  Web = "web",
}

export interface PermissionDatum {
  id: string;
  name: PermissionName;
  guard_name: PermissionGuardName;
  created_at: string;
  updated_at: string;
  label: string;
}

export interface PermissionListResponse {
  data: PermissionDatum[];
  status: string;
  message: string;
}
