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
export const stockTransferColumns: TableColumnsType<any> = [
  {
    title: "ID Number",
    dataIndex: "id",
    width: 200,
    sorter: {
      compare: (a, b) => a.id.localeCompare(b.id),
      multiple: 3,
    },
  },
  {
    title: "Transfer from",
    dataIndex: "transfer_from",
    width: 200,
    sorter: {
      compare: (a, b) => a.transfer_from.localeCompare(b.transfer_from),
      multiple: 3,
    },
  },
  {
    title: "Destination store",
    dataIndex: "destination_store",
    width: 150,
    sorter: {
      compare: (a, b) => a.destination_store.localeCompare(b.destination_store),
      multiple: 1,
    },
  },

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
  {
    title: "Status",
    dataIndex: "statue",
    width: 200,
    sorter: {
      compare: (a, b) => a.statue.localeCompare(b.statue),
      multiple: 3,
    },
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    width: 200,
    sorter: {
      compare: (a, b) => a.quantity.localeCompare(b.quantity),
      multiple: 3,
    },
  },

  {
    title: "Action",
    fixed: "right",
    dataIndex: "action",
    width: 140,
  },
];
