import AttributeHeader from "@/components/Attributes/AttributeHeader";
import TableMainComponent from "@/components/Attributes/TableMainComponent";
import { StockTransferForm } from "@/components/Forms/StockTransferForm";
import Header from "@/components/header";
import TextAreaInput from "@/components/Input/TextAreaInput";
import { stockTransferColumns } from "@/components/Items/itemsColumns";
import CustomButton from "@/components/sharedUI/Buttons/Button";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import PaginationComponent from "@/components/sharedUI/PaginationComponent";
import PlannerModal from "@/components/sharedUI/PlannerModal";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import Spinner from "@/components/sharedUI/Spinner";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";
import WarningModal from "@/components/sharedUI/WarningModal";
import StockTransferDetailsModal from "@/components/StockTransfer/StockTransferDetailsModal";
import StockTransferFilters from "@/components/StockTransfer/StockTransferFilters";
import { useGetAllDailyGoldPricesQuery } from "@/services/admin/daily-gold-price";
import { useGetAllInventoryItemsQuery } from "@/services/InventoryItem";
import {
  useAcceptStockTransferMutation,
  useCreateStockTransferMutation,
  useDeleteStockTransferMutation,
  useDispatchStockTransferMutation,
  useGetAllStockTransferQuery,
  useGetSingleStockTransferQuery,
  useRejectStockTransferMutation,
  useUpdateStockTransferMutation,
} from "@/services/stock-transfer";

