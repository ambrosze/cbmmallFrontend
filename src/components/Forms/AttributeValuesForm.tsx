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
  isEditing: boolean;
}
export const AttributeValuesForm = ({
  formErrors,
  error,
  formValues,
  btnText,
  isEditing,
  handleInputChange,
  setFormValues,
  handleSubmit,
  isLoadingCreate,
  setIsOpenModal,
}: IProps) => {
  return (
    <div>
      <form className="mt-5 flex flex-col gap-5">
        <TextInput
          type="text"
          name="value"
          errorMessage={
            formErrors.value ||
            (error as any)?.data?.errors?.value?.map((err: any) => err) ||
            ""
          }
          value={formValues.value}
          onChange={handleInputChange}
          placeholder="Enter a value"
          title={<span className="font-[500]">Attribute Value*</span>}
          required={false}
        />

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
