import PhoneInput from "react-phone-input-2";
import { twMerge } from "tailwind-merge";

const euroCountries = [
  "at", // Austria
  "be", // Belgium
  "cy", // Cyprus
  "ee", // Estonia
  "fi", // Finland
  "fr", // France
  "de", // Germany
  "gr", // Greece
  "ie", // Ireland
  "it", // Italy
  "lv", // Latvia
  "lt", // Lithuania
  "lu", // Luxembourg
  "mt", // Malta
  "nl", // Netherlands
  "pt", // Portugal
  "sk", // Slovakia
  "si", // Slovenia
  "es", // Spain
];

interface IProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  className?: string;
  fontSize?: number;
  placeholder?: string;
  inputProps?: object;
  color?: string;
  title?: string | React.ReactNode;
  errorMessage?: string;
  labelClassName?: string;
  backgroundColor?: string;
  enableSearch?: boolean; // Add enableSearch property
  inputClass?: string;
}
const PhoneInputWithCountry = ({
  value,
  color,
  title,
  onChange,
  disabled,
  fontSize,
  placeholder,
  inputProps,
  errorMessage,
  labelClassName,
  className,
  backgroundColor,
  enableSearch = true, // Default to true
  inputClass,
}: IProps) => {
  return (
    <div className="w-full">
      {!title || title === "" ? null : (
        <div className={`pb-1`}>
          <label
            className={twMerge(
              "text-sm capitalize text-[#000] font-[500]",
              labelClassName
            )}
          >
            {title}
          </label>
        </div>
      )}

      <div
        className={twMerge(
          `rounded-md border ${
            errorMessage ? "border-red-600" : "border-gray-200"
          }`,
          className
        )}
      >
        <PhoneInput
          // onlyCountries={['ca', 'ng', 'us', ...euroCountries, 'au', 'gb']} // Restrict to Canada, Nigeria, and US
          inputProps={inputProps}
          country={"ng"}
          disabled={disabled}
          placeholder={placeholder}
          buttonClass="py-1.5 border-none"
          value={value}
          containerClass="border-none"
          dropdownClass="border-none"
          onChange={onChange}
          enableSearch={enableSearch} // Add enableSearch prop
          searchPlaceholder="Search countries" // Add a search placeholder
          inputClass={twMerge(
            "w-full  text-base outline-none b text-[#000000]  rounded-[8px]  px-[10px] border focus:outline-none focus:ring-1 focus:ring-primary-40",
            inputClass
          )}
          inputStyle={{
            paddingBlock: "22px",
            color: color,
            border: "none",
            backgroundColor: backgroundColor ? backgroundColor : "#F9FAFB",
            fontSize: fontSize,
            width: "100%",
          }}
          buttonStyle={{
            border: "none",
            backgroundColor: backgroundColor ? backgroundColor : "#F9FAFB",
          }}
          countryCodeEditable={true}
        />
      </div>
      <p className="flex flex-col gap-1 text-xs text-red-600">{errorMessage}</p>
    </div>
  );
};

export default PhoneInputWithCountry;
