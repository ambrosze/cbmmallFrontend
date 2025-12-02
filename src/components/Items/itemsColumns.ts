import { TableColumnsType } from "antd";

interface DataType {
  key: React.Key;
  activity: string;
  colour: string;
  account: string;
  description: string;
  dateInitiated: string;
  status: string;
}
export const itemsColumns: TableColumnsType<any> = [
  {
    title: "Items",
    dataIndex: "item",
    width: 250,
    // sorter: {
    //   compare: (a, b) => a.item.localeCompare(b.item),
    //   multiple: 3,
    // },
  },
  {
    title: "Category",
    dataIndex: "category",
    width: 200,
    // sorter: {
    //   compare: (a, b) => a.category.localeCompare(b.category),
    //   multiple: 3,
    // },
  },
  {
    title: "Type",
    dataIndex: "type",
    width: 150,
    // sorter: {
    //   compare: (a, b) => a.type.localeCompare(b.type),
    //   multiple: 1,
    // },
  },
  {
    title: "Color",
    dataIndex: "color",
    width: 200,
  },
  {
    title: "Barcode",
    dataIndex: "barcode",
    width: 200,
  },
  {
    title: "Weight",
    dataIndex: "weight",
    width: 200,
  },
  {
    title: "Price",
    dataIndex: "price",
    width: 200,
  },

  {
    title: "Store Name",
    dataIndex: "store_name",
    width: 200,
    // sorter: {
    //   compare: (a, b) => a.location.localeCompare(b.location),
    //   multiple: 3,
    // },
  },
  {
    title: "Store Location",
    dataIndex: "store_location",
    width: 200,
    // sorter: {
    //   compare: (a, b) => a.location.localeCompare(b.location),
    //   multiple: 3,
    // },
  },

  {
    title: "Quantity",
    dataIndex: "quantity",
    width: 100,
    // sorter: {
    //   compare: (a, b) => a.quantity.localeCompare(b.quantity),
    //   multiple: 3,
    // },
  },
  {
    title: "Initiated Date",
    dataIndex: "dateInitiated",
    width: 200,
    sorter: {
      compare: (a, b) =>
        new Date(a.dateInitiated).getTime() -
        new Date(b.dateInitiated).getTime(),
      multiple: 1,
    },
  },
];
export const itemsAdminColumns: TableColumnsType<any> = [
  {
    title: "Items",
    dataIndex: "item",
    width: 250,
    // sorter: {
    //   compare: (a, b) => a.item.localeCompare(b.item),
    //   multiple: 3,
    // },
  },
  {
    title: "Category",
    dataIndex: "category",
    width: 200,
    // sorter: {
    //   compare: (a, b) => a.category.localeCompare(b.category),
    //   multiple: 3,
    // },
  },
  {
    title: "Type",
    dataIndex: "type",
    width: 150,
    // sorter: {
    //   compare: (a, b) => a.type.localeCompare(b.type),
    //   multiple: 1,
    // },
  },
  {
    title: "Color",
    dataIndex: "color",
    width: 200,
  },
  {
    title: "Barcode",
    dataIndex: "barcode",
    width: 200,
  },
  {
    title: "Weight",
    dataIndex: "weight",
    width: 200,
  },
  // {
  //   title: "Price",
  //   dataIndex: "price",
  //   width: 200,
  // },

  {
    title: "Quantity",
    dataIndex: "quantity",
    width: 100,
    // sorter: {
    //   compare: (a, b) => a.quantity.localeCompare(b.quantity),
    //   multiple: 3,
    // },
  },
  {
    title: "Initiated Date",
    dataIndex: "dateInitiated",
    width: 200,
    sorter: {
      compare: (a, b) =>
        new Date(a.dateInitiated).getTime() -
        new Date(b.dateInitiated).getTime(),
      multiple: 1,
    },
  },

  {
    title: "Action",
    fixed: "right",
    dataIndex: "action",
    width: 140,
  },
];
export const staffsColumns: TableColumnsType<any> = [
  {
    title: "Name",
    dataIndex: "name",
    width: 200,
    // sorter: {
    //   compare: (a, b) => a.name.localeCompare(b.name),
    //   multiple: 3,
    // },
  },
  {
    title: "Email",
    dataIndex: "email",
    width: 200,
    // sorter: {
    //   compare: (a, b) => a.email.localeCompare(b.email),
    //   multiple: 3,
    // },
  },
  {
    title: "Phone number",
    dataIndex: "phone_number",
    width: 150,
    // sorter: {
    //   compare: (a, b) => a.phone_number.localeCompare(b.phone_number),
    //   multiple: 1,
    // },
  },
  {
    title: "Staff No",
    dataIndex: "staff_no",
    width: 150,
    // sorter: {
    //   compare: (a, b) => a.staff_no.localeCompare(b.staff_no),
    //   multiple: 1,
    // },
  },
  {
    title: "Store Name",
    dataIndex: "store_name",
    width: 200,
    // sorter: {
    //   compare: (a, b) => a.store_name.localeCompare(b.store_name),
    //   multiple: 1,
    // },
  },

  {
    title: "Initiated Date",
    dataIndex: "dateInitiated",
    width: 200,
    sorter: {
      compare: (a, b) =>
        new Date(a.dateInitiated).getTime() -
        new Date(b.dateInitiated).getTime(),
      multiple: 1,
    },
  },

  {
    title: "Action",
    fixed: "right",
    dataIndex: "action",
    width: 140,
  },
];
export const storesColumns: TableColumnsType<any> = [
  {
    title: "Name",
    dataIndex: "name",
    width: 200,
    // sorter: {
    //   compare: (a, b) => a.name.localeCompare(b.name),
    //   multiple: 3,
    // },
  },
  {
    title: "Email",
    dataIndex: "email",
    width: 200,
    // sorter: {
    //   compare: (a, b) => a.email.localeCompare(b.email),
    //   multiple: 3,
    // },
  },
  {
    title: "Phone Number",
    dataIndex: "phone_number",
    width: 200,
    // sorter: {
    //   compare: (a, b) => a.name.localeCompare(b.name),
    //   multiple: 3,
    // },
  },
  {
    title: "Country",
    dataIndex: "country",
    width: 200,
    // sorter: {
    //   compare: (a, b) => a.name.localeCompare(b.name),
    //   multiple: 3,
    // },
  },
  {
    title: "City",
    dataIndex: "city",
    width: 200,
    // sorter: {
    //   compare: (a, b) => a.name.localeCompare(b.name),
    //   multiple: 3,
    // },
  },
  {
    title: "Address",
    dataIndex: "address",
    width: 350,
    // sorter: {
    //   compare: (a, b) => a.email.localeCompare(b.email),
    //   multiple: 3,
    // },
  },

  {
    title: "Is Warehouse",
    dataIndex: "is_warehouse",
    width: 150,
    // sorter: {
    //   compare: (a, b) => a.is_warehouse.localeCompare(b.is_warehouse),
    //   multiple: 1,
    // },
  },

  {
    title: "Initiated Date",
    dataIndex: "dateInitiated",
    width: 200,
    sorter: {
      compare: (a, b) =>
        new Date(a.dateInitiated).getTime() -
        new Date(b.dateInitiated).getTime(),
      multiple: 1,
    },
  },

  {
    title: "Action",
    fixed: "right",
    dataIndex: "action",
    width: 140,
  },
];
export const customerColumns: TableColumnsType<any> = [
  {
    title: "Name",
    dataIndex: "name",
    width: 200,
    // sorter: {
    //   compare: (a, b) => a.name.localeCompare(b.name),
    //   multiple: 3,
    // },
  },
  {
    title: "Email",
    dataIndex: "email",
    width: 200,
    // sorter: {
    //   compare: (a, b) => a.email.localeCompare(b.email),
    //   multiple: 3,
    // },
  },
  {
    title: "Phone Number",
    dataIndex: "phone_number",
    width: 200,
    // sorter: {
    //   compare: (a, b) => a.name.localeCompare(b.name),
    //   multiple: 3,
    // },
  },
  {
    title: "Country",
    dataIndex: "country",
    width: 200,
    // sorter: {
    //   compare: (a, b) => a.name.localeCompare(b.name),
    //   multiple: 3,
    // },
  },
  {
    title: "City",
    dataIndex: "city",
    width: 200,
    // sorter: {
    //   compare: (a, b) => a.name.localeCompare(b.name),
    //   multiple: 3,
    // },
  },
  {
    title: "Address",
    dataIndex: "address",
    width: 350,
    // sorter: {
    //   compare: (a, b) => a.email.localeCompare(b.email),
    //   multiple: 3,
    // },
  },
  {
    title: "Initiated Date",
    dataIndex: "dateInitiated",
    width: 200,
    sorter: {
      compare: (a, b) =>
        new Date(a.dateInitiated).getTime() -
        new Date(b.dateInitiated).getTime(),
      multiple: 1,
    },
  },

  {
    title: "Action",
    fixed: "right",
    dataIndex: "action",
    width: 80,
  },
];
export const rolesColumns: TableColumnsType<any> = [
  {
    title: "Name",
    dataIndex: "name",
    width: 220,
    // sorter: {
    //   compare: (a, b) => a.name.localeCompare(b.name),
    //   multiple: 3,
    // },
  },
  {
    title: "Guardian name",
    dataIndex: "guard_name",
    width: 300,
    // sorter: {
    //   compare: (a, b) => a.email.localeCompare(b.email),
    //   multiple: 3,
    // },
  },
  {
    title: "Permission Count",
    dataIndex: "permission_count",
    width: 250,
    // sorter: {
    //   compare: (a, b) => a.email.localeCompare(b.email),
    //   multiple: 3,
    // },
  },

  {
    title: "Initiated Date",
    dataIndex: "dateInitiated",
    width: 200,
    sorter: {
      compare: (a, b) =>
        new Date(a.dateInitiated).getTime() -
        new Date(b.dateInitiated).getTime(),
      multiple: 1,
    },
  },

  {
    title: "Action",
    fixed: "right",
    dataIndex: "action",
    width: 80,
  },
];
export const dailyGoldPriceColumns: TableColumnsType<any> = [
  {
    title: "Category",
    dataIndex: "category_name",
    width: 200,
    // sorter: {
    //   compare: (a, b) => a.name.localeCompare(b.name),
    //   multiple: 3,
    // },
  },
  {
    title: "Price per gram",
    dataIndex: "price_per_gram",
    width: 350,
    // sorter: {
    //   compare: (a, b) => a.email.localeCompare(b.email),
    //   multiple: 3,
    // },
  },

  {
    title: "Recorded on",
    dataIndex: "recorded_on",
    width: 200,
    sorter: {
      compare: (a, b) =>
        new Date(a.recorded_on).getTime() - new Date(b.recorded_on).getTime(),
      multiple: 1,
    },
  },
  {
    title: "Created at",
    dataIndex: "dateInitiated",
    width: 200,
    sorter: {
      compare: (a, b) =>
        new Date(a.dateInitiated).getTime() -
        new Date(b.dateInitiated).getTime(),
      multiple: 1,
    },
  },

  {
    title: "Action",
    fixed: "right",
    dataIndex: "action",
    width: 140,
  },
];
export const adminDiscountColumns: TableColumnsType<any> = [
  {
    title: "Code",
    dataIndex: "code",
    width: 200,
    // sorter: {
    //   compare: (a, b) => a.name.localeCompare(b.name),
    //   multiple: 3,
    // },
  },
  {
    title: "Description",
    dataIndex: "description",
    width: 350,
    // sorter: {
    //   compare: (a, b) => a.email.localeCompare(b.email),
    //   multiple: 3,
    // },
  },
  {
    title: "Percentage",
    dataIndex: "percentage",
    width: 200,
    // sorter: {
    //   compare: (a, b) => a.discount.localeCompare(b.discount),
    //   multiple: 1,
    // },
  },

  {
    title: "Expiry date",
    dataIndex: "expiry_date",
    width: 200,
    sorter: {
      compare: (a, b) =>
        new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime(),
      multiple: 1,
    },
  },
  {
    title: "Status",
    dataIndex: "is_active",
    width: 200,
    // sorter: {
    //   compare: (a, b) => a.status.localeCompare(b.status),
    //   multiple: 1,
    // },
  },
  {
    title: "Created at",
    dataIndex: "dateInitiated",
    width: 200,
    sorter: {
      compare: (a, b) =>
        new Date(a.dateInitiated).getTime() -
        new Date(b.dateInitiated).getTime(),
      multiple: 1,
    },
  },

  {
    title: "Action",
    fixed: "right",
    dataIndex: "action",
    width: 140,
  },
];

