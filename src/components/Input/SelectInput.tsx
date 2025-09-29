import { LoadingOutlined } from "@ant-design/icons";
import { Icon } from "@iconify/react";
import { Select } from "antd";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";
import type { ReactElement } from "react";
import { twMerge } from "tailwind-merge";

interface IProps {
  data: any;
  onChange: (value: any) => void;
  value?: any;
  disabled?: boolean;
  loading?: boolean;
  backgroundColor?: string;
  placeholder?: any;
  notFoundContent?: any;
  setSearchSelect?: any;
  handleSearchSelect?: any;
  className?: string;
  mode?: "multiple" | "tags" | undefined;
  tokenSeparators?: string[];
  onDeselect?: (value: any) => void;
  tagRender?: (props: CustomTagProps) => ReactElement;
}

const SelectInput = ({
  data,
  onChange,
  value,
  disabled,
  loading,
  backgroundColor,
  placeholder,
  notFoundContent,
  handleSearchSelect,
  setSearchSelect,
  className,
  mode = undefined,
  tokenSeparators,
  onDeselect,
  tagRender,
}: IProps) => {
  // Default tag renderer that replaces the close "x" with a delete icon
  const defaultTagRender = (props: CustomTagProps): ReactElement => {
    const { label, value, closable, onClose } = props;
    const preventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };

    // In tags mode, use the value as the display text if label is not available
    const displayText = mode === "tags" ? label || value : label;

    return (
      <span
        className="ant-select-selection-item flex items-center gap-1"
        title={String(displayText)}
      >
        <span className="ant-select-selection-item-content text-sm font-semibold">
          {displayText}
        </span>
        {closable && (
          <span
            onMouseDown={preventMouseDown}
            className="ant-select-selection-item-remove cursor-pointer text-red-500 hover:opacity-70"
            onClick={onClose}
          >
            <Icon
              icon="mdi:trash-can-outline"
              width={14}
              height={14}
              className="text-red-500"
            />
          </span>
        )}
      </span>
    );
  };
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
        loading={loading}
        suffixIcon={loading ? <LoadingOutlined spin /> : undefined}
        variant="borderless"
        value={value}
        size="large"
        placeholder={placeholder}
        className="w-full rounded-[8px] !placeholder:text-sm !placeholder:font-light text-sm"
        disabled={disabled || loading}
        onChange={handleChange}
        onDeselect={onDeselect}
        options={data}
        notFoundContent={notFoundContent}
        onSearch={handleSearchSelect}
        tagRender={mode ? tagRender || defaultTagRender : undefined}
        // Allow splitting tags by common separators when in tags mode
        tokenSeparators={mode === "tags" ? tokenSeparators ?? [","] : undefined}
        optionLabelProp={mode === "tags" ? "value" : "label"}
        labelRender={
          mode === "tags"
            ? undefined
            : (option) =>
                (
                  <span className="text-sm font-[500]">{option.label}</span>
                ) as unknown as ReactElement
        }
        optionFilterProp={mode === "tags" ? "value" : "label"}
        filterOption={
          handleSearchSelect
            ? false
            : (input, option) => {
                const searchText =
                  mode === "tags" ? option?.value : option?.label;
                return (
                  typeof searchText === "string" &&
                  searchText.toLowerCase().includes(input.toLowerCase())
                );
              }
        }
      />
    </div>
  );
};

export default SelectInput;
