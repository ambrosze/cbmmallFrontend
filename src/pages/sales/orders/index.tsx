import AttributeHeader from "@/components/Attributes/AttributeHeader";
import TableMainComponent from "@/components/Attributes/TableMainComponent";
import Header from "@/components/header";
import SelectInput from "@/components/Input/SelectInput";
import OrderSkeletonLoader from "@/components/Order/OrderSkeletonLoader";

import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import PaginationComponent from "@/components/sharedUI/PaginationComponent";
import PlannerModal from "@/components/sharedUI/PlannerModal";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";
import { useGetAllEnumsQuery } from "@/services/global";
import {
  useGetAllOrdersQuery,
  useGetSingleOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/services/orders/order";
import { IOrdersDatum } from "@/types/orderTypes";
import { formatCurrency, newUserTimeZoneFormatDate } from "@/utils/fx";
import { Icon } from "@iconify/react/dist/iconify.js";
const imgError = "/states/notificationToasts/error.svg";
const imgSuccess = "/states/notificationToasts/successcheck.svg";

import { orderTableColumns } from "@/components/Order/OrderTableColumns";
import PermissionGuard from "@/components/RolesPermission/PermissionGuard";
import { useCheckPermission } from "@/hooks/useCheckPermission";
import Image from "next/image";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface AddItemFormState {
  sku: string;
  quantity: string;
}

interface CustomerFormState {
  customer_id: string;
  payment_method: string;
  discount_code: string;
}
const formatStatusLabel = (status?: string) => {
  if (!status) return "Unknown";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
const index = () => {
  const [search, setSearch] = useState("");
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const { data: orderStatusData } = useGetAllEnumsQuery({
    enum: "OrderStatus",
  });
  const {
    hasPermission: hasViewPermission,
    isLoading: isLoadingViewPermission,
  } = useCheckPermission("orders.view");

  const {
    hasPermission: hasUpdatePermission,
    isLoading: isLoadingUpdatePermission,
  } = useCheckPermission("orders.update");
  console.log("OrderStatus", orderStatusData?.values);
  const ORDER_STATUS_OPTIONS =
    orderStatusData?.values.map((v) => v.value) || [];
  type OrderStatusValue = (typeof ORDER_STATUS_OPTIONS)[number];

  type OrderFilters = {
    status: OrderStatusValue;
  };

  const initialFilterState: OrderFilters = {
    status: "",
  };
  // get token from cookies
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<IOrdersDatum | null>(null);
  const [isViewed, setIsViewed] = useState(false);
  const [filters, setFilters] = useState<OrderFilters>(initialFilterState);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement | null>(null);

  const queryFilters = useMemo(
    () => ({
      status: filters.status || undefined,
    }),
    [filters]
  );

  const { data, isLoading, refetch } = useGetAllOrdersQuery({
    include: "user",
    page: currentPage,
    q: search,
    per_page: 10,
    filter: queryFilters,
  });
  const {
    data: singleData,
    isLoading: singleIsLoading,
    refetch: singleRefetch,
  } = useGetSingleOrdersQuery(
    {
      include: "user,payables.payable,items",
      id: selectedItem?.id!,
    },
    {
      skip: !selectedItem?.id,
    }
  );
  const [updateOrderStatus, { isLoading: updateOrderStatusLoading }] =
    useUpdateOrderStatusMutation();
  const getStatusDisplay = (status?: string) => {
    const normalized = status?.toLowerCase();
    let backgroundColor = "bg-gray-100";
    let textColor = "text-gray-600";
    let text = formatStatusLabel(status);

    switch (normalized) {
      case "completed":
        backgroundColor = "bg-emerald-100";
        textColor = "text-emerald-700";
        break;

      case "delivered":
        backgroundColor = "bg-green-100";
        textColor = "text-green-700";
        break;

      case "dispatched":
        backgroundColor = "bg-blue-100";
        textColor = "text-blue-700";
        break;

      case "processing":
        backgroundColor = "bg-amber-100";
        textColor = "text-amber-700";
        break;

      case "ongoing":
        backgroundColor = "bg-orange-100";
        textColor = "text-orange-700";
        break;

      case "pending":
        backgroundColor = "bg-yellow-100";
        textColor = "text-yellow-700";
        break;

      case "new":
        backgroundColor = "bg-sky-100";
        textColor = "text-sky-700";
        break;

      default:
        backgroundColor = "bg-gray-100";
        textColor = "text-gray-600";
    }

    return { backgroundColor, textColor, text };
  };
  const handleSearchChange: Dispatch<SetStateAction<string>> = (value) => {
    setSearch((prev) => {
      const nextValue =
        typeof value === "function" ? value(prev) : (value as string);
      if (prev !== nextValue) {
        setCurrentPage(1);
      }
      return nextValue;
    });
  };
  const transformedData = data?.data.map((item, index) => ({
    ...item,
    dateInitiated: (
      <span className="text-left w-full block">
        {newUserTimeZoneFormatDate(
          item.updated_at || item.created_at,
          "DD-MM-YYYY"
        )}
      </span>
    ),
    total_price: (
      <span className="text-left w-full block">
        {formatCurrency(item.total_price)}
      </span>
    ),
    ordered_by: (
      <span className="text-left w-full block">
        {item.delivery_address.full_name || "N/A"}
      </span>
    ),
    status: (
      <span className="text-left w-full block">
        <SelectInput
          className={
            getStatusDisplay(item.status).backgroundColor +
            " " +
            getStatusDisplay(item.status).textColor
          }
          data={
            orderStatusData?.values?.map((v) => ({
              label: v.name,
              value: v.value,
            })) || []
          }
          disabled={updateOrderStatusLoading}
          value={item.status || orderStatusData?.values[0]?.value || ""}
          onChange={(value) => {
            handleUpdateOrderStatus(item.id, value);
          }}
        />
      </span>
    ),
    email: (
      <span className="text-left w-full block">
        {item.delivery_address.email || "N/A"}
      </span>
    ),
    delivery_address: (
      <span className="text-left w-full block">
        {item.delivery_address.address || "N/A"}
      </span>
    ),
    action: (
      <div className={`flex gap-2 `}>
        <p
          onClick={(e) => {
            e.preventDefault();
            setSelectedItem(item);
            setIsViewed(true);
          }}
          className="hover:underline cursor-pointer text-primary font-medium"
        >
          View
        </p>
      </div>
    ),
  }));

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus({
        id: orderId,
        body: { status },
      }).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={<>Order status updated successfully</>}
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
    } catch (error: any) {
      console.error("Failed to update order status:", error);
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Error"}
              title={<>failed to update order status</>}
              image={imgError}
              textColor="red"
              message={(error as any)?.data?.message || "Something went wrong"}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Invalid Credentials",
      });
    }
  };

  const getStatusBadgeStyles = (status?: string) => {
    const normalized = status?.toLowerCase();
    if (!normalized) {
      return "bg-gray-100 text-gray-600";
    }
    if (["delivered", "completed", "fulfilled"].includes(normalized)) {
      return "bg-emerald-100 text-emerald-700";
    }
    if (["pending", "processing", "awaiting"].includes(normalized)) {
      return "bg-amber-100 text-amber-700";
    }
    if (["cancelled", "failed", "declined"].includes(normalized)) {
      return "bg-rose-100 text-rose-700";
    }
    return "bg-blue-100 text-blue-700";
  };

  const handleOpenOrderDetails = (order: IOrdersDatum) => {
    setSelectedItem(order);
    setIsViewed(true);
  };

  const handleFilterChange = <K extends keyof OrderFilters>(
    key: K,
    value: OrderFilters[K]
  ) => {
    setFilters((prev) => {
      if (prev[key] === value) return prev;
      return {
        ...prev,
        [key]: value,
      };
    });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters(initialFilterState);
    setCurrentPage(1);
  };

  const hasActiveFilters = filters.status !== "";

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch();
  };
  useEffect(() => {
    if (!isFilterOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen]);

  const filteredOrderTableColumns = orderTableColumns.filter((column) => {
    if (column.key === "status") {
      return !isLoadingUpdatePermission && hasUpdatePermission;
    }
    if (column.key === "action") {
      return !isLoadingViewPermission && hasViewPermission;
    }
    return true;
  });

  return (
    <div className="">
      <Header
        search={search}
        setSearch={setSearch}
        showSearch={true}
        placeHolderText="Search List"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />

      <AttributeHeader
        headerText="Orders"
        btnText="Add Item"
        showAddButton={false}
        onClick={() => setShowAddItemModal(true)}
      />

      <SharedLayout className="bg-white">
        <PermissionGuard permission="orders.viewAny">
          <div
            className="relative  flex justify-end bottom-16"
            ref={filterDropdownRef}
          >
            <button
              type="button"
              aria-label="Toggle filters"
              aria-haspopup="menu"
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className={`flex border justify-center items-center bg-white shadow-sm p-2 rounded-md transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                hasActiveFilters ? "text-primary" : "text-gray-700"
              }`}
            >
              <Icon icon="mynaui:filter" width="24" height="24" />
              {hasActiveFilters && (
                <span className="ml-2 text-xs font-medium tracking-wide">
                  Filters
                </span>
              )}
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl z-20">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-900">
                    Filter Orders
                  </p>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="text-xs font-semibold bg-transparent !py-2 px-3 text-primary hover:text-primary/80"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="uppercase text-[11px] font-semibold text-gray-400 tracking-wide">
                      Status
                    </p>
                    <select
                      aria-label="Filter by status"
                      value={filters.status}
                      onChange={(event) =>
                        handleFilterChange(
                          "status",
                          event.target.value as OrderStatusValue
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-900 focus:border-primary focus:outline-none"
                    >
                      <option value="">All statuses</option>
                      {ORDER_STATUS_OPTIONS.filter(
                        (status) => status !== ""
                      ).map((status) => (
                        <option key={status} value={status}>
                          {formatStatusLabel(status)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(false)}
                    className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(false)}
                    className="rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>
          {isLoading ? (
            <SkeletonLoaderForPage />
          ) : (
            <>
              <div className="flex flex-col lg:flex-row gap-4 ">
                <div className="hidden lg:block overflow-hidden">
                  <TableMainComponent
                    deleteCardApi={() => {}}
                    data={selectedItem} // Pass empty data as placeholder
                    formValues={{}}
                    refetch={refetch}
                    firstRowClassName="bg-white"
                    secondRowClassName="bg-white"
                    bordered={true}
                    setShowDeleteModal={() => {}}
                    showDeleteModal={false}
                    isDeleteLoading={false}
                    isLoading={isLoading}
                    transformedData={transformedData}
                    DeleteModalText={<></>}
                    columnsTable={filteredOrderTableColumns}
                  />
                </div>
              </div>
              <div className="lg:hidden flex flex-col gap-[16px]">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={`orders-skeleton-${index}`}
                      className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-24 rounded bg-gray-200" />
                        <div className="h-3 w-16 rounded bg-gray-200" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="h-2.5 w-20 rounded bg-gray-200" />
                          <div className="h-3 w-28 rounded bg-gray-200" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-2.5 w-16 rounded bg-gray-200 ml-auto" />
                          <div className="h-3 w-24 rounded bg-gray-200 ml-auto" />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <div className="h-2.5 w-24 rounded bg-gray-200" />
                          <div className="h-3 w-full rounded bg-gray-200" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t pt-4">
                        <div className="h-2.5 w-28 rounded bg-gray-200" />
                        <div className="h-8 w-24 rounded-full bg-gray-200" />
                      </div>
                    </div>
                  ))
                ) : data?.data && data.data.length > 0 ? (
                  data.data.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-2xl border border-gray-100 bg-white px-3 py-[20px] shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-gray-500">
                            Order ID
                          </p>
                          <p className="text-base font-semibold text-gray-900">
                            {item.reference}
                          </p>
                        </div>
                        {
                          /* Status Badge */
                          isLoadingUpdatePermission ? null : hasUpdatePermission ? (
                            <span
                              className={`px-3 py-1 text-xs font-semibold rounded-full`}
                            >
                              <SelectInput
                                className={
                                  getStatusDisplay(item.status)
                                    .backgroundColor +
                                  " " +
                                  "border-none focus:ring-0 focus:outline-none w-full block rounded-full min-w-[180px] text-center"
                                }
                                data={
                                  orderStatusData?.values?.map((v) => ({
                                    label: v.name,
                                    value: v.value,
                                  })) || []
                                }
                                disabled={updateOrderStatusLoading}
                                value={
                                  item.status ||
                                  orderStatusData?.values[0]?.value ||
                                  ""
                                }
                                onChange={(value) => {
                                  handleUpdateOrderStatus(item.id, value);
                                }}
                              />

                              {/* {formatStatusLabel(item.status)} */}
                            </span>
                          ) : null
                        }
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-500">Placed on</p>
                          <p className="font-medium text-gray-900">
                            {newUserTimeZoneFormatDate(
                              item.created_at,
                              "DD MMM YYYY"
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Total</p>
                          <p className="text-base font-semibold text-gray-900">
                            {formatCurrency(item?.total_price)}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-gray-500">Shipping to</p>
                          <p className="font-medium text-gray-900">
                            {item.delivery_address?.full_name || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.delivery_address?.address ||
                              "Address not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t">
                        {
                          /* View Details Button */
                          isLoadingUpdatePermission ? null : hasViewPermission ? (
                            <button
                              type="button"
                              onClick={() => handleOpenOrderDetails(item)}
                              className="rounded-full mt-1 bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                            >
                              View Details
                            </button>
                          ) : null
                        }
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center">
                    <p className="text-sm font-medium text-gray-700">
                      No orders found.
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Try adjusting your search or filters.
                    </p>
                  </div>
                )}
              </div>
              <div className="flex lg:justify-between justify-end  items-center w-full py-10">
                {(currentPage === 1 && data?.meta?.total! >= 10) ||
                (currentPage > 1 && data?.meta?.total! >= 1) ? (
                  <div
                    className={`text-sm hidden lg:block font-[500] text-black`}
                  >
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
            </>
          )}
        </PermissionGuard>
      </SharedLayout>
      {/* details modal table */}
      <PlannerModal
        modalOpen={isViewed}
        setModalOpen={setIsViewed}
        title=""
        backgroundColor=""
        className="order-details-modal"
        width={900}
        maskClosable={true}
        onCloseModal={() => setIsViewed(false)}
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
        {singleIsLoading ? (
          <OrderSkeletonLoader />
        ) : singleData?.data ? (
          <div className="order-details-container">
            {/* Header Section */}
            <div className="border-b pb-6 mb-6">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    Order Details
                  </h3>
                  <p className="text-gray-600">
                    Order ID:{" "}
                    <span className="font-medium text-gray-900">
                      {singleData.data.reference}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Order Date</p>
                  <p className="font-medium text-gray-900">
                    {newUserTimeZoneFormatDate(
                      singleData.data.created_at,
                      "DD MMM YYYY, HH:mm"
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer & Delivery Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-semibold text-gray-900 text-2xl mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Customer Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Full Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {singleData.data.full_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-sm text-gray-900">
                      {singleData.data.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="text-sm text-gray-900">
                      {singleData.data.phone_number}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-semibold text-gray-900 text-2xl mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Delivery Address
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Address</p>
                    <p className="text-sm text-gray-900">
                      {singleData.data.delivery_address.address}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">City</p>
                      <p className="text-sm text-gray-900">
                        {singleData.data.delivery_address.city.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">State</p>
                      <p className="text-sm text-gray-900">
                        {singleData.data.delivery_address.state.name}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Country</p>
                    <p className="text-sm text-gray-900">
                      {singleData.data.delivery_address.country.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 text-2xl mb-4">
                Order Items
              </h4>
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                          Product
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                          Price
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">
                          Quantity
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {singleData.data.items?.map(
                        (item: any, index: number) => (
                          <tr
                            key={item.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                {item.options?.image_url && (
                                  <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                                    <Image
                                      src={item.options.image_url}
                                      alt={item.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-gray-900 text-sm">
                                    {item.name}
                                  </p>
                                  {item.options?.itemable_id && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      ID:{" "}
                                      {item.options.itemable_id.substring(
                                        0,
                                        13
                                      )}
                                      ...
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right text-sm text-gray-900">
                              {formatCurrency(item.price)}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium text-gray-900">
                                {item.quantity}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right text-sm font-medium text-gray-900">
                              {formatCurrency(
                                (
                                  parseFloat(item.price) * item.quantity
                                ).toString()
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Payment Information */}
              {singleData.data.payables &&
                singleData.data.payables.length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <h4 className="font-semibold text-gray-900 text-2xl mb-4 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      Payment Information
                    </h4>
                    <div className="space-y-3">
                      {singleData.data.payables.map(
                        (payable: any, index: number) => (
                          <div
                            key={payable.id}
                            className="border-l-4 border-blue-400 pl-3"
                          >
                            <p className="text-xs text-gray-600 mb-1">
                              Payment ID
                            </p>
                            <p className="text-sm font-mono text-gray-900 break-all">
                              {payable.payment_id}
                            </p>
                            <div className="mt-2">
                              <p className="text-xs text-gray-600 mb-1">
                                Amount
                              </p>
                              <p className="text-lg font-bold text-primary">
                                {formatCurrency(payable.amount)}
                              </p>
                            </div>
                            {payable.verified_at ? (
                              <div className="mt-2 flex items-center gap-1 text-green-600">
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="text-xs font-medium">
                                  Verified
                                </span>
                              </div>
                            ) : (
                              <div className="mt-2 flex items-center gap-1 text-amber-600">
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="text-xs font-medium">
                                  Pending Verification
                                </span>
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-semibold text-gray-900 text-2xl mb-4">
                  Order Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(singleData.data.subtotal_price)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Delivery Cost</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(singleData.data.delivery_cost)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tax</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(singleData.data.tax)}
                    </span>
                  </div>
                  {parseFloat(singleData.data.discount_amount) > 0 && (
                    <div className="flex justify-between items-center text-green-600">
                      <span className="text-sm">Discount</span>
                      <span className="text-sm font-medium">
                        -{formatCurrency(singleData.data.discount_amount)}
                      </span>
                    </div>
                  )}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-semibold text-gray-900">
                        Total
                      </span>
                      <span className="text-xl font-bold text-primary">
                        {formatCurrency(singleData.data.total_price)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mt-6 pt-6 border-t flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Status</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {singleData.data.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                <p className="text-sm font-medium text-gray-900">
                  {newUserTimeZoneFormatDate(
                    singleData.data.updated_at,
                    "DD MMM YYYY, HH:mm"
                  )}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </PlannerModal>
    </div>
  );
};

export default index;
