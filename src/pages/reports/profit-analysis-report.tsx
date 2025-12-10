import AttributeHeader from "@/components/Attributes/AttributeHeader";
import Header from "@/components/header";
import PermissionGuard from "@/components/RolesPermission/PermissionGuard";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import { useGetAllProductsQuery } from "@/services/products/product-list";
import { useGetAllProfitAnalysisReportQuery } from "@/services/reports";
import { useState } from "react";

const index = () => {
  const [productSearch, setProductSearch] = useState<string>("");
  const { data, isLoading, isFetching } = useGetAllProfitAnalysisReportQuery({
    filter: {
      start_date: "", // yyyy-mm-dd {ant design range picker}
      end_date: "", // yyyy-mm-dd
      product_id: "", // {select input}
    },
  });

    const { data: allProducts, isLoading: isLoadingProducts } =
      useGetAllProductsQuery({
        paginate: true,
        per_page: 20,
        page: 1,
        q: productSearch,
        include: "images", // Minimized include for search performance
      });

  return (
    <div className={``}>
      <Header
        search={""}
        setSearch={() => {}}
        showSearch={false}
        placeHolderText="Search customers"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="Profit Analysis Report"
        btnText={""}
        showAddButton={false}
        onClick={() => {}}
      />
      <SharedLayout className="bg-white">
        <PermissionGuard permission="reports.view-financial">
          {isLoading ? (
            <SkeletonLoaderForPage />
          ) : (
            <>
              {/* <TableMainComponent
                DeleteModalText={
                  <>{capitalizeOnlyFirstLetter(selectedItem?.name!)}</>
                }
                data={selectedItem}
                deleteCardApi={deleteCustomer}
                isDeleteLoading={isDeleteLoading}
                printTitle="Customers"
                showExportButton={true}
                showPrintButton={true}
                showDeleteModal={showDeleteModal}
                refetch={refetch}
                formValues={formValues}
                setShowDeleteModal={setShowDeleteModal}
                isLoading={false}
                columnsTable={customerColumns as any}
                exportColumns={exportColumns as any}
                transformedData={transformedData}
              /> */}
            </>
          )}
        </PermissionGuard>
      </SharedLayout>
    </div>
  );
};

export default index;