import { useGetAllStoresQuery } from "@/services/admin/store";
import { UserResponseTopLevel } from "@/types/loginInUserType";
import { StockTransferDatum } from "@/types/StockTransferTypes";
import {
  capitalizeOnlyFirstLetter,
  newUserTimeZoneFormatDate,
} from "@/utils/fx";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Dropdown, MenuProps } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import * as yup from "yup";
import imgError from "/public/states/notificationToasts/error.svg";
import imgSuccess from "/public/states/notificationToasts/successcheck.svg";
const index = () => {
  const [search, setSearch] = useState("");
  console.log("🚀 ~ index ~ search:", search);
  const [selectedFilterTypes, setSelectedFilterTypes] = useState<any>(null);
  const router = useRouter();
  const [rejectFormValues, setRejectFormValues] = useState({
    comment: "",
  });
  const [formValues, setFormValues] = useState({
    driver_name: "",
    driver_phone_number: "",
    to_store_id: "",
    comment: "",
    stock_transfer_inventories: [
      { inventory_id: "", quantity: 0, price_per_gram: 0 },
    ],
  });
  const [selectedItem, setSelectedItem] = useState<StockTransferDatum | null>(
    null
  );
  console.log("🚀 ~ index ~ selectedItem:", selectedItem);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [createStockTransfer, { isLoading: isLoadingCreate, error }] =
    useCreateStockTransferMutation();
  const [loginResponse] = useLocalStorage<UserResponseTopLevel | null>(
    "authLoginResponse",
    null
  );
  const [
    dispatchStockTransfer,
    { isLoading: isLoadingDispatch, error: errorDispatch },
  ] = useDispatchStockTransferMutation();
  const [
    acceptStockTransfer,
    { isLoading: isLoadingAccept, error: errorAccept },
  ] = useAcceptStockTransferMutation();
  const [
    rejectStockTransfer,
    { isLoading: isLoadingReject, error: errorReject },
  ] = useRejectStockTransferMutation();

  const [
    updateStockTransfer,
    { isLoading: isLoadingUpdate, error: errorUpdate },
  ] = useUpdateStockTransferMutation();

  const [filters, setFilters] = useState<{
    status?: string;
    out_going?: string;
    in_coming?: string;
  }>({
    // Initialize your filters here if needed
  });

  const { data, refetch, isLoading } = useGetAllStockTransferQuery({
    q: search,
    page: currentPage,
    include: "sender,receiver,sender,fromStore,toStore,inventoriesCount",
    filter: {
      ...filters,
    },
    per_page: 15,
    paginate: true,
  });
  const {
    data: singleTransferData,
    refetch: refetchSingleTransfer,
    isLoading: isLoadingSingleTransfer,
  } = useGetSingleStockTransferQuery(
    {
      id: selectedItem?.id! as string,
    },
    {
      skip: !selectedItem?.id, // Only run query when selectedItem.id exists
    }
  );
  const { data: inventoryData } = useGetAllInventoryItemsQuery({
    paginate: false,
    per_page: 15,
    include: "store,item.category",
    page: currentPage,
    q: search,
  });
  console.log("🚀 ~ index ~ inventoryData:", inventoryData);
  const { data: dailyColdPriceData } = useGetAllDailyGoldPricesQuery({
    paginate: false,
    per_page: 15,
    page: currentPage,
    q: search,
    include: "category",
    sort: "recorded_on",
    filter: {
      period: "daily",
    },
  });
  console.log("🚀 ~ index ~ dailyColdPriceData:", dailyColdPriceData);
  const [deleteStockTransfer, { isLoading: isDeleteLoading }] =
    useDeleteStockTransferMutation();
  const [showInvoice, setShowInvoice] = useState(false);

  // Add the missing handleSettingClick function
  const handleSettingClick = (e: React.MouseEvent, item: any) => {
    e.preventDefault();

    // Always close any open modals first
    setShowEditModal(false);
    setShowViewDetailsModal(false);
    setShowAcceptModal(false);
    setShowRejectModal(false);
    setShowDispatchModal(false);

    // Set the selected item
    setSelectedItem(item);
  };

  // Add a new function to handle opening the edit modal
  const handleOpenEditModal = () => {
    // Clear form first
    setFormValues({
      driver_name: "",
      driver_phone_number: "",
      to_store_id: "",
      comment: "",
      stock_transfer_inventories: [
        { inventory_id: "", quantity: 0, price_per_gram: 0 },
      ],
    });

    // Then refetch data and open the modal
    refetchSingleTransfer();
    setShowEditModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Single useEffect to handle selectedItem changes and form population
  useEffect(() => {
    if (selectedItem?.id && showEditModal) {
      console.log(
        "🚀 Selected item changed, clearing form for ID:",
        selectedItem.id
      );

      // First, clear the form immediately when a new item is selected
      setFormValues({
        driver_name: "",
        driver_phone_number: "",
        to_store_id: "",
        comment: "",
        stock_transfer_inventories: [
          { inventory_id: "", quantity: 0, price_per_gram: 0 },
        ],
      });

      // Then refetch the data for the new item
      refetchSingleTransfer();
    }
  }, [selectedItem?.id, showEditModal]);

  // Separate useEffect to populate form when fresh data arrives
  useEffect(() => {
    console.log("🚀 Form population useEffect triggered:", {
      selectedItemId: selectedItem?.id,
      showEditModal,
      singleTransferDataId: singleTransferData?.data?.id,
      isLoadingSingleTransfer,
      hasData: !!singleTransferData?.data,
      fullData: singleTransferData,
    });

    if (
      selectedItem?.id &&
      showEditModal &&
      singleTransferData?.data &&
      !isLoadingSingleTransfer
    ) {
      console.log(
        "🚀 All conditions met, populating form with data:",
        singleTransferData.data
      );

      const newFormValues = {
        driver_name: singleTransferData.data.driver_name || "",
        driver_phone_number: singleTransferData.data.driver_phone_number || "",
        to_store_id: singleTransferData.data.to_store_id || "",
        comment: singleTransferData.data.comment || "",
        stock_transfer_inventories:
          singleTransferData.data.stock_transfer_inventories?.map(
            (transferItem: any) => {
              console.log("🚀 Processing transfer item:", transferItem);

              // Find the current gold price for this item's category
              const categoryId = transferItem?.inventory?.item?.category_id;
              console.log("🚀 Category ID:", categoryId);

              let goldPrice = null;
              if (categoryId && dailyColdPriceData?.data) {
                goldPrice = dailyColdPriceData.data.find(
                  (price: any) => price.category_id === categoryId
                );
              }

              console.log("🚀 Found gold price:", goldPrice);

              return {
                id: transferItem?.id || null,
                inventory_id: transferItem?.inventory_id || "",
                quantity: transferItem?.quantity || 0,
                price_per_gram: goldPrice?.price_per_gram || 0,
              };
            }
          ) || [{ inventory_id: "", quantity: 0, price_per_gram: 0 }],
      };

      console.log("🚀 Setting new form values:", newFormValues);
      setFormValues(newFormValues as any);
    }
  }, [
    singleTransferData,
    isLoadingSingleTransfer,
    selectedItem?.id,
    showEditModal,
    dailyColdPriceData,
  ]);

  const items: MenuProps["items"] = [
    {
      label: (
        <button
          onClick={() => {
            setShowViewDetailsModal(true);
          }}
          className="flex w-full items-center gap-2"
          type="button"
        >
          <Icon icon="mdi:eye-outline" className="w-4 h-4" />
          View Details
        </button>
      ),
      key: "0",
    },
    {
      label: (
        <button
          onClick={handleOpenEditModal}
          className="flex w-full items-center gap-2"
          type="button"
        >
          <Icon icon="mdi:pencil-outline" className="w-4 h-4" />
          Edit Transfer
        </button>
      ),
      key: "1",
    },
    {
      label: (
        <button
          onClick={() => {
            router.push(`/stock-transfer/inventories/${selectedItem?.id}`);
          }}
          className="flex w-full items-center gap-2"
          type="button"
        >
          <Icon icon="mdi:package-variant-closed" className="w-4 h-4" />
          View Stock Inventories
        </button>
      ),
      key: "4",
    },
    {
      label: (
        <button
          onClick={() => {
            setShowDispatchModal(true);
          }}
          className="flex w-full items-center gap-2"
          type="button"
        >
          <Icon icon="tabler:truck-delivery" className="w-4 h-4" />
          Dispatch Stock Transfer
        </button>
      ),
      key: "5",
    },
    {
      label: (
        <button
          onClick={() => {
            setShowAcceptModal(true);
          }}
          className="flex w-full items-center gap-2"
          type="button"
        >
          <Icon icon="flat-color-icons:accept-database" className="w-4 h-4" />
          Accept Stock Transfer
        </button>
      ),
      key: "6",
    },
    {
      label: (
        <button
          onClick={() => {
            setShowRejectModal(true);
          }}
          className="flex w-full items-center gap-2"
          type="button"
        >
          <Icon
            icon="fluent:text-change-reject-20-filled"
            className="w-4 h-4 text-red-500"
          />
          Reject Stock Transfer
        </button>
      ),
      key: "7",
    },
    ...(loginResponse?.user.is_admin!
      ? [
          {
            label: (
              <button
                onClick={() => {
                  setShowDeleteModal(true);
                }}
                className="flex w-full items-center text-red-500 gap-2"
                type="button"
              >
                <Icon icon="mdi:delete-outline" className="w-4 h-4" />
                Delete
              </button>
            ),
            key: "3",
          },
        ]
      : []),
  ];

  const transformedData = data?.data?.map((item) => ({
    key: item?.id,
    reference_no: (
      <span className="font-mono text-sm font-medium">
        {item?.reference_no}
      </span>
    ),
    // Export-friendly version
    reference_no_text: item?.reference_no,
    driver_name: (
      <div className="flex items-center gap-2">{item?.driver_name}</div>
    ),
    // Export-friendly version
    driver_name_text: item?.driver_name,
    from_store: (
      <div className="flex flex-col">
        <span className="font-medium">{item?.from_store?.name}</span>
        <span className="text-xs text-gray-500 truncate max-w-[150px]">
          {item?.from_store?.address}
        </span>
      </div>
    ),
    // Export-friendly version
    from_store_text: `${item?.from_store?.name} - ${item?.from_store?.address}`,
    to_store: (
      <div className="flex flex-col">
        <span className="font-medium">{item?.to_store?.name}</span>
        <span className="text-xs text-gray-500 truncate max-w-[150px]">
          {item?.to_store?.address}
        </span>
      </div>
    ),
    // Export-friendly version
    to_store_text: `${item?.to_store?.name} - ${item?.to_store?.address}`,
    status: (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium capitalize
        ${item?.status === "new" ? "bg-blue-100 text-blue-800" : ""}
        ${item?.status === "dispatched" ? "bg-orange-100 text-orange-800" : ""}
        ${item?.status === "accepted" ? "bg-green-100 text-green-800" : ""}
        ${item?.status === "rejected" ? "bg-red-100 text-red-800" : ""}
      `}
      >
        {item?.status}
      </span>
    ),
    // Export-friendly version
    status_text: capitalizeOnlyFirstLetter(item?.status || ""),
    inventories_count: (
      <span className="font-medium text-center block">
        {(item as any)?.inventories_count || "0"}
      </span>
    ),
    // Export-friendly version
    inventories_count_text: (item as any)?.inventories_count || "0",
    dateInitiated: newUserTimeZoneFormatDate(item?.created_at, "DD/MM/YYYY"),

    action: (
      <div className="flex items-center space-x-2">
        <Dropdown menu={{ items }} trigger={["click"]}>
          <a
            className={`cursor-pointer hover:opacity-80 duration-150 ease-in-out font-semibold text-sm px-4 rounded-full text-gray-600 underline py-2`}
            onClick={(e) => handleSettingClick(e, item)}
          >
            <Icon icon="uil:setting" width="24" height="24" />
          </a>
        </Dropdown>
      </div>
    ),
  }));

  // Create export columns with text versions
  const exportColumns = stockTransferColumns
    .filter(
      (column: any) => column.key !== "action" && column.dataIndex !== "action"
    )
    .map((column: any) => {
      // Map complex fields to their text versions
      if (column.dataIndex === "reference_no") {
        return { ...column, dataIndex: "reference_no_text" };
      }
      if (column.dataIndex === "driver_name") {
        return { ...column, dataIndex: "driver_name_text" };
      }
      if (column.dataIndex === "from_store") {
        return { ...column, dataIndex: "from_store_text" };
      }
      if (column.dataIndex === "to_store") {
        return { ...column, dataIndex: "to_store_text" };
      }
      if (column.dataIndex === "status") {
        return { ...column, dataIndex: "status_text" };
      }
      if (column.dataIndex === "inventories_count") {
        return { ...column, dataIndex: "inventories_count_text" };
      }
      return column;
    });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch();
  };
  const inventoryList = inventoryData?.data.map((item) => {
    return {
      label:
        item?.item?.material +
        "-" +
        `${item?.item?.weight}g` +
        ((item as any)?.item?.category?.name
          ? "-" + (item as any)?.item?.category?.name
          : ""),
      value: item.id,
      price: item?.item?.price,
      category_id: item?.item?.category_id,
    };
  });
  const { data: storeData } = useGetAllStoresQuery({
    q: "",
    page: 1,
    // include: "manager",
    per_page: 15,
    paginate: false,
  });
  const storeList = storeData?.data.map((store) => ({
    label: store.name,
    value: store.id,
  }));
  const handleAcceptStockTransfer = async () => {
    try {
      if (!selectedItem?.id) throw new Error("No selected item ID");
      await acceptStockTransfer({ id: selectedItem.id.toString() }).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={
                <>
                  Stock transfer for{" "}
                  <span className="font-bold">
                    {capitalizeOnlyFirstLetter(selectedItem?.driver_name!)}
                  </span>{" "}
                  accepted successfully.
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
      setShowAcceptModal(false);
    } catch (error) {
      console.error("Error accepting stock transfer:", error);
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Error"}
              title={
                <>
                  Stock transfer for{" "}
                  <span className="font-bold">
                    {capitalizeOnlyFirstLetter(selectedItem?.driver_name!)}
                  </span>{" "}
                  acceptance failed.
                </>
              }
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
  const handleDispatchStockTransfer = async () => {
    try {
      if (!selectedItem?.id) throw new Error("No selected item ID");
      await dispatchStockTransfer({ id: selectedItem.id.toString() }).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={
                <>
                  Stock transfer for{" "}
                  <span className="font-bold">
                    {capitalizeOnlyFirstLetter(selectedItem?.driver_name!)}
                  </span>{" "}
                  dispatched successfully.
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
      setShowDispatchModal(false);
    } catch (error) {
      console.error("Error accepting stock transfer:", error);
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Error"}
              title={
                <>
                  Stock transfer for{" "}
                  <span className="font-bold">
                    {capitalizeOnlyFirstLetter(selectedItem?.driver_name!)}
                  </span>{" "}
                  dispatch failed.
                </>
              }
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
  const handleRejectStockTransfer = async () => {
    let payload = {
      rejection_reason: rejectFormValues.comment,
    };
    try {
      if (!selectedItem?.id) throw new Error("No selected item ID");
      await rejectStockTransfer({
        id: selectedItem.id.toString(),
        body: payload,
      }).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={
                <>
                  Stock transfer for{" "}
                  <span className="font-bold">
                    {capitalizeOnlyFirstLetter(selectedItem?.driver_name!)}
                  </span>{" "}
                  rejected successfully.
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
      setShowRejectModal(false);
    } catch (error) {
      console.error("Error accepting stock transfer:", error);
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Error"}
              title={
                <>
                  Stock transfer for{" "}
                  <span className="font-bold">
                    {capitalizeOnlyFirstLetter(selectedItem?.driver_name!)}
                  </span>{" "}
                  rejection failed.
                </>
              }
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
  const handleSubmit = async () => {
    try {
      // Clear previous form errors if validation is successful
      setFormErrors({});

      // Prepare the payload with the correct field name
      const payload = {
        driver_name: formValues.driver_name,
        driver_phone_number: formValues.driver_phone_number,
        to_store_id: formValues.to_store_id,
        comment: formValues.comment,
        stock_transfer_inventories: formValues.stock_transfer_inventories.map(
          (item) => ({
            inventory_id: item.inventory_id,
            quantity: Number(item.quantity),
            price_per_gram: Number(item.price_per_gram),
          })
        ),
      };
      // Proceed with server-side submission
      const response = await createStockTransfer(payload).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={"Stock Transfer Created Successfully"}
              image={imgSuccess}
              textColor="green"
              message={"Thank you..."}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Stock Transfer has been recorded successfully.",
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
                title={"Stock Transfer Creation Failed"}
                image={imgError}
                textColor="red"
                message={(err as any)?.data?.message || "Something went wrong"}
                backgroundColor="#FCFCFD"
              />
            ),
          },
          message: "Failed to create stock transfer",
        });
      }
    }
  };
  const handleUpdateSubmit = async () => {
    try {
      // Validate form values using yup
      // await staffSchema.validate(formValues, {
      //   abortEarly: false,
      // });

      // Clear previous form errors if validation is successful
      setFormErrors({});
      const payload = {
        driver_name: formValues.driver_name,
        driver_phone_number: formValues.driver_phone_number,
        to_store_id: formValues.to_store_id,
        comment: formValues.comment,
        stock_transfer_inventories: formValues.stock_transfer_inventories.map(
          (item: any) => ({
            id: item.id || null,
            inventory_id: item.inventory_id,
            quantity: Number(item.quantity),
            price_per_gram: Number(item.price_per_gram),
          })
        ),
      };

      // Proceed with server-side submission
      const response = await updateStockTransfer({
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
                    {capitalizeOnlyFirstLetter(selectedItem?.receiver.name!)}
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
                      {capitalizeOnlyFirstLetter(selectedItem?.receiver.name!)}
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
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };
  return (
    <div className={``}>
      <Header
        search={search}
        setSearch={setSearch}
        showSearch={true}
        placeHolderText="Search stock"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="All Stock Transfers"
        btnText="Create Stock Transfer"
        onClick={() => {
          setIsOpenModal(true);
          setFormValues({
            driver_name: "",
            driver_phone_number: "",
            to_store_id: "",
            comment: "",
            stock_transfer_inventories: [
              { inventory_id: "", quantity: 0, price_per_gram: 0 },
            ],
          });
        }}
      />

      <SharedLayout className="bg-white">
        <StockTransferFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {isLoading ? (
          <SkeletonLoaderForPage />
        ) : (
          <>
            <TableMainComponent
              DeleteModalText={
                <>
                  {capitalizeOnlyFirstLetter(selectedItem?.driver_name || "")}
                </>
              }
              data={selectedItem}
              deleteCardApi={deleteStockTransfer}
              isDeleteLoading={isDeleteLoading}
              printTitle="Stock Transfers"
              showExportButton={true}
              showPrintButton={true}
              showDeleteModal={showDeleteModal}
              refetch={refetch}
              formValues={formValues}
              setShowDeleteModal={setShowDeleteModal}
              isLoading={false}
              columnsTable={stockTransferColumns as any}
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
          width={800}
          title="Create Stock Transfer"
          onCloseModal={() => setIsOpenModal(false)}
        >
          <StockTransferForm
            error={error}
            inventoryData={inventoryList || []}
            dailyGoldPrices={dailyColdPriceData?.data || []}
            storeData={storeList || []}
            btnText="Create Stock Transfer"
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
          title="Edit Stock Transfer"
          onCloseModal={() => setShowEditModal(false)}
        >
          {isLoadingSingleTransfer ? (
            <div className="flex justify-center items-center p-10">
              <Spinner className="border-primary-40" />
              <span className="ml-2">Loading stock transfer data...</span>
            </div>
          ) : (
            <StockTransferForm
              key={selectedItem?.id} // Add key to force re-render
              inventoryData={inventoryList || []}
              dailyGoldPrices={dailyColdPriceData?.data || []}
              storeData={storeList || []}
              error={errorUpdate}
              setFormValues={setFormValues}
              btnText="Update Stock Transfer"
              formErrors={formErrors}
              formValues={formValues}
              handleInputChange={handleInputChange}
              handleSubmit={handleUpdateSubmit}
              isLoadingCreate={isLoadingUpdate}
              setIsOpenModal={setShowEditModal}
            />
          )}
        </PlannerModal>
      )}
      {showViewDetailsModal && (
        <PlannerModal
          modalOpen={showViewDetailsModal}
          setModalOpen={setShowViewDetailsModal}
          className=""
          width={900}
          title=""
          onCloseModal={() => setShowViewDetailsModal(false)}
        >
          <StockTransferDetailsModal selectedItem={selectedItem} />
        </PlannerModal>
      )}
      {showAcceptModal && (
        <PlannerModal
          modalOpen={showAcceptModal}
          setModalOpen={setShowAcceptModal}
          onCloseModal={() => setShowAcceptModal(false)}
        >
          <WarningModal
            handleSubmit={() => {
              handleAcceptStockTransfer();
            }}
            isLoading={isLoadingAccept}
            BtnText="Accept"
            onCloseModal={() => setShowAcceptModal(false)}
            title={
              <>
                Are you sure you want to accept this stock from{" "}
                <span className="font-bold">{selectedItem?.driver_name}</span>
              </>
            }
            text="Are you sure you want to cancel?"
            altText=""
          />
        </PlannerModal>
      )}
      {showRejectModal && (
        <PlannerModal
          modalOpen={showRejectModal}
          setModalOpen={setShowRejectModal}
          onCloseModal={() => setShowRejectModal(false)}
        >
          <form className="mt-5 flex flex-col gap-5">
            <TextAreaInput
              name="comment"
              title={
                <span className="font-[500] text-lg">Rejection Reason</span>
              }
              className="w-full"
              errorMessage={
                (error as any)?.data?.errors?.rejection_reason?.map(
                  (err: any) => err
                ) || ""
              }
              row={4}
              value={rejectFormValues.comment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setRejectFormValues({
                  ...rejectFormValues,
                  comment: e.target.value,
                });
              }}
              placeholder="Enter a reason"
              required={false}
            />

            <div className="flex justify-end border-t border-gray-300 pt-3">
              <div className="w-fit flex gap-5">
                <CustomButton
                  type="button"
                  onClick={() => {
                    setShowRejectModal(false);
                  }}
                  className="border bg-border-300 text-black flex justify-center items-center gap-2 px-5"
                >
                  Cancel
                </CustomButton>
                <CustomButton
                  type="button"
                  onClick={handleRejectStockTransfer}
                  disabled={isLoadingReject || !rejectFormValues.comment}
                  className="border bg-primary-40 flex justify-center items-center gap-2 text-white px-5"
                >
                  {isLoadingReject ? (
                    <Spinner className="border-white" />
                  ) : (
                    "Save Reason"
                  )}
                </CustomButton>
              </div>
            </div>
          </form>
        </PlannerModal>
      )}
      {showDispatchModal && (
        <PlannerModal
          modalOpen={showDispatchModal}
          setModalOpen={setShowDispatchModal}
          onCloseModal={() => setShowDispatchModal(false)}
        >
          <WarningModal
            handleSubmit={() => {
              handleDispatchStockTransfer();
            }}
            isLoading={isLoadingDispatch}
            BtnText="Dispatch"
            onCloseModal={() => setShowDispatchModal(false)}
            title={
              <>
                Are you sure you want to dispatch this stock from{" "}
                <span className="font-bold">{selectedItem?.driver_name}</span>
              </>
            }
            text="Are you sure you want to cancel?"
            altText=""
          />
        </PlannerModal>
      )}
    </div>
  );
};

export default index;
