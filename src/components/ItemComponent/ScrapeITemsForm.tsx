import { compressImage, fileToBase64 } from "@/utils/compressImage";

import { Icon } from "@iconify/react/dist/iconify.js";
import { message, Tooltip } from "antd";
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
  selectedItem?: any;
  inventoryList?: any; // Add this prop
  debouncedInventorySearch?: (q: string) => void;
}

export const ScrapeITemsForm = ({
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
  debouncedInventorySearch,
  selectedItem,
  inventoryList, // Add this prop
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
  const handleFileChange = async ({ fileList: newFileList }: any) => {
    setFileList(newFileList);

    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      try {
        // Use your existing compressImage function from fx.ts
        const compressedFile = await compressImage(
          newFileList[0].originFileObj
        );

        // Convert compressed file to base64
        const base64 = await fileToBase64(compressedFile);

        setFormValues({
          ...formValues,
          upload_image: base64,
        });
      } catch (error) {
        console.error("Error processing image:", error);
        message.error("Error processing image");
      }
    } else {
      setFormValues({
        ...formValues,
        upload_image: null,
      });
    }
  };

  return (
    <div>
      <form className="mt-5 flex flex-col gap-3 w-full">
        {!isEditing && (
          <>
            {/* Customer Information Section for Creating Scrape Items */}
            <div className="border-b pb-4 mb-4">
              <div className="flex lg:flex-row flex-col gap-5 w-full">
                <div className="w-full">
                  <TextInput
                    type="text"
                    name="customer_name"
                    className="py-[13px]"
                    errorMessage={
                      formErrors.customer_name ||
                      (error as any)?.data?.errors?.["customer.name"]?.map(
                        (err: any) => err
                      ) ||
                      ""
                    }
                    value={formValues.customer_name}
                    onChange={handleInputChange}
                    placeholder="Enter customer name"
                    title={<span className="font-[500]">Customer Name</span>}
                    required={false}
                  />
                </div>
                <div className="w-full">
                  <TextInput
                    type="email"
                    name="customer_email"
                    className="py-[13px]"
                    errorMessage={
                      formErrors.customer_email ||
                      (error as any)?.data?.errors?.["customer.email"]?.map(
                        (err: any) => err
                      ) ||
                      ""
                    }
                    value={formValues.customer_email}
                    onChange={handleInputChange}
                    placeholder="Enter customer email"
                    title={<span className="font-[500]">Customer Email</span>}
                    required={false}
                  />
                </div>
              </div>
              <div className="flex lg:flex-row flex-col gap-5 w-full mt-3">
                <div className="w-full">
                  <TextInput
                    type="tel"
                    name="customer_phone"
                    className="py-[13px]"
                    errorMessage={
                      formErrors.customer_phone ||
                      (error as any)?.data?.errors?.[
                        "customer.phone_number"
                      ]?.map((err: any) => err) ||
                      ""
                    }
                    value={formValues.customer_phone}
                    onChange={handleInputChange}
                    placeholder="Enter customer phone number"
                    title={<span className="font-[500]">Customer Phone</span>}
                    required={false}
                  />
                </div>
                <div className="w-full">
                  <div className="pb-1">
                    <label className="text-sm font-bold capitalize text-[#2C3137]">
                      Scrape Type *
                    </label>
                  </div>
                  <SelectInput
                    onChange={(value) => {
                      setFormValues({ ...formValues, type: value });
                    }}
                    value={formValues.type || undefined}
                    placeholder={
                      <span className="text-sm font-bold">Select type</span>
                    }
                    data={[
                      { label: "Returned", value: "returned" },
                      { label: "Damaged", value: "damaged" },
                    ]}
                  />
                  {formErrors.type || error ? (
                    <p className="flex flex-col gap-1 text-xs italic text-red-600">
                      {formErrors.type ||
                        (error as any)?.data?.errors?.type?.map(
                          (err: any) => err
                        ) ||
                        ""}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Inventory Selection Section */}
            <div className="border-b pb-4 mb-4">
              <h3 className="text-lg font-semibold mb-3">Inventory Item</h3>
              <div className="w-full">
                <div className="pb-1">
                  <label className="text-sm font-bold capitalize text-[#2C3137]">
                    Inventory Item *
                  </label>
                </div>
                <SelectInput
                  onChange={(value) => {
                    setFormValues({ ...formValues, inventory_id: value });
                  }}
                  value={formValues.inventory_id || undefined}
                  handleSearchSelect={(q: string) =>
                    debouncedInventorySearch && debouncedInventorySearch(q ?? "")
                  }
                  placeholder={
                    <span className="text-sm font-bold">
                      Select inventory item
                    </span>
                  }
                  data={inventoryList || []}
                />
                {formErrors.inventory_id || error ? (
                  <p className="flex flex-col gap-1 text-xs italic text-red-600">
                    {formErrors.inventory_id ||
                      (error as any)?.data?.errors?.inventory_id?.map(
                        (err: any) => err
                      ) ||
                      ""}
                  </p>
                ) : null}
              </div>
            </div>
          </>
        )}

        {/* Quantity Section - appears for both create and edit */}
        <div className="flex lg:flex-row flex-col gap-5">
          <div className="w-full">
            <TextInput
              type="number"
              name="quantity"
              className="py-[13px]"
              errorMessage={
                formErrors.quantity ||
                (error as any)?.data?.errors?.quantity?.map(
                  (err: any) => err
                ) ||
                ""
              }
              value={formValues.quantity}
              onChange={handleInputChange}
              placeholder="Enter quantity"
              title={
                <Tooltip title="This is the number of items that will be removed from the scrape and added to the inventory. Ensure the quantity matches the actual count of items being processed.">
                  <span className="font-[500] flex items-center gap-1 py-0.5">
                    Quantity
                    <Icon icon="material-symbols:info-outline" /> *
                  </span>
                </Tooltip>
              }
              required={false}
            />
          </div>
          {!isEditing && (
            <div className="w-full">
              <TextInput
                type="text"
                name="comments"
                className="py-[13px]"
                errorMessage={
                  formErrors.comments ||
                  (error as any)?.data?.errors?.comments?.map(
                    (err: any) => err
                  ) ||
                  ""
                }
                value={formValues.comments}
                onChange={handleInputChange}
                placeholder="Enter comments (optional)"
                title={<span className="font-[500]">Comments</span>}
                required={false}
              />
            </div>
          )}
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
export default ScrapeITemsForm;
