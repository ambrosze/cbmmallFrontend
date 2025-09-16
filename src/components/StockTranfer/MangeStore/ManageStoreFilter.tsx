import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/router";
import { useState } from "react";
import CustomButton from "../../sharedUI/Buttons/Button";
import PrimaryFilter from "../../sharedUI/PrimaryFilter";

interface IProps {
  selectedFilterTypes: any;
  setSelectedFilterTypes: any;
}
const MangeStoreFilter = ({
  selectedFilterTypes,
  setSelectedFilterTypes,
}: IProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex pt-[105px] lg:pl-[300px] bg-white items-center justify-between gap-4 lg:pr-[34px] pb-5">
      <h3 className="font-semibold text-lg">Stock Transfer</h3>
      <div className="flex justify-center items-center gap-3">
        <div className="relative">
          <CustomButton
            onClick={() => setIsOpen(!isOpen)}
            className={`border border-gray-300 flex items-center gap-2 justify-center px-5 ${
              isOpen ? "border-2 border-primary-40 text-primary-40" : ""
            }`}
          >
            All Filter{" "}
            <Icon icon="mynaui:filter-solid" width="24" height="24" />
          </CustomButton>
          {isOpen && (
            <PrimaryFilter
              selectedFilterTypes={selectedFilterTypes}
              setSelectedFilterTypes={setSelectedFilterTypes as any}
              headerText="Colour"
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          )}
        </div>
        <div className="">
          <CustomButton
            onClick={() => {
              router.push("/stock-transfer/add-new-stock-transfer");
            }}
            type="button"
            className="border bg-primary-40 px-5 flex justify-center items-center gap-2 text-white"
          >
            <Icon icon="line-md:plus" width="20" height="20" />
            New Stock Transfer
          </CustomButton>
        </div>
        <div>
          {" "}
          <CustomButton
            onClick={() => {}}
            type="button"
            className="border border-black"
          >
            Transfer Request
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default MangeStoreFilter;
