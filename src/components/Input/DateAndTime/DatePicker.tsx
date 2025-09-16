import { DatePicker } from 'antd'

interface IProps {
  value: any
  errorMessage: string
  name: string
  placeholder: string
  className: string
  onChange: any
  allowClear: boolean
  size: 'large' | 'middle' | 'small'
  disabled?: boolean
  defaultValue?: any
  disabledDate?: any
}

const DatePickerComponent = ({
  value,
  onChange,
  errorMessage,
  name,
  placeholder,
  className,
  allowClear,
  size = 'large',
  disabled,
  defaultValue,
  disabledDate
}: IProps) => {
  return (
    <div>
      <DatePicker
        name={name}
        defaultValue={defaultValue}
        allowClear={allowClear}
        value={value}
        onChange={onChange}
        size={size}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        disabledDate={disabledDate ? disabledDate : null}
      />
      {errorMessage && <div className="flex flex-col gap-1 text-xs italic text-error-50">{errorMessage}</div>}
    </div>
  )
}

export default DatePickerComponent
