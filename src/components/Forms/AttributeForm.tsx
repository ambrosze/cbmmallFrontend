import { useGetAllEnumsQuery } from "@/services/global";
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
  isEditing: boolean;
}
export const AttributeForm = ({
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
  const { data, isLoading } = useGetAllEnumsQuery(
    {
      enum: "AttributeType",
    },
    { refetchOnMountOrArgChange: true }
  );
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
          placeholder="Enter a name"
          title={<span className="font-[500]">Name*</span>}
          required={false}
        />
        <div className="w-full">
          <div className={`pb-1`}>
            <label className={"text-sm font-bold capitalize text-[#2C3137]"}>
              Types
            </label>
          </div>
          <SelectInput
            onChange={(value) => {
              setFormValues({ ...formValues, type: value });
            }}
            loading={isLoading}
            value={formValues.type || undefined}
            placeholder={<span className="text-sm font-bold">Select type</span>}
            // data={[
            //   { label: "Text", value: "text" },
            //   { label: "Color", value: "color" },
            //   { label: "Number", value: "number" },
            //   { label: "Date", value: "date" },
            //   { label: "Image", value: "image" },
            // ]}
            data={
              isLoading
                ? []
                : data?.values?.map((enumValue) => ({
                    label: enumValue.name,
                    value: enumValue.value,
                  })) || []
            }
          />
          {formErrors.type || error ? (
            <p className="flex flex-col gap-1 text-xs italic text-red-600">
              {formErrors.type ||
                (error as any)?.data?.errors?.type?.map((err: any) => err) ||
                ""}
            </p>
          ) : null}
        </div>
        {!isEditing && (
          <div className="w-full">
            <div className={`pb-1`}>
              <label className={"text-sm font-bold capitalize text-[#2C3137]"}>
                Attribute Values*
              </label>
            </div>
            <SelectInput
              mode="tags"
              onChange={(value) => {
                // Normalize incoming values to clean, unique strings
                const normalized = (value || [])
                  .map((v: any) =>
                    typeof v === "string" ? v : v?.value ?? v?.label ?? ""
                  )
                  .map((s: string) => s.trim())
                  .filter((s: string) => s.length > 0);
                // Deduplicate (case-insensitive, preserving first occurrence's casing)
                const unique = Array.from(
                  new Map(
                    normalized.map((s: string) => [s.toLowerCase(), s])
                  ).values()
                );
                setFormValues({ ...formValues, values: unique });
              }}
              value={(formValues.values as any[]) || undefined}
              placeholder={
                <span className="text-sm font-bold">Enter values</span>
              }
              tokenSeparators={[","]}
              data={[]}
            />
            {formErrors.values || error ? (
              <p className="flex flex-col gap-1 text-xs italic text-red-600">
                {formErrors.values ||
                  (error as any)?.data?.errors?.values?.map(
                    (err: any) => err
                  ) ||
                  ""}
              </p>
            ) : null}
          </div>
        )}
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
