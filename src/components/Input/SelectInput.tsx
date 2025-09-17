import { Select } from "antd";
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
  mode?: "multiple" | "tags" | undefined;
  tokenSeparators?: string[];
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
  mode = undefined,
  tokenSeparators,
}: IProps) => {
  // console.log('🚀 ~ SelectInput ~ value:', value)

  // Support both single and array values (for multiple/tags modes)
  const handleChange = (selectedValue: any): void => {
    onChange(selectedValue); // Pass the selected value directly
  };

  // Avoid re-invoking onChange when the controlled value prop updates to prevent loops

  return (
    <div
      className={twMerge(
        "w-full rounded-[8px] border border-[#dfdcdc] p-[1px] text-sm hover:border-primary-40 focus:outline-none focus:ring-1 focus:ring-darkColor",
        className
      )}
    >
      <Select
        showSearch
        mode={mode}
        allowClear
        variant="borderless"
        value={value}
        size="large"
        placeholder={placeholder}
        className="w-full rounded-[8px] !placeholder:text-sm !placeholder:font-light text-sm"
        disabled={disabled}
        onChange={handleChange}
        options={data}
        notFoundContent={notFoundContent}
        onSearch={handleSearchSelect}
        // Allow splitting tags by common separators when in tags mode
        tokenSeparators={mode === "tags" ? tokenSeparators ?? [","] : undefined}
        optionLabelProp="label"
        optionFilterProp="label"
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
