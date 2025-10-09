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
}
export const InventoryQuantityForm = ({
  formErrors,
  error,
  formValues,
  btnText,
  handleInputChange,
  setFormValues,
  handleSubmit,
  isLoadingCreate,
  setIsOpenModal,
}: IProps) => {
  return (
    <div>
      <form className="mt-5 flex flex-col gap-3 w-full">
        <div className="flex w-full">
          <div className="w-full">
            <TextInput
              type="number"
              id="quantity"
              name="quantity"
              errorMessage={
                formErrors.quantity ||
                (error as any)?.data?.errors?.quantity?.map(
                  (err: any) => err
                ) ||
                ""
              }
              className="py-[13px]"
              value={formValues.quantity}
              onChange={handleInputChange}
              placeholder="Enter a quantity"
              title={<span className="font-[500]">Quantity*</span>}
              required={false}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          <div className="w-full">
            <TextInput
              type="text"
              name="serial_number"
              className="py-[13px]"
              errorMessage={
                formErrors.serial_number ||
                (error as any)?.data?.errors?.serial_number?.map(
                  (err: any) => err
                ) ||
                ""
              }
              value={formValues.serial_number}
              onChange={handleInputChange}
              placeholder="Enter a serial number"
              title={<span className="font-[500]">Serial Number</span>}
              required={false}
            />
          </div>
          <div className="w-full">
            <TextInput
              type="text"
              id="batch_number"
              name="batch_number"
              className="py-[13px]"
              errorMessage={
                formErrors.batch_number ||
                (error as any)?.data?.errors?.batch_number?.map(
                  (err: any) => err
                ) ||
                ""
              }
              value={formValues.batch_number}
              onChange={handleInputChange}
              placeholder="Enter a batch number"
              title={<span className="font-[500]">Batch Number</span>}
              required={false}
            />
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
