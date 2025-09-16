import { useGetAllCountriesQuery } from "@/services/global";
import { useState } from "react";
import SelectInput from "./SelectInput";

interface IProps {
  backgroundColor?: string;
  onChange: (value: any) => void;
  value?: any;
  placeholder?: string;
  key?: string;
  setTransformBoolean?: boolean;
}
const CountryInput = ({
  backgroundColor,
  onChange,
  value,
  placeholder,
  key,
  setTransformBoolean = true,
}: IProps) => {
  const [search, setSearch] = useState("");
  const { data, isLoading, isFetching } = useGetAllCountriesQuery({
    paginate: false,
  });

  // console.log('🚀 ~ CountryInput ~ data:', data)
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
      key={key}
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
            <span className="text-sm font-[500] text-gray-400">Country</span>
          )
        )
      }
      disabled={false}
      notFoundContent={"Country not found"}
      setSearchSelect={setSearch}
      backgroundColor={backgroundColor}
    />
  );
};

export default CountryInput;
