import {Select} from 'antd'

interface IProps {
  mode: 'multiple' | 'tags'
  onChange: (value: any) => void
  options: any[]
  defaultValue?: string[] | number[] | undefined
  placeholder: string
  children?: React.ReactNode
  optionLabelProps: string
  filterOption: any
  optionFilterProp: string
  backgroundColor?: string
  setSearchSelect?: any
  handleSearchSelect?: any
}
const MultipleSelect = ({
  mode,
  onChange,
  options,
  defaultValue,
  placeholder,
  children,
  optionLabelProps,
  filterOption,
  backgroundColor,
  handleSearchSelect,
  optionFilterProp
}: IProps) => {
  return (
    <div
      style={{
        backgroundColor:
          backgroundColor === null || backgroundColor === undefined || backgroundColor === '' ? '' : backgroundColor
      }}
      className="rounded-[8px] border py-[3px] hover:border-school focus:outline-none focus:ring-1 focus:ring-school"
    >
      <Select
        mode={mode}
        listHeight={200}
        variant="borderless"
        showSearch
        defaultValue={defaultValue}
        value={defaultValue}
        allowClear
        optionFilterProp={optionFilterProp}
        optionLabelProp={optionLabelProps}
        size="large"
        style={{
          width: '100%'
        }}
        className=""
        onSearch={handleSearchSelect} //function to search/filter from API
        labelRender={option => <span className="text-base">{option.label}</span>}
        filterOption={handleSearchSelect ? false : filterOption}
        placeholder={placeholder}
        onChange={onChange}
        options={options}
      >
        {children}
      </Select>
    </div>
  )
}

export default MultipleSelect
