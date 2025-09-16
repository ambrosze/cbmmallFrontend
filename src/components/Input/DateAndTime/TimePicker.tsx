import { TimePicker } from 'antd'

interface IProps {
  value: any
  errorMessage: string
  name: string
  placeholder: string
  className: string
  onChange: any
  allowClear: boolean
  size: 'large' | 'middle' | 'small'
  format?: string
}
const TimePickerComponent = ({
  value,
  errorMessage,
  name,
  placeholder,
  className,
  onChange,
  allowClear,
  size = 'large',
  format = 'HH:mm'
}: IProps) => {
  return (
    <div>
      <TimePicker
        size={size}
        allowClear={allowClear}
        value={value}
        onChange={onChange}
        format={format}
        name={name}
        // add am or pm
        use12Hours
        placeholder={placeholder}
        className={className}
      />
      {errorMessage && <p className="flex flex-col gap-1 text-xs italic text-error-50">{errorMessage}</p>}
    </div>
  )
}

export default TimePickerComponent
