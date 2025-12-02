import AttributeHeader from "@/components/Attributes/AttributeHeader";
import TableMainComponent from "@/components/Attributes/TableMainComponent";

import Header from "@/components/header";
import { rolesColumns } from "@/components/Items/itemsColumns";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import PaginationComponent from "@/components/sharedUI/PaginationComponent";
import PlannerModal from "@/components/sharedUI/PlannerModal";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";
import { useGetAllStaffQuery } from "@/services/admin/staff";
import {
  useCreateRolesMutation,
  useDeleteRolesMutation,
  useGetAllRolesQuery,
  useUpdateRolesMutation,
} from "@/services/roles_permissions/role";

import { RolesForm } from "@/components/Forms/RolesForm";
import PermissionGuard from "@/components/RolesPermission/PermissionGuard";
import SyncPermission from "@/components/RolesPermission/SyncPermission";
import { useCheckPermission } from "@/hooks/useCheckPermission";
import { useGetAllPermissionsQuery } from "@/services/roles_permissions/permissions";
import { IRolesDatum } from "@/types/roleTypes";
import {
  capitalizeOnlyFirstLetter,
  newUserTimeZoneFormatDate,
} from "@/utils/fx";
import { categorySchema } from "@/validation/authValidate";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Dropdown } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as yup from "yup";
import imgError from "/public/states/notificationToasts/error.svg";
import imgSuccess from "/public/states/notificationToasts/successcheck.svg";
const index = () => {
  const [search, setSearch] = useState("");
  const [searchPermissions, setSearchPermissions] = useState("");
  const [selectedFilterTypes, setSelectedFilterTypes] = useState<any>(null);
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    name: "",
  });
  const [selectedItem, setSelectedItem] = useState<IRolesDatum | null>(null);
  const {
    hasPermission: hasCreatePermission,
    isLoading: isLoadingCreatePermission,
  } = useCheckPermission("roles.create");
  // delete and edit permissions can be added similarly
  const {
    hasPermission: hasDeletePermission,
    isLoading: isLoadingDeletePermission,
  } = useCheckPermission("roles.delete");
  const {
    hasPermission: hasUpdatePermission,
    isLoading: isLoadingUpdatePermission,
  } = useCheckPermission("roles.update");
  const {
    hasPermission: hasAssignPermissions,
    isLoading: isLoadingAssignPermissions,
  } = useCheckPermission("roles.assign-permissions");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRolePermissionModal, setShowRolePermissionModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [createRoles, { isLoading: isLoadingCreate, error }] =
    useCreateRolesMutation();
  const [updateRoles, { isLoading: isLoadingUpdate, error: errorUpdate }] =
    useUpdateRolesMutation();
  const {
    data: allPermissions,
    refetch: refetchPermissions,
    isLoading: isLoadingPermissions,
  } = useGetAllPermissionsQuery({
    q: searchPermissions,
    paginate: false,
  });

  const { data, refetch, isLoading } = useGetAllRolesQuery({
    q: search,
    include: "permissions",
    page: currentPage,
    per_page: 15,
    paginate: true,
  });
  console.log("🚀 ~ index ~ data:", data);
  const {
    data: allStaff,
    refetch: refetchStaff,
    isLoading: isLoadingStaff,
  } = useGetAllStaffQuery({
    q: search,
    page: currentPage,
    include: "user,managedStore,store",
    per_page: 15,
    paginate: false,
  });
  const [deleteRoles, { isLoading: isDeleteLoading }] =
    useDeleteRolesMutation();
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
        name: selectedItem?.name || "",
      });
    }
  }, [selectedItem, showEditModal]);
  const items = [
    isLoadingUpdatePermission
      ? null
      : hasUpdatePermission
      ? {
          key: "1",
          label: (
            <a
              onClick={() => {
                setShowEditModal(true);
              }}
            >
              Edit
            </a>
          ),
        }
      : null,
    isLoadingAssignPermissions
      ? null
      : hasAssignPermissions
      ? {
          key: "2",
          label: (
            <a
              onClick={() => {
                setShowRolePermissionModal(true);
              }}
            >
              Sync Role Permissions
            </a>
          ),
        }
      : null,
    isLoadingDeletePermission
      ? null
      : hasDeletePermission
      ? {
          key: "3",
          label: (
            <a
              onClick={() => {
                setShowDeleteModal(true);
              }}
            >
              Delete
            </a>
          ),
        }
      : null,
  ];
  const transformedData = data?.data?.map((item) => ({
    key: item?.id,
    name: <div className="flex items-center gap-2">{item?.name}</div>,
    // Export-friendly version
    name_text: item?.name,
    guard_name: (
      <div className="flex items-center gap-2">{item?.guard_name || "-"}</div>
    ),
    // Export-friendly version
    guard_name_text: item?.guard_name || "-",
    permission_count: item?.permissions?.length || "-",
    dateInitiated: newUserTimeZoneFormatDate(item?.created_at, "DD/MM/YYYY"),

    action: (
      <div className="flex items-center space-x-2">
        <Dropdown menu={{ items }} trigger={["click"]}>
          <a
            className={`cursor-pointer hover:opacity-80 duration-150 ease-in-out font-semibold text-sm px-4 rounded-full text-gray-600 underline py-2`}
            onClick={(e) => {
              e.preventDefault();
              setSelectedItem(item);
            }}
          >
            <Icon icon="ic:round-more-vert" width={24} height={24} />
          </a>
        </Dropdown>
      </div>
    ),
  }));

  // Create export columns with text versions
  const exportColumns = rolesColumns
    .filter(
      (column: any) => column.key !== "action" && column.dataIndex !== "action"
    )
    .map((column: any) => {
      // Map complex fields to their text versions
      if (column.dataIndex === "name") {
        return { ...column, dataIndex: "name_text" };
      }
      if (column.dataIndex === "guard_name") {
        return { ...column, dataIndex: "guard_name_text" };
      }
      return column;
    });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch();
  };
  const staffList = allStaff?.data.map((item) => {
    return {
      label:
        capitalizeOnlyFirstLetter(item.user?.first_name) +
        " " +
        capitalizeOnlyFirstLetter(item.user?.last_name),
      value: item.id,
    };
  });

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

      // remove middle name if it is empty

      // Proceed with server-side submission
      const response = await createRoles(payload).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={"Store Created Successfully"}
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
                title={"Store Creation Failed"}
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
      };

      // Proceed with server-side submission
      const response = await updateRoles({
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
      setShowEditModal(false);
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
        showSearch={true}
        placeHolderText="Search roles"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="All Roles"
        btnText="Create Role"
        showAddButton={isLoadingCreatePermission ? false : hasCreatePermission}
        onClick={() => {
          setIsOpenModal(true);
          setFormValues({
            name: "",
          });
        }}
      />
      <SharedLayout className="bg-white">
        <PermissionGuard permission="roles.viewAny">
          {isLoading ? (
            <SkeletonLoaderForPage />
          ) : (
            <>
              <TableMainComponent
                DeleteModalText={
                  <>{capitalizeOnlyFirstLetter(selectedItem?.name!)}</>
                }
                data={selectedItem}
                deleteCardApi={deleteRoles}
                isDeleteLoading={isDeleteLoading}
                printTitle="Roles"
                showExportButton={true}
                showPrintButton={true}
                showDeleteModal={showDeleteModal}
                refetch={refetch}
                formValues={formValues}
                setShowDeleteModal={setShowDeleteModal}
                isLoading={false}
                columnsTable={rolesColumns as any}
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
        </PermissionGuard>
      </SharedLayout>
      {isOpenModal && (
        <PlannerModal
          modalOpen={isOpenModal}
          setModalOpen={setIsOpenModal}
          className=""
          width={500}
          title="Create Role"
          onCloseModal={() => setIsOpenModal(false)}
        >
          <RolesForm
            error={error}
            btnText="Create Role"
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
          width={500}
          title="Edit Role"
          onCloseModal={() => setShowEditModal(false)}
        >
          <RolesForm
            error={errorUpdate}
            setFormValues={setFormValues}
            btnText="Edit Role"
            formErrors={formErrors}
            formValues={formValues}
            handleInputChange={handleInputChange}
            handleSubmit={handleUpdateSubmit}
            isLoadingCreate={isLoadingUpdate}
            setIsOpenModal={setShowEditModal}
          />
        </PlannerModal>
      )}

      {showRolePermissionModal && (
        <PlannerModal
          modalOpen={showRolePermissionModal}
          setModalOpen={setShowRolePermissionModal}
          className=""
          width={900}
          title={
            <h2 className="text-lg font-semibold mb-4">
              Sync Permissions for{" "}
              {capitalizeOnlyFirstLetter(selectedItem?.name!)}
            </h2>
          }
          onCloseModal={() => setShowRolePermissionModal(false)}
        >
          <SyncPermission
            refetchRoles={refetch}
            searchText={searchPermissions}
            setSearchText={setSearchPermissions}
            setShowRolePermissionModal={setShowRolePermissionModal}
            isLoadingPermissions={isLoadingPermissions}
            allPermissions={allPermissions}
            refetchPermissions={refetchPermissions}
            selectedItem={selectedItem}
          />
        </PlannerModal>
      )}
    </div>
  );
};

export default index;
