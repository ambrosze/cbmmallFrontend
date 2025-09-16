import { useId } from "react";
import { twMerge } from "tailwind-merge";

interface IProps {
  placeholder: string;
  onChange: (e: any) => void;
  errorMessage?: any;
  value?: string | number;
  handleBlur?: any;
  name: string;
  title?: string | React.ReactNode;
  readOnly?: boolean;
  className?: string;
  id?: string;
  defaultValue?: string;
  maxLength?: number;
  onFocus?: () => void;
  row: number;
  helperText?: string;
  required?: boolean | undefined;
}

const TextAreaInput = ({
  placeholder,
  onChange,
  errorMessage,
  handleBlur,
  value,
  name,
  title,
  readOnly,
  className,
  id,
  defaultValue,
  maxLength,
  row,
  onFocus,
  required,
  helperText,
}: IProps) => {
  const idState = useId();
  return (
    <div>
      {!title || title === "" ? null : (
        <div className="pb-1">
          <label htmlFor={id} className="font-semibold text-sm">
            {title}
          </label>
        </div>
      )}
      <textarea
        className={twMerge(
          '"w-full rounded-[8px] border border-gray-300 px-[10px] py-[9.5px] font-medium placeholder:text-sm hover:border-primary-40 focus:outline-none focus:ring-1 focus:ring-primary-40',
          className
        )}
        id={id}
        rows={row}
        required={required}
        defaultValue={defaultValue}
        readOnly={readOnly}
        onFocus={onFocus}
        name={name}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={handleBlur}
        style={{ resize: "none" }}
        value={value}
      />
      <p className="flex flex-col text-xs font-normal text-[#9B9B9B]">
        {helperText}
      </p>

      <p className="text-xs italic text-red-600">{errorMessage}</p>
    </div>
  );
};

export default TextAreaInput;