export const invoiceColumns = [
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    width: 150,
  },
  {
    title: "Invoice No",
    dataIndex: "invoice_no",
    key: "invoice_no",
    width: 150,
  },
  {
    title: "Customer name",
    dataIndex: "customer_name",
    key: "customer_name",
    width: 150,
  },
  {
    title: "Customer email",
    dataIndex: "customer_email",
    key: "customer_email",
    width: 150,
  },
  {
    title: "Due",
    dataIndex: "Due",
    key: "Due",
    width: 150,
  },
  {
    title: "Date Initiated",
    dataIndex: "dateInitiated",
    key: "dateInitiated",
    width: 150,
  },

  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    width: 150,
  },
];

export const salesColumns: TableColumnsType<any> = [
  { title: "Invoice #", dataIndex: "invoice_number", width: 160 },
  {
    title: "Customer",
    dataIndex: "customer_name",
    width: 200,
  },
  { title: "Items", dataIndex: "items_count", width: 100 },
  { title: "Payment", dataIndex: "payment_method", width: 140 },
  { title: "Channel", dataIndex: "channel", width: 120 },
  { title: "Subtotal", dataIndex: "subtotal_price", width: 150 },
  { title: "Discount %", dataIndex: "discount_percentage", width: 130 },
  { title: "Total", dataIndex: "total_price", width: 150 },
  { title: "Cashier", dataIndex: "cashier_name", width: 180 },
  {
    title: "Date",
    dataIndex: "dateInitiated",
    width: 180,
    sorter: {
      compare: (a, b) =>
        new Date(a.dateInitiated).getTime() -
        new Date(b.dateInitiated).getTime(),
      multiple: 1,
    },
  },
  { title: "Action", fixed: "right", dataIndex: "action", width: 80 },
];

