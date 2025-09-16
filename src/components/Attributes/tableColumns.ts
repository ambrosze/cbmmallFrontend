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
export const columnsTable: TableColumnsType<any> = [
  {
    title: "Colours",
    dataIndex: "colour",
    width: 200,
    sorter: {
      compare: (a, b) => a.colour.localeCompare(b.colour),
      multiple: 3,
    },
  },
  
  {
    title: "Colour Code",
    dataIndex: "colour_code",
    width: 200,
    sorter: {
      compare: (a, b) => a.colour_code.localeCompare(b.colour_code),
      multiple: 3,
    },
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
    width: 140,
  },
];
