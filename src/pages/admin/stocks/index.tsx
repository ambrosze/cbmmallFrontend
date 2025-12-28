import AttributeHeader from "@/components/Attributes/AttributeHeader";
import TableMainComponent from "@/components/Attributes/TableMainComponent";
import Header from "@/components/header";
import AdminItemForm from "@/components/ItemComponent/AdminItemForm";
import { itemsAdminColumns } from "@/components/Items/itemsColumns";
import ImageComponent from "@/components/sharedUI/ImageComponent";
import PaginationComponent from "@/components/sharedUI/PaginationComponent";
import PlannerModal from "@/components/sharedUI/PlannerModal";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";
import {
  useCreateAdminItemsMutation,
  useDeleteAdminItemsMutation,
  useGetAllAdminItemsQuery,
  useUpdateAdminItemsMutation,
} from "@/services/admin/items-list";
import { useGetAllCategoryQuery } from "@/services/category";
import { useGetAllColoursQuery } from "@/services/colour";
import { useGetAllTypesQuery } from "@/services/types";
import {
  capitalizeOnlyFirstLetter,
  newUserTimeZoneFormatDate,
} from "@/utils/fx";
import { adminItemsSchema } from "@/validation/authValidate";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Image as AntImage, Tooltip } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as yup from "yup";
const imgError = "/states/notificationToasts/error.svg";
const imgSuccess = "/states/notificationToasts/successcheck.svg";

