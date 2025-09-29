import { useState } from "react";
import { twMerge } from "tailwind-merge";
import PhoneInputWithCountry from "../Input/PhoneInputWithCountry";
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
  roleData: any;
  storeData: any;
  debouncedRolesSearch?: (q: string) => void;
  debouncedStoreSearch?: (q: string) => void;
}
export const StaffForm = ({
  formErrors,
  error,
  formValues,
  btnText,
  handleInputChange,
  setFormValues,
  handleSubmit,
  isLoadingCreate,
  setIsOpenModal,
  roleData,
  storeData,
  debouncedRolesSearch,
  debouncedStoreSearch,
}: IProps) => {
  const [getDialCode, setGetDialCode] = useState("");

  // const handleSearchSelect = (input: string) => {
  //   setSearch(input);
  //   refetchStaff();
  // };
  return (
    <div>
      <form className="mt-5 flex flex-col gap-3 w-full">
        <div className="flex lg:flex-row flex-col gap-5 w-full">
          <div className="w-full">
            <TextInput
              type="text"
              name="first_name"
              errorMessage={
                formErrors.first_name ||
                (error as any)?.data?.errors?.first_name?.map(
                  (err: any) => err
                ) ||
                ""
              }
              className="py-[13px]"
              value={formValues.first_name}
              onChange={handleInputChange}
              placeholder="Enter a first name"
              title={<span className="font-[500]">First Name*</span>}
              required={false}
            />
          </div>
          <div className="w-full">
            <TextInput
              type="text"
              name="last_name"
              className="py-[13px]"
              errorMessage={
                formErrors.last_name ||
                (error as any)?.data?.errors?.last_name?.map(
                  (err: any) => err
                ) ||
                ""
              }
              value={formValues.last_name}
              onChange={handleInputChange}
              placeholder="Enter a first name"
              title={<span className="font-[500]">First Name*</span>}
              required={false}
            />
          </div>
        </div>
        <div className="flex lg:flex-row flex-col gap-5">
          <div className="w-full">
            <TextInput
              type="text"
              name="email"
              className="py-[13px]"
              errorMessage={
                formErrors.email ||
                (error as any)?.data?.errors?.email?.map((err: any) => err) ||
                ""
              }
              value={formValues.email}
              onChange={handleInputChange}
              placeholder="Enter a email address"
              title={<span className="font-[500]">Email*</span>}
              required={false}
            />
          </div>
          <div className="w-full">
            <div className={`pb-1`}>
              <label className={twMerge("text-sm capitalize text-[#2C3137]")}>
                Phone Number*
              </label>
            </div>
            <PhoneInputWithCountry
              disabled={false}
              value={formValues.last_name}
              className=""
              onChange={(value) => {
                setFormValues((prevValues: any) => ({
                  ...prevValues,
                  phone_number: value,
                }));
              }}
              placeholder="Enter a first name"
            />
            <span className="relative -top-1 text-[12px] italic text-error-50">
              {formErrors.phone_number ||
                (error as any)?.data?.errors?.phone_number?.map(
                  (err: any) => err
                ) ||
                ""}
            </span>
          </div>
        </div>
        <div className="">
          <div className={`pb-1`}>
            <label className={"text-sm capitalize text-[#2C3137]"}>
              Staff Role
            </label>
          </div>
          <SelectInput
            onChange={(value) => {
              setFormValues({ ...formValues, role_id: value });
            }}
            handleSearchSelect={(q: string) =>
              debouncedRolesSearch && debouncedRolesSearch(q ?? "")
            }
            value={formValues.role_id || undefined}
            placeholder={
              <span className="text-sm font-bold">Select staff role</span>
            }
            data={roleData}
          />
          {formErrors.role_id || error ? (
            <p className="flex flex-col gap-1 text-xs italic text-red-600">
              {formErrors.role_id ||
                (error as any)?.data?.errors?.role_id?.map((err: any) => err) ||
                ""}
            </p>
          ) : null}
        </div>
        <div className="">
          <div className={`pb-1`}>
            <label className={"text-sm capitalize text-[#2C3137]"}>
              Staff Store*
            </label>
          </div>
          <SelectInput
            onChange={(value) => {
              setFormValues({ ...formValues, store_id: value });
            }}
            handleSearchSelect={(q: string) =>
              debouncedStoreSearch && debouncedStoreSearch(q ?? "")
            }
            value={formValues.store_id || undefined}
            placeholder={
              <span className="text-sm font-bold">Select staff store</span>
            }
            data={storeData}
          />
          {formErrors.store_id || error ? (
            <p className="flex flex-col gap-1 text-xs italic text-red-600">
              {formErrors.store_id ||
                (error as any)?.data?.errors?.store_id?.map(
                  (err: any) => err
                ) ||
                ""}
            </p>
          ) : null}
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
