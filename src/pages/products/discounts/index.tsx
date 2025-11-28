import AttributeHeader from "@/components/Attributes/AttributeHeader";
import TableMainComponent from "@/components/Attributes/TableMainComponent";

import Header from "@/components/header";
import { adminDiscountColumns } from "@/components/Items/itemsColumns";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import PaginationComponent from "@/components/sharedUI/PaginationComponent";
import PlannerModal from "@/components/sharedUI/PlannerModal";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";

import { DiscountForm } from "@/components/Forms/DiscountForm";
import {
  useCreateDiscountAdminMutation,
  useDeleteDiscountAdminMutation,
  useGetAllDiscountAdminQuery,
  useUpdateDiscountAdminMutation,
} from "@/services/admin/discount";
import { useGetAllCategoryQuery } from "@/services/category";
import { AdminDiscountDatum } from "@/types/discountTypes";
import {
  capitalizeOnlyFirstLetter,
  newUserTimeZoneFormatDate,
} from "@/utils/fx";
import { adminDiscountSchema } from "@/validation/authValidate";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Tooltip } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as yup from "yup";
import imgError from "/public/states/notificationToasts/error.svg";
import imgSuccess from "/public/states/notificationToasts/successcheck.svg";
const index = () => {
  const [search, setSearch] = useState("");
  const [selectedFilterTypes, setSelectedFilterTypes] = useState<any>(null);
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    code: "",
    description: "",
    percentage: "",
    expires_at: "",
    is_active: 1, // Changed from number 1 to string '1'
  });
  const [selectedItem, setSelectedItem] = useState<AdminDiscountDatum | null>(
    null
  );
  console.log("🚀 ~ index ~ selectedItem:", selectedItem);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [createDiscountAdmin, { isLoading: isLoadingCreate, error }] =
    useCreateDiscountAdminMutation();
  const [
    updateDiscountAdmin,
    { isLoading: isLoadingUpdate, error: errorUpdate },
  ] = useUpdateDiscountAdminMutation();

  const { data, refetch, isLoading } = useGetAllDiscountAdminQuery({
    paginate: true,
    per_page: 15,
    page: currentPage,
    q: search,
    // filter: {
    //   is_active: "1",
    // },
  });

  console.log("🚀 ~ index ~ data:", data);

  const {
    data: getAllCategory,
    refetch: refetchCategory,
    isLoading: isLoadingCategory,
  } = useGetAllCategoryQuery({
    q: search,
    paginate: false,
  });
  const [deleteDiscountAdmin, { isLoading: isDeleteLoading }] =
    useDeleteDiscountAdminMutation();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const transformedData = data?.data?.map((item) => ({
    key: item?.id,
    code: <div className="flex items-center gap-2">{item?.code}</div>,
    // Export-friendly version
    code_text: item?.code,
    description: (
      <div className="flex items-center gap-2">
        {item?.description ?? "N/A"}
      </div>
    ),
    // Export-friendly version
    description_text: item?.description ?? "N/A",
    percentage: (
      <div className="flex items-center gap-2">{item?.percentage}</div>
    ),
    // Export-friendly version
    percentage_text: item?.percentage,
    expiry_date: (
      <div className="flex items-center gap-2">{item?.expires_at ?? "N/A"}</div>
    ),
    // Export-friendly version
    expiry_date_text: item?.expires_at ?? "N/A",
    is_active: (
      <div className="flex items-center font-[500] gap-2">
        {item?.is_active === 1 ? (
          <span className="text-green-500">Active</span>
        ) : (
          <span className="text-red-500">Inactive</span>
        )}
      </div>
    ),
    // Export-friendly version
    is_active_text: item?.is_active === 1 ? "Active" : "Inactive",
    dateInitiated: newUserTimeZoneFormatDate(item?.created_at, "DD/MM/YYYY"),
    action: (
      <div className="flex items-center space-x-2">
        <Tooltip title="Delete">
          <span
            onClick={() => {
              setSelectedItem(item);
              setShowDeleteModal(true);
            }}
            className={`cursor-pointer hover:opacity-80 duration-150 ease-in-out font-semibold text-sm px-4 rounded-full text-red-500 underline py-2`}
          >
            <Icon
              className="text-red-500 cursor-pointer"
              icon="gg:trash"
              width="30"
              height="30"
            />
          </span>
        </Tooltip>

        <Tooltip title="Edit">
          <span
            onClick={() => {
              const itemToEdit = item; // Store the item in a local variable
              setSelectedItem(itemToEdit);
              // Directly set form values here to ensure correct data is used
              setFormValues({
                code: itemToEdit.code,
                description: itemToEdit.description ?? "",
                percentage: itemToEdit.percentage ?? "",
                expires_at: itemToEdit.expires_at ?? "",
                is_active: itemToEdit.is_active ?? 1,
              });
              setShowEditModal(true);
            }}
            className={`cursor-pointer hover:opacity-80 duration-150 ease-in-out font-semibold text-sm px-4 rounded-full text-blue-500 underline py-2`}
          >
            <Icon
              className="text-primary-40 cursor-pointer"
              icon="line-md:pencil"
              width="30"
              height="30"
            />
          </span>
        </Tooltip>
      </div>
    ),
  }));
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch();
  };
  const transformedCategoryData = getAllCategory?.data.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  useEffect(() => {
    // This useEffect can be removed if the direct form update in the onClick handler is working
    // Keeping it as a backup with a more specific check
    if (selectedItem && showEditModal) {
      // Use a timeout to ensure this runs after the state updates
      setTimeout(() => {
        setFormValues({
          code: selectedItem.code,
          description: selectedItem.description ?? "",
          percentage: selectedItem.percentage ?? "",
          expires_at: selectedItem.expires_at ?? "",
          is_active: selectedItem.is_active,
        });
      }, 0);
    }
  }, [selectedItem, showEditModal]);
  const handleSubmit = async () => {
    try {
      // Validate form values using yup
      await adminDiscountSchema.validate(formValues, {
        abortEarly: false,
      });

      // Clear previous form errors if validation is successful
      setFormErrors({});
      let payload = {
        code: formValues.code,
        description: formValues.description,
        percentage: formValues.percentage,
        expires_at: formValues.expires_at,
        is_active: formValues.is_active,
      };

      // remove middle name if it is empty

      // Proceed with server-side submission
      const response = await createDiscountAdmin(payload).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={"Discount Created Successfully"}
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
                title={"Daily Gold Price Creation Failed"}
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
      await adminDiscountSchema.validate(formValues, {
        abortEarly: false,
      });

      // Clear previous form errors if validation is successful
      setFormErrors({});
      let payload = {
        code: formValues.code,
        description: formValues.description,
        percentage: formValues.percentage,
        expires_at: formValues.expires_at,
        is_active: formValues.is_active,
      };

      // Proceed with server-side submission
      const response = await updateDiscountAdmin({
        discount_id: selectedItem?.id!,
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
                    {capitalizeOnlyFirstLetter(selectedItem?.code!)} Discount
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
      setIsOpenModal(false);
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
                      {capitalizeOnlyFirstLetter(selectedItem?.code!)} Discount
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
  // Create export columns with text versions
  const exportColumns = adminDiscountColumns
    .filter(
      (column: any) => column.key !== "action" && column.dataIndex !== "action"
    )
    .map((column: any) => {
      // Map complex fields to their text versions
      if (column.dataIndex === "code") {
        return { ...column, dataIndex: "code_text" };
      }
      if (column.dataIndex === "description") {
        return { ...column, dataIndex: "description_text" };
      }
      if (column.dataIndex === "percentage") {
        return { ...column, dataIndex: "percentage_text" };
      }
      if (column.dataIndex === "expiry_date") {
        return { ...column, dataIndex: "expiry_date_text" };
      }
      if (column.dataIndex === "is_active") {
        return { ...column, dataIndex: "is_active_text" };
      }
      return column;
    });
  return (
    <div className={``}>
      <Header
        search={search}
        setSearch={setSearch}
        showSearch={true}
        placeHolderText="Search for discounts"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="Discounts"
        btnText="Create Discount"
        onClick={() => {
          setIsOpenModal(true);
          setFormValues({
            code: "",
            description: "",
            percentage: "",
            expires_at: "",
            is_active: 1,
          });
        }}
      />
      <SharedLayout className="bg-white">
        {isLoading ? (
          <SkeletonLoaderForPage />
        ) : (
          <>
            <TableMainComponent
              DeleteModalText={
                <>{capitalizeOnlyFirstLetter(selectedItem?.code!)}</>
              }
              data={selectedItem}
              deleteCardApi={deleteDiscountAdmin}
              isDeleteLoading={isDeleteLoading}
              printTitle="Discounts"
              showExportButton={true}
              showPrintButton={true}
              showDeleteModal={showDeleteModal}
              refetch={refetch}
              formValues={formValues}
              setShowDeleteModal={setShowDeleteModal}
              isLoading={false}
              columnsTable={adminDiscountColumns as any}
              exportColumns={exportColumns as any}
              transformedData={transformedData}
            />
          </>
        )}
        <div className="flex lg:justify-between justify-end  items-center w-full py-10">
          {(currentPage === 1 && data?.meta?.total! >= 10) ||
          (currentPage > 1 && data?.meta?.total! >= 1) ? (
            <div className={`text-sm hidden lg:block font-[500] text-black`}>
              Showing {(currentPage - 1) * data?.meta?.per_page! + 1} to{" "}
              {Math.min(
                currentPage * data?.meta?.per_page!,
                data?.meta?.total!
              )}{" "}
              of {data?.meta?.total!} results
            </div>
          ) : null}
          {(currentPage === 1 && data?.meta?.total! >= 10) ||
          (currentPage > 1 && data?.meta?.total! >= 1) ? (
            <div className="">
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
            </div>
          ) : null}
        </div>
      </SharedLayout>
      {isOpenModal && (
        <PlannerModal
          modalOpen={isOpenModal}
          setModalOpen={setIsOpenModal}
          className=""
          width={500}
          title="Create Discount"
          onCloseModal={() => setIsOpenModal(false)}
        >
          <DiscountForm
            error={error}
            btnText="Create Discount"
            formErrors={formErrors}
            transformedCategoryData={transformedCategoryData}
            formValues={formValues}
            setFormValues={setFormValues}
            handleInputChange={handleInputChange}
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
          width={500}
          title="Edit Discount"
          onCloseModal={() => setShowEditModal(false)}
        >
          <DiscountForm
            error={errorUpdate}
            transformedCategoryData={transformedCategoryData}
            setFormValues={setFormValues}
            btnText="Edit Discount"
            formErrors={formErrors}
            formValues={formValues}
            handleInputChange={handleInputChange}
            handleSubmit={handleUpdateSubmit}
            isLoadingCreate={isLoadingUpdate}
            setIsOpenModal={setShowEditModal}
          />
        </PlannerModal>
      )}
    </div>
  );
};

export default index;
