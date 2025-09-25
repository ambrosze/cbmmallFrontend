import { TableColumnsType } from "antd";

export const columnsTable: TableColumnsType<any> = [
  {
    title: "Names",
    dataIndex: "name",
    width: 250,
    sorter: {
      compare: (a, b) => a.name.localeCompare(b.name),
      multiple: 3,
    },
  },

  {
    title: "Type",
    dataIndex: "type",
    width: 200,
    sorter: {
      compare: (a, b) => a.type.localeCompare(b.type),
      multiple: 3,
    },
  },
  {
    title: "Values Count",
    dataIndex: "values_count",
    width: 200,
    sorter: {
      compare: (a, b) => a.values_count - b.values_count,
      multiple: 3,
    },
    render: (text) => text || 0,
  },

  {
    title: "Date Initiated",
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
    width: 50,
  },
];
