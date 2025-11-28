import AttributeHeader from "@/components/Attributes/AttributeHeader";
import TableMainComponent from "@/components/Attributes/TableMainComponent";
import Header from "@/components/header";
import DeleteModal from "@/components/sharedUI/DeleteModal";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import PlannerModal from "@/components/sharedUI/PlannerModal";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";
import {
  useDeleteSingleItemStockTransferMutation,
  useGetSingleStockTransferQuery,
} from "@/services/stock-transfer";
import { UserResponseTopLevel } from "@/types/loginInUserType";
import { newUserTimeZoneFormatDate } from "@/utils/fx";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Tooltip } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import { useLocalStorage } from "react-use";
import imgError from "/public/states/notificationToasts/error.svg";
import imgSuccess from "/public/states/notificationToasts/successcheck.svg";

const index = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [formValues, setFormValues] = useState({});
  const [selectedInventoryId, setSelectedInventoryId] = useState<string | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<any>(null);
  const [loginResponse] = useLocalStorage<UserResponseTopLevel | null>(
    "authLoginResponse",
    null
  );
  // Add delete mutation
  const [deleteInventory, { isLoading: isDeleteLoading }] =
    useDeleteSingleItemStockTransferMutation();

  const { data, refetch, isLoading } = useGetSingleStockTransferQuery(
    {
      id: router.query.id as string,
      include:
        "stockTransferInventories.inventory.productVariant.images,stockTransferInventories.inventory.productVariant.product.images",
    },
    {
      skip: !router.query.id,
    }
  );

  // Handle delete inventory
  const handleDeleteInventory = async () => {
    try {
      if (!selectedInventoryId) return;

      await deleteInventory({
        id: selectedInventoryId,
        stock_transfer_id: router.query.id as string,
      }).unwrap();

      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={"Stock Inventory item deleted successfully"}
              image={imgSuccess}
              textColor="green"
              message={
                "The stock inventory item has been removed from this transfer"
              }
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Stock Inventory item deleted successfully",
      });

      refetch();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting inventory:", error);
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Error"}
              title={"Failed to delete inventory"}
              image={imgError}
              textColor="red"
              message={(error as any)?.data?.message || "Something went wrong"}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: (error as any)?.data?.message || "Something went wrong",
      });
    }
  };

  // Define table columns for stock transfer inventories
  const stockTransferInventoriesColumns = [
    {
      title: "Inventory ID",
      dataIndex: "inventoryId",
      key: "inventoryId",
      width: 150,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: "Date Added",
      dataIndex: "dateAdded",
      key: "dateAdded",
      width: 120,
    },
    {
      title: "Last Updated",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      width: 120,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 100,
    },
  ];

  // Filter columns based on user permissions
  const filteredStockTransferInventoriesColumns =
    stockTransferInventoriesColumns.filter(
      (column: any) =>
        column?.dataIndex !== "action" || loginResponse?.user?.is_admin
    );

  // Transform data for table
  const transformedData = data?.data?.stock_transfer_inventories?.map(
    (item) => ({
      key: item?.id,
      inventoryId: (
        <div className="flex flex-col">
          <span className="font-medium text-sm">
            {item?.inventory_id ? item.inventory_id.slice(-8) : "N/A"}
          </span>
          <span className="text-xs text-gray-500">
            {item?.inventory_id || "No ID"}
          </span>
        </div>
      ),
      quantity: (
        <span className="font-medium text-center">{item?.quantity || "-"}</span>
      ),
      dateAdded: (
        <span className="text-sm">
          {newUserTimeZoneFormatDate(item?.created_at, "DD/MM/YYYY HH:mm")}
        </span>
      ),
      lastUpdated: (
        <span className="text-sm">
          {newUserTimeZoneFormatDate(item?.updated_at, "DD/MM/YYYY HH:mm")}
        </span>
      ),
      action: loginResponse?.user?.is_admin ? (
        <Tooltip title="Delete">
          <button
            onClick={() => {
              setSelectedInventoryId(item?.id);
              setSelectedInventoryItem(item);
              setShowDeleteModal(true);
            }}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
            aria-label="Delete inventory item"
          >
            <Icon icon="gg:trash" width="20" height="20" />
          </button>
        </Tooltip>
      ) : null,
    })
  );

  const getInventoryDisplayName = () => {
    if (!selectedInventoryItem) return "this item";

    // Since inventory data might be null, we'll use the inventory_id as identifier
    const inventoryId = selectedInventoryItem?.inventory_id;
    const quantity = selectedInventoryItem?.quantity;

    if (inventoryId) {
      return `Inventory Item (ID: ${inventoryId.slice(-8)})${
        quantity ? ` - Qty: ${quantity}` : ""
      }`;
    }

    return "this inventory item";
  };

  return (
    <div className={``}>
      <Header
        search={search}
        setSearch={setSearch}
        showSearch={false}
        placeHolderText="Search inventory"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText={`Stock Transfer Inventories - ${
          data?.data?.reference_no || ""
        }`}
        showAddButton={false}
        btnText=""
        onClick={() => {}}
      />
      <SharedLayout className="bg-white">
        {/* Show transfer details summary */}
        <div className="bg-gray-50 p-6 mb-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h4 className="text-gray-500 text-sm font-medium mb-2">
                From Store
              </h4>
              <p className="font-semibold text-gray-900">
                {data?.data?.from_store?.name}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {data?.data?.from_store?.address}
              </p>
              {(data?.data?.from_store as any)?.city && (
                <p className="text-xs text-gray-500 mt-1">
                  {(data?.data?.from_store as any)?.city},{" "}
                  {(data?.data?.from_store as any)?.country}
                </p>
              )}
              {data?.data?.from_store?.is_warehouse && (
                <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Warehouse
                </span>
              )}
            </div>

            <div>
              <h4 className="text-gray-500 text-sm font-medium mb-2">
                To Store
              </h4>
              <p className="font-semibold text-gray-900">
                {data?.data?.to_store?.name}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {data?.data?.to_store?.address}
              </p>
              {(data?.data?.to_store as any)?.city && (
                <p className="text-xs text-gray-500 mt-1">
                  {(data?.data?.to_store as any)?.city},{" "}
                  {(data?.data?.to_store as any)?.country}
                </p>
              )}
              {(data?.data?.to_store as any)?.phone_number && (
                <p className="text-xs text-gray-500 mt-1">
                  📞 {(data?.data?.to_store as any)?.phone_number}
                </p>
              )}
              {(data?.data?.to_store as any)?.email && (
                <p className="text-xs text-gray-500">
                  ✉️ {(data?.data?.to_store as any)?.email}
                </p>
              )}
            </div>

            <div>
              <h4 className="text-gray-500 text-sm font-medium mb-2">
                Driver Information
              </h4>
              <p className="font-semibold text-gray-900">
                {data?.data?.driver_name}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                📞 {data?.data?.driver_phone_number}
              </p>

              <div className="mt-3">
                <h5 className="text-gray-500 text-xs font-medium mb-1">
                  Transfer Details
                </h5>
                {data?.data?.dispatched_at && (
                  <p className="text-xs text-gray-600">
                    Dispatched:{" "}
                    {newUserTimeZoneFormatDate(
                      data.data.dispatched_at,
                      "DD/MM/YYYY HH:mm"
                    )}
                  </p>
                )}
                {data?.data?.accepted_at && (
                  <p className="text-xs text-gray-600">
                    Accepted:{" "}
                    {newUserTimeZoneFormatDate(
                      data.data.accepted_at,
                      "DD/MM/YYYY HH:mm"
                    )}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-gray-500 text-sm font-medium mb-2">
                Status & Details
              </h4>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium inline-block capitalize mb-3
                  ${
                    data?.data?.status === "new"
                      ? "bg-blue-100 text-blue-800"
                      : ""
                  }
                  ${
                    data?.data?.status === "dispatched"
                      ? "bg-orange-100 text-orange-800"
                      : ""
                  }
                  ${
                    data?.data?.status === "accepted"
                      ? "bg-green-100 text-green-800"
                      : ""
                  }
                  ${
                    data?.data?.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : ""
                  }
                `}
              >
                {data?.data?.status}
              </span>

              <div className="space-y-1">
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Ref:</span>{" "}
                  {data?.data?.reference_no}
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Items:</span>{" "}
                  {data?.data?.inventories_count || 0}
                </p>
                {data?.data?.comment && (
                  <p className="text-xs text-gray-600 mt-2">
                    <span className="font-medium">Comment:</span>{" "}
                    {data.data.comment}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sender & Receiver Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-gray-500 text-sm font-medium mb-2">
                  Sender
                </h4>
                <div className="flex items-center gap-3">
                  <img
                    src={
                      data?.data?.sender?.profile_photo_url ||
                      "/images/Avatar.png"
                    }
                    alt="Sender"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {data?.data?.sender?.first_name}{" "}
                      {data?.data?.sender?.last_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {data?.data?.sender?.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {data?.data?.sender?.phone_number}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-gray-500 text-sm font-medium mb-2">
                  Receiver
                </h4>
                <div className="flex items-center gap-3">
                  <img
                    src={
                      data?.data?.receiver?.profile_photo_url ||
                      "/images/Avatar.png"
                    }
                    alt="Receiver"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {data?.data?.receiver?.first_name}{" "}
                      {data?.data?.receiver?.last_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {data?.data?.receiver?.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {data?.data?.receiver?.phone_number}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <SkeletonLoaderForPage />
        ) : (
          <>
            <TableMainComponent
              DeleteModalText={<>Item from this stock transfer</>}
              data={null}
              deleteCardApi={() => {}}
              isDeleteLoading={false}
              showDeleteModal={false}
              refetch={refetch}
              formValues={formValues}
              setShowDeleteModal={setShowDeleteModal}
              isLoading={false}
              printTitle="Stock Transfer Inventories"
              showExportButton={true}
              showPrintButton={true}
              columnsTable={filteredStockTransferInventoriesColumns as any}
              transformedData={transformedData}
            />

            {/* Summary Footer */}
            {data?.data?.stock_transfer_inventories &&
              data.data.stock_transfer_inventories.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <h4 className="text-sm text-gray-500">Total Items</h4>
                      <p className="text-lg font-semibold text-gray-900">
                        {data.data.stock_transfer_inventories.length}
                      </p>
                    </div>
                    <div className="text-center">
                      <h4 className="text-sm text-gray-500">Total Quantity</h4>
                      <p className="text-lg font-semibold text-gray-900">
                        {data.data.stock_transfer_inventories.reduce(
                          (sum, item) => sum + (Number(item.quantity) || 0),
                          0
                        )}
                      </p>
                    </div>
                    <div className="text-center">
                      <h4 className="text-sm text-gray-500">Status</h4>
                      <p className="text-lg font-semibold text-gray-900 capitalize">
                        {data?.data?.status}
                      </p>
                    </div>
                    <div className="text-center">
                      <h4 className="text-sm text-gray-500">Reference No.</h4>
                      <p className="text-lg font-semibold text-gray-900">
                        {data?.data?.reference_no}
                      </p>
                    </div>
                  </div>
                </div>
              )}
          </>
        )}
      </SharedLayout>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <PlannerModal
          modalOpen={showDeleteModal}
          setModalOpen={setShowDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
        >
          <DeleteModal
            handleDelete={() => {
              handleDeleteInventory();
            }}
            isLoading={isDeleteLoading}
            onCloseModal={() => setShowDeleteModal(false)}
            title={
              <>
                Are you sure you want to delete{" "}
                <span className="font-bold">{getInventoryDisplayName()}</span>
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
