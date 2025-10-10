import AttributeHeader from "@/components/Attributes/AttributeHeader";
import TableMainComponent from "@/components/Attributes/TableMainComponent";
import { CustomerForm } from "@/components/Forms/CustomerForm";
import { SalesForm } from "@/components/Forms/SalesForm";
import Header from "@/components/header";
import InvoiceReceipt from "@/components/Invoice/InvoiceReceipt";
import { salesColumns } from "@/components/Items/itemsColumns";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import PaginationComponent from "@/components/sharedUI/PaginationComponent";
import PlannerModal from "@/components/sharedUI/PlannerModal";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";
import { useGetAllDiscountAdminQuery } from "@/services/admin/discount";
import { useGetAllInventoryQuery } from "@/services/inventories";
import {
  useCreateSalesMutation,
  useDeleteSalesMutation,
  useGetAllSalesQuery,
  useUpdateSalesMutation,
} from "@/services/sales/sales";
import { InventoryDatum } from "@/types/inventoryListType";
import { SalesDatum } from "@/types/SalesTypes";
import debounce from "@/utils/debounce";
import {
  capitalizeOnlyFirstLetter,
  formatCurrency,
  newUserTimeZoneFormatDate,
} from "@/utils/fx";
import { customerSchema, inventorySchema } from "@/validation/authValidate";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Dropdown, MenuProps } from "antd";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import imgError from "/public/states/notificationToasts/error.svg";
import imgSuccess from "/public/states/notificationToasts/successcheck.svg";
import { useCreateCustomerMutation, useGetAllCustomersQuery } from "@/services/customers";

interface InventoryCategory {
  name?: string;
}

interface InventoryItem {
  material?: string;
  weight?: number | string;
  price?: number;
  category_id?: number | string;
  category?: InventoryCategory;
}

interface InventoryDataItem {
  id: string | number;
  item?: InventoryItem;
}

