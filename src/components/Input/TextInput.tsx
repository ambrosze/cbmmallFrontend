import React, { forwardRef, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import Spinner from "../sharedUI/Spinner";

interface IProps {
  placeholder: string;
  onChange: (e: any) => void;
  errorMessage?: any;
  value?: string | number;
  handleBlur?: any;
  name: string;
  type: string;
  title?: string | React.ReactNode;
  readOnly?: boolean;
  className?: string;
  id?: string;
  defaultValue?: string;
  maxLength?: number;
  onFocus?: () => void;
  onInput?: (e: any) => void;
  labelClassName?: string;
  required?: boolean;
  helperText?: string;
  multiple?: boolean;
  accept?: string;
  max?: number;
  style?: React.CSSProperties;
  isLoading?: boolean;
  autoFocus?: boolean;
  maintainFocus?: boolean; // if true, will attempt to keep focus / refocus after certain interactions
}
const TextInput = forwardRef<HTMLInputElement, IProps>(function TextInput(
  {
    placeholder,
    onChange,
    errorMessage,
    handleBlur,
    value,
    name,
    type,
    title,
    readOnly,
    className,
    onInput,
    id,
    defaultValue,
    maxLength,
    labelClassName,
    required,
    onFocus,
    helperText,
    multiple,
    accept,
    style,
    max,
    isLoading,
    autoFocus,
    maintainFocus,
  },
  ref
) {
  const innerRef = useRef<HTMLInputElement | null>(null);
  // choose forwarded ref if provided else internal
  useEffect(() => {
    const target = (
      ref && typeof ref !== "function" ? ref.current : innerRef.current
    ) as HTMLInputElement | null;
    if (autoFocus && target) {
      target.focus();
      target.select?.();
    }
  }, [autoFocus, ref]);

  // Maintain focus when prop set and element blurs (unless user focuses another input inside same document intentionally)
  useEffect(() => {
    if (!maintainFocus) return;
    const el = (
      ref && typeof ref !== "function" ? ref.current : innerRef.current
    ) as HTMLInputElement | null;
    if (!el) return;
    const handleBlur = (e: FocusEvent) => {
      // give time for other interactive elements (modals, dropdowns) to capture focus
      setTimeout(() => {
        if (
          !document.activeElement ||
          document.activeElement === document.body
        ) {
          el.focus();
          el.select?.();
        }
      }, 0);
    };
    el.addEventListener("blur", handleBlur as any);
    return () => el.removeEventListener("blur", handleBlur as any);
  }, [maintainFocus, ref]);

  return (
    <div className="relative">
      {!title || title === "" ? null : (
        <div className={`pb-1`}>
          <label
            htmlFor={id}
            className={twMerge(
              "text-sm capitalize text-[#2C3137]",
              labelClassName
            )}
          >
            {title}
          </label>
        </div>
      )}
      <input
        style={style}
        multiple={multiple}
        max={max}
        className={twMerge(
          "w-full rounded-[8px] border border-gray-300 px-[10px] py-[9.5px] font-medium placeholder:text-sm hover:border-primary-40 focus:outline-none focus:ring-1 focus:ring-primary-40 text-base lg:text-sm",
          className
        )}
        accept={accept}
        onInput={onInput}
        id={id}
        defaultValue={defaultValue}
        readOnly={readOnly}
        onFocus={onFocus}
        autoFocus={autoFocus}
        type={type}
        name={name}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={handleBlur}
        value={value}
        required={required}
        ref={(node) => {
          innerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref && typeof ref === "object") (ref as any).current = node;
        }}
      />
      {isLoading && (
        <div className="absolute top-10 right-2 z-50">
          <Spinner className="border-primary-40" />
        </div>
      )}
      <p className="flex flex-col gap-1 text-xs italic text-red-600">
        {errorMessage}
      </p>
      {helperText && (
        <p className="flex flex-col text-xs font-normal text-[#9B9B9B]">
          {helperText}
        </p>
      )}
    </div>
  );
});

export default TextInput;
