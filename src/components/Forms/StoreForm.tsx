import { Checkbox, CheckboxChangeEvent } from "antd";
import { useState } from "react";
import SelectInput from "../Input/SelectInput";
import TextInput from "../Input/TextInput";
import CustomButton from "../sharedUI/Buttons/Button";
import Spinner from "../sharedUI/Spinner";
import PhoneInputWithCountry from "../Input/PhoneInputWithCountry";

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
  setChecked: any;
  checked: any;
}
export const StoreForm = ({
  formErrors,
  error,
  formValues,
  btnText,
  handleInputChange,
  setFormValues,
  handleSubmit,
  isLoadingCreate,
  setIsOpenModal,
  setChecked,
  checked,
}: IProps) => {
  const [getDialCode, setGetDialCode] = useState("");

  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    setChecked(e.target.checked);
  };

  return (
    <div>
      <form className="mt-5 flex flex-col gap-3 w-full">
        <div className="flex w-full">
          <div className="w-full">
            <TextInput
              type="text"
              id="name"
              name="name"
              errorMessage={
                formErrors.name ||
                (error as any)?.data?.errors?.name?.map((err: any) => err) ||
                ""
              }
              className="py-[13px]"
              value={formValues.name}
              onChange={handleInputChange}
              placeholder="Enter a first name"
              title={<span className="font-[500]">Name*</span>}
              required={false}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <div className="space-y-1.5 w-full">
            <label className="text-sm font-medium">Phone Number</label>
            <PhoneInputWithCountry
            
              disabled={false}
              value={formValues.phone_number}
              onChange={(e) =>
                setFormValues((p:any) => ({
                  ...p,
                  phone_number: e,
                }))
              }
              placeholder="Enter phone number"
              className="w-full border rounded text-sm"
            />
          </div>
          <div className="w-full">
            <TextInput
              type="text"
              id="email"
              name="email"
              className="py-[13px]"
              errorMessage={
                formErrors.email ||
                (error as any)?.data?.errors?.email?.map((err: any) => err) ||
                ""
              }
              value={formValues.email}
              onChange={handleInputChange}
              placeholder="Enter an email"
              title={<span className="font-[500]">Email</span>}
              required={false}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <div className="w-full">
            <TextInput
              type="text"
              name="country"
              className="py-[13px]"
              errorMessage={
                formErrors.country ||
                (error as any)?.data?.errors?.country?.map((err: any) => err) ||
                ""
              }
              value={formValues.country}
              onChange={handleInputChange}
              placeholder="Enter an country"
              title={<span className="font-[500]">Country</span>}
              required={false}
            />
          </div>
          <div className="w-full">
            <TextInput
              type="text"
              id="city"
              name="city"
              className="py-[13px]"
              errorMessage={
                formErrors.city ||
                (error as any)?.data?.errors?.city?.map((err: any) => err) ||
                ""
              }
              value={formValues.city}
              onChange={handleInputChange}
              placeholder="Enter an city"
              title={<span className="font-[500]">State</span>}
              required={false}
            />
          </div>
        </div>
        <div className="w-full">
          <TextInput
            type="text"
            id="address"
            name="address"
            className="py-[13px]"
            errorMessage={
              formErrors.address ||
              (error as any)?.data?.errors?.address?.map((err: any) => err) ||
              ""
            }
            value={formValues.address}
            onChange={handleInputChange}
            placeholder="Enter an address"
            title={<span className="font-[500]">Address</span>}
            required={false}
          />
        </div>
        {/* <div className="">
          <div className={`pb-1`}>
            <label className={"text-sm capitalize text-[#2C3137]"}>
              Manager Name
            </label>
          </div>
          <SelectInput
            onChange={(value) => {
              setFormValues({ ...formValues, manager_staff_id: value });
            }}
            value={formValues.manager_staff_id || undefined}
            placeholder={<span className="text-sm font-bold">Select Name</span>}
            data={staffList}
          />
          {formErrors.manager_staff_id || error ? (
            <p className="flex flex-col gap-1 text-xs italic text-red-600">
              {formErrors.manager_staff_id ||
                (error as any)?.data?.errors?.manager_staff_id?.map(
                  (err: any) => err
                ) ||
                ""}
            </p>
          ) : null}
        </div> */}

        <div className="">
          {/* checkbox for active status   */}
          <Checkbox checked={checked} onChange={(e) => handleCheckboxChange(e)}>
            <span className="text-[#2C3137]">Is Warehouse</span>
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