interface InventoryListItem {
  label: string;
  value: string | number;
  price?: number | string;
  quantity?: number; // available quantity from inventory
  cost_price?: string; // cost price from product variant
}
const index = () => {
  const [search, setSearch] = useState("");
  const [selectedFilterTypes, setSelectedFilterTypes] = useState<any>(null);
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    customer_id: "",
    payment_method: "",
    discount_code: "",
    sale_inventories: [{ inventory_id: "", quantity: "" }],
  });
  const [selectedItem, setSelectedItem] = useState<SalesDatum | null>(null);
  console.log("🚀 ~ index ~ selectedItem:", selectedItem);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [inventorySearch, setInventorySearch] = useState<string>("");
  const [customerSearch, setCustomerSearch] = useState<string>("");
  const [discountSearch, setDiscountSearch] = useState<string>("");
  const [isOpenCustomerModal, setIsOpenCustomerModal] = useState(false);
  const [formCustomerValues, setFormCustomerValues] = useState({
    name: "",
    email: "",
    phone_number: "",
    country: "",
    city: "",
    address: "",
  });
  const [formCustomerErrors, setFormCustomerErrors] = useState<{
    [key: string]: string;
  }>({});

  const [createSales, { isLoading: isLoadingCreate, error }] =
    useCreateSalesMutation();
  const [updateSales, { isLoading: isLoadingUpdate, error: errorUpdate }] =
    useUpdateSalesMutation();
  const [createCustomer, { isLoading: isLoadingCustomerCreate, error: errorCustomerCreate }] =
    useCreateCustomerMutation();
    const { data: customerData, isLoading: isLoadingCustomers,refetch: refetchCustomers } =
      useGetAllCustomersQuery({
        paginate: true,
        per_page: 50,
        page: 1,
        q: customerSearch,
      }, { refetchOnMountOrArgChange: true });
  const { data, refetch, isLoading } = useGetAllSalesQuery({
    q: search,
    page: currentPage,
    include:
      "saleInventories.inventory.productVariant,discount,cashier.user,buyerable",
    per_page: 15,
    paginate: true,
  });
  const { data: inventoryData, refetch: refetchInventory } =
    useGetAllInventoryQuery({
      paginate: false,
      per_page: 50,
      page: currentPage,
      q: inventorySearch,
    });
  const {
    data: discountData,
    refetch: refetchDiscount,
    isLoading: isLoadingDiscount,
  } = useGetAllDiscountAdminQuery({
    paginate: true,
    per_page: 50,
    page: currentPage,
    q: discountSearch,
    filter: {
      is_active: 1,
    },
  });
  console.log("🚀 ~ index ~ inventoryData:", inventoryData);
  const debouncedInventorySearch = useMemo(
    () => debounce((q: string) => setInventorySearch(q.trim()), 400),
    []
  );
  const debouncedDiscountSearch = useMemo(
    () => debounce((q: string) => setDiscountSearch(q.trim()), 400),
    []
  );
  const debouncedCustomerSearch = useMemo(
    () => debounce((q: string) => setCustomerSearch(q.trim()), 400),
    []
  );

  const [deleteSales, { isLoading: isDeleteLoading }] =
    useDeleteSalesMutation();
  const [showInvoice, setShowInvoice] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormCustomerValues((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    if (selectedItem && showEditModal) {
      setFormValues({
        customer_id: (selectedItem as any)?.buyerable_id || "",
        payment_method: selectedItem?.payment_method || "",
        discount_code: (selectedItem as any)?.metadata?.discount?.code || "",
        sale_inventories:
          selectedItem?.sale_inventories?.map((saleItem: any) => ({
            id: saleItem?.id || null,
            inventory_id: saleItem?.inventory_id || "",
            quantity: saleItem?.quantity || "",
            cost_price:
              (inventoryList || []).find(
                (opt) => opt.value === saleItem?.inventory_id
              )?.cost_price ||
              saleItem?.price_per_gram ||
              "",
          })) || [],
      });
    }
  }, [selectedItem, showEditModal]);
  const items: MenuProps["items"] = [
    {
      label: (
        <button
          onClick={() => {
            // You need to pass the correct item here when rendering the menu
            // setSelectedItem(item);
            setShowEditModal(true);
          }}
          className="flex w-full items-center gap-2"
          type="button"
        >
          Edit sale
        </button>
      ),
      key: "1",
    },
    {
      label: (
        <button
          onClick={() => {
            router.push(
              `/sales/sales-inventory/${selectedItem?.id}?customer_name=${selectedItem?.customer_name}`
            );
          }}
          className="flex w-full items-center gap-2"
          type="button"
        >
          View details
        </button>
      ),
      key: "4",
    },
    {
      label: (
        <button
          onClick={() => {
            setShowInvoice(true);
          }}
          className="flex w-full items-center gap-2"
          type="button"
        >
          View invoice
        </button>
      ),
      key: "2",
    },

    {
      label: (
        <button
          onClick={() => {
            setShowDeleteModal(true);
          }}
          className="flex w-full items-center text-red-500 gap-2"
          type="button"
        >
          Delete
        </button>
      ),
      key: "3",
    },
  ];
  const transformedData = data?.data?.map((item) => ({
    key: item?.id,
    invoice_number: (
      <span className="font-[500]">{item?.invoice_number || "-"}</span>
    ),
    customer_name: (
      <div className="flex items-center gap-2">
        {(item as any)?.buyerable?.name}
      </div>
    ),
    items_count: (
      <span className="font-[500] text-center">
        {item?.sale_inventories?.length || 0}
      </span>
    ),
    payment_method: (
      <div className="flex items-center gap-2">
        {item?.payment_method ?? "-"}
      </div>
    ),
    channel: (
      <span className="font-[500]">{(item as any)?.channel ?? "-"}</span>
    ),
    subtotal_price: (
      <span className="font-[500]">
        {formatCurrency((item as any)?.subtotal_price || 0)}
      </span>
    ),
    discount_percentage: (
      <span className="font-[500]">
        {
          ((item as any)?.metadata?.discount?.percentage
            ? `${(item as any)?.metadata?.discount?.percentage}%`
            : "-") as any
        }
      </span>
    ),
    total_price: (
      <span className="font-[600]">
        {formatCurrency(item?.total_price || 0)}
      </span>
    ),
    cashier_name: (
      <span>
        {(item as any)?.cashier?.user
          ? `${(item as any)?.cashier?.user?.first_name ?? ""} ${
              (item as any)?.cashier?.user?.last_name ?? ""
            }`.trim()
          : "-"}
      </span>
    ),
    dateInitiated: newUserTimeZoneFormatDate(item?.created_at, "DD/MM/YYYY"),

    action: (
      <div className="flex items-center space-x-2">
        <Dropdown menu={{ items }} trigger={["click"]}>
          <a
            className={`cursor-pointer hover:opacity-80 duration-150 ease-in-out font-semibold text-sm px-4 rounded-full text-gray-600 underline py-2`}
            onClick={(e) => {
              e.preventDefault();
              setSelectedItem(item);
              const itemToEdit = item; // Store the item in a local variable
              setSelectedItem(itemToEdit);
              // Directly set form values here to ensure correct data is used
              setFormValues({
                customer_id: (itemToEdit as any)?.customer_user_id || "",
                payment_method: itemToEdit?.payment_method || "",
                discount_code:
                  (itemToEdit as any)?.metadata?.discount?.code || "",
                sale_inventories:
                  itemToEdit?.sale_inventories?.map((saleItem: any) => ({
                    id: saleItem?.id || null,
                    inventory_id: saleItem?.inventory_id || "",
                    quantity: saleItem?.quantity || "",
                    cost_price:
                      (inventoryList || []).find(
                        (opt) => opt.value === saleItem?.inventory_id
                      )?.cost_price ||
                      saleItem?.price_per_gram ||
                      "",
                  })) || [],
              });
            }}
          >
            <Icon icon="uil:setting" width="24" height="24" />
          </a>
        </Dropdown>
      </div>
    ),
  }));
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch();
  };

  const inventoryList: InventoryListItem[] | undefined =
    inventoryData?.data.map((item: InventoryDatum): InventoryListItem => {
      const qty = 1;
      const price = Number(item?.product_variant?.cost_price) || 0;
      return {
        label: `${item?.product_variant?.name} - ${formatCurrency(
          qty * price
        )}`,
        value: item.id,
        price: item?.product_variant?.price,
        quantity: item?.quantity,
        cost_price: item?.product_variant?.cost_price,
      };
    });
  console.log("🚀 ~ inventoryList:", inventoryList);

  const handleSubmit = async () => {
    try {
      // Validate form values using yup
      await inventorySchema.validate(formValues, {
        abortEarly: false,
      });
      // Clear previous form errors if validation is successful
      setFormErrors({});

      // Prepare the payload with the correct field name
      const payload = {
        customer_id: formValues.customer_id,
        payment_method: formValues.payment_method,
        discount_code: formValues.discount_code,
        sale_inventories: formValues.sale_inventories.map((item) => ({
          inventory_id: item.inventory_id,
          quantity: Number(item.quantity),
        })),
      };
      // Proceed with server-side submission
      const response = await createSales(payload).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={"Sale Created Successfully"}
              image={imgSuccess}
              textColor="green"
              message={"Thank you..."}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Sale has been recorded successfully.",
      });
      refetch();
      refetchInventory();
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
                title={"Sale Creation Failed"}
                image={imgError}
                textColor="red"
                message={(err as any)?.data?.message || "Something went wrong"}
                backgroundColor="#FCFCFD"
              />
            ),
          },
          message: "Failed to create sale",
        });
      }
    }
  };
  const handleCustomerSubmit = async () => {
    try {
      // Validate form values using yup
      await customerSchema.validate(formCustomerValues, {
        abortEarly: false,
      });

      // Clear previous form errors if validation is successful
      setFormCustomerErrors({});
      let payload = {
        name: formCustomerValues.name,
        email: formCustomerValues.email,
        phone_number: formCustomerValues.phone_number,
        country: formCustomerValues.country,
        city: formCustomerValues.city,
        address: formCustomerValues.address,
      };

      // Proceed with server-side submission
      const response = await createCustomer(payload).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={"Customer Created Successfully"}
              image={imgSuccess}
              textColor="green"
              message={"Thank you..."}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Please check your email for verification.",
      });
      refetchCustomers();
      setIsOpenCustomerModal(false);
    } catch (err: any) {
      if (err.name === "ValidationError") {
        // Handle client-side validation errors
        const errors: { [key: string]: string } = {};
        err.inner.forEach((validationError: yup.ValidationError) => {
          if (validationError.path) {
            errors[validationError.path] = validationError.message;
          }
        });
        setFormCustomerErrors(errors);
      } else {
        // Handle server-side errors
        console.log("🚀 ~ handleSubmit ~ err:", err);
        refetch();
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText={"Error"}
                title={"Customer Creation Failed"}
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
  const handleUpdateSubmit = async () => {
    try {
      // Validate form values using yup
      await inventorySchema.validate(formValues, {
        abortEarly: false,
      });

      // Clear previous form errors if validation is successful
      setFormErrors({});
      const payload = {
        customer_id: formValues.customer_id,
        payment_method: formValues.payment_method,
        discount_code: formValues.discount_code,
        sale_inventories: formValues.sale_inventories.map((item: any) => ({
          id: item.id || null,
          inventory_id: item.inventory_id,
          quantity: Number(item.quantity),
        })),
      };

      // Proceed with server-side submission
      const response = await updateSales({
        id: selectedItem?.id!,
        body: payload,
      }).unwrap();
      setShowEditModal(false);
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={
                <>
                  <span className="font-bold">
                    {capitalizeOnlyFirstLetter(selectedItem?.customer_name!)}
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
      refetchInventory();
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
                      {capitalizeOnlyFirstLetter(selectedItem?.customer_name!)}
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
        placeHolderText="Search sales"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="All Sales"
        btnText="Create Sales"
        onClick={() => {
          setIsOpenModal(true);
          setFormValues({
            customer_id: "",
            payment_method: "",
            discount_code: "",
            sale_inventories: [{ inventory_id: "", quantity: "" }],
          });
        }}
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
              deleteCardApi={deleteSales}
              isDeleteLoading={isDeleteLoading}
              showDeleteModal={showDeleteModal}
              refetch={refetch}
              formValues={formValues}
              setShowDeleteModal={setShowDeleteModal}
              isLoading={false}
              printTitle="Sales List"
              showExportButton={true}
              showPrintButton={true}
              columnsTable={salesColumns as any}
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
          title="Create Sales"
          onCloseModal={() => setIsOpenModal(false)}
        >
          <SalesForm
            error={error}
            isLoadingCustomers={isLoadingCustomers}
            customerData={customerData}
            setIsOpenCustomerModal={setIsOpenCustomerModal}
            debouncedInventorySearch={debouncedInventorySearch}
            debouncedDiscountSearch={debouncedDiscountSearch}
            debouncedCustomerSearch={debouncedCustomerSearch}
            inventoryData={inventoryList || []}
            discountData={discountData?.data || []}
            isLoadingDiscount={isLoadingDiscount}
            btnText="Create Sale"
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
          title="Edit Sale"
          onCloseModal={() => setShowEditModal(false)}
        >
          <SalesForm
            customerData={customerData}
            setIsOpenCustomerModal={setIsOpenCustomerModal}
            isLoadingCustomers={isLoadingCustomers}
            debouncedCustomerSearch={debouncedCustomerSearch}
            debouncedInventorySearch={debouncedInventorySearch}
            debouncedDiscountSearch={debouncedDiscountSearch}
            inventoryData={inventoryList || []}
            discountData={discountData?.data || []}
            isLoadingDiscount={isLoadingDiscount}
            error={errorUpdate}
            setFormValues={setFormValues}
            btnText="Update Sale"
            formErrors={formErrors}
            formValues={formValues}
            handleInputChange={handleInputChange}
            handleSubmit={handleUpdateSubmit}
            isLoadingCreate={isLoadingUpdate}
            setIsOpenModal={setShowEditModal}
          />
        </PlannerModal>
      )}
      {showInvoice && (
        <PlannerModal
          modalOpen={showInvoice}
          setModalOpen={setShowInvoice}
          className=""
          width={400}
          title="Invoice"
          onCloseModal={() => setShowInvoice(false)}
        >
          <InvoiceReceipt selectedItem={selectedItem} />
        </PlannerModal>
      )}
      {isOpenCustomerModal && (
        <PlannerModal
          modalOpen={isOpenCustomerModal}
          setModalOpen={setIsOpenCustomerModal}
          className=""
          width={600}
          title="Create Customer"
          onCloseModal={() => setIsOpenCustomerModal(false)}
        >
          <CustomerForm
            error={errorCustomerCreate}
            btnText="Create Customer"
            formErrors={formCustomerErrors}
            formValues={formCustomerValues}
            setFormValues={setFormCustomerValues}
            handleInputChange={handleCustomerInputChange}
            handleSubmit={handleCustomerSubmit}
            isLoadingCreate={isLoadingCustomerCreate}
            setIsOpenModal={setIsOpenCustomerModal}
          />
        </PlannerModal>
      )}
    </div>
  );
};

export default index;
