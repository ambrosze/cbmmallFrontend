import AttributeCard from "@/components/Attributes/AttributeCard";
import AttributeHeader from "@/components/Attributes/AttributeHeader";
import Header from "@/components/header";
import TextInput from "@/components/Input/TextInput";
import EmptyState from "@/components/ItemComponent/EmptyState";
import CustomButton from "@/components/sharedUI/Buttons/Button";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import PaginationComponent from "@/components/sharedUI/PaginationComponent";
import PlannerModal from "@/components/sharedUI/PlannerModal";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import Spinner from "@/components/sharedUI/Spinner";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";

import {
  useCreateTypesMutation,
  useDeleteTypesMutation,
  useGetAllTypesQuery,
  useUpdateTypesMutation,
} from "@/services/types";
import { categorySchema } from "@/validation/authValidate";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/router";
import { useState } from "react";
import * as yup from "yup";
import imgError from "/public/states/notificationToasts/error.svg";
import imgSuccess from "/public/states/notificationToasts/successcheck.svg";
const index = () => {
  const [search, setSearch] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const { data, refetch, isLoading } = useGetAllTypesQuery({
    q: search,
    page: currentPage,
    per_page: 15,
    paginate: true,
  });
  const [createTypes, { isLoading: isLoadingTypes, error }] =
    useCreateTypesMutation();
  const [updateTypes, { isLoading: isLoadingUpdate, error: errorUpdate }] =
    useUpdateTypesMutation();
  const [deleteTypes, { isLoading: isDeleteLoading }] =
    useDeleteTypesMutation();
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
      };

      // Proceed with server-side submission
      const response = await createTypes(payload).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={"Category Created Successfully"}
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
                title={"Category Creation Failed"}
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
        placeHolderText="Search Types"
        showSearch={true}
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="Types"
        btnText="Create Types"
        onClick={() => {
          setIsOpenModal(true);
          setFormValues({
            name: "",
          });
        }}
      />
      <SharedLayout className="bg-white">
        <>
          {isLoading ? (
            <SkeletonLoaderForPage />
          ) : (
            <>
              {" "}
              <div
                className={`grid  gap-5 p-5 ${
                  data?.data.length! === 0
                    ? "grid-cols-1"
                    : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                }`}
              >
                {data?.data.length! > 0 ? (
                  <>
                    {data?.data?.map((item) => {
                      return (
                        <div className="">
                          <AttributeCard
                            modalBtnEditText="Edit Types"
                            editInputPlaceHolder="Enter a type name"
                            formErrors={formErrors}
                            setFormErrors={setFormErrors}
                            updateCardApi={updateTypes}
                            deleteCardApi={deleteTypes}
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
                  <EmptyState textHeader="To see your colours, you need to create one.">
                    <div className="flex justify-center items-center gap-3 mt-8">
                      <div className="">
                        <CustomButton
                          onClick={() => {
                            setIsOpenModal(true);
                            setFormValues({
                              name: "",
                            });
                          }}
                          type="button"
                          className="border bg-primary-40 flex justify-center items-center gap-2 text-white"
                        >
                          <Icon icon="line-md:plus" width="20" height="20" />
                          Create Types
                        </CustomButton>
                      </div>
                    </div>
                  </EmptyState>
                )}
              </div>
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
          title="Create Types"
          onCloseModal={() => setIsOpenModal(false)}
        >
          <form className="mt-5 flex flex-col gap-5">
            <TextInput
              type="text"
              name="name"
              errorMessage={
                formErrors.name ||
                (error as any)?.data?.errors?.name?.map((err: any) => err) ||
                ""
              }
              value={formValues.name}
              onChange={handleInputChange}
              placeholder="Enter a type name"
              title={<span className="font-[500]">Category</span>}
              required={false}
            />

            <div className="flex justify-end border-t border-gray-300 pt-3">
              <div className="w-fit flex gap-5">
                <CustomButton
                  type="button"
                  onClick={() => {
                    setIsOpenModal(false);
                  }}
                  className="border bg-border-300 text-black flex justify-center items-center gap-2 px-5"
                >
                  Cancel
                </CustomButton>
                <CustomButton
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoadingTypes}
                  className="border bg-primary-40 flex justify-center items-center gap-2 text-white px-5"
                >
                  {isLoadingTypes ? (
                    <Spinner className="border-white" />
                  ) : (
                    "Create Types"
                  )}
                </CustomButton>
              </div>
            </div>
          </form>
        </PlannerModal>
      )}
    </div>
  );
};

export default index;
