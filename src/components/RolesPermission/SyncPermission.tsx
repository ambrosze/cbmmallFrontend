import { useSyncRolePermissionsMutation } from "@/services/roles_permissions/role";
import { IRolesDatum, IRolesPermissionsDatum } from "@/types/roleTypes";
import { Checkbox, CheckboxProps, Divider } from "antd";
import { useState } from "react";
import * as yup from "yup";
import InputSearch from "../Input/InputSearch";
import CustomButton from "../sharedUI/Buttons/Button";
import Spinner from "../sharedUI/Spinner";
import CustomToast from "../sharedUI/Toast/CustomToast";
import { showPlannerToast } from "../sharedUI/Toast/plannerToast";
const imgError = "/states/notificationToasts/error.svg";
const imgSuccess = "/states/notificationToasts/successcheck.svg";
const CheckboxGroup = Checkbox.Group;

interface IProps {
  selectedItem: IRolesDatum | null;
  setShowRolePermissionModal: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingPermissions: boolean;
  allPermissions: any;
  refetchPermissions: () => void;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  refetchRoles: () => void;
}

const SyncPermission = ({
  selectedItem,
  setShowRolePermissionModal,
  isLoadingPermissions,
  allPermissions,
  refetchPermissions,
  refetchRoles,
  searchText,
  setSearchText,
}: IProps) => {
  const [syncRolePermissions, { isLoading: isLoadingCreate, error }] =
    useSyncRolePermissionsMutation();

  // Create options array with label and value
  const plainOptions =
    allPermissions?.data?.map((item: IRolesPermissionsDatum) => ({
      label: item?.label || item?.name, // Use label if available, fallback to name
      value: item?.id,
    })) || [];

  const defaultCheckedList =
    selectedItem?.permissions?.map((item) => item.id) || [];
  const [checkedList, setCheckedList] = useState<string[]>(defaultCheckedList);
  console.log("🚀 ~ SyncPermission ~ checkedList:", checkedList);

  const checkAll = plainOptions.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < plainOptions.length;

  const onChange = (list: string[]) => {
    setCheckedList(list);
  };

  const onCheckAllChange: CheckboxProps["onChange"] = (e) => {
    setCheckedList(
      e.target.checked
        ? plainOptions.map((opt: { value: any }) => opt.value)
        : []
    );
  };
  const handleSubmit = async () => {
    try {
      // remove middle name if it is empty

      // Proceed with server-side submission
      const response = await syncRolePermissions({
        role_id: selectedItem?.id || "",
        body: { permissions: checkedList },
      }).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={"Permissions Synced Successfully"}
              image={imgSuccess}
              textColor="green"
              message={"Thank you..."}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Please check your email for verification.",
      });
      refetchPermissions();
      refetchRoles();
      setShowRolePermissionModal(false);
    } catch (err: any) {
      if (err.name === "ValidationError") {
        // Handle client-side validation errors
        const errors: { [key: string]: string } = {};
        err.inner.forEach((validationError: yup.ValidationError) => {
          if (validationError.path) {
            errors[validationError.path] = validationError.message;
          }
        });
      } else {
        // Handle server-side errors
        console.log("🚀 ~ handleSubmit ~ err:", err);
        refetchPermissions();
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText={"Error"}
                title={"Permissions Sync Failed"}
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
    <div className="py-5">
      <div className="flex md:flex-row flex-col justify-between md:items-center mb-3">
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
          className="flex items-center font-[500] mb-3"
        >
          Check all
        </Checkbox>
        <div className="">
          <InputSearch
            debounceTimer={10}
            placeholder="Search permissions"
            search={searchText}
            setSearch={setSearchText}
            className="border lg:w-[300px]"
          />
        </div>
      </div>
      <Divider />
      <CheckboxGroup
        options={plainOptions}
        value={checkedList}
        onChange={onChange}
        disabled={isLoadingPermissions}
        className="grid lg:grid-cols-3 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto overflow-x-hidden"
      />
      <div className="">
        <Divider />
        <div className="flex justify-end">
          <div className="">
            <CustomButton
              onClick={() => {
                setShowRolePermissionModal(false);
              }}
              className="border bg-border-300 w-fit text-black rounded-lg flex justify-center items-center gap-2 px-10 py-2.5"
            >
              Close
            </CustomButton>
          </div>
          <div className="">
            <CustomButton
              onClick={() => {
                handleSubmit();
              }}
              disabled={isLoadingCreate}
              className="ml-3 border bg-primary-40 w-fit flex justify-center rounded-lg items-center gap-2 text-white px-5 py-2.5"
            >
              {isLoadingCreate ? <Spinner /> : "Save Changes"}
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncPermission;
