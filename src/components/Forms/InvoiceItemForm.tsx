import { useEffect, useRef, useState } from "react";
import SelectInput from "../Input/SelectInput";
import TextInput from "../Input/TextInput";
import CustomButton from "../sharedUI/Buttons/Button";
import Spinner from "../sharedUI/Spinner";

interface IProps {
  formErrors: any;
  error: any;
  formValues: any;
  handleInputChange: any;
  setFormValues: any;
  handleSubmit: any;
  isLoadingCreate: boolean;
  setIsOpenModal: any;
  btnText: string;
  transformedColoursData: any;
  transformedTypesData: any;
  transformedCategoryData: any;
  isEditing: boolean;
  selectedItem?: any; // Add this prop to receive the selected item
}
export const InvoiceItemForm = ({
  formErrors,
  error,
  formValues,
  btnText,
  handleInputChange,
  setFormValues,
  handleSubmit,
  isLoadingCreate,
  setIsOpenModal,
  transformedColoursData,
  transformedTypesData,
  transformedCategoryData,
  isEditing,
  selectedItem,
}: IProps) => {
  console.log("🚀 ~ selectedItem:", selectedItem?.image);
  const [fileList, setFileList] = useState<any>([]);
  const uploadRef = useRef(null);

  // Initialize fileList with the existing image when in edit mode
  useEffect(() => {
    if (isEditing && selectedItem?.image?.url) {
      setFileList([
        {
          uid: "-1",
          name: `existing-image.${selectedItem.image.extension}`,
          status: "done",
          url: selectedItem.image.url,
        },
      ]);
    }
  }, [isEditing, selectedItem]);

  const triggerUpload = () => {
    const uploadControl = document.querySelector(
      '.hidden-upload .ant-upload input[type="file"]'
    );
    if (uploadControl) {
      (uploadControl as HTMLElement).click();
    }
  };

  // const handleSearchSelect = (input: string) => {
  //   setSearch(input);
  //   refetchStaff();
  // };
  return (
    <div>
      <form className="mt-5 flex flex-col gap-3 w-full">
        <div className="flex w-full gap-5">
          <div className="w-full">
            <TextInput
              type="text"
              name="customer"
              errorMessage={
                formErrors.customer ||
                (error as any)?.data?.errors?.customer?.map(
                  (err: any) => err
                ) ||
                ""
              }
              className="py-[13px]"
              value={formValues.customer}
              onChange={handleInputChange}
              placeholder="Enter customer"
              title={<span className="font-[500]">Customer</span>}
              required={false}
            />
          </div>
          <div className="w-full">
            <TextInput
              type="text"
              name="currency"
              errorMessage={
                formErrors.currency ||
                (error as any)?.data?.errors?.currency?.map(
                  (err: any) => err
                ) ||
                ""
              }
              className="py-[13px]"
              value={formValues.currency}
              onChange={handleInputChange}
              placeholder="Enter currency"
              title={<span className="font-[500]">Currency</span>}
              required={false}
            />
          </div>
        </div>
        <div className="flex w-full gap-5">
          <div className="w-full">
            <div className={`pb-1`}>
              <label className={"text-sm font-bold capitalize text-[#2C3137]"}>
                Colour
              </label>
            </div>
            <SelectInput
              onChange={(value) => {
                setFormValues({ ...formValues, colour_id: value });
              }}
              value={formValues.colour_id || undefined}
              placeholder={
                <span className="text-sm font-bold">Select colour</span>
              }
              data={transformedColoursData}
            />
            {formErrors.colour_id || error ? (
              <p className="flex flex-col gap-1 text-xs italic text-red-600">
                {formErrors.colour_id ||
                  (error as any)?.data?.errors?.colour_id?.map(
                    (err: any) => err
                  ) ||
                  ""}
              </p>
            ) : null}
          </div>
          <div className="w-full">
            <div className={`pb-1`}>
              <label className={"text-sm font-bold capitalize text-[#2C3137]"}>
                Type
              </label>
            </div>
            <SelectInput
              onChange={(value) => {
                setFormValues({ ...formValues, type_id: value });
              }}
              value={formValues.type_id || undefined}
              placeholder={
                <span className="text-sm font-bold">Select staff store</span>
              }
              data={transformedTypesData}
            />
            {formErrors.type_id || error ? (
              <p className="flex flex-col gap-1 text-xs italic text-red-600">
                {formErrors.type_id ||
                  (error as any)?.data?.errors?.type_id?.map(
                    (err: any) => err
                  ) ||
                  ""}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex lg:flex-row flex-col gap-5 w-full">
          <div className="w-full">
            <TextInput
              type="text"
              name="weight"
              errorMessage={
                formErrors.weight ||
                (error as any)?.data?.errors?.weight?.map((err: any) => err) ||
                ""
              }
              className="py-[13px]"
              value={formValues.weight}
              onChange={handleInputChange}
              placeholder="Enter weight"
              title={<span className="font-[500]">Weight</span>}
              required={false}
            />
          </div>
        </div>
        <div className="flex w-full gap-5">
          <div className="w-full">
            <div className={`pb-1`}>
              <label className={"text-sm font-bold capitalize text-[#2C3137]"}>
                Payment Collection
              </label>
            </div>
            <SelectInput
              onChange={(value) => {
                setFormValues({ ...formValues, payment: value });
              }}
              value={formValues.payment || undefined}
              placeholder={
                <span className="text-sm font-bold">Select colour</span>
              }
              data={[
                { label: "Due in 30days", value: "Due in 30days" },
                { label: "Due in 60days", value: "Due in 60days" },
                { label: "Due in 90days", value: "Due in 90days" },
                { label: "Due in 120days", value: "Due in 120days" },
                { label: "Due in 150days", value: "Due in 150days" },
                { label: "Due in 180days", value: "Due in 180days" },
                { label: "Due in 210days", value: "Due in 210days" },
                { label: "Due in 240days", value: "Due in 240days" },
                { label: "Due in 270days", value: "Due in 270days" },
                { label: "Due in 300days", value: "Due in 300days" },
                { label: "Due in 330days", value: "Due in 330days" },
                { label: "Due in 360days", value: "Due in 360days" },
              ]}
            />
            {formErrors.payment || error ? (
              <p className="flex flex-col gap-1 text-xs italic text-red-600">
                {formErrors.payment ||
                  (error as any)?.data?.errors?.payment?.map(
                    (err: any) => err
                  ) ||
                  ""}
              </p>
            ) : null}
          </div>
          <div className="w-full">
            <div className={`pb-1`}>
              <label className={"text-sm font-bold capitalize text-[#2C3137]"}>
                Delivery
              </label>
            </div>
            <SelectInput
              onChange={(value) => {
                setFormValues({ ...formValues, delivery: value });
              }}
              value={formValues.delivery || undefined}
              placeholder={
                <span className="text-sm font-bold">Select staff store</span>
              }
              data={[
                { label: "Delivery", value: "Delivery" },
                { label: "Pick up", value: "Pick up" },
                { label: "Email invoice", value: "Email invoice" },
              ]}
            />
            {formErrors.delivery || error ? (
              <p className="flex flex-col gap-1 text-xs italic text-red-600">
                {formErrors.delivery ||
                  (error as any)?.data?.errors?.delivery?.map(
                    (err: any) => err
                  ) ||
                  ""}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-300 pt-3">
          <div className="w-fit flex gap-5">
            <CustomButton
              type="button"
              onClick={() => {
                setIsOpenModal(false);
              }}
              className="border bg-border-300 text-black flex justify-center items-center gap-2 px-5"
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="button"
              onClick={handleSubmit}
              disabled={isLoadingCreate}
              className="border bg-primary-40 flex justify-center items-center gap-2 text-white px-5"
            >
              {isLoadingCreate ? <Spinner className="border-white" /> : btnText}
            </CustomButton>
          </div>
        </div>
      </form>
    </div>
  );
};
export default InvoiceItemForm;
