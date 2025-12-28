import AttributeHeader from "@/components/Attributes/AttributeHeader";
import TableMainComponent from "@/components/Attributes/TableMainComponent";

import { DeliveryLocationForm } from "@/components/Forms/DeliveryLocationForm";
import Header from "@/components/header";
import { deliveryLocationColumns } from "@/components/Items/itemsColumns";
import PermissionGuard from "@/components/RolesPermission/PermissionGuard";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import PaginationComponent from "@/components/sharedUI/PaginationComponent";
import PlannerModal from "@/components/sharedUI/PlannerModal";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";
import { useCheckPermission } from "@/hooks/useCheckPermission";
import {
  useCreateDeliveryLocationMutation,
  useDeleteDeliveryLocationsMutation,
  useGetAllDeliveryLocationsQuery,
  useUpdateDeliveryLocationMutation,
} from "@/services/sales/delivery-locations";
import { IDeliveryLocation } from "@/types/deliveryLocations";
import { newUserTimeZoneFormatDate } from "@/utils/fx";
import { deliveryLocationSchema } from "@/validation/authValidate";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Dropdown, MenuProps } from "antd";
import { useEffect, useState } from "react";
import * as yup from "yup";
const imgError = "/states/notificationToasts/error.svg";
const imgSuccess = "/states/notificationToasts/successcheck.svg";
const index = () => {
  const [search, setSearch] = useState("");

  const [formValues, setFormValues] = useState({
    store_id: "",
    country_id: "",
    state_id: "",
    city_id: "",
    delivery_fee: "",
    estimated_delivery_days: "",
  });
  const [selectedItem, setSelectedItem] = useState<IDeliveryLocation | null>(
    null
  );
  console.log("🚀 ~ index ~ selectedItem:", selectedItem);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [createDeliveryLocation, { isLoading: isLoadingCreate, error }] =
    useCreateDeliveryLocationMutation();
  const [
    updateDeliveryLocation,
    { isLoading: isLoadingUpdate, error: errorUpdate },
  ] = useUpdateDeliveryLocationMutation();
  const {
    hasPermission: hasCreatePermission,
    isLoading: isLoadingCreatePermission,
  } = useCheckPermission("delivery_locations.create");
  const {
    hasPermission: hasUpdatePermission,
    isLoading: isLoadingUpdatePermission,
  } = useCheckPermission("delivery_locations.update");
  // delete and edit permissions can be added similarly
  const {
    hasPermission: hasDeletePermission,
    isLoading: isLoadingDeletePermission,
  } = useCheckPermission("delivery_locations.delete");

  const { data, refetch, isLoading } = useGetAllDeliveryLocationsQuery({
    q: search,
    page: currentPage,
    per_page: 15,
    paginate: true,
    include: "country,state,city",
  });
  console.log("🚀 ~ index ~ data:", data);

  const [deleteDeliveryLocation, { isLoading: isDeleteLoading }] =
    useDeleteDeliveryLocationsMutation();
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
        store_id: selectedItem?.store_id || "",
        country_id: (selectedItem?.country_id as any) || "",
        state_id: (selectedItem?.state_id as any) || "",
        city_id: (selectedItem?.city_id as any) || "",
        delivery_fee: selectedItem?.delivery_fee || "",
        estimated_delivery_days: String(
          selectedItem?.estimated_delivery_days || ""
        ),
      });
    }
  }, [selectedItem, showEditModal]);

  useEffect(() => {
    if (!showEditModal && !isOpenModal) {
      setFormValues({
        store_id: "",
        country_id: "",
        state_id: "",
        city_id: "",
        delivery_fee: "",
        estimated_delivery_days: "",
      });
    }
  }, [showEditModal, isOpenModal]);
  const transformedData = data?.data?.map((item) => ({
    key: item?.id,
    country: (
      <div className="flex items-center gap-2">
        {item?.country?.name || "-"}
      </div>
    ),
    state: (
      <div className="flex items-center gap-2">{item?.state?.name || "-"}</div>
    ),
    city: (
      <div className="flex items-center gap-2">{item?.city?.name || "-"}</div>
    ),
    delivery_fee: (
      <div className="flex items-center gap-2">
        ₦{Number(item?.delivery_fee || 0).toLocaleString()}
      </div>
    ),
    estimated_delivery_days: (
      <div className="flex items-center gap-2">
        {item?.estimated_delivery_days || "-"} days
      </div>
    ),
    // Export-friendly versions
    country_text: item?.country?.name || "-",
    state_text: item?.state?.name || "-",
    city_text: item?.city?.name || "-",
    delivery_fee_text: `₦${Number(item?.delivery_fee || 0).toLocaleString()}`,
    estimated_delivery_days_text: `${
      item?.estimated_delivery_days || "-"
    } days`,
    dateInitiated: newUserTimeZoneFormatDate(item?.created_at, "DD/MM/YYYY"),
    action: (
      <div className="flex items-center space-x-2">
        {(() => {
          const items = [
            isLoadingUpdatePermission
              ? null
              : hasUpdatePermission
              ? {
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
                }
              : null,
            isLoadingDeletePermission
              ? null
              : hasDeletePermission
              ? {
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
                }
              : null,
          ].filter(Boolean) as MenuProps["items"];
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
  const exportColumns = deliveryLocationColumns
    .filter(
      (column: any) => column.key !== "action" && column.dataIndex !== "action"
    )
    .map((column: any) => {
      // Map complex fields to their text versions
      if (column.dataIndex === "country") {
        return { ...column, dataIndex: "country_text" };
      }
      if (column.dataIndex === "state") {
        return { ...column, dataIndex: "state_text" };
      }
      if (column.dataIndex === "city") {
        return { ...column, dataIndex: "city_text" };
      }
      if (column.dataIndex === "delivery_fee") {
        return { ...column, dataIndex: "delivery_fee_text" };
      }
      if (column.dataIndex === "estimated_delivery_days") {
        return { ...column, dataIndex: "estimated_delivery_days_text" };
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
      await deliveryLocationSchema.validate(formValues, {
        abortEarly: false,
      });

      // Clear previous form errors if validation is successful
      setFormErrors({});
      let payload = {
        store_id: formValues.store_id,
        country_id: formValues.country_id,
        state_id: formValues.state_id,
        city_id: formValues.city_id,
        delivery_fee: Number(formValues.delivery_fee),
        estimated_delivery_days: Number(formValues.estimated_delivery_days),
      };

      // Proceed with server-side submission
      const response = await createDeliveryLocation(payload).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={"Delivery Location Created Successfully"}
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
                title={"Delivery Location Creation Failed"}
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
      await deliveryLocationSchema.validate(formValues, {
        abortEarly: false,
      });

      // Clear previous form errors if validation is successful
      setFormErrors({});
      let payload = {
        store_id: formValues.store_id,
        country_id: formValues.country_id,
        state_id: formValues.state_id,
        city_id: formValues.city_id,
        delivery_fee: Number(formValues.delivery_fee),
        estimated_delivery_days: Number(formValues.estimated_delivery_days),
      };

      // Proceed with server-side submission
      const response = await updateDeliveryLocation({
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
                  <span className="font-bold">Delivery location</span> updated
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
                    <span className="font-bold">Delivery location</span> update
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
    <div className={``}>
      <Header
        search={search}
        setSearch={setSearch}
        showSearch={true}
        placeHolderText="Search Delivery Locations..."
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="All Delivery Locations"
        btnText={"Create Delivery Location"}
        showAddButton={isLoadingCreatePermission ? false : hasCreatePermission}
        onClick={() => {
          setIsOpenModal(true);
          setFormValues({
            store_id: "",
            country_id: "",
            state_id: "",
            city_id: "",
            delivery_fee: "",
            estimated_delivery_days: "",
          });
        }}
      />
      <SharedLayout className="bg-white">
        <PermissionGuard permission="products.viewAny">
          {isLoading ? (
            <SkeletonLoaderForPage />
          ) : (
            <>
              <TableMainComponent
                DeleteModalText={
                  <>
                    {selectedItem?.city?.name ||
                      selectedItem?.state?.name ||
                      "this delivery location"}
                  </>
                }
                data={selectedItem}
                deleteCardApi={deleteDeliveryLocation}
                isDeleteLoading={isDeleteLoading}
                printTitle="Delivery Locations"
                showExportButton={true}
                showPrintButton={true}
                showDeleteModal={showDeleteModal}
                refetch={refetch}
                formValues={formValues}
                setShowDeleteModal={setShowDeleteModal}
                isLoading={false}
                columnsTable={deliveryLocationColumns as any}
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
        </PermissionGuard>
      </SharedLayout>
      {isOpenModal && (
        <PlannerModal
          modalOpen={isOpenModal}
          setModalOpen={setIsOpenModal}
          className=""
          width={800}
          title="Create Delivery Location"
          onCloseModal={() => setIsOpenModal(false)}
        >
          <DeliveryLocationForm
            error={error}
            btnText="Create Delivery Location"
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
          width={800}
          title="Edit Delivery Location"
          onCloseModal={() => {
            setShowEditModal(false);
            setSelectedItem(null);
          }}
        >
          <DeliveryLocationForm
            error={errorUpdate}
            setFormValues={setFormValues}
            btnText="Edit Delivery Location"
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
