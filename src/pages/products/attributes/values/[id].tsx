import AttributeHeader from "@/components/Attributes/AttributeHeader";
import Header from "@/components/header";
import DeleteModal from "@/components/sharedUI/DeleteModal";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import PaginationComponent from "@/components/sharedUI/PaginationComponent";
import PlannerModal from "@/components/sharedUI/PlannerModal";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";

import { AttributeValuesForm } from "@/components/Forms/AttributeValuesForm";
import {
  useCreateAttributeValueMutation,
  useDeleteAttributeValueMutation,
  useGetAllAttributeValuesQuery,
  useUpdateAttributeValueMutation,
} from "@/services/attributes-values/values";
import { IAttributesValuesDatum } from "@/types/attributeValuesTypes";
import {
  capitalizeOnlyFirstLetter,
  newUserTimeZoneFormatDate,
} from "@/utils/fx";
import { attributeValueSchema } from "@/validation/authValidate";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Dropdown, MenuProps } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as yup from "yup";
const imgError = "/states/notificationToasts/error.svg";
const imgSuccess = "/states/notificationToasts/successcheck.svg";
const index = () => {
  const [search, setSearch] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { id } = useRouter().query;
  const [formValues, setFormValues] = useState<{
    attribute_id: string;
    value: string;
  }>({
    attribute_id: id as string,
    value: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  console.log("iformErrors", formErrors);
  const { data, refetch, isLoading } = useGetAllAttributeValuesQuery({
    q: search,
    page: currentPage,
    include: "attribute",
    per_page: 15,
    paginate: true,
    filter: {
      attribute_id: id as string,
    },
  });
  const [createAttributeValue, { isLoading: isLoadingCreate, error }] =
    useCreateAttributeValueMutation();
  const [
    updateAttributeValue,
    { isLoading: isLoadingUpdate, error: errorUpdate },
  ] = useUpdateAttributeValueMutation();
  const [deleteAttributeValue, { isLoading: isDeleteLoading }] =
    useDeleteAttributeValueMutation();
  const [selectedItem, setSelectedItem] =
    useState<IAttributesValuesDatum | null>(null);
  console.log("🚀 ~ index ~ selectedItem:", selectedItem);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const router = useRouter();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch();
  };
  useEffect(() => {
    if (selectedItem && showEditModal) {
      setFormValues({
        attribute_id: selectedItem.attribute_id || "",
        value: selectedItem?.value || "",
      });
    }
  }, [selectedItem, showEditModal]);
  const items: MenuProps["items"] = [
    {
      label: (
        <button
          onClick={() => {
            setShowEditModal(true);
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
            setShowDeleteModal(true);
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

  const handleDeleteSubmit = async () => {
    try {
      const response = await deleteAttributeValue({
        id: selectedItem?.id,
      } as any).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={
                <>
                  <span className="font-bold">
                    {capitalizeOnlyFirstLetter(selectedItem?.value || "")}
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
      setShowDeleteModal(false);
    } catch (err: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Error"}
              title={
                <>
                  <span className="font-bold">
                    {capitalizeOnlyFirstLetter(selectedItem?.value || "")}
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
  const handleSubmit = async () => {
    try {
      // Validate form values using yup
      await attributeValueSchema.validate(formValues, {
        abortEarly: false,
      });

      // Clear previous form errors if validation is successful
      setFormErrors({});
      let payload = {
        attribute_id: id as string,
        value: formValues.value,
      };

      // Proceed with server-side submission
      const response = await createAttributeValue(payload as any).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={"Attribute Created Successfully"}
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
                title={"Attribute Creation Failed"}
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
  const handleUpdateSubmit = async () => {
    try {
      // Validate form values using yup
      await attributeValueSchema.validate(
        {
          value: formValues.value,
        },
        {
          abortEarly: false,
        }
      );
      let payload = {
        attribute_id: id as string,
        value: formValues.value,
      };

      // Proceed with server-side submission
      const response = await updateAttributeValue({
        id: selectedItem?.id!,
        body: payload as any,
      }).unwrap();

      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={
                <>
                  <span className="font-bold">
                    {capitalizeOnlyFirstLetter(selectedItem?.value!)}
                  </span>{" "}
                  updated Successfully
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
      setShowEditModal(false);
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
                      {capitalizeOnlyFirstLetter(selectedItem?.value!)}
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
    <div className={``}>
      <Header
        search={search}
        setSearch={setSearch}
        placeHolderText="Search Attributes Values"
        showSearch={true}
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="Attributes Values"
        btnText="Create"
        onClick={() => {
          setIsOpenModal(true);
          setFormValues({
            attribute_id: id as string,
            value: "",
          });
        }}
      />
      <SharedLayout className="bg-white">
        {isLoading ? (
          <SkeletonLoaderForPage />
        ) : (
          <>
            <div className="bg-gray-50 p-4 mb-6 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-gray-500 text-sm">Attribute Name</h4>
                  <p className="font-medium">
                    {data?.data[0]?.attribute?.name}
                  </p>
                </div>
                <div>
                  <h4 className="text-gray-500 text-sm">Values Count</h4>
                  <p className="font-medium">{data?.data.length || 0}</p>
                </div>
                <div className="">
                  <h4 className="text-gray-500 text-sm">Attribute Type</h4>
                  <p className="font-medium">
                    {data?.data[0]?.attribute?.type}
                  </p>
                </div>
              </div>
            </div>
            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-4">
              {data?.data?.length ? (
                data?.data?.map((item: IAttributesValuesDatum) => (
                  <div
                    key={item.id}
                    className="group relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-primary-40/30 transition-all duration-300 p-4"
                  >
                    {/* Actions */}
                    <div className="absolute top-2 right-2">
                      <Dropdown menu={{ items }} trigger={["click"]}>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedItem(item);
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

                    {/* Value */}
                    <div className="mt-2">
                      <div className="text-lg font-semibold text-gray-900">
                        {capitalizeOnlyFirstLetter(item.value)}
                      </div>
                      {item.attribute?.name && (
                        <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-primary-40/10 text-primary-40">
                          <Icon icon="mdi:tag-outline" width="14" height="14" />
                          {item.attribute.name}
                        </div>
                      )}
                    </div>

                    {/* Dates */}
                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Icon icon="mdi:calendar-plus" width="16" height="16" />
                        <span>
                          {newUserTimeZoneFormatDate(
                            item.created_at,
                            "DD/MM/YYYY"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-end">
                        <Icon icon="mdi:update" width="16" height="16" />
                        <span>
                          {newUserTimeZoneFormatDate(
                            item.updated_at,
                            "DD/MM/YYYY"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-10">
                  No attribute values found.
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="py-8 flex justify-end items-center w-full">
              <div className="w-fit">
                {data?.meta?.total! > 0 && (
                  <PaginationComponent
                    paginationData={{
                      current_page: data?.meta?.current_page!,
                      last_page: data?.meta?.last_page!,
                      per_page: data?.meta?.per_page!,
                      total: data?.meta?.total!,
                      next_page_url: data?.links?.next!,
                      prev_page_url: data?.links?.prev!,
                    }}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </SharedLayout>
      {isOpenModal && (
        <PlannerModal
          modalOpen={isOpenModal}
          width={400}
          setModalOpen={setIsOpenModal}
          className=""
          title="Create Attribute Value"
          onCloseModal={() => setIsOpenModal(false)}
        >
          <AttributeValuesForm
            isEditing={false}
            error={error}
            btnText="Create Attribute"
            formErrors={formErrors}
            formValues={formValues}
            handleInputChange={handleInputChange}
            setFormValues={setFormValues}
            handleSubmit={handleSubmit}
            isLoadingCreate={isLoadingCreate}
            setIsOpenModal={setIsOpenModal}
          />
        </PlannerModal>
      )}
      {showEditModal && (
        <PlannerModal
          modalOpen={showEditModal}
          setModalOpen={setShowEditModal}
          width={400}
          className=""
          title="Edit Attribute Value"
          onCloseModal={() => setShowEditModal(false)}
        >
          <AttributeValuesForm
            isEditing={true}
            error={errorUpdate}
            btnText="Edit Attribute Value"
            formErrors={formErrors}
            formValues={formValues}
            handleInputChange={handleInputChange}
            setFormValues={setFormValues}
            handleSubmit={handleUpdateSubmit}
            isLoadingCreate={isLoadingUpdate}
            setIsOpenModal={setShowEditModal}
          />
        </PlannerModal>
      )}
      {showDeleteModal && (
        <PlannerModal
          modalOpen={showDeleteModal}
          setModalOpen={setShowDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
        >
          <DeleteModal
            handleDelete={handleDeleteSubmit}
            isLoading={isDeleteLoading}
            onCloseModal={() => setShowDeleteModal(false)}
            title={
              <>
                Are you sure you want to delete{" "}
                <span className="font-bold">
                  {capitalizeOnlyFirstLetter(selectedItem?.value || "")}
                </span>
                ?
              </>
            }
            text="This action cannot be undone."
            altText=""
          />
        </PlannerModal>
      )}
    </div>
  );
};

export default index;
