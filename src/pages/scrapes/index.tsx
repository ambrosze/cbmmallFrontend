import AttributeHeader from "@/components/Attributes/AttributeHeader";
import TableMainComponent from "@/components/Attributes/TableMainComponent";
import Header from "@/components/header";
import ItemsFilter from "@/components/ItemComponent/ItemsFilter";
import ScrapeITemsForm from "@/components/ItemComponent/ScrapeITemsForm";
import { itemsScrapesColumns } from "@/components/Items/itemsColumns";
import ImageComponent from "@/components/sharedUI/ImageComponent";
import PaginationComponent from "@/components/sharedUI/PaginationComponent";
import PlannerModal from "@/components/sharedUI/PlannerModal";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";
import { useGetAllStoresQuery } from "@/services/admin/store";
import { useGetAllCategoryQuery } from "@/services/category";
import { useGetAllColoursQuery } from "@/services/colour";
import { useGetAllInventoryItemsQuery } from "@/services/InventoryItem";
import {
  useAddSingleScrapeItemToInventoryMutation,
  useCreateInventoryScrapeItemsMutation,
  useGetAllInventoryScrapeItemsQuery,
} from "@/services/InventoryScrapes";
import { useGetAllTypesQuery } from "@/services/types";
import {
  capitalizeOnlyFirstLetter,
  newUserTimeZoneFormatDate,
} from "@/utils/fx";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Dropdown, MenuProps } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import imgError from "/public/states/notificationToasts/error.svg";
import imgSuccess from "/public/states/notificationToasts/successcheck.svg";

