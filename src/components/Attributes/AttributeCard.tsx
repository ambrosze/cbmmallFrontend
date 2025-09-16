import { capitalizeOnlyFirstLetter } from "@/utils/fx";
import { categorySchema } from "@/validation/authValidate";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import * as yup from "yup";
import TextInput from "../Input/TextInput";
import CustomButton from "../sharedUI/Buttons/Button";
import DeleteModal from "../sharedUI/DeleteModal";
import PlannerModal from "../sharedUI/PlannerModal";
import Spinner from "../sharedUI/Spinner";
import CustomToast from "../sharedUI/Toast/CustomToast";
import { showPlannerToast } from "../sharedUI/Toast/plannerToast";
import imgError from "/public/states/notificationToasts/error.svg";
import imgSuccess from "/public/states/notificationToasts/successcheck.svg";

interface IProps {
  data: any;
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  refetch: () => void;
  deleteCardApi: any;
  isDeleteLoading: boolean;
  errorUpdate: any;
  updateCardApi: any;
  formErrors: any;
  setFormErrors: React.Dispatch<React.SetStateAction<any>>;
  isLoadingUpdate: boolean;
  modalBtnEditText: string;
  editInputPlaceHolder: string;
}
const AttributeCard = ({
  data,
  formValues,
  setFormValues,
  refetch,
  deleteCardApi,
  handleInputChange,
  isDeleteLoading,
  errorUpdate,
  updateCardApi,
  formErrors,
  setFormErrors,
  isLoadingUpdate,
  modalBtnEditText,
  editInputPlaceHolder,
}: IProps) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  useEffect(() => {
    if (data && isOpenModal) {
      setFormValues({
        name: data.name,
      });
    }
  }, [data, isOpenModal]);
  const handleDeleteSubmit = async () => {
    try {
      // Proceed with server-side submission
      const response = await deleteCardApi({
        id: data?.id,
      }).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={
                <>
                  <span className="font-bold">
                    {capitalizeOnlyFirstLetter(data?.name)}
                  </span>{" "}
                  deleted Successfully
                </>
              }
              image={imgSuccess}
              textColor="green"
              message={"Thank you..."}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Please check your email for verification.",
      });
      refetch();
      setDeleteModal(false);
    } catch (err: any) {
      // Handle server-side errors
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Error"}
              title={
                <>
                  <span className="font-bold">
                    {capitalizeOnlyFirstLetter(data?.name)}
                  </span>{" "}
                  deletion failed
                </>
              }
              image={imgError}
              textColor="red"
              message={(err as any)?.data?.message || "Something went wrong"}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Invalid Credentials",
      });
    }
  };
  const handleUpdateSubmit = async () => {
    try {
      // Validate form values using yup
      await categorySchema.validate(formValues, {
        abortEarly: false,
      });

      // Clear previous form errors if validation is successful
      setFormErrors({});
      let payload = {
        name: formValues.name,
      };

      // Proceed with server-side submission
      const response = await updateCardApi({
        id: data?.id,
        body: payload,
      }).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={
                <>
                  <span className="font-bold">
                    {capitalizeOnlyFirstLetter(data?.name)}
                  </span>{" "}
                  updateded Successfully
                </>
              }
              image={imgSuccess}
              textColor="green"
              message={"Thank you..."}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Please check your email for verification.",
      });
      refetch();
      setIsOpenModal(false);
    } catch (err: any) {
      if (err.name === "ValidationError") {
        // Handle client-side validation errors
        const errors: { [key: string]: string } = {};
        err.inner.forEach((validationError: yup.ValidationError) => {
          if (validationError.path) {
            errors[validationError.path] = validationError.message;
          }
        });
        setFormErrors(errors);
      } else {
        // Handle server-side errors
        console.log("🚀 ~ handleSubmit ~ err:", err);
        refetch();
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText={"Error"}
                title={
                  <>
                    <span className="font-bold">
                      {capitalizeOnlyFirstLetter(data?.name)}
                    </span>{" "}
                    update Failed
                  </>
                }
                image={imgError}
                textColor="red"
                message={(err as any)?.data?.message || "Something went wrong"}
                backgroundColor="#FCFCFD"
              />
            ),
          },
          message: "Invalid Credentials",
        });
      }
    }
  };
  return (
    <>
      <div className="group flex justify-between items-center gap-4 py-4 px-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-primary-40/30 transition-all duration-300 mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-40/10 to-primary-40/20 rounded-lg flex items-center justify-center">
            <Icon
              icon="material-symbols:category-outline"
              className="text-primary-40"
              width="20"
              height="20"
            />
          </div>
          <div className="font-medium text-gray-900 text-base">
            {capitalizeOnlyFirstLetter(data?.name)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpenModal(true)}
            className="p-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 flex items-center justify-center"
            title={`Edit ${data?.name}`}
            type="button"
          >
            <Icon icon="line-md:pencil" width="18" height="18" />
          </button>

          <button
            onClick={() => setDeleteModal(true)}
            className="p-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center justify-center"
            title={`Delete ${data?.name}`}
            type="button"
          >
            <Icon icon="gg:trash" width="18" height="18" />
          </button>
        </div>
      </div>
      {isOpenModal && (
        <PlannerModal
          modalOpen={isOpenModal}
          setModalOpen={setIsOpenModal}
          className=""
          title={modalBtnEditText}
          onCloseModal={() => setIsOpenModal(false)}
        >
          <form className="mt-5 flex flex-col gap-5">
            <TextInput
              type="text"
              name="name"
              errorMessage={
                formErrors.name ||
                (errorUpdate as any)?.data?.errors?.name?.map(
                  (err: any) => err
                ) ||
                ""
              }
              value={formValues.name}
              onChange={handleInputChange}
              placeholder={editInputPlaceHolder}
              title={<span className="font-[500]">Category</span>}
              required={false}
            />

            <div className="flex justify-end border-t border-gray-300 pt-3">
              <div className="w-fit flex gap-5">
                <CustomButton
                  type="button"
                  onClick={() => {
                    setIsOpenModal(false);
                    setFormValues({ name: "" });
                  }}
                  className="border bg-border-300 text-black flex justify-center items-center gap-2 px-5"
                >
                  Cancel
                </CustomButton>
                <CustomButton
                  type="button"
                  disabled={isLoadingUpdate}
                  onClick={handleUpdateSubmit}
                  className="border bg-primary-40 flex justify-center items-center gap-2 text-white px-5"
                >
                  {isLoadingUpdate ? (
                    <Spinner className="border-white" />
                  ) : (
                    <> {modalBtnEditText}</>
                  )}
                </CustomButton>
              </div>
            </div>
          </form>
        </PlannerModal>
      )}
      {deleteModal && (
        <PlannerModal
          modalOpen={deleteModal}
          setModalOpen={setDeleteModal}
          onCloseModal={() => setDeleteModal(false)}
        >
          <DeleteModal
            handleDelete={() => {
              handleDeleteSubmit();
            }}
            isLoading={isDeleteLoading}
            onCloseModal={() => setDeleteModal(false)}
            title={
              <>
                Are you sure you want to delete{" "}
                <span className="font-bold">this {data?.name}</span>
              </>
            }
            text="Are you sure you want to cancel?"
            altText=""
          />
        </PlannerModal>
      )}
    </>
  );
};

export default AttributeCard;
