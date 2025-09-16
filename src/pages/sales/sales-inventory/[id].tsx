import AttributeHeader from "@/components/Attributes/AttributeHeader";
import TableMainComponent from "@/components/Attributes/TableMainComponent";
import Header from "@/components/header";
import { salesInventoriesColumns } from "@/components/Items/itemsColumns";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import {
  useCreateSalesMutation,
  useGetSingleSalesQuery,
  useUpdateSalesMutation,
} from "@/services/sales/sales";
import { SalesDatum } from "@/types/SalesTypes";
import {
  capitalizeOnlyFirstLetter,
  formatCurrency,
  newUserTimeZoneFormatDate,
} from "@/utils/fx";
import { useRouter } from "next/router";
import { useState } from "react";
const index = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    customer_name: "",
    customer_phone_number: "",
    customer_email: "",
    payment_method: "",
    sale_inventories: [{ inventory_id: "", quantity: "", price_per_gram: "" }],
  });
  const [selectedItem, setSelectedItem] = useState<SalesDatum | null>(null);
  console.log("🚀 ~ index ~ selectedItem:", selectedItem);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [createSales, { isLoading: isLoadingCreate, error }] =
    useCreateSalesMutation();
  const [updateSales, { isLoading: isLoadingUpdate, error: errorUpdate }] =
    useUpdateSalesMutation();

  const { data, refetch, isLoading } = useGetSingleSalesQuery({
    id: router.query.id as string,
    include: "saleInventories.inventory.item",
  });

  const transformedData = data?.data?.sale_inventories?.map((item) => ({
    key: item?.id,
    customer_name: (
      <div className="flex items-center gap-2">{data?.data?.customer_name}</div>
    ),
    payment_method: (
      <div className="flex items-center gap-2">
        {data?.data?.payment_method}
      </div>
    ),
    amount: (
      <span className=" font-[500]">
        {formatCurrency(item?.total_price || 0)}
      </span>
    ),

    price_per_gram: (
      <span className=" font-[500]">
        {formatCurrency(item?.price_per_gram || 0)}
      </span>
    ),
    quantity: (
      <span className=" font-[500] text-center">{item?.quantity || "-"}</span>
    ),
    weight: (
      <span className=" font-[500] text-center">{item?.weight || "-"}</span>
    ),

    dateInitiated: newUserTimeZoneFormatDate(item?.created_at, "DD/MM/YYYY"),
  }));

  return (
    <div className={``}>
      <Header
        search={search}
        setSearch={setSearch}
        showSearch={false}
        placeHolderText="Search product, supplier, order"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="Sales Inventories"
        showAddButton={false}
        btnText=""
        onClick={() => {}}
      />
      <SharedLayout className="bg-white">
        {isLoading ? (
          <SkeletonLoaderForPage />
        ) : (
          <>
            <TableMainComponent
              DeleteModalText={
                <>{capitalizeOnlyFirstLetter(selectedItem?.customer_name!)}</>
              }
              data={selectedItem}
              deleteCardApi={() => {}}
              isDeleteLoading={false}
              showDeleteModal={showDeleteModal}
              refetch={refetch}
              formValues={formValues}
              setShowDeleteModal={setShowDeleteModal}
              isLoading={false}
              columnsTable={salesInventoriesColumns as any}
              transformedData={transformedData}
            />
          </>
        )}
      </SharedLayout>
    </div>
  );
};

export default index;
