import AttributeCard from "@/components/Attributes/AttributeCard";
import AttributeHeader from "@/components/Attributes/AttributeHeader";
import { CategoryForm } from "@/components/Forms/Category/CategoryForm";
import Header from "@/components/header";
import EmptyState from "@/components/ItemComponent/EmptyState";
import CustomButton from "@/components/sharedUI/Buttons/Button";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import PaginationComponent from "@/components/sharedUI/PaginationComponent";
import PlannerModal from "@/components/sharedUI/PlannerModal";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoryQuery,
  useUpdateCategoryMutation,
} from "@/services/category";
import { CategoryDatum } from "@/types/categoryTypes";
import { categoryCreateSchema } from "@/validation/authValidate";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/router";
import { useState } from "react";
import * as yup from "yup";
const imgError = "/states/notificationToasts/error.svg";
const imgSuccess = "/states/notificationToasts/successcheck.svg";
const index = () => {
  const [search, setSearch] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    image: null,
    parent_category_id: null,
  });
  console.log("🚀 ~ index ~ formValues:", formValues);
  const [currentPage, setCurrentPage] = useState(1);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [selectedItem, setSelectedItem] = useState<CategoryDatum | null>(null);
  console.log("🚀 ~ index ~ selectedItem:", selectedItem);
  const [isOpenParentModal, setIsOpenParentModal] = useState(false);
  const { data, refetch, isLoading } = useGetAllCategoryQuery({
    q: search,
    page: currentPage,
    per_page: 15,
    paginate: true,
    include: "parentCategory,subCategories",
  });
  const [createCategory, { isLoading: isLoadingCreate, error }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isLoadingUpdate, error: errorUpdate }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleteLoading }] =
    useDeleteCategoryMutation();
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
      await categoryCreateSchema.validate(formValues, {
        abortEarly: false,
      });

      // Clear previous form errors if validation is successful
      setFormErrors({});
      let payload = {
        name: formValues.name,
        image: formValues.image || null,
        // Creating from the top-level modal always creates a root category
        parent_category_id: null,
      };

      // Proceed with server-side submission
      const response = await createCategory(payload).unwrap();
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
        placeHolderText="Search Category"
        showSearch={true}
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="Categories"
        btnText="Create Category"
        onClick={() => {
          setIsOpenModal(true);
          setFormValues({
            name: "",
            image: null,
            parent_category_id: null,
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
                        <div key={item.id} className="">
                          <AttributeCard
                            isOpenParentModal={isOpenParentModal}
                            setIsOpenParentModal={setIsOpenParentModal}
                            selectedItem={selectedItem}
                            setSelectedItem={setSelectedItem}
                            modalBtnEditText="Edit Category"
                            editInputPlaceHolder="Enter a category name"
                            formErrors={formErrors}
                            setFormErrors={setFormErrors}
                            updateCardApi={updateCategory}
                            createCardApi={createCategory}
                            deleteCardApi={deleteCategory}
                            isLoadingUpdate={isLoadingUpdate}
                            errorUpdate={errorUpdate}
                            errorCreate={error}
                            isLoadingCreate={isLoadingCreate}
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
                  <EmptyState textHeader="To see your category, you need to create one.">
                    <div className="flex justify-center items-center gap-3 mt-8">
                      <div className="">
                        <CustomButton
                          onClick={() => {
                            setIsOpenModal(true);
                            setFormValues({
                              name: "",
                              image: null,
                              parent_category_id: null,
                            });
                          }}
                          type="button"
                          className="border bg-primary-40 flex justify-center items-center gap-2 text-white"
                        >
                          <Icon icon="line-md:plus" width="20" height="20" />
                          Create Category
                        </CustomButton>
                      </div>
                    </div>
                  </EmptyState>
                )}
              </div>
              <div className="flex lg:justify-between justify-end  items-center w-full py-10">
                {(currentPage === 1 && data?.meta?.total! >= 10) ||
                (currentPage > 1 && data?.meta?.total! >= 1) ? (
                  <div
                    className={`text-sm hidden lg:block font-[500] text-black`}
                  >
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
            </>
          )}
        </>
      </SharedLayout>
      {isOpenModal && (
        <PlannerModal
          modalOpen={isOpenModal}
          setModalOpen={setIsOpenModal}
          className=""
          width={400}
          title="Create Category"
          onCloseModal={() => setIsOpenModal(false)}
        >
          <CategoryForm
            isEditing={false}
            error={error}
            btnText="Create Category"
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
    </div>
  );
};

export default index;
