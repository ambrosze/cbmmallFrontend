import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/router";
import CustomButton from "../sharedUI/Buttons/Button";

interface IProps {
  headerText: string;
  btnText: string;
  showAddButton?: boolean;
  onClick: () => void;
}
const AttributeHeader = ({
  btnText,
  headerText,
  onClick,
  showAddButton = true,
}: IProps) => {
  const router = useRouter();

  return (
    <div className="flex pt-[105px] lg:pl-[300px] bg-white items-center border-b justify-between gap-4 lg:pr-[34px] px-5 pb-5">
      <h3 className="font-semibold text-lg">{headerText}</h3>
      <div className="flex justify-center items-center gap-3">
        <div className="">
          {showAddButton && (
            <CustomButton
              onClick={onClick}
              type="button"
              className="border bg-primary-40 px-5 flex justify-center items-center gap-2 text-white"
            >
              <Icon icon="line-md:plus" width="20" height="20" />
              {btnText}
            </CustomButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttributeHeader;
