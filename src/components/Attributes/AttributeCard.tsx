import { CategoryDatum } from "@/types/categoryTypes";
import {
  categoryCreateSchema,
  categorySchema,
} from "@/validation/authValidate";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Dropdown, MenuProps } from "antd";
import { useEffect, useState } from "react";
import * as yup from "yup";
import CategoryDetails from "../Category/CategoryDetails";
import { CategoryForm } from "../Forms/Category/CategoryForm";
import { SubCategoryForm } from "../Forms/Category/SubCategoryForm";
import DeleteModal from "../sharedUI/DeleteModal";
import ImageComponent from "../sharedUI/ImageComponent";
import PlannerModal from "../sharedUI/PlannerModal";
import CustomToast from "../sharedUI/Toast/CustomToast";
import { showPlannerToast } from "../sharedUI/Toast/plannerToast";
import imgError from "/public/states/notificationToasts/error.svg";
import imgSuccess from "/public/states/notificationToasts/successcheck.svg";

interface IProps {
  data: CategoryDatum;
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  refetch: () => void;
  deleteCardApi: any;
  isDeleteLoading: boolean;
  errorUpdate: any;
  updateCardApi: any;
  // create flow props (for creating subcategory)
  createCardApi: any;
  errorCreate: any;
  isLoadingCreate: boolean;
  formErrors: any;
  setFormErrors: React.Dispatch<React.SetStateAction<any>>;
  isLoadingUpdate: boolean;
  modalBtnEditText: string;
  editInputPlaceHolder: string;
  // new props
  selectedItem?: CategoryDatum | null;
  isOpenParentModal: boolean;
  setIsOpenParentModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedItem: React.Dispatch<React.SetStateAction<CategoryDatum | null>>;
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
  createCardApi,
  errorCreate,
  isLoadingCreate,
  formErrors,
  setFormErrors,
  isLoadingUpdate,
  modalBtnEditText,
  editInputPlaceHolder,
  selectedItem,
  isOpenParentModal,
  setIsOpenParentModal,
  setSelectedItem,
}: IProps) => {
  console.log("🚀 ~ AttributeCard ~ data:", data);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isViewDetailsModal, setIsViewDetailsModal] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(true);

  console.log("🚀 ~ AttributeCard ~ selectedItem:", selectedItem);
  useEffect(() => {
    if (selectedItem && isOpenModal) {
      setFormValues({
        name: selectedItem?.name || "",
        image: null,
        parent_category_id: selectedItem?.parent_id || null,
      });
    }
  }, [selectedItem, isOpenModal]);
  console.log("🚀 ~ AttributeCard ~ selectedItem:", selectedItem);
  const items: MenuProps["items"] = [
    {
      label: (
        <button
          onClick={() => {
            setIsViewDetailsModal(true);
          }}
          className="flex w-full items-center gap-2"
          type="button"
        >
          View Details
        </button>
      ),
      key: "2",
    },
    {
      label: (
        <button
          onClick={() => {
            setIsOpenModal(true);
          }}
          className="flex w-full items-center gap-2"
          type="button"
        >
          Edit
        </button>
      ),
      key: "1",
    },
    {
      label: (
        <button
          onClick={() => {
            setIsOpenParentModal(true);
            setSelectedItem(data);
            setFormValues({
              name: "",
              image: null,
              // when creating a subcategory, the parent is the current item's id
              parent_category_id: data?.id || null,
            });
          }}
          className="flex w-full items-center gap-2"
          type="button"
        >
          Add Sub Category
        </button>
      ),
      key: "4",
    },
    {
      label: (
        <button
          onClick={() => {
            setDeleteModal(true);
          }}
          className="flex w-full items-center text-red-500 gap-2"
          type="button"
        >
          Delete
        </button>
      ),
      key: "3",
    },
  ];
  const handleCreateSubmit = async () => {
    try {
      // Validate form values using yup (create schema)
      await categoryCreateSchema.validate(formValues, {
        abortEarly: false,
      });

      // Clear previous form errors if validation is successful
      setFormErrors({});
      const payload = {
        name: formValues.name,
        image: formValues.image || null,
        // ensure we send the selected item's id as parent when creating subcategory
        parent_category_id:
          selectedItem?.parent_id || formValues.parent_category_id || null,
      };

      // Proceed with server-side submission (create)
      const response = await createCardApi(payload).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={
                <>
                  <span className="font-bold">{formValues?.name}</span> created
                  Successfully
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
      setIsOpenParentModal(false);
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
        console.log("🚀 ~ handleCreateSubmit ~ err:", err);
        refetch();
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText={"Error"}
                title={
                  <>
                    <span className="font-bold">{formValues?.name}</span>{" "}
                    creation Failed
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
                  <span className="font-bold">{data?.name}</span> deleted
                  Successfully
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
                  <span className="font-bold">{data?.name}</span> deletion
                  failed
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
        image: formValues.image || null,
        parent_category_id: formValues.parent_category_id || null,
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
                  <span className="font-bold">{data?.name}</span> updated
                  Successfully
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
                    <span className="font-bold">{data?.name}</span> update
                    Failed
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
          <div className="w-10 h-10 rounded-md">
            <ImageComponent
              isLoadingImage={isLoadingImage}
              setIsLoadingImage={setIsLoadingImage}
              aspectRatio="1/1"
              src={data?.image_url || "/images/empty_box.svg"}
              width={50}
              height={50}
              alt="image"
              className="h-[40px] w-[40px]  rounded-md"
            />
          </div>

          <div className="font-medium text-gray-900 text-base">
            {data?.name.length > 25
              ? `${data?.name.slice(0, 25)}...`
              : data?.name}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Actions */}

          <Dropdown menu={{ items }} trigger={["click"]}>
            <button
              onClick={(e) => {
                e.preventDefault();
                setSelectedItem(data);
              }}
              className="p-1.5 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              title="Actions"
              type="button"
            >
              <Icon
                icon="mdi:dots-vertical-circle-outline"
                width="22"
                height="22"
              />
            </button>
          </Dropdown>
        </div>
      </div>
      {isOpenModal && (
        <PlannerModal
          modalOpen={isOpenModal}
          setModalOpen={setIsOpenModal}
          className=""
          width={400}
          title={modalBtnEditText}
          onCloseModal={() => setIsOpenModal(false)}
        >
          <CategoryForm
            isEditing={true}
            error={errorUpdate}
            btnText="Edit Category"
            formErrors={formErrors}
            formValues={formValues}
            selectedItem={selectedItem}
            handleInputChange={handleInputChange}
            setFormValues={setFormValues}
            handleSubmit={handleUpdateSubmit}
            isLoadingCreate={isLoadingUpdate}
            setIsOpenModal={setIsOpenModal}
          />
        </PlannerModal>
      )}
      {isOpenParentModal && data?.id === selectedItem?.id && (
        <PlannerModal
          modalOpen={isOpenParentModal}
          setModalOpen={setIsOpenParentModal}
          className=""
          width={400}
          title={"Add Sub Category"}
          onCloseModal={() => setIsOpenParentModal(false)}
        >
          <SubCategoryForm
            isEditing={false}
            error={errorCreate}
            btnText="Create Sub Category"
            formErrors={formErrors}
            formValues={formValues}
            selectedItem={selectedItem}
            handleInputChange={handleInputChange}
            setFormValues={setFormValues}
            handleSubmit={handleCreateSubmit}
            isLoadingCreate={isLoadingCreate}
            // ensure cancel closes the parent modal, not the edit modal
            setIsOpenModal={setIsOpenParentModal}
          />
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

      {isViewDetailsModal && (
        <PlannerModal
          modalOpen={isViewDetailsModal}
          setModalOpen={setIsViewDetailsModal}
          className=""
          title={"View Category Details"}
          onCloseModal={() => setIsViewDetailsModal(false)}
        >
          <CategoryDetails
            category={{
              ...data,
              sub_categories:
                (selectedItem as any)?.sub_categories ||
                (data as any)?.sub_categories,
            }}
            onClose={() => setIsViewDetailsModal(false)}
            onRefetch={refetch}
            createSubCategory={createCardApi}
            updateSubCategory={updateCardApi}
            isMutating={isLoadingCreate || isLoadingUpdate}
            serverError={errorCreate || errorUpdate}
          />
        </PlannerModal>
      )}
    </>
  );
};

export default AttributeCard;
