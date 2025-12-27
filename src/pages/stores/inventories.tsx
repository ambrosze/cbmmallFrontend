import AttributeHeader from "@/components/Attributes/AttributeHeader";
import TableMainComponent from "@/components/Attributes/TableMainComponent";
import { InventoryQuantityForm } from "@/components/Forms/InventoryQuantityForm";
import Header from "@/components/header";
import InventoryFilter, {
  InventoryFilterState,
} from "@/components/ItemComponent/InventoryFilter";
import ImageComponent from "@/components/sharedUI/ImageComponent";
import PaginationComponent from "@/components/sharedUI/PaginationComponent";
import PlannerModal from "@/components/sharedUI/PlannerModal";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";
import { useGetAllStoresQuery } from "@/services/admin/store";
import {
  useGetAllInventoryQuery,
  useUpdateInventoryQuantityMutation,
} from "@/services/inventories";
import {
  useDeleteProductsMutation,
  useGetAllProductsQuery,
} from "@/services/products/product-list";
import { useGetAllProductVariantsQuery } from "@/services/products/variant/variant-product-list";
import { InventoryDatum } from "@/types/inventoryListType";
import {
  capitalizeOnlyFirstLetter,
  newUserTimeZoneFormatDate,
} from "@/utils/fx";
import { Icon } from "@iconify/react/dist/iconify.js";
import * as yup from "yup";
const imgError = "/states/notificationToasts/error.svg";
const imgSuccess = "/states/notificationToasts/successcheck.svg";

import PermissionGuard from "@/components/RolesPermission/PermissionGuard";
import { useCheckPermission } from "@/hooks/useCheckPermission";
import { Dropdown, MenuProps } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

