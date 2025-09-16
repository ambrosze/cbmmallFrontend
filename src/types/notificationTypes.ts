export interface NotificationTopLevel {
  data: NotificationDatum[];
  links: NotificationLinks;
  meta: NotificationTopLevelMeta;
  message: string;
}

export interface NotificationDatum {
  id: string;
  type: string;
  title: string;
  message: string;
  icon: string;
  level: "success" | "info" | "warning" | "error";
  action_url: string;
  meta: NotificationDatumMeta;
  read: boolean;
  read_at: null;
  created_at: string;
}

export interface NotificationDatumMeta {
  id: string;
  reference_no: string;
  sender_name: string;
  comment: string;
  dispatch_date: Date;
  driver_name: string;
  driver_phone: null;
  inventory_count: number;
  total_quantity: number;
  items: NotificationItem[];
}

export interface NotificationItem {
  sn: number;
  sku: null;
  quantity: string;
}

export interface NotificationLinks {
  first: string;
  last: string;
  prev: null;
  next: null;
}

export interface NotificationTopLevelMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: NotificationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface NotificationLink {
  url: null | string;
  label: string;
  active: boolean;
}

// single notification
export interface NotificationSingleTopLevel {
  data: NotificationDatum;
  message: string;
}
