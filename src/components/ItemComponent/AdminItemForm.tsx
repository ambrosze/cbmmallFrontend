import { compressImage, fileToBase64 } from "@/utils/compressImage";

import { Icon } from "@iconify/react/dist/iconify.js";
import { message, Upload } from "antd";
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
export const AdminItemForm = ({
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

  // const handleSearchSelect = (input: string) => {
  //   setSearch(input);
  //   refetchStaff();
  // };
  return (
    <div>
      <form className="mt-5 flex flex-col gap-3 w-full">
        <div className="flex md:flex-row flex-col w-full gap-5">
          <div className="w-full">
            <div className={`pb-1`}>
              <label className={"text-sm font-bold capitalize text-[#2C3137]"}>
                Commodity*
              </label>
            </div>
            <SelectInput
              onChange={(value) => {
                setFormValues({ ...formValues, material: value });
              }}
              value={formValues.material || undefined}
              placeholder={
                <span className="text-sm font-bold">Select Commodity</span>
              }
              data={[
                { label: "Gold", value: "Gold" },
                { label: "Silver", value: "Silver" },
                { label: "Diamond", value: "Diamond" },
              ]}
            />
            {formErrors.material || error ? (
              <p className="flex flex-col gap-1 text-xs italic text-red-600">
                {formErrors.material ||
                  (error as any)?.data?.errors?.material?.map(
                    (err: any) => err
                  ) ||
                  ""}
              </p>
            ) : null}
          </div>
          <div className="w-full">
            <div className={`pb-1`}>
              <label className={"text-sm font-bold capitalize text-[#2C3137]"}>
                Category {formValues.material === "Gold" ? "*" : ""}
              </label>
            </div>
            <SelectInput
              onChange={(value) => {
                setFormValues({ ...formValues, category_id: value });
              }}
              value={formValues.category_id || undefined}
              placeholder={
                <span className="text-sm font-bold">Select category</span>
              }
              data={transformedCategoryData}
            />
            {formErrors.category_id || error ? (
              <p className="flex flex-col gap-1 text-xs italic text-red-600">
                {formErrors.category_id ||
                  (error as any)?.data?.errors?.category_id?.map(
                    (err: any) => err
                  ) ||
                  ""}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex md:flex-row flex-col w-full gap-5">
          <div className="w-full">
            <div className={`pb-1`}>
              <label className={"text-sm font-bold capitalize text-[#2C3137]"}>
                Colour {formValues.material === "Gold" ? "*" : ""}
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
                {formValues.material === "Diamond" ? "*" : ""}
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
              title={
                <span className="font-[500]">
                  Weight{formValues.material === "Gold" ? "*" : ""}
                </span>
              }
              required={false}
            />
          </div>
          <div className="w-full">
            <TextInput
              type="number"
              name="price"
              className="py-[13px]"
              errorMessage={
                formErrors.price ||
                (error as any)?.data?.errors?.price?.map((err: any) => err) ||
                ""
              }
              value={formValues.price}
              onChange={handleInputChange}
              placeholder="Enter price"
              title={
                <span className="font-[500]">
                  price{formValues.material === "Diamond" ? "*" : ""}
                </span>
              }
              required={false}
            />
          </div>
        </div>
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
              title={<span className="font-[500]">Quantity*</span>}
              required={false}
            />
          </div>
          <div className="w-full">
            <TextInput
              type="text"
              name="sku"
              className="py-[13px]"
              errorMessage={
                formErrors.sku ||
                (error as any)?.data?.errors?.sku?.map((err: any) => err) ||
                ""
              }
              value={formValues.sku}
              onChange={handleInputChange}
              placeholder="Enter sku"
              title={
                <span className="font-[500]">Sku(Stock keeping unit)</span>
              }
              required={false}
            />
          </div>
        </div>
        <div className="">
          {" "}
          {/* Upload Image */}
          <div className="w-full">
            <p className="text-sm capitalize font-[500] text-[#000]">
              Upload Image <span className="text-red-500"></span>
            </p>
            <div className="relative w-full">
              {fileList.length === 0 && (
                <div className="relative w-full">
                  <Upload
                    ref={uploadRef}
                    className="hidden-upload w-full hidden"
                    maxCount={1}
                    fileList={fileList}
                    onChange={handleFileChange}
                    beforeUpload={() => false}
                    accept="image/*"
                    showUploadList={false}
                    customRequest={({ onSuccess }) => {
                      if (onSuccess) onSuccess("ok", undefined);
                    }}
                  >
                    <div></div>
                  </Upload>

                  <button
                    type="button"
                    onClick={triggerUpload}
                    className={`p-4 w-full mt-2 border-2 border-dashed ${
                      formErrors.upload_image ||
                      (error as any)?.data?.errors?.image?.map(
                        (err: any) => err
                      )
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg mb-2 cursor-pointer hover:border-blue-500 transition-colors`}
                  >
                    <div className="flex justify-center items-center gap-2 py-4">
                      <Icon icon="ic:round-plus" width="24" height="24" />
                      <p className="text-xs font-bold text-center">
                        Add Images
                      </p>
                    </div>
                  </button>
                  <div className="text-xs text-red-500">
                    {formErrors.upload_image ||
                      ((error as any)?.data?.errors?.image?.map(
                        (err: any) => err
                      ) && (
                        <p className="text-xs text-red-500 mt-1">
                          {formErrors.image ||
                            (error as any)?.data?.errors?.image?.map(
                              (err: any) => err
                            ) ||
                            ""}
                        </p>
                      ))}
                  </div>
                </div>
              )}

              {fileList.length > 0 && (
                <div className="mb-3 w-full">
                  <div className="flex items-center gap-2 p-2 border rounded w-full">
                    <img
                      src={
                        fileList[0].thumbUrl ||
                        fileList[0].url ||
                        (fileList[0].originFileObj &&
                          URL.createObjectURL(fileList[0].originFileObj))
                      }
                      alt="Preview"
                      className="w-8 h-8 object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm truncate">{fileList[0].name}</p>
                      <button
                        type="button"
                        className="text-red-500 text-xs mt-1"
                        onClick={() => {
                          setFileList([]);
                          if (isEditing) {
                            // Only clear image if editing and user explicitly removes it
                            setFormValues({
                              ...formValues,
                              upload_image: null,
                            });
                          }
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
export default AdminItemForm;
