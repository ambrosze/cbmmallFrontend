import { Switch } from "antd";
import dayjs from "dayjs";
import DatePickerComponent from "../Input/DateAndTime/DatePicker";
import TextAreaInput from "../Input/TextAreaInput";
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
  transformedCategoryData: any;
}
export const DiscountForm = ({
  formErrors,
  error,
  formValues,
  btnText,
  handleInputChange,
  setFormValues,
  handleSubmit,
  isLoadingCreate,
  setIsOpenModal,
  transformedCategoryData,
}: IProps) => {
  return (
    <div>
      <form className="mt-5 flex flex-col gap-5">
        <TextInput
          type="text"
          name="code"
          errorMessage={
            formErrors.code ||
            (error as any)?.data?.errors?.code?.map((err: any) => err) ||
            ""
          }
          value={formValues.code}
          onChange={handleInputChange}
          placeholder="Enter discount code"
          title={<span className="font-[500]">Discount Code*</span>}
          required={true}
        />

        <TextAreaInput
          row={4}
          name="description"
          errorMessage={
            formErrors.description ||
            (error as any)?.data?.errors?.description?.map((err: any) => err) ||
            ""
          }
          value={formValues.description}
          onChange={handleInputChange}
          className="w-full"
          placeholder="Enter discount description"
          title="Description"
          required={false}
        />

        <TextInput
          type="number"
          name="percentage"
          errorMessage={
            formErrors.percentage ||
            (error as any)?.data?.errors?.percentage?.map((err: any) => err) ||
            ""
          }
          value={formValues.percentage}
          onChange={handleInputChange}
          placeholder="Enter discount percentage"
          title={<span className="font-[500]">Percentage*</span>}
          required={true}
        />

        <div className="w-full">
          <div className={`pb-1`}>
            <label className={"text-sm font-bold capitalize text-[#2C3137]"}>
              Expiration Date
            </label>
          </div>
          <DatePickerComponent
            size="large"
            name="expires_at"
            value={
              formValues.expires_at ? dayjs(formValues.expires_at) : undefined
            }
            defaultValue={
              formValues.expires_at ? dayjs(formValues.expires_at) : undefined
            }
            onChange={(date: { format: (arg0: string) => any }) =>
              handleInputChange({
                target: {
                  name: "expires_at",
                  value: date ? date.format("YYYY-MM-DD") : "",
                },
              })
            }
            placeholder="Select expiration date"
            errorMessage={
              formErrors.expires_at ||
              (error as any)?.data?.errors?.expires_at?.map(
                (err: any) => err
              ) ||
              ""
            }
            allowClear
            className="w-full py-2"
          />
        </div>

        <div className="w-full">
          <div className={`pb-1`}>
            <label className={"text-sm font-bold capitalize text-[#2C3137]"}>
              Status
            </label>
          </div>
          <Switch
            checked={formValues.is_active === 1}
            onChange={(checked) =>
              setFormValues({ ...formValues, is_active: checked ? 1 : 0 })
            }
            className="bg-gray-300"
          />
          <span className="ml-2">
            {formValues.is_active === 1 ? "Active" : "Inactive"}
          </span>
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
