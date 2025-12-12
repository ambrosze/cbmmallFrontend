import AttributeHeader from "@/components/Attributes/AttributeHeader";
import TableMainComponent from "@/components/Attributes/TableMainComponent";

import { PaymentGatewayForm } from "@/components/Forms/PaymentGatewayForm";
import Header from "@/components/header";
import { paymentGatewayColumns } from "@/components/Items/itemsColumns";
import PaymentGatewayViewModal from "@/components/payment/PaymentGatewayViewModal";
import PermissionGuard from "@/components/RolesPermission/PermissionGuard";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import PaginationComponent from "@/components/sharedUI/PaginationComponent";
import PlannerModal from "@/components/sharedUI/PlannerModal";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";
import { useCheckPermission } from "@/hooks/useCheckPermission";
import {
  useGetAllPaymentGatewaysQuery,
  useGetSinglePaymentGatewayQuery,
  useUpdatePaymentGatewayMutation,
} from "@/services/payment/gateway";
import { IPaymentGatewayDatum } from "@/types/paymentTypes";
import { newUserTimeZoneFormatDate } from "@/utils/fx";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Dropdown, MenuProps, Tag } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as yup from "yup";
const imgError = "/states/notificationToasts/error.svg";
const imgSuccess = "/states/notificationToasts/successcheck.svg";