export const salesInventoriesColumns: TableColumnsType<any> = [
  { title: "Customer Name", dataIndex: "customer_name", width: 200 },
  { title: "Payment Method", dataIndex: "payment_method", width: 200 },
  { title: "Item", dataIndex: "item_name", width: 250 },
  { title: "Unit Price", dataIndex: "unit_price", width: 150 },
  { title: "Quantity", dataIndex: "quantity", width: 100 },
  { title: "Line Total", dataIndex: "amount", width: 150 },
  {
    title: "Initiated Date",
    dataIndex: "dateInitiated",
    fixed: "right",
    width: 200,
    sorter: {
      compare: (a, b) =>
        new Date(a.dateInitiated).getTime() -
        new Date(b.dateInitiated).getTime(),
      multiple: 1,
    },
  },
];

export const stockTransferInventoriesColumns: TableColumnsType<any> = [
  { title: "Material", dataIndex: "material", width: 150 },
  { title: "Type", dataIndex: "type", width: 150 },
  { title: "Weight(g)", dataIndex: "weight", width: 100 },
  { title: "Quantity", dataIndex: "quantity", width: 100 },
  {
    title: "Transfer Date",
    dataIndex: "dateInitiated",
    width: 200,
    sorter: {
      compare: (a, b) =>
        new Date(a.dateInitiated).getTime() -
        new Date(b.dateInitiated).getTime(),
      multiple: 1,
    },
  },
  { title: "Action", fixed: "right", dataIndex: "action", width: 100 },
];
export const itemsScrapesColumns = [
  {
    title: "Item",
    dataIndex: "item",
    key: "item",
    width: 200,
  },
  {
    title: "Type",
    dataIndex: "scrape_type",
    key: "scrape_type",
    width: 100,
  },
  {
    title: "Customer",
    dataIndex: "customer_name",
    key: "customer_name",
    width: 150,
  },
  {
    title: "Store",
    dataIndex: "store_name",
    key: "store_name",
    width: 150,
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
    width: 100,
  },
  {
    title: "Comment",
    dataIndex: "comment",
    key: "comment",
    width: 200,
  },
  {
    title: "Date Initiated",
    dataIndex: "dateInitiated",
    key: "dateInitiated",
    width: 130,
  },
  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    width: 120,
    fixed: "right" as const,
  },
];

export const stockTransferColumns: TableColumnsType<any> = [
  {
    title: "Reference No",
    dataIndex: "reference_no",
    width: 200,
  },
  {
    title: "Driver Name",
    dataIndex: "driver_name",
    width: 200,
  },
  {
    title: "From Store",
    dataIndex: "from_store",
    width: 200,
  },
  {
    title: "To Store",
    dataIndex: "to_store",
    width: 200,
  },
  {
    title: "Status",
    dataIndex: "status",
    width: 120,
  },
  {
    title: "Inventories Count",
    dataIndex: "inventories_count",
    width: 150,
  },
  {
    title: "Initiated Date",
    dataIndex: "dateInitiated",
    width: 200,
    sorter: {
      compare: (a, b) =>
        new Date(a.dateInitiated).getTime() -
        new Date(b.dateInitiated).getTime(),
      multiple: 1,
    },
  },
  {
    title: "Action",
    fixed: "right",
    dataIndex: "action",
    width: 140,
  },
];
