import AttributeHeader from "@/components/Attributes/AttributeHeader";
import Header from "@/components/header";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import PaginationComponent from "@/components/sharedUI/PaginationComponent";
import PlannerModal from "@/components/sharedUI/PlannerModal";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";

import { columnsTable } from "@/components/Attributes/tableColumns";
import TableMainComponent from "@/components/Attributes/TableMainComponent";
import { ColourForm } from "@/components/Forms/ColourForm";
import {
  useCreateColourMutation,
  useDeleteColourMutation,
  useGetAllColoursQuery,
  useUpdateColourMutation,
} from "@/services/colour";
import { IColourDatum } from "@/types/colourTypes";
import {
  capitalizeOnlyFirstLetter,
  formatCurrency,
  newUserTimeZoneFormatDate,
} from "@/utils/fx";
import { categorySchema } from "@/validation/authValidate";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Tooltip } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as yup from "yup";
import imgError from "/public/states/notificationToasts/error.svg";
import imgSuccess from "/public/states/notificationToasts/successcheck.svg";
const index = () => {
  const [search, setSearch] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    hex: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const { data, refetch, isLoading } = useGetAllColoursQuery({
    q: search,
    page: currentPage,
    per_page: 15,
    paginate: true,
  });
  const [createColour, { isLoading: isLoadingCreate, error }] =
    useCreateColourMutation();
  const [updateColour, { isLoading: isLoadingUpdate, error: errorUpdate }] =
    useUpdateColourMutation();
  const [deleteColour, { isLoading: isDeleteLoading }] =
    useDeleteColourMutation();
  const [selectedItem, setSelectedItem] = useState<IColourDatum | null>(null);
  console.log("🚀 ~ index ~ selectedItem:", selectedItem);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const router = useRouter();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch();
  };
  useEffect(() => {
    if (selectedItem && showEditModal) {
      setFormValues({
        name: selectedItem.name || "",
        hex: selectedItem.hex || "",
      });
    }
  }, [selectedItem, showEditModal]);
  const transformedData = data?.data?.map((item) => ({
    key: item?.id,
    colour: (
      <div className="flex items-center">
        <div className="capitalize">{item?.name ?? "-"}</div>
      </div>
    ),
    colour_code: (
      <>
        {item?.hex ? (
          <>
            {
              <Tooltip title={item?.hex}>
                <span
                  className="px-6 border"
                  style={{
                    backgroundColor: item?.hex,
                  }}
                />
              </Tooltip>
            }
          </>
        ) : (
          "-"
        )}
      </>
    ),
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
              setSelectedItem(item);
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
  const handleSubmit = async () => {
    try {
      // Validate form values using yup
      await categorySchema.validate(formValues, {
        abortEarly: false,
      });

      // Clear previous form errors if validation is successful
      setFormErrors({});
      let payload = {
        name: formValues.name,
        hex: formValues.hex,
      };

      // Proceed with server-side submission
      const response = await createColour(payload).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={"Colour Created Successfully"}
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
                title={"Colour Creation Failed"}
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
      await categorySchema.validate(formValues, {
        abortEarly: false,
      });

      // Clear previous form errors if validation is successful
      setFormErrors({});
      let payload = {
        name: formValues.name,
        hex: formValues.hex,
      };

      // Proceed with server-side submission
      const response = await updateColour({
        id: selectedItem?.id!,
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
                    {capitalizeOnlyFirstLetter(selectedItem?.name!)}
                  </span>{" "}
                  updateded Successfully
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
                      {capitalizeOnlyFirstLetter(selectedItem?.name!)}
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
        placeHolderText="Search Colour"
        showSearch={true}
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="Colours"
        btnText="Create Colour"
        onClick={() => {
          setIsOpenModal(true);
          setFormValues({
            name: "",
            hex: "",
          });
        }}
      />
      <SharedLayout className="bg-white">
        <>
          {isLoading ? (
            <SkeletonLoaderForPage />
          ) : (
            <>
              <TableMainComponent
                DeleteModalText={selectedItem?.name}
                data={selectedItem}
                deleteCardApi={deleteColour}
                isDeleteLoading={isDeleteLoading}
                showDeleteModal={showDeleteModal}
                refetch={refetch}
                formValues={formValues}
                setShowDeleteModal={setShowDeleteModal}
                isLoading={isLoading}
                columnsTable={columnsTable as any}
                transformedData={transformedData}
              />
              <hr />

              {/* {data?.data.length! > 0 ? (
                <>
                  {data?.data?.map((item) => {
                    return (
                      <div className="">
                        <AttributeCard
                          modalBtnEditText="Edit Colour"
                          editInputPlaceHolder="Enter a colour name"
                          formErrors={formErrors}
                          setFormErrors={setFormErrors}
                          updateCardApi={updateCol}
                          deleteCardApi={deleteCategory}
                          isLoadingUpdate={isLoadingUpdate}
                          errorUpdate={errorUpdate}
                          isDeleteLoading={isDeleteLoading}
                          refetch={refetch}
                          data={item}
                          formValues={formValues}
                          setFormValues={setFormValues}
                          handleInputChange={handleInputChange}
                        />
                      </div>
                    );
                  })}
                </>
              ) : (
                <EmptyState textHeader="To see your Colours, you need to create one.">
                  <div className="flex justify-center items-center gap-3 mt-8">
                    <div className="">
                      <CustomButton
                        onClick={() => {
                          setIsOpenModal(true);
                          setFormValues({
                            name: "",
                            hex: "",
                          });
                        }}
                        type="button"
                        className="border bg-primary-40 flex justify-center items-center gap-2 text-white"
                      >
                        <Icon icon="line-md:plus" width="20" height="20" />
                        Create Colour
                      </CustomButton>
                    </div>
                  </div>
                </EmptyState>
              )} */}
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
            </>
          )}
        </>
      </SharedLayout>
      {isOpenModal && (
        <PlannerModal
          modalOpen={isOpenModal}
          setModalOpen={setIsOpenModal}
          className=""
          title="Create Colour"
          onCloseModal={() => setIsOpenModal(false)}
        >
          <ColourForm
            error={error}
            btnText="Create Colour"
            formErrors={formErrors}
            formValues={formValues}
            handleInputChange={handleInputChange}
            setFormValues={setFormValues}
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
          title="Edit Colour"
          onCloseModal={() => setShowEditModal(false)}
        >
          <ColourForm
            error={errorUpdate}
            btnText="Edit Colour"
            formErrors={formErrors}
            formValues={formValues}
            handleInputChange={handleInputChange}
            setFormValues={setFormValues}
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
