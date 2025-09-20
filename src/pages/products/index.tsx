import AttributeHeader from "@/components/Attributes/AttributeHeader";
import TableMainComponent from "@/components/Attributes/TableMainComponent";
import Header from "@/components/header";
import ItemsFilter from "@/components/ItemComponent/ItemsFilter";
import { itemsColumns } from "@/components/Items/itemsColumns";
import ImageComponent from "@/components/sharedUI/ImageComponent";
import PaginationComponent from "@/components/sharedUI/PaginationComponent";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import { useGetAllStoresQuery } from "@/services/admin/store";
import { useGetAllCategoryQuery } from "@/services/category";
import { useGetAllColoursQuery } from "@/services/colour";
import { useGetAllInventoryItemsQuery } from "@/services/InventoryItem";
import { useGetAllTypesQuery } from "@/services/types";
import { formatCurrency, newUserTimeZoneFormatDate } from "@/utils/fx";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Image as AntImage } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";

const index = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilterTypes, setSelectedFilterTypes] = useState<any>(null);
  const [filters, setFilters] = useState<{
    store_id?: string;
    item_id?: string;
    "item.type_id"?: string;
    "item.colour_id"?: string;
    "item.category_id"?: string;
    "item.material"?: string;
    out_of_stock?: string;
    low_stock?: number;
  }>({});

  const router = useRouter();
  const { data, isLoading, refetch } = useGetAllInventoryItemsQuery({
    paginate: true,
    per_page: 15,
    page: currentPage,
    q: search,
    include: "store,item.category",
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
  const [formValues, setFormValues] = useState({});
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
  const transformedTypesData = getAllTypesData?.data.map((item:any) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  const transformedColoursData = getAllColoursData?.data.map((item:any) => {
    return {
      label: item.name,
      value: item.id,
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
    const colour = transformedColoursData?.find((item: any) => item.value === id);
    return colour ? colour.label : "N/A";
  };
  const transformedData = data?.data.map((item) => ({
    key: item?.id,
    item: (
      <div className="flex items-center gap-2">
        <div className="h-[40px] w-[40px]">
          <ImageComponent
            isLoadingImage={isLoadingImage}
            setIsLoadingImage={setIsLoadingImage}
            aspectRatio="1/1"
            src={item?.item?.image || "/images/empty_box.svg"}
            width={50}
            height={50}
            alt="image"
            className="h-[40px] w-[40px]  rounded-md"
          />
        </div>
        <div className="capitalize">
          <p className="font-[500] text-[15px]">{item?.item?.material}</p>
          <p className="text-xs text-[#858D9D]">
            sku: {item?.item?.sku || "N/A"}
          </p>
        </div>
      </div>
    ),
    // Export-friendly version
    item_text: `${item?.item?.material} (SKU: ${item?.item?.sku || "N/A"})`,
    category: getCategoryById((item as any)?.item?.category_id),
    type: getTypeById((item as any)?.item?.type_id),
    store_name: (item as any)?.store?.name,
    store_location: (item as any)?.store?.address,
    color: getColourById((item as any)?.item?.colour_id),
    barcode: (
      <div className="flex flex-col items-center">
        <AntImage
          src={item?.item?.barcode! || "/images/empty_box.svg"}
          onError={(error) => {
            error.currentTarget.src = "/images/empty_box.svg";
          }}
          width={40}
          height={30}
          alt="barcode"
          className="border rounded-md object-contain"
          preview={{
            mask: (
              <div className="flex flex-col items-center">
                <Icon icon="carbon:view" width="16" height="16" />
                <span className="text-xs">View</span>
              </div>
            ),
            maskClassName: "custom-mask flex flex-col items-center",
            rootClassName: "custom-preview-root",
            style: { backgroundColor: "#fff" },
            imageRender: () => {
              return (
                <div className="flex flex-col items-center justify-center gap-3 h-full">
                  {/* <p className="text-sm font-medium">
                    SKU: {item?.item?.sku || "N/A"}
                  </p> */}
                  <img
                    src={item?.item?.barcode! || "/images/empty_box.svg"}
                    style={{
                      width: "120px", // Reduced from 250px to 120px
                      height: "auto",
                      objectFit: "contain",
                    }}
                    alt="barcode"
                  />
                  <div className="flex flex-row gap-2 mt-10">
                    <button
                      className="bg-primary-40 text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1"
                      onClick={() => {
                        const printWindow = window.open("", "_blank");
                        if (printWindow) {
                          (printWindow.document as any).write(`
                              <html>
                                <head><title>Print Barcode</title></head>
                                <body style="margin: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh;">
                                 
                                  <img 
                                    src="${
                                      item?.item?.barcode! ||
                                      "/images/empty_box.svg"
                                    }" 
                                    style="max-width: 100%; width: 120px; height: auto;"
                                    onload="window.print(); window.close();"
                                  />
                                </body>
                              </html>
                            `);
                          printWindow.document.close();
                        }
                      }}
                    >
                      <Icon icon="ph:printer" width="12" height="12" />
                      Print Small
                    </button>
                    <button
                      className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-xs flex items-center gap-1"
                      onClick={() => {
                        const printWindow = window.open("", "_blank");
                        if (printWindow) {
                          printWindow.document.write(`
                              <html>
                                <head><title>Print Barcode</title></head>
                                <body style="margin: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh;">
                                  
                                  <img 
                                    src="${
                                      item?.item?.barcode! ||
                                      "/images/empty_box.svg"
                                    }"
                                    style="max-width: 100%; width: 200px; height: auto;"
                                    onload="window.print(); window.close();"
                                  />
                                </body>
                              </html>
                            `);
                          printWindow.document.close();
                        }
                      }}
                    >
                      <Icon icon="ph:printer-fill" width="12" height="12" />
                      Print Large
                    </button>
                  </div>
                </div>
              );
            },
          }}
        />
        <span className="text-xs mt-1 text-gray-500">
          {item?.item?.sku || "N/A"}
        </span>
      </div>
    ),
    // Export-friendly version
    barcode_text: item?.item?.sku || "N/A",
    weight: (item as any)?.item?.weight,
    price: formatCurrency((item as any)?.item?.price || 0),
    // Export-friendly version
    price_text: (item as any)?.item?.price || 0,
    quantity: item?.quantity || 0,
    dateInitiated: newUserTimeZoneFormatDate(
      item?.created_at || item?.updated_at,
      "DD/MM/YYYY"
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

  // Create export columns with text versions
  const exportColumns = itemsColumns
    .filter(
      (column: any) =>
        column.key !== "actions" && column.dataIndex !== "actions"
    )
    .map((column: any) => {
      // Map complex fields to their text versions
      if (column.dataIndex === "item") {
        return { ...column, dataIndex: "item_text" };
      }
      if (column.dataIndex === "barcode") {
        return { ...column, dataIndex: "barcode_text" };
      }
      if (column.dataIndex === "price") {
        return { ...column, dataIndex: "price_text" };
      }
      return column;
    });

  return (
    <div className={``}>
      <Header
        search={search}
        setSearch={setSearch}
        showSearch={true}
        placeHolderText="Search product, supplier, order"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="All Products"
        showAddButton={true}
        btnText="Add New Product"
        onClick={() => {}}
      />
      <SharedLayout>
        <div className="">
          <ItemsFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            showBtn={false}
            selectedFilterTypes={selectedFilterTypes}
            setSelectedFilterTypes={setSelectedFilterTypes}
            storeOptions={storeOptions}
            categoryOptions={transformedCategoryData || []}
            typeOptions={transformedTypesData || []}
            colourOptions={transformedColoursData || []}
            itemOptions={itemOptions as any}
          />
        </div>
        <TableMainComponent
          DeleteModalText="Are you sure you want to delete this item?"
          data={selectedItem}
          deleteCardApi={() => {}}
          isDeleteLoading={false}
          printTitle="Inventory Items"
          showExportButton={true}
          showPrintButton={true}
          showDeleteModal={showDeleteModal}
          refetch={refetch}
          formValues={formValues}
          setShowDeleteModal={setShowDeleteModal}
          isLoading={isLoading}
          columnsTable={itemsColumns as any}
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
    </div>
  );
};

export default index;
