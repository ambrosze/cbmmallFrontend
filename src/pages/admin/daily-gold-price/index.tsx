import AttributeHeader from "@/components/Attributes/AttributeHeader";
import TableMainComponent from "@/components/Attributes/TableMainComponent";

import Header from "@/components/header";
import { dailyGoldPriceColumns } from "@/components/Items/itemsColumns";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import PaginationComponent from "@/components/sharedUI/PaginationComponent";
import PlannerModal from "@/components/sharedUI/PlannerModal";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";

import { DailyGoldForm } from "@/components/Forms/DailyGoldForm";
import {
  useCreateDailyGoldPricesMutation,
  useDeleteDailyGoldPricesMutation,
  useGetAllDailyGoldPricesQuery,
  useUpdateDailyGoldPricesMutation,
} from "@/services/admin/daily-gold-price";
import { useGetAllCategoryQuery } from "@/services/category";
import { IDailyGoldPriceDatum } from "@/types/dailyGoldPriceTypes";
import {
  capitalizeOnlyFirstLetter,
  formatCurrency,
  newUserTimeZoneFormatDate,
} from "@/utils/fx";
import { dailyGoldSchema } from "@/validation/authValidate";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Tooltip } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as yup from "yup";
import imgError from "/public/states/notificationToasts/error.svg";
import imgSuccess from "/public/states/notificationToasts/successcheck.svg";
const index = () => {
  const [search, setSearch] = useState("");
  const [selectedFilterTypes, setSelectedFilterTypes] = useState<any>(null);
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    category_id: "",
    price_per_gram: "",
  });
  const [selectedItem, setSelectedItem] = useState<IDailyGoldPriceDatum | null>(
    null
  );
  console.log("🚀 ~ index ~ selectedItem:", selectedItem);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [createDailyGoldPrices, { isLoading: isLoadingCreate, error }] =
    useCreateDailyGoldPricesMutation();
  const [
    updateDailyGoldPrices,
    { isLoading: isLoadingUpdate, error: errorUpdate },
  ] = useUpdateDailyGoldPricesMutation();

  const { data, refetch, isLoading } = useGetAllDailyGoldPricesQuery({
    paginate: true,
    per_page: 15,
    page: currentPage,
    q: search,
    include: "category",
    sort: "recorded_on",
    filter: {
      period: "today",
    },
  });

  console.log("🚀 ~ index ~ data:", data);

  const {
    data: getAllCategory,
    refetch: refetchCategory,
    isLoading: isLoadingCategory,
  } = useGetAllCategoryQuery({
    q: search,
    paginate: false,
  });
  const [deleteDailyGoldPrices, { isLoading: isDeleteLoading }] =
    useDeleteDailyGoldPricesMutation();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const transformedData = data?.data?.map((item) => ({
    key: item?.id,
    category_name: (
      <div className="flex items-center gap-2">{item?.category?.name}</div>
    ),
    // Export-friendly version
    category_name_text: item?.category?.name,
    price_per_gram: (
      <div className="flex items-center gap-2">
        {formatCurrency(item?.price_per_gram) || 0}
      </div>
    ),
    // Export-friendly version
    price_per_gram_text: item?.price_per_gram || 0,
    recorded_on: item?.recorded_on,
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
            onClick={() => {
              const itemToEdit = item; // Store the item in a local variable
              setSelectedItem(itemToEdit);
              // Directly set form values here to ensure correct data is used
              setFormValues({
                category_id: String(itemToEdit?.category?.id ?? ""),
                price_per_gram: String(itemToEdit?.price_per_gram ?? ""),
              });
              setShowEditModal(true);
            }}
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
  useEffect(() => {
    // This useEffect can be removed if the direct form update in the onClick handler is working
    // Keeping it as a backup with a more specific check
    if (selectedItem && showEditModal) {
      // Use a timeout to ensure this runs after the state updates
      setTimeout(() => {
        setFormValues({
          category_id: String(selectedItem.category?.id ?? ""),
          price_per_gram: String(selectedItem.price_per_gram ?? ""),
        });
      }, 0);
    }
  }, [selectedItem, showEditModal]);
  const handleSubmit = async () => {
    try {
      // Validate form values using yup
      await dailyGoldSchema.validate(formValues, {
        abortEarly: false,
      });

      // Clear previous form errors if validation is successful
      setFormErrors({});
      let payload = {
        category_id: formValues.category_id,
        price_per_gram: formValues.price_per_gram,
      };

      // remove middle name if it is empty

      // Proceed with server-side submission
      const response = await createDailyGoldPrices(payload).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={"Daily Gold Price Created Successfully"}
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
                title={"Daily Gold Price Creation Failed"}
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
      await dailyGoldSchema.validate(formValues, {
        abortEarly: false,
      });

      // Clear previous form errors if validation is successful
      setFormErrors({});
      let payload = {
        category_id: formValues.category_id,
        price_per_gram: formValues.price_per_gram,
      };

      // Proceed with server-side submission
      const response = await updateDailyGoldPrices({
        daily_gold_price_id: selectedItem?.id!,
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
                    {capitalizeOnlyFirstLetter(selectedItem?.category?.name!)}{" "}
                    daily gold price
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
                      {capitalizeOnlyFirstLetter(selectedItem?.category?.name!)}{" "}
                      daily gold price
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
  // Create export columns with text versions
  const exportColumns = dailyGoldPriceColumns
    .filter(
      (column: any) => column.key !== "action" && column.dataIndex !== "action"
    )
    .map((column: any) => {
      // Map complex fields to their text versions
      if (column.dataIndex === "category_name") {
        return { ...column, dataIndex: "category_name_text" };
      }
      if (column.dataIndex === "price_per_gram") {
        return { ...column, dataIndex: "price_per_gram_text" };
      }
      return column;
    });
  return (
    <div className={``}>
      <Header
        search={search}
        setSearch={setSearch}
        showSearch={true}
        placeHolderText="Search for daily gold prices"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="Daily Gold Price"
        btnText="Create daily gold price"
        onClick={() => {
          setIsOpenModal(true);
          setFormValues({
            category_id: "",
            price_per_gram: "",
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
                <>{capitalizeOnlyFirstLetter(selectedItem?.category?.name!)}</>
              }
              data={selectedItem}
              deleteCardApi={deleteDailyGoldPrices}
              isDeleteLoading={isDeleteLoading}
              printTitle="Daily Gold Prices"
              showExportButton={true}
              showPrintButton={true}
              showDeleteModal={showDeleteModal}
              refetch={refetch}
              formValues={formValues}
              setShowDeleteModal={setShowDeleteModal}
              isLoading={false}
              columnsTable={dailyGoldPriceColumns as any}
              exportColumns={exportColumns as any}
              transformedData={transformedData}
            />
          </>
        )}
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
      </SharedLayout>
      {isOpenModal && (
        <PlannerModal
          modalOpen={isOpenModal}
          setModalOpen={setIsOpenModal}
          className=""
          width={500}
          title="Create Daily Gold Price"
          onCloseModal={() => setIsOpenModal(false)}
        >
          <DailyGoldForm
            error={error}
            btnText="Create Daily Gold Price"
            formErrors={formErrors}
            transformedCategoryData={transformedCategoryData}
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
          width={500}
          title="Edit Daily Gold Price"
          onCloseModal={() => setShowEditModal(false)}
        >
          <DailyGoldForm
            error={errorUpdate}
            transformedCategoryData={transformedCategoryData}
            setFormValues={setFormValues}
            btnText="Edit Daily Gold Price"
            formErrors={formErrors}
            formValues={formValues}
            handleInputChange={handleInputChange}
            handleSubmit={handleUpdateSubmit}
            isLoadingCreate={isLoadingUpdate}
            setIsOpenModal={setShowEditModal}
          />
        </PlannerModal>
      )}
    </div>
  );
};

export default index;
