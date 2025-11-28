import AttributeHeader from "@/components/Attributes/AttributeHeader";
import Header from "@/components/header";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import PaginationComponent from "@/components/sharedUI/PaginationComponent";
import PlannerModal from "@/components/sharedUI/PlannerModal";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";

import { columnsTable } from "@/components/Attributes/tableColumns";
import TableMainComponent from "@/components/Attributes/TableMainComponent";
import { AttributeForm } from "@/components/Forms/AttributeForm";
import {
  useCreateAttributesMutation,
  useDeleteAttributesMutation,
  useGetAllAttributesQuery,
  useUpdateAttributesMutation,
} from "@/services/attributes-values/attributes";
import { useDeleteAttributeValueMutation } from "@/services/attributes-values/values";
import { IAttributesDatum, IAttributeValue } from "@/types/attributeTypes";
import { IAttributesValuesDatum } from "@/types/attributeValuesTypes";
import {
  capitalizeOnlyFirstLetter,
  newUserTimeZoneFormatDate,
} from "@/utils/fx";
import { categorySchema } from "@/validation/authValidate";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Dropdown, MenuProps, Popconfirm, PopconfirmProps } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as yup from "yup";
import imgError from "/public/states/notificationToasts/error.svg";
import imgSuccess from "/public/states/notificationToasts/successcheck.svg";
const index = () => {
  const [search, setSearch] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isViewAttributeModal, setIsViewAttributeModal] = useState(false);

  const [formValues, setFormValues] = useState<{
    name: string;
    type?: "number" | "color" | "text" | "date" | "image" | undefined;
    values: string[];
  }>({
    name: "",
    type: undefined,
    values: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const { data, refetch, isLoading } = useGetAllAttributesQuery({
    q: search,
    page: currentPage,
    include: "values",
    per_page: 15,
    paginate: true,
  });
  const [deleteAttributeValue, { isLoading: isDeleteValueLoading }] =
    useDeleteAttributeValueMutation();
  const [createAttributes, { isLoading: isLoadingCreate, error }] =
    useCreateAttributesMutation();
  const [updateAttributes, { isLoading: isLoadingUpdate, error: errorUpdate }] =
    useUpdateAttributesMutation();
  const [deleteAttributes, { isLoading: isDeleteLoading }] =
    useDeleteAttributesMutation();
  const [selectedItem, setSelectedItem] = useState<IAttributesDatum | null>(
    null
  );
  const [selectedValueItem, setSelectedValueItem] =
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
        name: selectedItem.name || "",
        type: selectedItem?.type || undefined,
        values: (selectedItem?.values || []).map((v: any) =>
          typeof v === "string" ? v : v.value ?? v.name ?? v.label ?? String(v)
        ),
      });
    }
  }, [selectedItem, showEditModal]);
  // Keep the selected item in sync with the latest server data while the view modal is open
  useEffect(() => {
    if (!isViewAttributeModal || !selectedItem) return;
    const updated = data?.data?.find((a: any) => a?.id === selectedItem?.id);
    if (updated) {
      setSelectedItem(updated);
    }
  }, [data?.data, isViewAttributeModal]);
  const items: MenuProps["items"] = [
    {
      label: (
        <button
          onClick={() => {
            setIsViewAttributeModal(true);
          }}
          className="flex w-full items-center gap-2"
          type="button"
        >
          View Attribute
        </button>
      ),
      key: "4",
    },
    {
      label: (
        <button
          onClick={() => {
            setShowEditModal(true);
          }}
          className="flex w-full items-center gap-2"
          type="button"
        >
          Edit Attribute
        </button>
      ),
      key: "1",
    },
    {
      label: (
        <button
          onClick={() => {
            router.push(`/products/attributes/values/${selectedItem?.id}`);
          }}
          className="flex w-full items-center gap-2"
          type="button"
        >
          Add Attribute Value
        </button>
      ),
      key: "2",
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
  const transformedData = data?.data?.map((item) => ({
    key: item?.id,
    name: capitalizeOnlyFirstLetter(item?.name),
    type: item?.type,
    values_count: (item as any)?.values.length || 0,
    dateInitiated: newUserTimeZoneFormatDate(item?.created_at, "DD/MM/YYYY"),
    action: (
      <div className="flex items-center space-x-2">
        <Dropdown menu={{ items }} trigger={["click"]}>
          <Icon
            onClick={(e) => {
              e.preventDefault();
              setSelectedItem(item);
            }}
            icon="mdi:dots-vertical-circle-outline"
            width="30"
            height="30"
            className="text-gray-600 cursor-pointer"
          />
        </Dropdown>
      </div>
    ),
  }));
  const handleSubmit = async () => {
    try {
      // Validate form values using yup
      await categorySchema.validate(formValues, {
        abortEarly: false,
      });

      // Clear previous form errors if validation is successful
      setFormErrors({});
      let payload = {
        name: formValues.name,
        type: formValues?.type || "text",
        // Convert IAttributeValue[] to string[] expected by the API
        values: formValues.values.map((v: any) =>
          typeof v === "string" ? v : v.value ?? v.name ?? v.label ?? String(v)
        ),
      };

      // Proceed with server-side submission
      const response = await createAttributes(payload as any).unwrap();
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
      await categorySchema.validate(formValues, {
        abortEarly: false,
      });
      let payload = {
        name: formValues.name,
        type: formValues.type,
        // Convert IAttributeValue[] to string[] expected by the API
        values: formValues.values.map((v: any) =>
          typeof v === "string" ? v : v.value ?? v.name ?? v.label ?? String(v)
        ),
      };

      // Proceed with server-side submission
      const response = await updateAttributes({
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
                    {capitalizeOnlyFirstLetter(selectedItem?.name!)}
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
                      {capitalizeOnlyFirstLetter(selectedItem?.name!)}
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
  const handleDeleteSubmit = async () => {
    try {
      const response = await deleteAttributeValue({
        id: selectedValueItem?.id,
      } as any).unwrap();
      // Optimistically update the selected item's values so the modal reflects the change immediately
      setSelectedItem((prev) => {
        if (!prev) return prev as any;
        const filtered = (prev.values || []).filter(
          (v: any) => v?.id !== selectedValueItem?.id
        );
        return { ...(prev as any), values: filtered } as any;
      });
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={
                <>
                  <span className="font-bold">
                    {capitalizeOnlyFirstLetter(selectedValueItem?.value || "")}
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
    } catch (err: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Error"}
              title={
                <>
                  <span className="font-bold">
                    {capitalizeOnlyFirstLetter(selectedValueItem?.value || "")}
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

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
  };
  return (
    <div className={``}>
      <Header
        search={search}
        setSearch={setSearch}
        placeHolderText="Search Attributes"
        showSearch={true}
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="Attributes"
        btnText="Create Attribute"
        onClick={() => {
          setIsOpenModal(true);
          setFormValues({
            name: "",
            type: undefined,
            values: [],
          });
        }}
      />
      <SharedLayout className="bg-white">
        <>
          {isLoading ? (
            <SkeletonLoaderForPage />
          ) : (
            <>
              <TableMainComponent
                DeleteModalText={selectedItem?.name}
                data={selectedItem}
                deleteCardApi={deleteAttributes}
                isDeleteLoading={isDeleteLoading}
                showDeleteModal={showDeleteModal}
                refetch={refetch}
                formValues={formValues}
                setShowDeleteModal={setShowDeleteModal}
                isLoading={isLoading}
                columnsTable={columnsTable as any}
                transformedData={transformedData}
              />
              <hr />

              <div className="py-8 flex justify-end items-center  w-full">
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
        </>
      </SharedLayout>
      {isOpenModal && (
        <PlannerModal
          modalOpen={isOpenModal}
          setModalOpen={setIsOpenModal}
          className=""
          title="Create Attribute"
          onCloseModal={() => setIsOpenModal(false)}
        >
          <AttributeForm
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
          className=""
          title="Edit Attribute"
          onCloseModal={() => setShowEditModal(false)}
        >
          <AttributeForm
            isEditing={true}
            error={errorUpdate}
            btnText="Edit Attribute"
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
      {isViewAttributeModal && (
        <PlannerModal
          modalOpen={isViewAttributeModal}
          setModalOpen={setIsViewAttributeModal}
          className=""
          width={850}
          title="View Attribute"
          onCloseModal={() => setIsViewAttributeModal(false)}
        >
          {/* Cards Grid */}
          <div className="bg-gray-50 p-4 mb-6 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="text-gray-500 text-sm">Name</h4>
                <p className="font-medium">{selectedItem?.name}</p>
              </div>
              <div>
                <h4 className="text-gray-500 text-sm">Value Count</h4>
                <p className="font-medium">
                  {selectedItem?.values.length || 0}
                </p>
              </div>
              <div>
                <h4 className="text-gray-500 text-sm">Date Created</h4>
                <p className="font-medium">
                  {newUserTimeZoneFormatDate(
                    selectedItem?.created_at!,
                    "DD/MM/YYYY"
                  )}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-gray-500 text-sm">Type</h4>
              <p className="font-medium">{selectedItem?.type}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedItem?.values.length ? (
              selectedItem?.values.map((item: IAttributeValue) => (
                <div
                  key={item.id}
                  className="group relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-primary-40/30 transition-all duration-300 p-4"
                >
                  {/* Actions */}
                  <div className="absolute top-2 right-2">
                    <Popconfirm
                      title="Delete the value"
                      description="Are you sure to delete this attribute value?"
                      onConfirm={handleDeleteSubmit}
                      onCancel={cancel}
                      okButtonProps={{ loading: isDeleteValueLoading }}
                      okText="Yes"
                      cancelText="No"
                    >
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedValueItem(item as any);
                        }}
                        className="p-1.5 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                        title="Actions"
                        type="button"
                      >
                        <Icon
                          icon="ic:baseline-delete"
                          className="text-red-500"
                          width="22"
                          height="22"
                        />
                      </button>
                    </Popconfirm>
                  </div>

                  {/* Value */}
                  <div className="">
                    <div className="text-lg font-semibold text-gray-900">
                      {capitalizeOnlyFirstLetter(item.value)}
                    </div>
                    {item.value && (
                      <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-primary-40/10 text-primary-40">
                        <Icon icon="mdi:tag-outline" width="14" height="14" />
                        {selectedItem?.name}
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
        </PlannerModal>
      )}
    </div>
  );
};

export default index;
