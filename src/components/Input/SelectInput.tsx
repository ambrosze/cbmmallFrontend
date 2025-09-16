import { Select } from "antd";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

interface IProps {
  data: any;
  onChange: (value: any) => void;
  value?: any;
  disabled?: boolean;
  backgroundColor?: string;
  placeholder?: any;
  notFoundContent?: any;
  setSearchSelect?: any;
  handleSearchSelect?: any;
  className?: string;
}

const SelectInput = ({
  data,
  onChange,
  value,
  disabled,
  backgroundColor,
  placeholder,
  notFoundContent,
  handleSearchSelect,
  setSearchSelect,
  className,
}: IProps) => {
  // console.log('🚀 ~ SelectInput ~ value:', value)

  const handleChange = (selectedValue: string): void => {
    onChange(selectedValue); // Pass the selected value directly
  };

  useEffect(() => {
    if (value) {
      onChange(value);
    }
  }, [value]);

  return (
    <div
      style={{
        backgroundColor:
          backgroundColor === null ||
          backgroundColor === undefined ||
          backgroundColor === ""
            ? ""
            : backgroundColor,
      }}
      className={twMerge(
        "w-full rounded-[8px] border border-[#dfdcdc] p-[1px] text-sm hover:border-primary-40 focus:outline-none focus:ring-1 focus:ring-darkColor",
        className
      )}
    >
      <Select
        showSearch
        allowClear
        variant="borderless"
        value={value}
        size="large"
        placeholder={placeholder}
        labelRender={(option) => (
          <span className="text-base">{option.label}</span>
        )}
        style={{ width: "100%", borderRadius: "8px" }}
        className="!placeholder:text-sm !placeholder:font-light text-sm"
        disabled={disabled}
        onChange={handleChange}
        options={data}
        notFoundContent={notFoundContent}
        onSearch={handleSearchSelect}
        filterOption={
          handleSearchSelect
            ? false
            : (input, option) => {
                const label = option?.label;
                return (
                  typeof label === "string" &&
                  label.toLowerCase().includes(input.toLowerCase())
                );
              }
        }
      />
    </div>
  );
};

export default SelectInput;