const index = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    name: "",
    logo: null,
    is_disabled: 0,
    mode: "",
    is_default: 0,
  });
  const [selectedItem, setSelectedItem] = useState<IPaymentGatewayDatum | null>(
    null
  );
  console.log("🚀 ~ index ~ selectedItem:", selectedItem);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [
    updatePaymentGateway,
    { isLoading: isLoadingUpdate, error: errorUpdate },
  ] = useUpdatePaymentGatewayMutation();
  const {
    hasPermission: hasUpdatePermission,
    isLoading: isLoadingUpdatePermission,
  } = useCheckPermission("payment_gateways.update");

  const { data, refetch, isLoading } = useGetAllPaymentGatewaysQuery({
    q: search,
    page: currentPage,
    per_page: 15,
    paginate: true,
  });
  const {
    data: singleData,
    refetch: refetchSingle,
    isLoading: isLoadingSingle,
  } = useGetSinglePaymentGatewayQuery(
    {
      id: selectedItem?.id || "",
    },
    {
      skip: !selectedItem?.id,
    }
  );

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
        name: selectedItem.name,
        logo: null,
        is_disabled: selectedItem.is_disabled ? 1 : 0,
        mode: selectedItem.mode,
        is_default: selectedItem.is_default,
      });
    }
  }, [selectedItem, showEditModal]);

  useEffect(() => {
    if (!showEditModal && !isOpenModal) {
      setFormValues({
        name: "",
        logo: null,
        is_disabled: 0,
        mode: "",
        is_default: 0,
      });
    }
  }, [showEditModal, isOpenModal]);
  const transformedData = data?.data?.map((item) => ({
    key: item?.id,
    logo: (
      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
        {item?.logo_url ? (
          <img
            src={item.logo_url}
            alt={item.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <Icon
            icon="mdi:credit-card-outline"
            width={20}
            height={20}
            className="text-gray-400"
          />
        )}
      </div>
    ),
    name: (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">{item?.name || "-"}</span>
        <span className="text-xs text-gray-500 truncate max-w-[200px]">
          {item?.description || ""}
        </span>
      </div>
    ),
    code: (
      <span className="text-sm text-gray-700 font-mono">
        {item?.code || "-"}
      </span>
    ),
    mode: (
      <Tag color={item?.mode === "live" ? "green" : "orange"}>
        {item?.mode?.toUpperCase() || "-"}
      </Tag>
    ),
    currencies: (
      <div className="flex flex-wrap gap-1 max-w-[180px]">
        {item?.supported_currencies?.slice(0, 3).map((currency) => (
          <Tag key={currency} className="!m-0 !text-xs">
            {currency}
          </Tag>
        ))}
        {(item?.supported_currencies?.length || 0) > 3 && (
          <Tag className="!m-0 !text-xs">
            +{(item?.supported_currencies?.length || 0) - 3}
          </Tag>
        )}
      </div>
    ),
    status: (
      <Tag color={item?.is_disabled ? "red" : "green"}>
        {item?.is_disabled ? "Disabled" : "Active"}
      </Tag>
    ),
    is_default: (
      <Tag color={item?.is_default === 1 ? "blue" : "default"}>
        {item?.is_default === 1 ? "Yes" : "No"}
      </Tag>
    ),
    // Export-friendly versions
    name_text: item?.name || "-",
    code_text: item?.code || "-",
    mode_text: item?.mode || "-",
    currencies_text: item?.supported_currencies?.join(", ") || "-",
    status_text: item?.is_disabled ? "Disabled" : "Active",
    is_default_text: item?.is_default === 1 ? "Yes" : "No",
    dateInitiated: newUserTimeZoneFormatDate(item?.created_at, "DD/MM/YYYY"),
    action: (
      <div className="flex items-center space-x-2">
        {(() => {
          const items = [
            {
              label: (
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setShowViewModal(true);
                  }}
                  className="flex w-full items-center gap-2"
                  type="button"
                >
                  View
                </button>
              ),
              key: "view",
            },
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
  }));

  // Create export columns with text versions
  const exportColumns = paymentGatewayColumns
    .filter(
      (column: any) =>
        column.key !== "action" &&
        column.dataIndex !== "action" &&
        column.dataIndex !== "logo"
    )
    .map((column: any) => {
      // Map complex fields to their text versions
      if (column.dataIndex === "name") {
        return { ...column, dataIndex: "name_text" };
      }
      if (column.dataIndex === "code") {
        return { ...column, dataIndex: "code_text" };
      }
      if (column.dataIndex === "mode") {
        return { ...column, dataIndex: "mode_text" };
      }
      if (column.dataIndex === "currencies") {
        return { ...column, dataIndex: "currencies_text" };
      }
      if (column.dataIndex === "status") {
        return { ...column, dataIndex: "status_text" };
      }
      if (column.dataIndex === "is_default") {
        return { ...column, dataIndex: "is_default_text" };
      }
      return column;
    });
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch();
  };

  const handleUpdateSubmit = async () => {
    try {
      // Basic validation
      const errors: { [key: string]: string } = {};
      if (!formValues.name?.trim()) {
        errors.name = "Name is required";
      }
      if (!formValues.mode) {
        errors.mode = "Payment mode is required";
      }
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      // Clear previous form errors if validation is successful
      setFormErrors({});
      let payload = {
        name: formValues.name,
        logo: formValues.logo,
        is_disabled: formValues.is_disabled,
        mode: formValues.mode,
        is_default: formValues.is_default,
      };

      // Proceed with server-side submission
      const response = await updatePaymentGateway({
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
                  <span className="font-bold">Gateway</span> updated
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
                    <span className="font-bold">Gateway</span> update Failed
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
        placeHolderText="Search gateways..."
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="All gateways"
        btnText={"Create Gateway"}
        showAddButton={false}
        onClick={() => {
          setIsOpenModal(true);
          setFormValues({
            name: "",
            logo: null,
            is_disabled: 0,
            mode: "",
            is_default: 0,
          });
        }}
      />
      <SharedLayout className="bg-white">
        <PermissionGuard permission="payment_gateways.view">
          {isLoading ? (
            <SkeletonLoaderForPage />
          ) : (
            <>
              <TableMainComponent
                DeleteModalText={<>{selectedItem?.name || "this gateway"}</>}
                data={selectedItem}
                deleteCardApi={() => Promise.resolve()}
                isDeleteLoading={false}
                printTitle="gateways"
                showExportButton={true}
                showPrintButton={true}
                showDeleteModal={showDeleteModal}
                refetch={refetch}
                formValues={formValues}
                setShowDeleteModal={setShowDeleteModal}
                isLoading={false}
                columnsTable={paymentGatewayColumns as any}
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

      {showEditModal && (
        <PlannerModal
          modalOpen={showEditModal}
          setModalOpen={setShowEditModal}
          className=""
          width={600}
          title="Edit Gateway"
          onCloseModal={() => {
            setShowEditModal(false);
            setSelectedItem(null);
          }}
        >
          <style jsx global>{`
            .order-details-modal .ant-modal-body {
              padding: 0;
              max-height: 85vh;
              overflow-y: auto;
              // reduce scrollbar width
              scrollbar-width: 1px;
              &::-webkit-scrollbar {
                width: 6px;
              }
            }
            .order-details-modal .ant-modal-content {
              border-radius: 16px;
              overflow: hidden;
            }
            .order-details-container {
              padding: 2rem;
            }
            @media (max-width: 768px) {
              .order-details-container {
                padding: 0;
              }
            }
          `}</style>
          <div className="order-details-container">
            <PaymentGatewayForm
              selectedItem={selectedItem}
              error={errorUpdate}
              setFormValues={setFormValues}
              btnText="Edit Gateway"
              formErrors={formErrors}
              formValues={formValues}
              handleInputChange={handleInputChange}
              handleSubmit={handleUpdateSubmit}
              isLoadingCreate={isLoadingUpdate}
              setIsOpenModal={setShowEditModal}
            />
          </div>
        </PlannerModal>
      )}
      {showViewModal && (
        <PlannerModal
          modalOpen={showViewModal}
          setModalOpen={setShowViewModal}
          className=""
          width={700}
          title="View Gateway Details"
          onCloseModal={() => {
            setShowViewModal(false);
            setSelectedItem(null);
          }}
        >
          <PaymentGatewayViewModal
            gateway={singleData?.data || selectedItem}
            isLoading={isLoadingSingle}
          />
        </PlannerModal>
      )}
    </div>
  );
};

export default index;