const index = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilterTypes, setSelectedFilterTypes] = useState<any>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filters, setFilters] = useState<{
    store_id?: string;
    item_id?: string;
    "inventory.item.type_id"?: string;
    "inventory.item.colour_id"?: string;
    "inventory.item.category_id"?: string;
    "inventory.item.material"?: string;
  }>({});
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
  const [viewDetailsData, setViewDetailsData] = useState<any>(null);
  const { data: inventoryData } = useGetAllInventoryItemsQuery({
    paginate: false,
    per_page: 15,
    include: "store,item.category",
    page: currentPage,
    q: search,
  });
  const router = useRouter();
  const { data, isLoading, refetch } = useGetAllInventoryScrapeItemsQuery({
    paginate: true,
    per_page: 15,
    page: currentPage,
    q: search,
    include:
      "staff.user,customer,inventory.store,inventory.item.category,inventory.item.type,inventory.item.colour",
    filter: {
      ...filters,
    },
  });
  const {
    data: getAllCategory,
    refetch: refetchCategory,
    isLoading: isLoadingCategory,
  } = useGetAllCategoryQuery({
    q: search,
    paginate: false,
  });
  const {
    data: getAllTypesData,
    refetch: refetchTypes,
    isLoading: isLoadingTypes,
  } = useGetAllTypesQuery({
    q: search,
    paginate: false,
  });
  const {
    data: getAllColoursData,
    refetch: refetchColours,
    isLoading: isLoadingColours,
  } = useGetAllColoursQuery({
    q: search,
    paginate: false,
  });
  const [formValues, setFormValues] = useState<any>({
    inventory_id: "",
    quantity: "",
    customer_id: "",
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    type: "returned",
    comments: "",
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [createInventoryScrapeItems, { isLoading: isLoadingCreate, error }] =
    useCreateInventoryScrapeItemsMutation();
  const [
    addSingleScrapeItemToInventory,
    { isLoading: isLoadingUpdate, error: errorUpdate },
  ] = useAddSingleScrapeItemToInventoryMutation();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch();
  };
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const transformedCategoryData = getAllCategory?.data.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  const transformedTypesData = getAllTypesData?.data.map((item: any) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  const transformedColoursData = getAllColoursData?.data.map((item: any) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
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

  // get the category by  id from the data
  const getCategoryById = (id: string) => {
    const category = transformedCategoryData?.find((item) => item.value === id);
    return category ? category.label : "N/A";
  };
  // get the type by id from the data
  const getTypeById = (id: string) => {
    const type = transformedTypesData?.find((item: any) => item.value === id);
    return type ? type.label : "N/A";
  };
  // get the colour by id from the data
  const getColourById = (id: string) => {
    const colour = transformedColoursData?.find(
      (item: any) => item.value === id
    );
    return colour ? colour.label : "N/A";
  };
  const items: MenuProps["items"] = [
    {
      label: (
        <button
          onClick={() => {
            setViewDetailsData(selectedItem);
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
          onClick={() => {
            setShowEditModal(true);
          }}
          className="flex w-full items-center gap-2"
          type="button"
        >
          <Icon icon="mdi:pencil-outline" className="w-4 h-4" />
          Add to Inventory
        </button>
      ),
      key: "1",
    },
  ];
  const transformedData = data?.data.map((item: any) => ({
    key: item?.id,
    item: (
      <div className="flex items-center gap-2">
        <div className="h-[40px] w-[40px]">
          <ImageComponent
            isLoadingImage={isLoadingImage}
            setIsLoadingImage={setIsLoadingImage}
            aspectRatio="1/1"
            src={item?.inventory?.item?.image || "/images/empty_box.svg"}
            width={50}
            height={50}
            alt="image"
            className="h-[40px] w-[40px]  rounded-md"
          />
        </div>
        <div className="capitalize">
          <p className="font-[500] text-[15px]">
            {item?.inventory?.item?.material || "N/A"}
          </p>
          <p className="text-xs text-[#858D9D]">
            sku: {item?.inventory?.item?.sku || "N/A"}
          </p>
        </div>
      </div>
    ),
    // Export-friendly version
    item_text: `${item?.inventory?.item?.material || "N/A"} (SKU: ${
      item?.inventory?.item?.sku || "N/A"
    })`,
    scrape_type: (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          item?.type === "returned"
            ? "bg-blue-100 text-blue-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {capitalizeOnlyFirstLetter(item?.type || "N/A")}
      </span>
    ),
    // Export-friendly version
    scrape_type_text: capitalizeOnlyFirstLetter(item?.type || "N/A"),
    customer_name: item?.customer?.name || "N/A",
    store_name: item?.inventory?.store?.name || "N/A",
    quantity: item?.quantity || 0,
    comment: (
      <div className="max-w-[180px] truncate" title={item?.comment || "N/A"}>
        {item?.comment || "N/A"}
      </div>
    ),
    // Export-friendly version
    comment_text: item?.comment || "N/A",
    dateInitiated: newUserTimeZoneFormatDate(item?.created_at, "DD/MM/YYYY"),
    actions: (
      <div className="flex gap-2">
        <Dropdown menu={{ items }} trigger={["click"]}>
          <a
            className={`cursor-pointer hover:opacity-80 duration-150 ease-in-out font-semibold text-sm px-4 rounded-full text-gray-600 underline py-2`}
            onClick={() => {
              handleAddToInventory(item);
            }}
          >
            <Icon icon="uil:setting" width="24" height="24" />
          </a>
        </Dropdown>
      </div>
    ),
  }));

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

  const storeOptions =
    storesData?.data?.map((store: any) => ({
      label: store.name,
      value: store.id,
    })) || [];

  const itemOptions =
    data?.data?.map((item) => ({
      label: `${item.item?.material} - ${item.item?.weight || "N/A"}g`,
      value: item.item?.id,
    })) || [];

  // Add missing handler functions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev: any) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const result = await createInventoryScrapeItems({
        inventory_id: formValues.inventory_id,
        quantity: parseInt(formValues.quantity),
        customer: {
          name: formValues.customer_name,
          phone_number: formValues.customer_phone,
          email: formValues.customer_email,
        },
        type: (formValues.type as "returned" | "damaged") || "returned",
        comments: formValues.comments,
      }).unwrap();

      setIsOpenModal(false);
      setFormValues({
        inventory_id: "",
        quantity: "",
        customer_id: "",
        customer_name: "",
        customer_phone: "",
        customer_email: "",
        type: "returned",
        comments: "",
      });
      setFormErrors({});
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={
                <>
                  Inventory for{" "}
                  <span className="font-bold">
                    {inventoryList?.find(
                      (item) => item.value === formValues.inventory_id
                    )?.label || "N/A"}
                  </span>{" "}
                  added to scrape successfully.
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
    } catch (error: any) {
      console.error("Error creating scrape item:", error);
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Error"}
              title={
                <>
                  Failed to add scrape item for{" "}
                  <span className="font-bold">
                    {inventoryList?.find(
                      (item) => item.value === formValues.inventory_id
                    )?.label || "N/A"}
                  </span>{" "}
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

  const handleUpdateSubmit = async () => {
    try {
      const result = await addSingleScrapeItemToInventory({
        item_id: selectedItem.id,
        body: {
          quantity: parseInt(formValues.quantity || selectedItem.quantity),
        },
      }).unwrap();

      setShowEditModal(false);
      setFormValues({
        inventory_id: "",
        quantity: "",
        customer_id: "",
        customer_name: "",
        customer_phone: "",
        customer_email: "",
        type: "returned",
        comments: "",
      });
      setFormErrors({});
      setSelectedItem(null);
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={<>Scrape item added to inventory successfully.</>}
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
      console.error("Error adding item to inventory:", error);
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Error"}
              title={<>Failed to add scrape item to inventory</>}
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

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setFormValues({
      inventory_id: "",
      quantity: "",
      customer_id: "",
      customer_name: "",
      customer_phone: "",
      customer_email: "",
      type: "returned",
      comments: "",
    });
    setFormErrors({});
    setSelectedItem(null);
  };

  const handleAddToInventory = (item: any) => {
    setSelectedItem(item);
    setFormValues({
      quantity: item.quantity as any,
    });
  };

  // Filter out actions column for export/print
  const exportColumns = itemsScrapesColumns
    .filter(
      (column: any) =>
        column.key !== "actions" && column.dataIndex !== "actions"
    )
    .map((column: any) => {
      // Map complex fields to their text versions
      if (column.dataIndex === "item") {
        return { ...column, dataIndex: "item_text" };
      }
      if (column.dataIndex === "scrape_type") {
        return { ...column, dataIndex: "scrape_type_text" };
      }
      if (column.dataIndex === "comment") {
        return { ...column, dataIndex: "comment_text" };
      }
      return column;
    });

  return (
    <div className={``}>
      <Header
        search={search}
        setSearch={setSearch}
        showSearch={true}
        placeHolderText="Search"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="All Scrapes"
        showAddButton={true}
        btnText="Create Scrape Item"
        onClick={() => setIsOpenModal(true)}
      />
      <SharedLayout>
        <div className="">
          <ItemsFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            showBtn={false}
            hideSomeFilters={false}
            selectedFilterTypes={selectedFilterTypes}
            setSelectedFilterTypes={setSelectedFilterTypes}
            storeOptions={storeOptions}
            categoryOptions={transformedCategoryData || []}
            typeOptions={transformedTypesData || []}
            colourOptions={transformedColoursData || []}
            itemOptions={itemOptions as any}
            filterKeys={{
              essentialKeys: ["store_id", "inventory.item.category_id"],
              advancedKeys: [
                "inventory.item.type_id",
                "inventory.item.colour_id",
                "inventory.item.material",
                "item_id",
              ],
              typeKey: "inventory.item.type_id",
              colourKey: "inventory.item.colour_id",
              categoryKey: "inventory.item.category_id",
              materialKey: "inventory.item.material",
              storeKey: "store_id",
              itemKey: "item_id",
            }}
          />
        </div>
        <TableMainComponent
          DeleteModalText="Are you sure you want to delete this item?"
          data={selectedItem}
          deleteCardApi={() => {}}
          isDeleteLoading={false}
          printTitle="Scrape Items"
          showExportButton={true}
          showPrintButton={true}
          showDeleteModal={showDeleteModal}
          refetch={refetch}
          formValues={formValues}
          setShowDeleteModal={setShowDeleteModal}
          isLoading={isLoading}
          columnsTable={itemsScrapesColumns as any}
          exportColumns={exportColumns as any}
          transformedData={transformedData}
        />
        <div className="mt-4 mb-10 flex justify-end items-center  w-full">
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
          title="Create Scrape Item"
          onCloseModal={() => setIsOpenModal(false)}
        >
          <ScrapeITemsForm
            error={error}
            transformedColoursData={transformedColoursData}
            transformedTypesData={transformedTypesData}
            transformedCategoryData={transformedCategoryData}
            btnText="Create Scrape Item"
            inventoryList={inventoryList || []}
            isEditing={false}
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
          width={300}
          title="Add scrape to Inventory"
          onCloseModal={handleCloseEditModal}
        >
          <ScrapeITemsForm
            transformedColoursData={transformedColoursData}
            transformedTypesData={transformedTypesData}
            transformedCategoryData={transformedCategoryData}
            error={errorUpdate}
            setFormValues={setFormValues}
            btnText="Add to Inventory"
            isEditing={true}
            selectedItem={selectedItem}
            formErrors={formErrors}
            formValues={formValues}
            handleInputChange={handleInputChange}
            handleSubmit={handleUpdateSubmit}
            isLoadingCreate={isLoadingUpdate}
            setIsOpenModal={handleCloseEditModal}
          />
        </PlannerModal>
      )}
      {showViewDetailsModal && viewDetailsData && (
        <PlannerModal
          modalOpen={showViewDetailsModal}
          setModalOpen={setShowViewDetailsModal}
          className=""
          width={800}
          title="Scrape Details"
          onCloseModal={() => {
            setShowViewDetailsModal(false);
            setViewDetailsData(null);
          }}
        >
          <div className="space-y-4 md:space-y-6">
            {/* Item Information */}
            <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
              <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">
                Item Information
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                <div className="flex items-center gap-3 col-span-1 lg:col-span-2 xl:col-span-1">
                  <div className="h-[50px] w-[50px] md:h-[60px] md:w-[60px] flex-shrink-0">
                    <ImageComponent
                      isLoadingImage={isLoadingImage}
                      setIsLoadingImage={setIsLoadingImage}
                      aspectRatio="1/1"
                      src={
                        viewDetailsData?.inventory?.item?.image ||
                        "/images/empty_box.svg"
                      }
                      width={60}
                      height={60}
                      alt="image"
                      className="h-[50px] w-[50px] md:h-[60px] md:w-[60px] rounded-md"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm md:text-base truncate">
                      {viewDetailsData?.inventory?.item?.material || "N/A"}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500 truncate">
                      SKU: {viewDetailsData?.inventory?.item?.sku || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="space-y-1 md:space-y-2">
                  <div className="text-sm md:text-base">
                    <span className="font-medium">Category:</span>{" "}
                    <span className="break-words">
                      {getCategoryById(
                        viewDetailsData?.inventory?.item?.category_id
                      ) || "N/A"}
                    </span>
                  </div>
                  <div className="text-sm md:text-base">
                    <span className="font-medium">Type:</span>{" "}
                    <span className="break-words">
                      {getTypeById(viewDetailsData?.inventory?.item?.type_id) ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="text-sm md:text-base">
                    <span className="font-medium">Color:</span>{" "}
                    <span className="break-words">
                      {getColourById(
                        viewDetailsData?.inventory?.item?.colour_id
                      ) || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="space-y-1 md:space-y-2 lg:col-span-1">
                  <div className="text-sm md:text-base">
                    <span className="font-medium">Weight:</span>{" "}
                    {viewDetailsData?.inventory?.item?.weight || "N/A"}g
                  </div>
                </div>
              </div>
            </div>

            {/* Scrape Information */}
            <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
              <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">
                Scrape Information
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-1 md:space-y-2">
                  <div className="text-sm md:text-base">
                    <span className="font-medium">Type:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        viewDetailsData?.type === "returned"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {capitalizeOnlyFirstLetter(
                        viewDetailsData?.type || "N/A"
                      )}
                    </span>
                  </div>
                  <div className="text-sm md:text-base">
                    <span className="font-medium">Quantity:</span>{" "}
                    {viewDetailsData?.quantity || 0}
                  </div>
                  <div className="text-sm md:text-base">
                    <span className="font-medium">Date Created:</span>{" "}
                    <span className="break-words">
                      {newUserTimeZoneFormatDate(
                        viewDetailsData?.created_at,
                        "DD/MM/YYYY HH:mm"
                      )}
                    </span>
                  </div>
                </div>
                <div className="space-y-1 md:space-y-2">
                  <div className="text-sm md:text-base">
                    <span className="font-medium">Comment:</span>
                  </div>
                  <div className="bg-white p-2 md:p-3 rounded border text-xs md:text-sm break-words">
                    {viewDetailsData?.comment || "No comment provided"}
                  </div>
                </div>
              </div>
            </div>

            {/* Store Information */}
            <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
              <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">
                Store Information
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-1 md:space-y-2">
                  <div className="text-sm md:text-base">
                    <span className="font-medium">Store Name:</span>{" "}
                    <span className="break-words">
                      {viewDetailsData?.inventory?.store?.name || "N/A"}
                    </span>
                  </div>
                  <div className="text-sm md:text-base">
                    <span className="font-medium">Address:</span>{" "}
                    <span className="break-words">
                      {viewDetailsData?.inventory?.store?.address || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="space-y-1 md:space-y-2">
                  <div className="text-sm md:text-base">
                    <span className="font-medium">Is Headquarters:</span>{" "}
                    {viewDetailsData?.inventory?.store?.is_warehouse === "1"
                      ? "Yes"
                      : "No"}
                  </div>
                  <div className="text-sm md:text-base">
                    <span className="font-medium">Inventory Quantity:</span>{" "}
                    {viewDetailsData?.inventory?.quantity || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information (if available) */}
            {viewDetailsData?.customer && (
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-1 md:space-y-2">
                    <div className="text-sm md:text-base">
                      <span className="font-medium">Name:</span>{" "}
                      <span className="break-words">
                        {viewDetailsData?.customer?.name || "N/A"}
                      </span>
                    </div>
                    <div className="text-sm md:text-base">
                      <span className="font-medium">Email:</span>{" "}
                      <span className="break-words">
                        {viewDetailsData?.customer?.email || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <div className="text-sm md:text-base">
                      <span className="font-medium">Phone:</span>{" "}
                      <span className="break-words">
                        {viewDetailsData?.customer?.phone_number || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </PlannerModal>
      )}
    </div>
  );
};

export default index;
