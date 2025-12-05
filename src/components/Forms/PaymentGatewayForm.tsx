import { useGetAllEnumsQuery } from "@/services/global";
import { compressImage, fileToBase64 } from "@/utils/compressImage";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Checkbox, message, Upload } from "antd";
import { useEffect, useMemo, useState } from "react";
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
  selectedItem: any;
}
export const PaymentGatewayForm = ({
  formErrors,
  error,
  formValues,
  btnText,
  handleInputChange,
  setFormValues,
  handleSubmit,
  isLoadingCreate,
  setIsOpenModal,
  selectedItem,
}: IProps) => {
  const [fileList, setFileList] = useState<any>([]);
  const { data: enumsData, isLoading: isLoadingEnums } = useGetAllEnumsQuery({
    enum: "PaymentMode",
  });

  const enumOptions = useMemo(
    () =>
      (enumsData?.values ?? []).map((enumItem) => ({
        label: enumItem.label,
        value: enumItem.value,
      })),
    [enumsData]
  );

  // Initialize fileList with the existing logo when in edit mode
  useEffect(() => {
    if (selectedItem?.logo_url) {
      setFileList([
        {
          uid: "-1",
          name: `existing-image-${selectedItem.name.split(".").pop()}`,
          status: "done",
          url: selectedItem.logo_url,
        },
      ]);
    }
  }, [selectedItem]);

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
          logo: base64,
        });
      } catch (error) {
        console.error("Error processing logo:", error);
        message.error("Error processing logo");
      }
    } else {
      setFormValues({
        ...formValues,
        logo: null,
      });
    }
  };

  return (
    <div>
      <form className="mt-5 flex flex-col gap-5 w-full">
        <div className="w-full">
          <TextInput
            type="text"
            name="name"
            errorMessage={
              formErrors.name ||
              (error as any)?.data?.errors?.name?.map((err: any) => err) ||
              ""
            }
            value={formValues.name}
            onChange={handleInputChange}
            placeholder="Enter a name"
            title={<span className="font-[500]">Name*</span>}
            required={false}
          />
        </div>
        <div className="flex w-full">
          <div className="w-full">
            <div className={`pb-1`}>
              <label className={"text-sm"}>
                Store <span className="text-red-600">*</span>
              </label>
            </div>
            <SelectInput
              onChange={(value) => {
                setFormValues({ ...formValues, mode: value });
              }}
              value={formValues.mode || undefined}
              placeholder={
                <span className="text-sm font-[500]">Select Payment Mode</span>
              }
              className="py-1"
              data={enumOptions}
              loading={isLoadingEnums}
            />
            {formErrors.mode ? (
              <p className="flex flex-col gap-1 text-xs italic text-red-600">
                {formErrors.mode ? formErrors.mode : ""}
              </p>
            ) : null}
          </div>
        </div>
        <div className="">
          {" "}
          {/* Upload Image */}
          <div className="w-full">
            <p className="text-sm capitalize font-[500] text-[#000]">
              Upload logo <span className="text-red-500"></span>
            </p>
            <div className="relative w-full">
              {fileList.length === 0 && (
                <div className="relative w-full">
                  <Upload
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
                      formErrors.image ||
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
                    {formErrors.logo ||
                      ((error as any)?.data?.errors?.logo?.map(
                        (err: any) => err
                      ) && (
                        <p className="text-xs text-red-500 mt-1">
                          {formErrors.logo ||
                            (error as any)?.data?.errors?.logo?.map(
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
                      <p className="text-sm truncate">
                        {fileList[0].name.length > 20
                          ? `${fileList[0].name.slice(0, 20)}...`
                          : fileList[0].name}
                      </p>
                      <button
                        type="button"
                        className="text-red-500 text-xs mt-1"
                        onClick={() => {
                          setFileList([]);
                          // Clear logo for both create and edit flows when user removes it
                          setFormValues({
                            ...formValues,
                            logo: null,
                          });
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
        <div className="flex gap-5">
          <Checkbox
            checked={
              formValues.is_disabled === 1 || formValues.is_disabled === true
            }
            onChange={(e) => {
              setFormValues({
                ...formValues,
                is_disabled: e.target.checked ? 1 : 0,
              });
            }}
          >
            Is Disabled
          </Checkbox>
          <Checkbox
            checked={
              formValues.is_default === 1 || formValues.is_default === true
            }
            onChange={(e) => {
              setFormValues({
                ...formValues,
                is_default: e.target.checked ? 1 : 0,
              });
            }}
          >
            Is Default
          </Checkbox>
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
