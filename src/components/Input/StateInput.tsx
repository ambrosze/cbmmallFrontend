import { useGetAllStatesQuery } from "@/services/global";
import { useEffect, useState } from "react";
import SelectInput from "./SelectInput";

interface IProps {
  backgroundColor?: string;
  onChange: (value: any) => void;
  value: any;
  countryId: number;
  placeholder?: string;
  setTransformBoolean?: boolean;
}
const StateInput = ({
  backgroundColor,
  onChange,
  value,
  countryId,
  placeholder,
  setTransformBoolean = true,
}: IProps) => {
  const [search, setSearch] = useState("");
  const { data, isLoading, isFetching, refetch } = useGetAllStatesQuery({
    paginate: false,
    sort: "name",
    filter: { country_id: countryId },
  });
  useEffect(() => {
    if (countryId) {
      refetch();
    }
  }, [countryId]);
  const transformData = data?.data.map((item: any) => {
    return setTransformBoolean
      ? {
          value: item.id,
          label: item.name,
        }
      : {
          value: item.name,
          label: item.name,
        };
  });
  const handleSearchSelect = (input: string) => {
    setSearch(input);
  };
  return (
    <SelectInput
      data={transformData}
      value={value}
      onChange={onChange}
      placeholder={
        isLoading || isFetching ? (
          <span className="text-sm font-[500] text-gray-400 italic">
            Loading..
          </span>
        ) : (
          placeholder ?? (
            <span className="text-sm font-[500] text-gray-400">
              {placeholder}
            </span>
          )
        )
      }
      disabled={false}
      notFoundContent={"State not found"}
      setSearchSelect={setSearch}
      backgroundColor={backgroundColor}
    />
  );
};

export default StateInput;
