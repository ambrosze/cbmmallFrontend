import ColorPickerInput from "../Input/ColorPicker";
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
export const ColourForm = ({
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
      <form className="mt-5 flex flex-col gap-5">
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
          placeholder="Enter a colour name"
          title={<span className="font-[500]">Colour Name*</span>}
          required={false}
        />
        <div className="">
          <ColorPickerInput
            colorPicker={formValues.hex}
            onChange={(color: any) =>
              setFormValues({
                ...formValues,
                hex: color.toHexString(),
              })
            }
            errorMessage={
              formErrors.hex ||
              (error as any)?.data?.errors?.hex?.map((err: any) => err) ||
              ""
            }
            title={(<span className="font-[500]">Colour Code</span>) as any}
            className="py-2"
          />
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
