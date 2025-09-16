import dayjs from "dayjs";
import DatePickerComponent from "../Input/DateAndTime/DatePicker";
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
  transformedCategoryData: any;
}
export const DailyGoldForm = ({
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
        <div className="w-full">
          <div className={`pb-1`}>
            <label className={"text-sm font-bold capitalize text-[#2C3137]"}>
              Category
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
        <TextInput
          type="text"
          name="price_per_gram"
          errorMessage={
            formErrors.price_per_gram ||
            (error as any)?.data?.errors?.price_per_gram?.map(
              (err: any) => err
            ) ||
            ""
          }
          value={formValues.price_per_gram}
          onChange={handleInputChange}
          placeholder="Enter a price per gram"
          title={<span className="font-[500]">Price per gram*</span>}
          required={false}
        />

        {/* <div className="w-full">
          <div className={`pb-1`}>
            <label className={"text-sm font-bold capitalize text-[#2C3137]"}>
              Recorded on
            </label>
          </div>
          <DatePickerComponent
            size="large"
            name="recorded_on"
            value={
              formValues.recorded_on ? dayjs(formValues.recorded_on) : undefined
            }
            defaultValue={
              formValues.recorded_on ? dayjs(formValues.recorded_on) : undefined
            }
            onChange={(date: { format: (arg0: string) => any; }) =>
              handleInputChange({
                target: {
                  name: "recorded_on",
                  value: date ? date.format("YYYY-MM-DD") : "",
                },
              })
            }
            placeholder="Select date"
            errorMessage={
              formErrors.recorded_on ||
              (error as any)?.data?.errors?.recorded_on?.map(
                (err: any) => err
              ) ||
              ""
            }
            allowClear
            className="w-full py-2"
          />
        </div> */}

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
