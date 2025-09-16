// POS cart item structure based on provided API response
// Example item:
// {
//   id: "9fcda4c9-...",
//   name: "21k Saudi extra Chain Rose (Gold)",
//   price: 673876.4,
//   quantity: 1,
//   options: { image_url: null, itemable_id: "...", itemable_type: "App\\Models\\Inventory" },
//   total: 673876.4
// }
export interface PosCartItemOptions {
  image_url: string | null;
  itemable_id: string;
  itemable_type: string;
  [key: string]: any;
}

export interface PosCartItem {
  id: string;
  name: string;
  price: number; // unit price (could be 0 if dynamic)
  quantity: number;
  options: PosCartItemOptions;
  total: number; // price * quantity or server computed
}

export interface PosCartResponse {
  data: PosCartItem[];
  sub_total: number; // aggregated sum of totals
  status?: string;
  message?: string;
}

// For list query (getAllPosCart) we map to this top level for backward compatibility
export interface PosTopLevel extends PosCartResponse {}

export interface SinglePosTopLevel {
  data: PosCartItem; // when querying a single item (if supported)
  status?: string;
  message?: string;
}
