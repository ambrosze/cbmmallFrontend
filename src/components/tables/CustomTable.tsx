import { Table, TableColumnsType } from "antd";

interface IProps {
  transformedData: any;
  columns: TableColumnsType;
  isLoading: boolean;
}

const CustomTable = ({ transformedData, isLoading, columns }: IProps) => {
  return (
    <Table<any>
      columns={columns}
      dataSource={transformedData as any}
      onChange={() => {}}
      loading={isLoading}
      pagination={false}
      className="overflow-x-auto "
      scroll={{ x: "max-content" }}
    />
  );
};

export default CustomTable;
