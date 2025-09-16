import AttributeHeader from "@/components/Attributes/AttributeHeader";
import TableMainComponent from "@/components/Attributes/TableMainComponent";
import Header from "@/components/header";
import { stockTransferInventoriesColumns } from "@/components/Items/itemsColumns";
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
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<any>(null);
  const [loginResponse] = useLocalStorage<UserResponseTopLevel | null>(
    "authLoginResponse",
    null
  );
  // Add delete mutation
  const filteredStockTransferInventoriesColumns =
    stockTransferInventoriesColumns.filter(
      (column: any) =>
        column?.dataIndex !== "action" || loginResponse?.user?.is_admin
    );
  const [deleteInventory, { isLoading: isDeleteLoading }] =
    useDeleteSingleItemStockTransferMutation();

  const { data, refetch, isLoading } = useGetSingleStockTransferQuery(
    {
      id: router.query.id as string,
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

  const transformedData = data?.data?.stock_transfer_inventories?.map(
    (item) => ({
      key: item?.id,
      material: (
        <span className="font-medium">
          {item?.inventory?.item?.material || "N/A"}
        </span>
      ),
      type: (
        <span className="font-medium">
          {item?.inventory?.item?.type?.name || "N/A"}
        </span>
      ),
      weight: (
        <span className="font-medium text-center">
          {item?.inventory?.item?.weight || "N/A"}
        </span>
      ),
      quantity: (
        <span className="font-medium text-center">{item?.quantity || "-"}</span>
      ),

      dateInitiated: newUserTimeZoneFormatDate(item?.created_at, "DD/MM/YYYY"),
      action: loginResponse?.user.is_admin ? (
        <Tooltip title="Delete">
          <span
            onClick={() => {
              setSelectedInventoryId(item?.id);
              setSelectedInventoryItem(item);
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
      ) : null,
    })
  );

  const getInventoryDisplayName = () => {
    if (!selectedInventoryItem) return "this item";

    const material =
      selectedInventoryItem?.inventory?.item?.material || "Unknown";
    const type = selectedInventoryItem?.inventory?.item?.type?.name || "";
    const weight = selectedInventoryItem?.inventory?.item?.weight || "";

    return `${material}${type ? ` ${type}` : ""}${
      weight ? ` (${weight}g)` : ""
    }`;
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
        <div className="bg-gray-50 p-4 mb-6 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-gray-500 text-sm">From Store</h4>
              <p className="font-medium">{data?.data?.from_store?.name}</p>
              <p className="text-sm text-gray-600">
                {data?.data?.from_store?.address}
              </p>
            </div>
            <div>
              <h4 className="text-gray-500 text-sm">To Store</h4>
              <p className="font-medium">{data?.data?.to_store?.name}</p>
              <p className="text-sm text-gray-600">
                {data?.data?.to_store?.address}
              </p>
            </div>
            <div>
              <h4 className="text-gray-500 text-sm">Driver</h4>
              <p className="font-medium">{data?.data?.driver_name}</p>
              <p className="text-sm text-gray-600">
                {data?.data?.driver_phone_number}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="text-gray-500 text-sm">Status</h4>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium inline-block capitalize
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
