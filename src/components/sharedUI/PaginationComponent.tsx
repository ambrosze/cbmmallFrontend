import type { PaginationProps } from "antd";
import { Pagination } from "antd";

interface PaginationResponse {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

interface IProps {
  paginationData: PaginationResponse;
  onPageChange: (page: number) => void;
}

const PaginationComponent = ({ paginationData, onPageChange }: IProps) => {
  const handleChange: PaginationProps["onChange"] = (page) => {
    onPageChange(page);
  };

  return (
    <Pagination
      defaultCurrent={1}
      className="mx-[auto] my-[0] flex w-fit flex-row items-center justify-center self-center rounded-md bg-white p-2 text-white"
      current={paginationData.current_page}
      showSizeChanger={false}
      onChange={handleChange}
      showLessItems={true}
      pageSize={paginationData.per_page}
      total={paginationData.total}
    />
  );
};

export default PaginationComponent;
