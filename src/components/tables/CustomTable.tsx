import { Table, TableColumnsType } from "antd";

interface IProps {
  transformedData: any;
  columns: TableColumnsType;
  isLoading: boolean;
  rowClassName?: (record: any, index: number) => string;
  expandable?: any;
  rowKey?: string;
}

const CustomTable = ({
  transformedData,
  isLoading,
  columns,
  rowClassName,
  expandable,
  rowKey = "key",
}: IProps) => {
  return (
    <Table<any>
      rowKey={rowKey}
      columns={columns}
      dataSource={transformedData as any}
      onChange={() => {}}
      loading={isLoading}
      pagination={false}
      className="overflow-x-auto "
      rowClassName={rowClassName}
      expandable={expandable}
      scroll={{ x: "max-content" }}
    />
  );
};

export default CustomTable;
