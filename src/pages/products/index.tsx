import AttributeHeader from "@/components/Attributes/AttributeHeader";
import TableMainComponent from "@/components/Attributes/TableMainComponent";
import Header from "@/components/header";
import ItemsFilter from "@/components/ItemComponent/ItemsFilter";
import PermissionGuard from "@/components/RolesPermission/PermissionGuard";
import ImageComponent from "@/components/sharedUI/ImageComponent";
import PaginationComponent from "@/components/sharedUI/PaginationComponent";
import PlannerModal from "@/components/sharedUI/PlannerModal";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import { useCheckPermission } from "@/hooks/useCheckPermission";
import { useGetAllStoresQuery } from "@/services/admin/store";
import { useGetAllAttributesQuery } from "@/services/attributes-values/attributes";
import { useGetAllAttributeValuesQuery } from "@/services/attributes-values/values";
import { useGetAllCategoryQuery } from "@/services/category";
import {
  useDeleteProductsMutation,
  useGetAllProductsQuery,
} from "@/services/products/product-list";
import { useGetAllProductVariantsQuery } from "@/services/products/variant/variant-product-list";
import { newUserTimeZoneFormatDate } from "@/utils/fx";
import { Icon } from "@iconify/react/dist/iconify.js";

import { Dropdown, MenuProps } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