const index = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilterTypes, setSelectedFilterTypes] = useState<any>(null);
  const router = useRouter();
  const { data, isLoading, refetch } = useGetAllAdminItemsQuery({
    paginate: true,
    per_page: 15,
    page: currentPage,
    q: search,
  });
  console.log("🚀 ~ index ~ data:", data);
  const [formValues, setFormValues] = useState({
    material: "",
    category_id: "",
    colour_id: "",
    type_id: "",
    weight: "",
    price: "",
    quantity: "",
    upload_image: null,
    sku: "",
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [createAdminItems, { isLoading: isLoadingCreate, error }] =
    useCreateAdminItemsMutation();
  const [updateAdminItems, { isLoading: isLoadingUpdate, error: errorUpdate }] =
    useUpdateAdminItemsMutation();
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

  const [
    deleteAdminItems,
    {
      isLoading: isLoadingDeleteAdminItems,
      isSuccess: isSuccessDeleteAdminItems,
      isError: isErrorDeleteAdminItems,
      error: errorDeleteAdminItems,
    },
  ] = useDeleteAdminItemsMutation();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  console.log("🚀 ~ index ~ selectedItem:", selectedItem);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch();
  };
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
  const handleCloseEditModal = () => {
    setSelectedItem(null);
    setFormValues({
      material: "",
      category_id: "",
      colour_id: "",
      type_id: "",
      weight: "",
      price: "",
      quantity: "",
      upload_image: null,
      sku: "",
    });
    setFormErrors({});
    setShowEditModal(false);
  };

  const handleEditItem = (item: any) => {
    setFormErrors({});
    setSelectedItem(item);
    setFormValues({
      material: item?.material || "",
      category_id: item?.category_id || "",
      colour_id: item?.colour_id || "",
      type_id: item?.type_id || "",
      weight: item?.weight || "",
      price: item?.price || "",
      quantity: item?.inventory_sum_quantity || "",
      upload_image: null,
      sku: item?.sku || "",
    });
    setShowEditModal(true);
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
            src={(item as any)?.image?.url || "/images/empty_box.svg"}
            width={50}
            height={50}
            alt="image"
            className="h-[40px] w-[40px] rounded-md"
          />
        </div>
        <div className="capitalize">
          <p className="font-[500] text-[15px]">{item?.material}</p>
          <p className="text-xs text-[#858D9D]">sku: {item?.sku || "N/A"}</p>
        </div>
      </div>
    ),
    // Export-friendly version
    item_text: `${item?.material} (SKU: ${item?.sku || "N/A"})`,
    category: getCategoryById(item?.category_id || ""),
    type: getTypeById(item?.type_id),
    store_name: (item as any)?.store?.name,
    // store_location: item?.notes,
    color: getColourById(item?.colour_id || ""),
    barcode: (
      <div className="flex flex-col items-center">
        <AntImage
          src={item?.barcode! || "/images/empty_box.svg"}
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
                    SKU: {item?.sku || "N/A"}
                  </p> */}
                  <img
                    src={item?.barcode! || "/images/empty_box.svg"}
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
                                    item?.barcode! || "/images/empty_box.svg"
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
                                    item?.barcode! || "/images/empty_box.svg"
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
        <span className="text-xs mt-1 text-gray-500">{item?.sku || "N/A"}</span>
      </div>
    ),
    // Export-friendly version
    barcode_text: item?.sku || "N/A",
    weight: item?.weight,
    // price: formatCurrency(item?.price || 0),
    quantity: item?.inventory_sum_quantity || 0,
    dateInitiated: newUserTimeZoneFormatDate(item?.created_at, "DD/MM/YYYY"),
    action: (
      <div className="flex items-center space-x-2">
        <Tooltip title="Delete">
          <span
            onClick={() => {
              setSelectedItem(item);
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

        <Tooltip title="Edit">
          <span
            onClick={() => handleEditItem(item)}
            className={`cursor-pointer hover:opacity-80 duration-150 ease-in-out font-semibold text-sm px-4 rounded-full text-blue-500 underline py-2`}
          >
            <Icon
              className="text-primary-40 cursor-pointer"
              icon="line-md:pencil"
              width="30"
              height="30"
            />
          </span>
        </Tooltip>
      </div>
    ),
  }));

  // Create export columns with text versions
  const exportColumns = itemsAdminColumns
    .filter(
      (column: any) => column.key !== "action" && column.dataIndex !== "action"
    )
    .map((column: any) => {
      // Map complex fields to their text versions
      if (column.dataIndex === "item") {
        return { ...column, dataIndex: "item_text" };
      }
      if (column.dataIndex === "barcode") {
        return { ...column, dataIndex: "barcode_text" };
      }
      return column;
    });

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
        material: selectedItem?.material,
        category_id: selectedItem?.category_id,
        colour_id: selectedItem?.colour_id,
        type_id: selectedItem?.type_id,
        weight: selectedItem?.weight,
        price: selectedItem?.price,
        quantity: selectedItem?.quantity,
        upload_image: null,
        sku: selectedItem?.sku,
      });
    }
  }, [selectedItem?.id, showEditModal]);
  const handleSubmit = async () => {
    try {
      // Validate form values using yup
      // Add the required rule for upload_image specifically for creation
      const createValidationSchema = adminItemsSchema.concat(
        yup.object({
          upload_image: yup.mixed().required("Image is required"),
        })
      );
      await createValidationSchema.validate(formValues, {
        abortEarly: false,
      });

      // Clear previous form errors if validation is successful
      setFormErrors({});
      let payload = {
        ...formValues,
        ...(formValues.sku && {
          sku: formValues.sku,
        }),
      };

      // remove middle name if it is empty

      // Proceed with server-side submission
      const response = await createAdminItems(payload).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={"Item Created Successfully"}
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
                title={"Item Creation Failed"}
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
      await adminItemsSchema.validate(formValues, {
        abortEarly: false,
      });

      // Clear previous form errors if validation is successful
      setFormErrors({});
      let payload = {
        ...formValues,
        ...(formValues.sku && {
          sku: formValues.sku,
        }),
        // do for price if formValues.price=== 'daimond' then price is required
        ...(formValues.material === "Diamond" && {
          price: formValues.price,
        }),
        ...(formValues.material === "Gold" && {
          category_id: formValues.category_id,
          colour_id: formValues.colour_id,
          weight: formValues.weight,
        }),
        ...(formValues.material === "Diamond" && {
          type_id: formValues.type_id,
        }),
      };

      // Conditionally create the final payload without upload_image if it's null
      let finalPayload: any;
      if (payload.upload_image === null) {
        const { upload_image, ...rest } = payload;
        finalPayload = rest;
      } else {
        finalPayload = payload;
      }

      // Proceed with server-side submission
      const response = await updateAdminItems({
        item_id: selectedItem?.id!,
        body: finalPayload,
      }).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={
                <>
                  <span className="font-bold">
                    {capitalizeOnlyFirstLetter(selectedItem?.material!)}
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
                      {capitalizeOnlyFirstLetter(selectedItem?.material!) +
                        " " +
                        capitalizeOnlyFirstLetter(
                          selectedItem?.user?.last_name!
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
        placeHolderText="Search product, supplier, order"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="All Stocks"
        btnText="Create Stock"
        showAddButton={true}
        onClick={() => {
          setIsOpenModal(true);
          setFormValues({
            material: "",
            category_id: "",
            colour_id: "",
            type_id: "",
            weight: "",
            price: "",
            quantity: "",
            upload_image: null,
            sku: "",
          });
          setFormErrors({});
        }}
      />

      <SharedLayout>
        <TableMainComponent
          DeleteModalText={selectedItem?.material}
          data={selectedItem}
          deleteCardApi={deleteAdminItems}
          isDeleteLoading={isLoadingDeleteAdminItems}
          printTitle="Admin Stocks"
          showExportButton={true}
          showPrintButton={true}
          showDeleteModal={showDeleteModal}
          refetch={refetch}
          formValues={formValues}
          setShowDeleteModal={setShowDeleteModal}
          isLoading={isLoading}
          columnsTable={itemsAdminColumns as any}
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
          title="Create Stock"
          onCloseModal={() => setIsOpenModal(false)}
        >
          <AdminItemForm
            error={error}
            transformedColoursData={transformedColoursData}
            transformedTypesData={transformedTypesData}
            transformedCategoryData={transformedCategoryData}
            btnText="Create Stock"
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
          width={600}
          title="Edit Stock"
          onCloseModal={handleCloseEditModal}
        >
          <AdminItemForm
            transformedColoursData={transformedColoursData}
            transformedTypesData={transformedTypesData}
            transformedCategoryData={transformedCategoryData}
            error={errorUpdate}
            setFormValues={setFormValues}
            btnText="Edit Stock"
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
    </div>
  );
};

export default index;