const index = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewProductListModal, setIsViewProductListModal] = useState(false);
  const [filters, setFilters] = useState<InventoryFilterState>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const {
    hasPermission: hasViewPermission,
    isLoading: isLoadingViewPermission,
  } = useCheckPermission("inventories.view");
  // delete and edit permissions can be added similarly
  const {
    hasPermission: hasUpdatePermission,
    isLoading: isLoadingUpdatePermission,
  } = useCheckPermission("inventories.update-stock");
  const { data, isLoading, refetch } = useGetAllInventoryQuery({
    paginate: true,
    per_page: 15,
    page: currentPage,
    q: search,
    include: "productVariant.product.attributeValues,productVariant.images",
    filter: {
      ...filters,
    },
  });
  const [deleteProducts, { isLoading: isDeleteLoading }] =
    useDeleteProductsMutation();
  const [
    updateInventoryQuantity,
    { isLoading: isLoadingUpdate, error: errorUpdate },
  ] = useUpdateInventoryQuantityMutation();
  // Products for product filter
  const { data: productsData } = useGetAllProductsQuery({
    paginate: false,
    include: undefined,
  });

  const [formValues, setFormValues] = useState({
    quantity: 1,
    serial_number: "",
    batch_number: "",
  });
  const [selectedItem, setSelectedItem] = useState<InventoryDatum | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch();
  };
  const [isLoadingImage, setIsLoadingImage] = useState(true);
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
        quantity: selectedItem.quantity,
        serial_number: selectedItem.serial_number || "",
        batch_number: selectedItem.batch_number || "",
      });
    }
  }, [selectedItem, showEditModal]);
  // Build transformed data for inventory items
  const transformedData = useMemo(
    () =>
      data?.data.map((inv) => {
        const pv = inv.product_variant;
        const product = pv?.product;
        const imageUrl = pv?.images?.[0]?.url || "/images/empty_box.svg";
        const productName = pv?.name || product?.name || "Unnamed product";
        const sku = pv?.sku || "-";
        const storeName = inv?.store?.name || "-";
        const createdDate = newUserTimeZoneFormatDate(
          inv?.created_at || inv?.updated_at,
          "DD/MM/YYYY"
        );

        return {
          key: inv.id,
          product: (
            <div className="flex items-center gap-3 min-w-[260px]">
              <div className="h-10 w-10 flex-shrink-0">
                <ImageComponent
                  key={inv.id}
                  isLoadingImage={isLoadingImage}
                  setIsLoadingImage={setIsLoadingImage}
                  aspectRatio="1/1"
                  src={imageUrl}
                  width={40}
                  height={40}
                  alt="thumb"
                  className="h-10 w-10 rounded-md object-cover"
                />
              </div>
              <div className="flex flex-col">
                <Link
                  href={`/products/${product?.id}`}
                  className="font-[600] text-[14px] text-black hover:underline line-clamp-1"
                  title={productName}
                >
                  {productName}
                </Link>
                <p className="text-[11px] text-[#667085]">SKU: {sku}</p>
              </div>
            </div>
          ),
          product_text: productName,
          sku_text: sku,
          store: (
            <div className="min-w-[180px]">
              <p className="font-medium text-[13px]">{storeName}</p>
              {inv?.store?.city || inv?.store?.country ? (
                <p className="text-[11px] text-[#667085]">
                  {[inv?.store?.city, inv?.store?.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              ) : null}
            </div>
          ),
          store_text: `${storeName}`,
          quantity: inv.quantity,
          status: (
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded-full text-xs capitalize ${
                  inv.status === "available"
                    ? "bg-green-100 text-green-700"
                    : inv.status === "reserved"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {inv.status}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs capitalize bg-blue-100 text-blue-700">
                {inv.condition_status}
              </span>
            </div>
          ),
          status_text: inv.status,
          condition_text: inv.condition_status,
          dateInitiated: createdDate,
          action: (
            <div className="flex items-center space-x-2">
              {(() => {
                const items: MenuProps["items"] = [
                  isLoadingViewPermission
                    ? null
                    : hasViewPermission
                    ? {
                        label: (
                          <button
                            onClick={() => {
                              setSelectedItem(inv);
                              setIsViewProductListModal(true);
                            }}
                            className="flex w-full items-center gap-2"
                            type="button"
                          >
                            View details
                          </button>
                        ),
                        key: "view",
                      }
                    : null,
                  isLoadingUpdatePermission
                    ? null
                    : hasUpdatePermission
                    ? {
                        label: (
                          <button
                            onClick={() => {
                              setSelectedItem(inv);
                              setShowEditModal(true);
                            }}
                            className="flex w-full items-center gap-2"
                            type="button"
                          >
                            Edit quantity
                          </button>
                        ),
                        key: "edit",
                      }
                    : null,
                ];
                return (
                  <Dropdown menu={{ items }} trigger={["click"]}>
                    <Icon
                      onClick={(e) => {
                        e.preventDefault();
                        setFormErrors({});
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
        };
      }) || [],
    [data, isLoadingImage]
  );

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  // Get stores data for filter options
  const { data: storesData } = useGetAllStoresQuery({
    paginate: false,
    per_page: 100,
  });

  // Get product variants data for filter options
  const { data: variantsData } = useGetAllProductVariantsQuery({
    paginate: false,
    per_page: 200,
    include: "product",
  });

  const storeOptions =
    storesData?.data?.map((store: any) => ({
      label: store.name,
      value: store.id,
    })) || [];

  const productOptions =
    productsData?.data?.map((p: any) => ({ label: p.name, value: p.id })) || [];

  // Transform variants data for filter options
  const variantOptions =
    variantsData?.data?.map((variant: any) => ({
      label: `${variant.name} (${variant.product?.name || "Product"})`,
      value: variant.id,
    })) || [];

  // No SKU filter needed in InventoryFilter

  // Define columns for inventory list
  const columns = useMemo(
    () => [
      {
        title: "Product",
        dataIndex: "product",
        width: 280,
      },
      {
        title: "SKU",
        dataIndex: "sku_text",
        width: 140,
      },
      {
        title: "Store",
        dataIndex: "store",
        width: 200,
      },
      {
        title: "Qty",
        dataIndex: "quantity",
        width: 100,
      },
      {
        title: "Status",
        dataIndex: "status",
        width: 180,
      },
      {
        title: "Created",
        dataIndex: "dateInitiated",
        width: 160,
        sorter: {
          compare: (a: any, b: any) =>
            new Date(a.dateInitiated).getTime() -
            new Date(b.dateInitiated).getTime(),
          multiple: 1,
        },
      },
      {
        title: "Action",
        dataIndex: "action",
        width: 50,
        fixed: "right" as const,
      },
    ],
    []
  );

  // Create export columns (use text versions where needed)
  const exportColumns = useMemo(
    () => [
      { title: "Product", dataIndex: "product_text" },
      { title: "SKU", dataIndex: "sku_text" },
      { title: "Store", dataIndex: "store_text" },
      { title: "Quantity", dataIndex: "quantity" },
      { title: "Status", dataIndex: "status_text" },
      { title: "Condition", dataIndex: "condition_text" },
      { title: "Created", dataIndex: "dateInitiated" },
    ],
    []
  );
  const handleUpdateSubmit = async () => {
    try {
      // Validate form values using yup
      {
        // Ensure selectedItem exists
        const isSerialized = selectedItem?.product_variant?.is_serialized === 1;

        const schema = yup.object().shape({
          quantity: yup
            .number()
            .required("Quantity is required")
            .test(
              "serialized-unchanged",
              "Quantity cannot be changed for serialized product",
              function (value) {
                if (!isSerialized) {
                  return (value ?? 0) >= 1;
                }
                // For serialized products quantity must remain unchanged
                return Number(value) === Number(selectedItem?.quantity);
              }
            )
            .when("$isSerialized", {
              is: false,
              then: (sch) => sch.min(1, "Quantity must be at least 1"),
            }),
          serial_number: isSerialized
            ? yup
                .string()
                .required("Serial number is required for serialized products")
                .test(
                  "unique-serial",
                  "Serial number must be unique",
                  function (value) {
                    if (!value) return false;
                    // Check against other inventories to ensure uniqueness
                    const existing = data?.data?.some(
                      (inv: any) =>
                        inv.serial_number &&
                        inv.serial_number === value &&
                        inv.id !== selectedItem?.id
                    );
                    return !existing;
                  }
                )
            : yup.string().notRequired(),
          batch_number: isSerialized
            ? yup.string().notRequired()
            : yup.string().notRequired(),
        });

        await schema.validate(formValues, {
          abortEarly: false,
          context: { isSerialized },
        });
      }

      // Clear previous form errors if validation is successful
      setFormErrors({});
      let payload = {
        quantity: Number(formValues.quantity),
        serial_number: formValues.serial_number || "",
        batch_number: formValues.batch_number || "",
      };

      // Proceed with server-side submission
      const response = await updateInventoryQuantity({
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
                      selectedItem?.product_variant?.name!
                    )}
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
                      {capitalizeOnlyFirstLetter(
                        selectedItem?.product_variant?.name!
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
  return (
    <div className={``}>
      <Header
        search={search}
        setSearch={setSearch}
        showSearch={true}
        placeHolderText="Search inventories"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="All Inventories"
        showAddButton={false}
        btnText=""
        onClick={() => {}}
      />
      <SharedLayout className="bg-white">
        <PermissionGuard permission="inventories.viewAny">
          <div className="">
            <InventoryFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              storeOptions={storeOptions}
              productOptions={productOptions}
              variantOptions={variantOptions}
            />
          </div>
          <TableMainComponent
            DeleteModalText={
              selectedItem?.product_variant?.name ||
              selectedItem?.product_variant?.product?.name ||
              "Inventory"
            }
            data={selectedItem}
            deleteCardApi={deleteProducts}
            isDeleteLoading={isDeleteLoading}
            printTitle="inventories"
            showExportButton={true}
            showPrintButton={true}
            showDeleteModal={showDeleteModal}
            refetch={refetch}
            formValues={formValues}
            setShowDeleteModal={setShowDeleteModal}
            isLoading={isLoading}
            columnsTable={columns as any}
            exportColumns={exportColumns as any}
            transformedData={transformedData}
          />
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
      {isViewProductListModal && selectedItem && (
        <PlannerModal
          modalOpen={isViewProductListModal}
          setModalOpen={setIsViewProductListModal}
          className="order-details-modal"
          width={950}
          title="Inventory details"
          onCloseModal={() => setIsViewProductListModal(false)}
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
              padding: 0rem;
            }
            @media (max-width: 768px) {
              .order-details-container {
                padding: 0;
              }
            }
          `}</style>
          {/* Details Content */}
          <div className="order-details-container space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 rounded-xl overflow-hidden ring-1 ring-gray-200 bg-white">
                <ImageComponent
                  isLoadingImage={isLoadingImage}
                  setIsLoadingImage={setIsLoadingImage}
                  aspectRatio="1/1"
                  src={
                    selectedItem?.product_variant?.images?.[0]?.url ||
                    "/images/empty_box.svg"
                  }
                  width={80}
                  height={80}
                  alt="product image"
                  className="h-20 w-20 object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {selectedItem?.product_variant?.name ||
                    selectedItem?.product_variant?.product?.name}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[#667085]">
                  <span className="inline-flex items-center gap-1">
                    <Icon icon="mdi:barcode" className="w-4 h-4" />
                    SKU:{" "}
                    <span className="font-medium">
                      {selectedItem?.product_variant?.sku}
                    </span>
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="inline-flex items-center gap-1">
                    <Icon icon="mdi:store" className="w-4 h-4" />
                    Store:{" "}
                    <span className="font-medium">
                      {selectedItem?.store?.name}
                    </span>
                    {selectedItem?.store?.city
                      ? `, ${selectedItem?.store?.city}`
                      : ""}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="inline-flex items-center gap-1">
                    <Icon
                      icon="mdi:package-variant-closed"
                      className="w-4 h-4"
                    />
                    Qty:{" "}
                    <span className="font-medium">
                      {selectedItem?.quantity}
                    </span>
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs capitalize ring-1 ring-inset ${
                      selectedItem?.status === "available"
                        ? "bg-green-50 text-green-700 ring-green-200"
                        : selectedItem?.status === "reserved"
                        ? "bg-yellow-50 text-yellow-700 ring-yellow-200"
                        : "bg-gray-50 text-gray-700 ring-gray-200"
                    }`}
                  >
                    {selectedItem?.status}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs capitalize bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200">
                    {selectedItem?.condition_status}
                  </span>
                </div>

                {/* Quick actions */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(selectedItem?.id)
                    }
                    className="text-xs px-3 py-1 rounded-md border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  >
                    Copy Inventory ID
                  </button>
                  {selectedItem?.product_variant?.sku ? (
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          selectedItem?.product_variant?.sku || ""
                        )
                      }
                      className="text-xs px-3 py-1 rounded-md border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    >
                      Copy SKU
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="border-t pt-4" />

            {/* Grid sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inventory details */}
              <div className="rounded-xl border p-4 bg-gray-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <Icon
                    icon="mdi:warehouse"
                    className="w-4 h-4 text-gray-600"
                  />
                  <h4 className="font-semibold">Inventory</h4>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <span className="text-[#667085]">Batch number</span>
                  <span className="font-medium">
                    {selectedItem?.batch_number || "-"}
                  </span>
                  <span className="text-[#667085]">Serial number</span>
                  <span className="font-medium">
                    {selectedItem?.serial_number || "-"}
                  </span>
                  <span className="text-[#667085]">Received date</span>
                  <span className="font-medium">
                    {selectedItem?.received_date || "-"}
                  </span>
                  <span className="text-[#667085]">Warranty expiry</span>
                  <span className="font-medium">
                    {selectedItem?.warranty_expiry_date || "-"}
                  </span>
                  <span className="text-[#667085]">Expiration date</span>
                  <span className="font-medium">
                    {selectedItem?.expiration_date || "-"}
                  </span>
                  <span className="text-[#667085]">Created</span>
                  <span className="font-medium">
                    {newUserTimeZoneFormatDate(
                      selectedItem?.created_at,
                      "DD/MM/YYYY HH:mm"
                    )}
                  </span>
                  <span className="text-[#667085]">Updated</span>
                  <span className="font-medium">
                    {newUserTimeZoneFormatDate(
                      selectedItem?.updated_at,
                      "DD/MM/YYYY HH:mm"
                    )}
                  </span>
                  <span className="text-[#667085]">Inventory ID</span>
                  <span className="font-mono text-xs">{selectedItem?.id}</span>
                </div>
              </div>

              {/* Store details */}
              <div className="rounded-xl border p-4 bg-gray-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <Icon icon="mdi:store" className="w-4 h-4 text-gray-600" />
                  <h4 className="font-semibold">Store</h4>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <span className="text-[#667085]">Name</span>
                  <span className="font-medium">
                    {selectedItem?.store?.name}
                  </span>
                  <span className="text-[#667085]">Address</span>
                  <span className="font-medium">
                    {selectedItem?.store?.address}
                  </span>
                  <span className="text-[#667085]">City</span>
                  <span className="font-medium">
                    {selectedItem?.store?.city}
                  </span>
                  <span className="text-[#667085]">Country</span>
                  <span className="font-medium">
                    {selectedItem?.store?.country}
                  </span>
                  <span className="text-[#667085]">Warehouse</span>
                  <span className="font-medium">
                    {selectedItem?.store?.is_warehouse ? "Yes" : "No"}
                  </span>
                  <span className="text-[#667085]">Phone</span>
                  <span className="font-medium">
                    {selectedItem?.store?.phone_number}
                  </span>
                  <span className="text-[#667085]">Email</span>
                  <span className="font-medium">
                    {selectedItem?.store?.email}
                  </span>
                </div>
              </div>

              {/* Product variant details */}
              <div className="rounded-xl border p-4 bg-gray-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <Icon icon="mdi:shape" className="w-4 h-4 text-gray-600" />
                  <h4 className="font-semibold">Product variant</h4>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <span className="text-[#667085]">Name</span>
                  <span className="font-medium">
                    {selectedItem?.product_variant?.name ||
                      selectedItem?.product_variant?.product?.name}
                  </span>
                  <span className="text-[#667085]">SKU</span>
                  <span className="font-medium">
                    {selectedItem?.product_variant?.sku}
                  </span>
                  <span className="text-[#667085]">Price</span>
                  <span className="font-medium">
                    {selectedItem?.product_variant?.price}
                  </span>
                  <span className="text-[#667085]">Compare price</span>
                  <span className="font-medium">
                    {selectedItem?.product_variant?.compare_price}
                  </span>
                  <span className="text-[#667085]">Cost price</span>
                  <span className="font-medium">
                    {selectedItem?.product_variant?.cost_price}
                  </span>
                  <span className="text-[#667085]">Serialized</span>
                  <span className="font-medium">
                    {selectedItem?.product_variant?.is_serialized
                      ? "Yes"
                      : "No"}
                  </span>
                </div>
                {/* Barcode */}
                {selectedItem?.product_variant?.barcode ? (
                  <div className="mt-3">
                    <p className="text-sm text-[#667085] mb-2">Barcode</p>
                    <img
                      src={selectedItem?.product_variant?.barcode}
                      alt="barcode"
                      className="max-h-24 rounded-md border bg-white p-2"
                    />
                  </div>
                ) : null}
              </div>

              {/* Product details & attributes */}
              <div className="rounded-xl border p-4 bg-gray-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <Icon icon="mdi:shopping" className="w-4 h-4 text-gray-600" />
                  <h4 className="font-semibold">Product</h4>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <span className="text-[#667085]">Name</span>
                  <span className="font-medium">
                    {selectedItem?.product_variant?.product?.name}
                  </span>
                  <span className="text-[#667085]">Slug</span>
                  <span className="font-medium">
                    {selectedItem?.product_variant?.product?.slug}
                  </span>
                  <span className="text-[#667085]">Created</span>
                  <span className="font-medium">
                    {newUserTimeZoneFormatDate(
                      selectedItem?.product_variant?.product?.created_at,
                      "DD/MM/YYYY HH:mm"
                    )}
                  </span>
                </div>
                {selectedItem?.product_variant?.product?.attribute_values
                  ?.length ? (
                  <div className="mt-3">
                    <p className="text-sm text-[#667085] mb-1">Attributes</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem?.product_variant?.product?.attribute_values?.map(
                        (av) => (
                          <span
                            key={av.id}
                            className="px-2.5 py-0.5 rounded-full text-xs bg-white text-gray-700 ring-1 ring-inset ring-gray-200"
                          >
                            {av.display_value || av.value}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Images gallery if more than one */}
            {selectedItem?.product_variant?.images?.length ? (
              <div className="rounded-xl border p-4 bg-gray-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <Icon
                    icon="mdi:image-multiple"
                    className="w-4 h-4 text-gray-600"
                  />
                  <h4 className="font-semibold">Images</h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {selectedItem?.product_variant?.images?.map((img, idx) => (
                    <div
                      key={img.id}
                      className="h-24 w-full rounded-lg overflow-hidden ring-1 ring-gray-200 bg-white"
                    >
                      <ImageComponent
                        isLoadingImage={isLoadingImage}
                        setIsLoadingImage={setIsLoadingImage}
                        aspectRatio="1/1"
                        src={img.url}
                        width={96}
                        height={96}
                        alt={`image-${idx}`}
                        className="h-24 w-full object-cover"
                        index={idx}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </PlannerModal>
      )}
      {showEditModal && selectedItem && (
        <PlannerModal
          modalOpen={showEditModal}
          setModalOpen={setShowEditModal}
          className=""
          width={500}
          title="Edit inventory quantity"
          onCloseModal={() => setShowEditModal(false)}
        >
          <InventoryQuantityForm
            formErrors={formErrors}
            error={errorUpdate}
            isSerialized={selectedItem?.product_variant?.is_serialized === 1}
            formValues={formValues}
            handleInputChange={handleInputChange}
            setFormValues={setFormValues}
            handleSubmit={handleUpdateSubmit}
            isLoadingCreate={isLoadingUpdate}
            setIsOpenModal={setShowEditModal}
            btnText="Update Quantity"
          />
        </PlannerModal>
      )}
    </div>
  );
};

export default index;
