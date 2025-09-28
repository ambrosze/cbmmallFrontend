import AttributeHeader from "@/components/Attributes/AttributeHeader";
import TableMainComponent from "@/components/Attributes/TableMainComponent";

import { CustomerForm } from "@/components/Forms/CustomerForm";
import Header from "@/components/header";
import {
  customerColumns,
  storesColumns,
} from "@/components/Items/itemsColumns";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import PaginationComponent from "@/components/sharedUI/PaginationComponent";
import PlannerModal from "@/components/sharedUI/PlannerModal";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";
import {
  useCreateCustomerMutation,
  useDeleteCustomerMutation,
  useGetAllCustomersQuery,
  useUpdateCustomerMutation,
} from "@/services/customers";
import { IStoreDatum } from "@/types/storeTypes";
import {
  capitalizeOnlyFirstLetter,
  newUserTimeZoneFormatDate,
} from "@/utils/fx";
import { customerSchema } from "@/validation/authValidate";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Dropdown, MenuProps } from "antd";
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
    name: "",
    email: "",
    phone_number: "",
    country: "",
    city: "",
    address: "",
  });
  const [selectedItem, setSelectedItem] = useState<IStoreDatum | null>(null);
  console.log("🚀 ~ index ~ selectedItem:", selectedItem);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [createCustomer, { isLoading: isLoadingCreate, error }] =
    useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isLoadingUpdate, error: errorUpdate }] =
    useUpdateCustomerMutation();

  const { data, refetch, isLoading } = useGetAllCustomersQuery({
    q: search,
    page: currentPage,
    per_page: 15,
    paginate: true,
  });
  console.log("🚀 ~ index ~ data:", data);

  const [deleteCustomer, { isLoading: isDeleteLoading }] =
    useDeleteCustomerMutation();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    if (selectedItem && showEditModal) {
      setFormValues({
        name: selectedItem?.name || "",
        address: selectedItem?.address || "",
        email: selectedItem?.email || "",
        phone_number: selectedItem?.phone_number || "",
        country: selectedItem?.country || "",
        city: selectedItem?.city || "",
      });
    }
  }, [selectedItem, showEditModal]);

  useEffect(() => {
    if (!showEditModal && !isOpenModal) {
      setFormValues({
        name: "",
        address: "",
        email: "",
        phone_number: "",
        country: "",
        city: "",
      });
    }
  }, [showEditModal, isOpenModal]);
  const transformedData = data?.data?.map((item) => ({
    key: item?.id,
    name: (
      <div className="flex items-center gap-2 font-semibold">{item?.name}</div>
    ),
    email: <div className="flex items-center gap-2">{item?.email || "-"}</div>,
    phone_number: (
      <div className="flex items-center gap-2">{item?.phone_number || "-"}</div>
    ),
    phone_number_text: item?.phone_number || "-",
    email_text: item?.email || "-",
    country_text: item?.country || "-",
    city_text: item?.city || "-",
    country: (
      <div className="flex items-center gap-2">{item?.country || "-"}</div>
    ),
    city: <div className="flex items-center gap-2">{item?.city || "-"}</div>,

    // Export-friendly version
    name_text: item?.name,
    address: (
      <div className="flex items-center gap-2">{item?.address || "-"}</div>
    ),
    // Export-friendly version
    address_text: item?.address || "-",

    dateInitiated: newUserTimeZoneFormatDate(item?.created_at, "DD/MM/YYYY"),
    action: (
      <div className="flex items-center space-x-2">
        {(() => {
          const items: MenuProps["items"] = [
            {
              label: (
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setShowEditModal(true);
                  }}
                  className="flex w-full items-center gap-2"
                  type="button"
                >
                  Edit
                </button>
              ),
              key: "edit",
            },
            {
              label: (
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setShowDeleteModal(true);
                  }}
                  className="flex w-full items-center text-red-500 gap-2"
                  type="button"
                >
                  Delete
                </button>
              ),
              key: "delete",
            },
          ];
          return (
            <Dropdown menu={{ items }} trigger={["click"]}>
              <Icon
                onClick={(e) => {
                  e.preventDefault();
                }}
                icon="mdi:dots-vertical-circle-outline"
                width="30"
                height="30"
                className="text-gray-600 cursor-pointer"
              />
            </Dropdown>
          );
        })()}
      </div>
    ),
    // action: (
    //   <div className="flex items-center space-x-2">
    //     <Tooltip title="Delete">
    //       <span
    //         onClick={() => {
    //           setSelectedItem(item);
    //           setShowDeleteModal(true);
    //         }}
    //         className={`cursor-pointer hover:opacity-80 duration-150 ease-in-out font-semibold text-sm px-4 rounded-full text-red-500 underline py-2`}
    //       >
    //         <Icon
    //           className="text-red-500 cursor-pointer"
    //           icon="gg:trash"
    //           width="30"
    //           height="30"
    //         />
    //       </span>
    //     </Tooltip>

    //     <Tooltip title="Edit">
    //       <span
    //         onClick={() => {
    //           setSelectedItem(item!);
    //           setShowEditModal(true);
    //         }}
    //         className={`cursor-pointer hover:opacity-80 duration-150 ease-in-out font-semibold text-sm px-4 rounded-full text-blue-500 underline py-2`}
    //       >
    //         <Icon
    //           className="text-primary-40 cursor-pointer"
    //           icon="line-md:pencil"
    //           width="30"
    //           height="30"
    //         />
    //       </span>
    //     </Tooltip>
    //   </div>
    // ),
  }));
  // Create export columns with text versions
  const exportColumns = storesColumns
    .filter(
      (column: any) => column.key !== "action" && column.dataIndex !== "action"
    )
    .map((column: any) => {
      // Map complex fields to their text versions
      if (column.dataIndex === "name") {
        return { ...column, dataIndex: "name_text" };
      }
      if (column.dataIndex === "email") {
        return { ...column, dataIndex: "email_text" };
      }
      if (column.dataIndex === "phone_number") {
        return { ...column, dataIndex: "phone_number_text" };
      }
      if (column.dataIndex === "country") {
        return { ...column, dataIndex: "country_text" };
      }
      if (column.dataIndex === "city") {
        return { ...column, dataIndex: "city_text" };
      }
      if (column.dataIndex === "address") {
        return { ...column, dataIndex: "address_text" };
      }
      if (column.dataIndex === "is_warehouse") {
        return { ...column, dataIndex: "is_warehouse_text" };
      }
      return column;
    });
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch();
  };

  const handleSubmit = async () => {
    try {
      // Validate form values using yup
      await customerSchema.validate(formValues, {
        abortEarly: false,
      });

      // Clear previous form errors if validation is successful
      setFormErrors({});
      let payload = {
        name: formValues.name,
        email: formValues.email,
        phone_number: formValues.phone_number,
        country: formValues.country,
        city: formValues.city,
        address: formValues.address,
      };

      // Proceed with server-side submission
      const response = await createCustomer(payload).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={"Customer Created Successfully"}
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
                title={"Customer Creation Failed"}
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
      await customerSchema.validate(formValues, {
        abortEarly: false,
      });

      // Clear previous form errors if validation is successful
      setFormErrors({});
      let payload = {
        name: formValues.name,
        email: formValues.email,
        phone_number: formValues.phone_number,
        country: formValues.country,
        city: formValues.city,
        address: formValues.address,
      };

      // Proceed with server-side submission
      const response = await updateCustomer({
        id: selectedItem?.id!,
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
      setIsOpenModal(false);
      setShowEditModal(false);
      setSelectedItem(null);
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
  return (
    <div className={``}>
      <Header
        search={search}
        setSearch={setSearch}
        showSearch={true}
        placeHolderText="Search customers"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="All Customers"
        btnText="Create Customer"
        onClick={() => {
          setIsOpenModal(true);
          setFormValues({
            name: "",
            address: "",
            email: "",
            phone_number: "",
            country: "",
            city: "",
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
                <>{capitalizeOnlyFirstLetter(selectedItem?.name!)}</>
              }
              data={selectedItem}
              deleteCardApi={deleteCustomer}
              isDeleteLoading={isDeleteLoading}
              printTitle="Customers"
              showExportButton={true}
              showPrintButton={true}
              showDeleteModal={showDeleteModal}
              refetch={refetch}
              formValues={formValues}
              setShowDeleteModal={setShowDeleteModal}
              isLoading={false}
              columnsTable={customerColumns as any}
              exportColumns={exportColumns as any}
              transformedData={transformedData}
            />
          </>
        )}
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
      </SharedLayout>
      {isOpenModal && (
        <PlannerModal
          modalOpen={isOpenModal}
          setModalOpen={setIsOpenModal}
          className=""
          width={600}
          title="Create Store"
          onCloseModal={() => setIsOpenModal(false)}
        >
          <CustomerForm
            error={error}
            btnText="Create Customer"
            formErrors={formErrors}
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
          width={600}
          title="Edit Customer"
          onCloseModal={() => {
            setShowEditModal(false);
            setSelectedItem(null);
          }}
        >
          <CustomerForm
            error={errorUpdate}
            setFormValues={setFormValues}
            btnText="Edit Customer"
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
