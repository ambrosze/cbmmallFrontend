import AttributeHeader from "@/components/Attributes/AttributeHeader";
import TableMainComponent from "@/components/Attributes/TableMainComponent";

import { StoreForm } from "@/components/Forms/StoreForm";
import Header from "@/components/header";
import { storesColumns } from "@/components/Items/itemsColumns";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import PaginationComponent from "@/components/sharedUI/PaginationComponent";
import PlannerModal from "@/components/sharedUI/PlannerModal";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";
import {
  useDeleteStaffMutation,
  useGetAllStaffQuery,
} from "@/services/admin/staff";
import {
  useCreateStoreMutation,
  useGetAllStoresQuery,
  useUpdateStoreMutation,
} from "@/services/admin/store";
import { IStoreDatum } from "@/types/storeTypes";
import {
  capitalizeOnlyFirstLetter,
  newUserTimeZoneFormatDate,
} from "@/utils/fx";
import { storeSchema } from "@/validation/authValidate";
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
    name: "",
    address: "",
    manager_staff_id: "",
    is_headquarters: 0,
  });
  const [selectedItem, setSelectedItem] = useState<IStoreDatum | null>(null);
  console.log("🚀 ~ index ~ selectedItem:", selectedItem);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [createStore, { isLoading: isLoadingCreate, error }] =
    useCreateStoreMutation();
  const [updateStore, { isLoading: isLoadingUpdate, error: errorUpdate }] =
    useUpdateStoreMutation();
  const [checked, setChecked] = useState(false);
  console.log("🚀 ~ index ~ checked:", checked);

  const { data, refetch, isLoading } = useGetAllStoresQuery({
    q: search,
    page: currentPage,
    per_page: 15,
    paginate: true,
  });
  console.log("🚀 ~ index ~ data:", data);
  const {
    data: allStaff,
    refetch: refetchStaff,
    isLoading: isLoadingStaff,
  } = useGetAllStaffQuery({
    q: search,
    page: currentPage,
    include: "user,managedStore,store",
    per_page: 15,
    paginate: false,
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
  useEffect(() => {
    if (selectedItem && showEditModal) {
      setFormValues({
        name: selectedItem?.name || "",
        address: selectedItem?.address || "",
        manager_staff_id: selectedItem?.manager_staff_id || "",
        is_headquarters: selectedItem?.is_headquarters || 0,
      });
      setChecked(
        (selectedItem as any)?.is_headquarters === "1" ||
          (selectedItem as any)?.is_headquarters === 1
      );
    }
  }, [selectedItem, showEditModal]);

  useEffect(() => {
    if (!showEditModal && !isOpenModal) {
      setChecked(false);
      setFormValues({
        name: "",
        address: "",
        manager_staff_id: "",
        is_headquarters: 0,
      });
    }
  }, [showEditModal, isOpenModal]);
  const transformedData = data?.data?.map((item) => ({
    key: item?.id,
    name: <div className="flex items-center gap-2">{item?.name}</div>,
    // Export-friendly version
    name_text: item?.name,
    address: (
      <div className="flex items-center gap-2">{item?.address || "-"}</div>
    ),
    // Export-friendly version
    address_text: item?.address || "-",
    is_headquarters: (
      <div className="flex items-center gap-2">
        {(item as any)?.is_headquarters === "1" ||
        (item as any)?.is_headquarters === 1 ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-md">
              <Icon icon="mdi:crown" className="mr-1" width="14" height="14" />
              Headquarters
            </span>
          </div>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            Branch
          </span>
        )}
      </div>
    ),
    // Export-friendly version
    is_headquarters_text:
      (item as any)?.is_headquarters === "1" ||
      (item as any)?.is_headquarters === 1
        ? "Headquarters"
        : "Branch",
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
              setSelectedItem(item!);
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
      if (column.dataIndex === "address") {
        return { ...column, dataIndex: "address_text" };
      }
      if (column.dataIndex === "is_headquarters") {
        return { ...column, dataIndex: "is_headquarters_text" };
      }
      return column;
    });
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch();
  };
  const staffList = allStaff?.data.map((item) => {
    return {
      label:
        capitalizeOnlyFirstLetter(item.user?.first_name) +
        " " +
        capitalizeOnlyFirstLetter(item.user?.last_name),
      value: item.id,
    };
  });

  const handleSubmit = async () => {
    try {
      // Validate form values using yup
      await storeSchema.validate(formValues, {
        abortEarly: false,
      });

      // Clear previous form errors if validation is successful
      setFormErrors({});
      let payload = {
        name: formValues.name,
        ...(formValues.manager_staff_id && {
          manager_staff_id: formValues.manager_staff_id,
        }),
        ...(formValues.address && { address: formValues.address }),
        is_headquarters: checked ? 1 : 0,
      };

      // remove middle name if it is empty

      // Proceed with server-side submission
      const response = await createStore(payload).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={"Store Created Successfully"}
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
                title={"Store Creation Failed"}
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
      await storeSchema.validate(formValues, {
        abortEarly: false,
      });

      // Clear previous form errors if validation is successful
      setFormErrors({});
      let payload = {
        name: formValues.name,
        ...(formValues.manager_staff_id && {
          manager_staff_id: formValues.manager_staff_id,
        }),
        ...(formValues.address && { address: formValues.address }),
        is_headquarters: checked ? 1 : 0,
      };

      // Proceed with server-side submission
      const response = await updateStore({
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
        placeHolderText="Search stores"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="All Stores"
        btnText="Create Store"
        onClick={() => {
          setIsOpenModal(true);
          setChecked(false);
          setFormValues({
            name: "",
            address: "",
            manager_staff_id: "",
            is_headquarters: 0,
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
              deleteCardApi={deleteStaff}
              isDeleteLoading={isDeleteLoading}
              printTitle="Stores"
              showExportButton={true}
              showPrintButton={true}
              showDeleteModal={showDeleteModal}
              refetch={refetch}
              formValues={formValues}
              setShowDeleteModal={setShowDeleteModal}
              isLoading={false}
              columnsTable={storesColumns as any}
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
          title="Create Store"
          onCloseModal={() => setIsOpenModal(false)}
        >
          <StoreForm
            error={error}
            setChecked={setChecked}
            checked={checked}
            staffList={staffList}
            btnText="Create Store"
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
          title="Edit Store"
          onCloseModal={() => {
            setShowEditModal(false);
            setChecked(false);
            setSelectedItem(null);
          }}
        >
          <StoreForm
            setChecked={setChecked}
            checked={checked}
            staffList={staffList}
            error={errorUpdate}
            setFormValues={setFormValues}
            btnText="Edit Store"
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