const index = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilterTypes, setSelectedFilterTypes] = useState<any>(null);
  const [isViewProductListModal, setIsViewProductListModal] = useState(false);
  const [filters, setFilters] = useState<{
    out_of_stock?: string;
    low_stock?: number;
    "variants.id"?: string | string[];
    "variants.sku"?: string | string[];
    "categories.id"?: string | string[];
    "attributeValues.attribute.id"?: string | string[];
    "attributeValues.id"?: string | string[];
  }>({});
  const {
    hasPermission: hasCreatePermission,
    isLoading: isLoadingCreatePermission,
  } = useCheckPermission("products.create");
  // delete and edit permissions can be added similarly
  const {
    hasPermission: hasDeletePermission,
    isLoading: isLoadingDeletePermission,
  } = useCheckPermission("products.delete");
  console.log("🚀 ~ index ~ hasDeletePermission:", hasDeletePermission);
  const {
    hasPermission: hasUpdatePermission,
    isLoading: isLoadingUpdatePermission,
  } = useCheckPermission("products.update");
  const router = useRouter();
  const { data, isLoading, refetch } = useGetAllProductsQuery({
    paginate: true,
    per_page: 15,
    page: currentPage,
    q: search,
    include: "variants,images,attributeValues,categories",
    filter: {
      ...filters,
    },
  });
  const [deleteProducts, { isLoading: isDeleteLoading }] =
    useDeleteProductsMutation();
  const {
    data: getAllCategory,
    refetch: refetchCategory,
    isLoading: isLoadingCategory,
  } = useGetAllCategoryQuery({
    q: search,
    paginate: false,
  });

  const [formValues, setFormValues] = useState({});
  const [selectedItem, setSelectedItem] = useState<any>(null);
  console.log("🚀 ~ index ~ selectedItem:", selectedItem);
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

  // Note: We no longer use a single shared `items` that depends on selectedItem.
  // Instead, we build per-row menu items using the local `prod` in transformedData.
  // Build transformed data for core products with counts
  const transformedData = useMemo(
    () =>
      data?.data.map((prod) => ({
        key: prod?.id,
        product: (
          <div className="flex items-center gap-3 min-w-[220px]">
            <div className="h-10 w-10 flex-shrink-0">
              <ImageComponent
                isLoadingImage={isLoadingImage}
                setIsLoadingImage={setIsLoadingImage}
                aspectRatio="1/1"
                src={prod?.images?.[0]?.url || "/images/empty_box.svg"}
                width={40}
                height={40}
                alt="thumb"
                className="h-10 w-10 rounded-md object-cover"
              />
            </div>
            <div className="flex flex-col">
              <Link
                href={`/products/${prod?.id}`}
                className="font-[600] text-base text-black hover:underline line-clamp-1"
                title={prod?.name}
              >
                {prod?.name || "Unnamed product"}
              </Link>
              {prod?.short_description ? (
                <p className="text-[11px] text-[#667085] line-clamp-1">
                  {prod?.short_description.length > 15
                    ? prod?.short_description.substring(0, 15) + "..."
                    : prod?.short_description}
                </p>
              ) : null}
            </div>
          </div>
        ),
        product_text: prod?.name || "",
        variants_count: prod?.variants?.length || 0,
        images_count: prod?.images?.length || 0,
        dateInitiated: newUserTimeZoneFormatDate(
          prod?.created_at || prod?.updated_at,
          "DD/MM/YYYY"
        ),
        action: (
          <div className="flex items-center space-x-2">
            {(() => {
              const items: MenuProps["items"] = [
                {
                  label: (
                    <Link href={`/products/${prod?.id}`}>
                      <button
                        className="flex w-full items-center gap-2"
                        type="button"
                      >
                        View
                      </button>
                    </Link>
                  ),
                  key: "view",
                },
                isLoadingUpdatePermission
                  ? null
                  : hasUpdatePermission
                  ? {
                      label: (
                        <Link href={`/products/edit/${prod?.id}`}>
                          <button
                            className="flex w-full items-center gap-2"
                            type="button"
                          >
                            Edit
                          </button>
                        </Link>
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
                            setSelectedItem(prod);
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
              ];
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
      })) || [],
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

  // Get attributes data for filter options
  const { data: attributesData } = useGetAllAttributesQuery({
    paginate: false,
    include: "values",
  });

  // Get attribute values data for filter options
  const { data: attributeValuesData } = useGetAllAttributeValuesQuery({
    paginate: false,
    include: "attribute",
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

  const itemOptions =
    data?.data?.map((prod: any) => ({
      label: prod?.name || "Unnamed product",
      value: prod?.id,
    })) || [];

  // Transform attributes data for filter options
  const attributeOptions =
    attributesData?.data?.map((attribute: any) => ({
      label: attribute.name,
      value: attribute.id,
    })) || [];

  // Transform attribute values data for filter options
  const attributeValueOptions =
    attributeValuesData?.data?.map((attributeValue: any) => ({
      label: `${attributeValue.attribute?.name}: ${attributeValue.value}`,
      value: attributeValue.id,
    })) || [];

  // Transform variants data for filter options
  const variantOptions =
    variantsData?.data?.map((variant: any) => ({
      label: `${variant.name} (${variant.product?.name || "Product"})`,
      value: variant.id,
    })) || [];

  // Transform variants SKU data for filter options
  const variantSkuOptions =
    variantsData?.data
      ?.filter((variant: any) => variant.sku)
      ?.map((variant: any) => ({
        label: `${variant.sku} - ${variant.name}`,
        value: variant.sku,
      })) || [];

  // Define columns for core products
  const columns = useMemo(
    () => [
      {
        title: "Product",
        dataIndex: "product",
        width: 200,
      },
      {
        title: "Variants",
        dataIndex: "variants_count",
        width: 120,
      },
      {
        title: "Images",
        dataIndex: "images_count",
        width: 120,
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
      { title: "Variants", dataIndex: "variants_count" },
      { title: "Images", dataIndex: "images_count" },
      { title: "Created", dataIndex: "dateInitiated" },
    ],
    []
  );

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
        showAddButton={isLoadingCreatePermission ? false : hasCreatePermission}
        btnText="Add New Product"
        onClick={() => {
          router.push("/products/create");
        }}
      />
      <SharedLayout className="bg-white">
        <PermissionGuard permission="products.viewAny">
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
              typeOptions={[]}
              colourOptions={[]}
              itemOptions={itemOptions as any}
              // Product-specific filter options
              variantOptions={variantOptions}
              variantSkuOptions={variantSkuOptions}
              attributeOptions={attributeOptions}
              attributeValueOptions={attributeValueOptions}
              filterKeys={{
                // keep basic keys available but use categories.id instead of item.category_id
                essentialKeys: ["categories.id"],
                advancedKeys: [
                  "variants.id",
                  "variants.sku",
                  "attributeValues.attribute.id",
                  "attributeValues.id",
                  "out_of_stock",
                  "low_stock",
                ],
                categoryKey: "categories.id",
                stockKey: "out_of_stock",
                lowStockKey: "low_stock",
                variantsIdKey: true,
                variantsSkuKey: true,
                attributeKey: true,
                attributeValueKey: true,
              }}
            />
          </div>
          <TableMainComponent
            DeleteModalText={selectedItem?.name}
            data={selectedItem}
            deleteCardApi={deleteProducts}
            isDeleteLoading={isDeleteLoading}
            printTitle="Products"
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
      {isViewProductListModal && (
        <PlannerModal
          modalOpen={isViewProductListModal}
          setModalOpen={setIsViewProductListModal}
          className=""
          width={850}
          title="View ProductList"
          onCloseModal={() => setIsViewProductListModal(false)}
        ></PlannerModal>
      )}
    </div>
  );
};

export default index;
