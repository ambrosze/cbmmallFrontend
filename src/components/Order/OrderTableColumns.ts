import { TableColumnsType } from "antd";

export const orderTableColumns: TableColumnsType<any> = [
  {
    title: "Reference",
    dataIndex: "reference",
    width: 150,
    className: "font-[500]",
    onHeaderCell: () => ({
      style: { backgroundColor: "black", color: "white" },
    }),
    render: (text, record, index) => text,
  },
  {
    title: "Date Initiated",
    dataIndex: "dateInitiated",
    width: 150,
    className: "font-[500]",
    onHeaderCell: () => ({
      style: { backgroundColor: "black", color: "white" },
    }),
    sorter: {
      compare: (a, b) =>
        new Date(a.dateInitiated).getTime() -
        new Date(b.dateInitiated).getTime(),
      multiple: 1,
    },
  },
  {
    title: "Full Name",
    dataIndex: "ordered_by",
    width: 200,
    className: "font-[500]",
    onHeaderCell: () => ({
      style: { backgroundColor: "black", color: "white" },
    }),
  },
  {
    title: "Status",
    dataIndex: "status",
    width: 250,
    className: "font-[500]",
    onHeaderCell: () => ({
      style: { backgroundColor: "black", color: "white" },
    }),
  },
  {
    title: "Email",
    dataIndex: "email",
    width: 200,
    className: "font-[500]",
    onHeaderCell: () => ({
      style: { backgroundColor: "black", color: "white" },
    }),
  },
  {
    title: "Phone Number",
    dataIndex: "phone_number",
    width: 150,
    className: "font-[500]",
    onHeaderCell: () => ({
      style: { backgroundColor: "black", color: "white" },
    }),
    // sorter: {
    //   compare: (a, b) => a.store_name.localeCompare(b.store_name),
    //   multiple: 1,
    // },
  },
  {
    title: "Total Price",
    dataIndex: "total_price",
    width: 150,
    className: "font-[500]",
    onHeaderCell: () => ({
      style: { backgroundColor: "black", color: "white" },
    }),
    // sorter: {
    //   compare: (a, b) => a.store_name.localeCompare(b.store_name),
    //   multiple: 1,
    // },
  },
  {
    title: "Delivery Address",
    dataIndex: "delivery_address",
    width: 250,
    className: "font-[500]",
    onHeaderCell: () => ({
      style: { backgroundColor: "black", color: "white" },
    }),
    // sorter: {
    //   compare: (a, b) => a.phone_number.localeCompare(b.phone_number),
    //   multiple: 1,
    // },
  },

  {
    title: "Action",
    fixed: "right",
    dataIndex: "action",
    width: 80,
    className: "font-[500]",
    onHeaderCell: () => ({
      style: { backgroundColor: "black", color: "white" },
    }),
    onCell: (record, index) => ({
      style: {
        backgroundColor:
          index !== undefined && index % 2 === 0 ? "#ffff" : "white",
      },
    }),
  },
];
