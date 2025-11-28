import AttributeHeader from "@/components/Attributes/AttributeHeader";
import TableMainComponent from "@/components/Attributes/TableMainComponent";
import { StaffForm } from "@/components/Forms/StaffForm";
import Header from "@/components/header";
import { staffsColumns } from "@/components/Items/itemsColumns";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import PaginationComponent from "@/components/sharedUI/PaginationComponent";
import PlannerModal from "@/components/sharedUI/PlannerModal";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";
import { useGetAllRolesQuery } from "@/services/admin/role";
import {
  useCreateStaffMutation,
  useDeleteStaffMutation,
  useGetAllStaffQuery,
  useUpdateStaffMutation,
} from "@/services/admin/staff";
import { useGetAllStoresQuery } from "@/services/admin/store";
import { IStaffDatum } from "@/types/staffTypes";
import debounce from "@/utils/debounce";
import {
  capitalizeOnlyFirstLetter,
  formatPhoneNumber,
  newUserTimeZoneFormatDate,
} from "@/utils/fx";
import { staffSchema } from "@/validation/authValidate";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Tooltip } from "antd";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import imgError from "/public/states/notificationToasts/error.svg";
import imgSuccess from "/public/states/notificationToasts/successcheck.svg";
const index = () => {
  const [search, setSearch] = useState("");
  const [selectedFilterTypes, setSelectedFilterTypes] = useState<any>(null);
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    phone_number: "",
    role_id: "",
    store_id: "",
  });
  const [selectedItem, setSelectedItem] = useState<IStaffDatum | null>(null);
  console.log("🚀 ~ index ~ selectedItem:", selectedItem);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [createStaff, { isLoading: isLoadingCreate, error }] =
    useCreateStaffMutation();
  const [updateStaff, { isLoading: isLoadingUpdate, error: errorUpdate }] =
    useUpdateStaffMutation();
  const [storeSearch, setStoreSearch] = useState<string>("");
  const [rolesSearch, setRolesSearch] = useState<string>("");

  const { data, refetch, isLoading } = useGetAllStaffQuery({
    q: search,
    page: currentPage,
    include: "user,store",
    per_page: 15,
    paginate: true,
  });
  const { data: storesData } = useGetAllStoresQuery({
    q: storeSearch,
    page: currentPage,
    // include: "manager",
    per_page: 50,
    paginate: true,
  });
  const { data: rolesData } = useGetAllRolesQuery({
    q: rolesSearch,
    page: currentPage,
    per_page: 50,
    paginate: true,
  });
  const [deleteStaff, { isLoading: isDeleteLoading }] =
    useDeleteStaffMutation();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };
  const debouncedStoreSearch = useMemo(
    () => debounce((q: string) => setStoreSearch(q.trim()), 400),
    []
  );
  const debouncedRolesSearch = useMemo(
    () => debounce((q: string) => setRolesSearch(q.trim()), 400),
    []
  );
  useEffect(() => {
    if (selectedItem && showEditModal) {
      setFormValues({
        first_name: selectedItem?.user?.first_name || "",
        last_name: selectedItem?.user?.last_name || "",
        middle_name: selectedItem?.user?.middle_name || "",
        email: selectedItem?.user?.email || "",
        phone_number: selectedItem?.user?.phone_number || "",
        role_id: (selectedItem as any)?.role?.id || "",
        store_id: selectedItem?.store?.id || "",
      });
    }
  }, [selectedItem, showEditModal]);
  const transformedData = data?.data?.map((item) => ({
    key: item?.id,
    name: (
      <div className="flex items-center gap-2">
        {item?.user?.first_name} {item?.user?.last_name}
      </div>
    ),
    // Export-friendly version
    name_text: `${item?.user?.first_name} ${item?.user?.last_name}`,
    email: (
      <div className="flex items-center gap-2">{item?.user?.email || "-"}</div>
    ),
    // Export-friendly version
    email_text: item?.user?.email || "-",
    phone_number: (
      <div className="flex items-center gap-2">
        {formatPhoneNumber(item?.user?.phone_number)}
      </div>
    ),
    // Export-friendly version
    phone_number_text: item?.user?.phone_number || "-",
    staff_no: <span className=" font-[500]">{item?.staff_no || "-"}</span>,
    // Export-friendly version
    staff_no_text: item?.staff_no || "-",
    store_name: <span className=" font-[500]">{item?.store?.name || "-"}</span>,
    // Export-friendly version
    store_name_text: item?.store?.name || "-",
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
              setSelectedItem(item);
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
  const storeList = storesData?.data.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  const roleList = rolesData?.data.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  const handleSubmit = async () => {
    try {
      // Validate form values using yup
      await staffSchema.validate(formValues, {
        abortEarly: false,
      });

      // Clear previous form errors if validation is successful
      setFormErrors({});
      let payload = {
        first_name: formValues.first_name,
        last_name: formValues.last_name,
        email: formValues.email,
        phone_number: formValues.phone_number,
        store_id: formValues.store_id,
        ...(formValues.middle_name && { middle_name: formValues.middle_name }),
        ...(formValues.role_id && { role_id: formValues.role_id }),
      };

      // remove middle name if it is empty

      // Proceed with server-side submission
      const response = await createStaff(payload).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={"Staff Created Successfully"}
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
                title={"Staff Creation Failed"}
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
      await staffSchema.validate(formValues, {
        abortEarly: false,
      });

      // Clear previous form errors if validation is successful
      setFormErrors({});
      let payload = {
        first_name: formValues.first_name,
        last_name: formValues.last_name,
        email: formValues.email,
        phone_number: formValues.phone_number,
        store_id: formValues.store_id,
        ...(formValues.middle_name && { middle_name: formValues.middle_name }),
        ...(formValues.role_id && { role_id: formValues.role_id }),
      };

      // Proceed with server-side submission
      const response = await updateStaff({
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
                    {capitalizeOnlyFirstLetter(
                      selectedItem?.user?.first_name!
                    ) +
                      " " +
                      capitalizeOnlyFirstLetter(selectedItem?.user?.last_name!)}
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
                      {capitalizeOnlyFirstLetter(
                        selectedItem?.user?.first_name!
                      ) +
                        " " +
                        capitalizeOnlyFirstLetter(
                          selectedItem?.user?.last_name!
                        )}
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
  const exportColumns = staffsColumns
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
      if (column.dataIndex === "staff_no") {
        return { ...column, dataIndex: "staff_no_text" };
      }
      if (column.dataIndex === "store_name") {
        return { ...column, dataIndex: "store_name_text" };
      }
      return column;
    });
  return (
    <div className={``}>
      <Header
        search={search}
        setSearch={setSearch}
        showSearch={true}
        placeHolderText="Search staff"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="All Staffs"
        btnText="Create Staff"
        onClick={() => {
          setIsOpenModal(true);
          setFormValues({
            first_name: "",
            last_name: "",
            middle_name: "",
            email: "",
            phone_number: "",
            role_id: "",
            store_id: "",
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
                <>
                  {capitalizeOnlyFirstLetter(selectedItem?.user?.first_name!)}{" "}
                  {capitalizeOnlyFirstLetter(selectedItem?.user?.last_name!)}
                </>
              }
              data={selectedItem}
              deleteCardApi={deleteStaff}
              isDeleteLoading={isDeleteLoading}
              printTitle="Staff Members"
              showExportButton={true}
              showPrintButton={true}
              showDeleteModal={showDeleteModal}
              refetch={refetch}
              formValues={formValues}
              setShowDeleteModal={setShowDeleteModal}
              isLoading={false}
              columnsTable={staffsColumns as any}
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
        {/* <EmptyState textHeader="This place is empty, Add a new item, to see all your products here">
          <div className="flex justify-center items-center gap-3 mt-8">
            <div className="">
              <CustomButton
                onClick={() => {
                  router.push("/items/add-items");
                }}
                type="button"
                className="border bg-primary-40 flex justify-center items-center gap-2 text-white"
              >
                <Icon icon="line-md:plus" width="20" height="20" />
                New Item
              </CustomButton>
            </div>
            <div>
              {" "}
              <CustomButton
                onClick={() => {}}
                type="button"
                className="border border-black"
              >
                Import
              </CustomButton>
            </div>
          </div>
        </EmptyState> */}
      </SharedLayout>
      {isOpenModal && (
        <PlannerModal
          modalOpen={isOpenModal}
          setModalOpen={setIsOpenModal}
          className=""
          width={600}
          title="Create Staff"
          onCloseModal={() => setIsOpenModal(false)}
        >
          <StaffForm
            error={error}
            roleData={roleList}
            debouncedRolesSearch={debouncedRolesSearch}
            debouncedStoreSearch={debouncedStoreSearch}
            storeData={storeList}
            btnText="Create staff"
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
          title="Edit Staff"
          onCloseModal={() => setShowEditModal(false)}
        >
          <StaffForm
            roleData={roleList}
            debouncedRolesSearch={debouncedRolesSearch}
            debouncedStoreSearch={debouncedStoreSearch}
            storeData={storeList}
            error={errorUpdate}
            setFormValues={setFormValues}
            btnText="Edit Staff"
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
