import { generate, green, presetPalettes, red } from "@ant-design/colors";
import type { ColorPickerProps, GetProp } from "antd";
import { ColorPicker, theme } from "antd";
import { twMerge } from "tailwind-merge";

type Presets = Required<ColorPickerProps>["presets"][number];
type Color = Extract<
  GetProp<ColorPickerProps, "value">,
  string | { cleared: any }
>;
type Format = GetProp<ColorPickerProps, "format">;
const genPresets = (presets = presetPalettes) =>
  Object.entries(presets).map<Presets>(([label, colors]) => ({
    label,
    colors,
  }));

interface IProps {
  onChange: (color: Color) => void;
  colorPicker: Color;
  className?: string;
  labelClassName?: string;
  title?: string;
  errorMessage?: any;
}

const ColorPickerInput = ({
  colorPicker,
  onChange,
  className,
  labelClassName,
  title,
  errorMessage,
}: IProps) => {
  const { token } = theme.useToken();
  const presets = genPresets({
    primary: generate(token.colorPrimary),
    red,
    green,
  });
  return (
    <>
      {!title || title === "" ? null : (
        <div className={`pb-1`}>
          <label
            className={twMerge(
              "text-sm capitalize text-[#2C3137]",
              labelClassName
            )}
          >
            {title}
          </label>
        </div>
      )}
      <ColorPicker
        value={colorPicker}
        onChange={onChange}
        className={twMerge(
          "w-full  rounded-[8px] border border-gray-300 px-[10px] py-[9.5px] font-medium placeholder:text-sm hover:border-primary-40 focus:outline-none focus:ring-1 focus:ring-primary-40",
          className
        )}
        showText={(color) => (
          <span className="text-sm">({color.toHexString()})</span>
        )}
      />
      <p className="flex flex-col gap-1 text-xs italic text-red-600">
        {errorMessage}
      </p>
    </>
  );
};

export default ColorPickerInput;
