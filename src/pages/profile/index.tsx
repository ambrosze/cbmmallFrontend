import AttributeHeader from "@/components/Attributes/AttributeHeader";
import Header from "@/components/header";
import PhoneInputWithCountry from "@/components/Input/PhoneInputWithCountry";
import TextInput from "@/components/Input/TextInput";
import ProfileAvatarCard from "@/components/Profile/ProfileAvatarCard";
import ProfileSection from "@/components/Profile/ProfileSection";
import CustomButton from "@/components/sharedUI/Buttons/Button";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import PlannerModal from "@/components/sharedUI/PlannerModal";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import Spinner from "@/components/sharedUI/Spinner";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";
import {
  useCreateProfileMutation,
  useGetAllProfileQuery,
} from "@/services/profile";
import { compressImage, fileToBase64 } from "@/utils/compressImage";

import ProfileInfoGrid from "@/components/Profile/ProfileInfoGrid";
import { Icon } from "@iconify/react";
import { UploadFile } from "antd"; // kept type for consistency, though using custom input now
import { useEffect, useMemo, useRef, useState } from "react";
import imgError from "/public/states/notificationToasts/error.svg";
import imgSuccess from "/public/states/notificationToasts/successcheck.svg";

// Page component: User Profile overview
const ProfilePage = () => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [formValues, setFormValues] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    phone_number: "",
    profile_photo: null, // base64 or URL
  });
  // antd Upload state
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewTitle, setPreviewTitle] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data, isLoading, isError, refetch } = useGetAllProfileQuery({
    include: "roles,staff,permissions",
    append: "is_admin",
  });
  const [createProfile, { isLoading: isCreating }] = useCreateProfileMutation();

  const profile = (data as any)?.data; // Aligning with provided sample response

  const fullName = useMemo(() => {
    if (!profile) return "";
    return [profile.first_name, profile.middle_name, profile.last_name]
      .filter(Boolean)
      .join(" ");
  }, [profile]);

  const infoItems = useMemo(
    () => [
      {
        label: "User ID",
        value: profile?.id,
        icon: "mdi:identifier",
      },
      {
        label: "Email",
        value: profile?.email,
        icon: "mdi:email-outline",
      },
      {
        label: "Phone Number",
        value: profile?.phone_number || "—",
        icon: "mdi:phone-outline",
      },
      {
        label: "Email Verified",
        value: profile?.email_verified_at ? "Yes" : "No",
        icon: profile?.email_verified_at
          ? "mdi:check-decagram"
          : "mdi:alert-decagram",
        highlight: !!profile?.email_verified_at,
      },
      {
        label: "Phone Verified",
        value: profile?.phone_number_verified_at ? "Yes" : "No",
        icon: profile?.phone_number_verified_at
          ? "mdi:check-decagram"
          : "mdi:alert-decagram",
        highlight: !!profile?.phone_number_verified_at,
      },
      {
        label: "Store",
        value: profile?.staff?.store?.name || "—",
        icon: "mdi:store-outline",
      },
      {
        label: "Store Address",
        value: profile?.staff?.store?.address || "—",
        icon: "mdi:map-marker-outline",
      },
      {
        label: "Headquarters",
        value: profile?.staff?.store?.is_headquarters === "1" ? "Yes" : "No",
        icon:
          profile?.staff?.store?.is_headquarters === "1"
            ? "mdi:office-building"
            : "mdi:office-building-outline",
        highlight: profile?.staff?.store?.is_headquarters === "1",
      },
      {
        label: "Primary Role",
        value: profile?.roles?.[0]?.name || "—",
        icon: "mdi:account-tie",
      },
      {
        label: "Created At",
        value: profile?.created_at,
        icon: "mdi:calendar",
      },
      {
        label: "Updated At",
        value: profile?.updated_at,
        icon: "mdi:update",
      },
    ],
    [profile]
  );

  const handleSubmit = async () => {
    // Basic client validation
    const errors: { [k: string]: string } = {};
    if (!formValues.first_name) errors.first_name = "First name is required";
    if (!formValues.last_name) errors.last_name = "Last name is required";
    if (!formValues.phone_number)
      errors.phone_number = "Phone number is required";
    setFormErrors(errors);
    if (Object.keys(errors).length) return;

    try {
      const payload = { ...formValues } as any;
      let finalPayload: any;
      if (payload.profile_photo === null) {
        const { profile_photo, ...rest } = payload;
        finalPayload = rest;
      } else {
        finalPayload = payload;
      }
      const res = await createProfile({ body: finalPayload }).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText="Success"
              title={<span className="font-semibold">Profile created</span>}
              message="Profile has been created successfully"
              image={imgSuccess}
              textColor="green"
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Success",
      });
      setShowModal(false);
      setFormValues({
        first_name: "",
        middle_name: "",
        last_name: "",
        phone_number: "",
        profile_photo: null,
      });
      refetch();
    } catch (err: any) {
      const apiErrors = (err as any)?.data?.errors;
      if (apiErrors) {
        const formatted: { [k: string]: string } = {};
        Object.keys(apiErrors).forEach((k) => {
          formatted[k] = apiErrors[k][0];
        });
        setFormErrors(formatted);
      }
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText="Error"
              title={<span className="font-semibold">Creation failed</span>}
              message={(err as any)?.data?.message || "Something went wrong"}
              image={imgError}
              textColor="red"
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Error",
      });
    }
  };

  // Handle file selection (custom input instead of antd Upload to avoid previous broken refs)
  const handleSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      const base64 = (await fileToBase64(compressed)) as string;
      setFormValues((p: any) => ({ ...p, profile_photo: base64 }));
      const newFile: UploadFile = {
        uid: Date.now().toString(),
        name: compressed.name,
        status: "done",
        url: base64,
      } as UploadFile;
      setFileList([newFile]);
    } catch (err) {
      console.warn("Failed to process image", err);
      setFormValues({
        ...formValues,
        profile_photo: null,
      });
    }
  };

  const removeSelectedFile = () => {
    setFileList([]);
    setFormValues((p: any) => ({ ...p, profile_photo: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  useEffect(() => {
    if (!showModal) {
      setFormErrors({});
      setFormValues({
        first_name: "",
        middle_name: "",
        last_name: "",
        phone_number: "",
        profile_photo: null,
      });
    } else {
      setFormValues({
        first_name: profile?.first_name || "",
        middle_name: profile?.middle_name || "",
        last_name: profile?.last_name || "",
        phone_number: profile?.phone_number || "",
        profile_photo: null,
      });
    }
  }, [profile, showModal]);
  useEffect(() => {
    if (!profile) return;

    // Populate form values from profile (prefer explicit profile_photo_url if available)
    setFormValues((prev) => ({
      ...prev,
      first_name: profile.first_name || prev.first_name,
      middle_name: profile.middle_name || prev.middle_name,
      last_name: profile.last_name || prev.last_name,
      phone_number: profile.phone_number || prev.phone_number,
      profile_photo: null,
    }));

    // If there's a photo URL, show it in the fileList for preview
    const photoUrl = profile.profile_photo_url || null;
    if (photoUrl) {
      setFileList([
        {
          uid: "-1",
          name: profile.first_name + " " + profile.last_name || "profile-photo",
          status: "done",
          url: photoUrl,
        } as UploadFile,
      ]);
    } else {
      setFileList([]);
    }

    // Clear any existing form errors when new profile loads
    setFormErrors({});
  }, [profile]);
  return (
    <div className="pb-16 bg-white">
      <Header
        search={search}
        setSearch={setSearch}
        placeHolderText=""
        showSearch={false}
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="User Profile"
        btnText={"Update Profile"}
        showAddButton={true}
        onClick={() => setShowModal(true)}
      />
      <SharedLayout className="bg-white">
        {isLoading ? (
          <SkeletonLoaderForPage />
        ) : (
          <>
            {/* Error State */}
            {isError && !isLoading && (
              <div className="mt-10 flex flex-col items-center gap-4">
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center gap-2">
                  <Icon icon="mdi:alert-circle-outline" width={20} />
                  <span>Failed to load profile.</span>
                </div>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-500"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && !profile && (
              <div className="mt-10 flex flex-col items-center gap-4">
                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 max-w-md text-center">
                  <Icon
                    icon="mdi:account-question-outline"
                    width={38}
                    className="text-gray-400 mx-auto mb-2"
                  />
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    No Profile Data
                  </h3>
                  <p className="text-sm text-gray-500">
                    We couldn't find any profile information yet.
                  </p>
                </div>
              </div>
            )}

            {/* Main Content */}
            {profile && !isLoading && (
              <div className="mt-6">
                <ProfileAvatarCard
                  name={fullName}
                  email={profile.email}
                  phone={profile.phone_number}
                  avatarUrl={profile.profile_photo_url}
                  createdAt={profile.created_at}
                  emailVerified={profile.email_verified_at}
                  phoneVerified={profile.phone_number_verified_at}
                />

                <ProfileSection
                  title="Account Details"
                  description="Key information related to this user account."
                >
                  <ProfileInfoGrid items={infoItems} />
                </ProfileSection>

                {/* Staff Information Section */}
                {profile.staff && (
                  <ProfileSection
                    title="Staff Information"
                    description="Details about staff assignment and store information."
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon
                            icon="mdi:badge-account-outline"
                            className="text-blue-600"
                            width={20}
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Staff Number
                          </span>
                        </div>
                        <p className="text-base font-semibold text-gray-900">
                          {profile.staff.staff_no}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon
                            icon="mdi:store"
                            className="text-green-600"
                            width={20}
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Store
                          </span>
                        </div>
                        <p className="text-base font-semibold text-gray-900">
                          {profile.staff.store.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {profile.staff.store.address}
                        </p>
                        {profile.staff.store.is_headquarters === "1" && (
                          <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Headquarters
                          </span>
                        )}
                      </div>
                      <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon
                            icon="mdi:calendar-account"
                            className="text-purple-600"
                            width={20}
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Staff Since
                          </span>
                        </div>
                        <p className="text-base font-semibold text-gray-900">
                          {new Date(
                            profile.staff.created_at
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </ProfileSection>
                )}

                {/* Roles and Permissions Section */}
                {(profile.roles?.length > 0 ||
                  profile.permissions?.length > 0) && (
                  <ProfileSection
                    title="Roles & Permissions"
                    description="User roles and associated permissions within the system."
                  >
                    <div className="space-y-6">
                      {/* User Roles */}
                      {profile.roles?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Icon
                              icon="mdi:account-group"
                              className="text-indigo-600"
                              width={18}
                            />
                            Assigned Role
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {profile.roles.map((role: any) => (
                              <span
                                key={role.id}
                                className="inline-block px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-800 rounded-full capitalize"
                              >
                                {role.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* User Permissions */}
                      {profile.permissions?.length > 0 && (
                        <div className="">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Icon
                              icon="mdi:shield-check"
                              className="text-green-600"
                              width={18}
                            />
                            Permissions ({profile.permissions.length})
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {profile.permissions.map((permission: any) => (
                              <div
                                key={permission.id}
                                className="flex items-center gap-2 p-2 rounded border border-gray-200 bg-white"
                              >
                                <Icon
                                  icon={
                                    permission.name.includes("view")
                                      ? "mdi:eye"
                                      : permission.name.includes("create")
                                      ? "mdi:plus"
                                      : permission.name.includes("update")
                                      ? "mdi:pencil"
                                      : permission.name.includes("delete")
                                      ? "mdi:delete"
                                      : "mdi:shield-check"
                                  }
                                  className="text-gray-500"
                                  width={16}
                                />
                                <span className="text-sm text-gray-700">
                                  {permission.label || permission.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </ProfileSection>
                )}
              </div>
            )}
          </>
        )}
      </SharedLayout>
      {showModal && (
        <PlannerModal
          modalOpen={showModal}
          setModalOpen={setShowModal}
          title="Update Profile"
          width={520}
          onCloseModal={() => setShowModal(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="space-y-4 py-2"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First Name *</label>
                <TextInput
                  name="first_name"
                  type="text"
                  value={formValues.first_name}
                  onChange={(e) =>
                    setFormValues((p) => ({ ...p, first_name: e.target.value }))
                  }
                  placeholder="Enter first name"
                  className="w-full border rounded px-3 py-3 text-sm"
                />
                {formErrors.first_name && (
                  <p className="text-xs text-red-500 mt-1">
                    {formErrors.first_name}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Middle Name</label>
                <TextInput
                  name="middle_name"
                  type="text"
                  value={formValues.middle_name}
                  onChange={(e) =>
                    setFormValues((p) => ({
                      ...p,
                      middle_name: e.target.value,
                    }))
                  }
                  placeholder="Enter middle name"
                  className="w-full border rounded px-3 py-3 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Last Name *</label>
                <TextInput
                  name="last_name"
                  type="text"
                  value={formValues.last_name}
                  onChange={(e) =>
                    setFormValues((p) => ({ ...p, last_name: e.target.value }))
                  }
                  placeholder="Enter last name"
                  className="w-full border rounded px-3 py-3 text-sm"
                />
                {formErrors.last_name && (
                  <p className="text-xs text-red-500 mt-1">
                    {formErrors.last_name}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Phone Number *</label>
                <PhoneInputWithCountry
                  disabled={false}
                  value={formValues.phone_number}
                  onChange={(e) =>
                    setFormValues((p) => ({
                      ...p,
                      phone_number: e,
                    }))
                  }
                  placeholder="Enter phone number"
                  className="w-full border rounded  text-sm"
                />
                {formErrors.phone_number && (
                  <p className="text-xs text-red-500 mt-1">
                    {formErrors.phone_number}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full">
              <label className="text-sm font-medium">Profile Photo</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                aria-label="Profile photo upload"
                onChange={handleSelectFile}
              />
              {fileList.length === 0 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-4 w-full mt-2 border-2 border-dashed border-gray-300 rounded-lg mb-2 cursor-pointer hover:border-primary-40 transition-colors`}
                >
                  <div className="flex justify-center items-center gap-2 py-4">
                    <Icon icon="ic:round-plus" width="24" height="24" />
                    <p className="text-xs font-bold text-center">Add Photo</p>
                  </div>
                </button>
              )}
              {fileList.length > 0 && (
                <div className="mt-2 flex items-center gap-3 px-2 py-4 border border-dashed rounded w-full">
                  <img
                    src={fileList[0].url}
                    alt="Preview"
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm truncate">{fileList[0].name}</p>
                    <div className="flex gap-2 mt-1">
                      <button
                        type="button"
                        className="text-blue-600 hover:underline font-semibold text-sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        className="text-red-500 text-sm"
                        onClick={removeSelectedFile}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t mt-2">
              <CustomButton
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </CustomButton>
              <CustomButton
                onClick={() => {}}
                type="submit"
                disabled={isCreating}
                className="bg-primary-40 text-white hover:opacity-90 flex items-center justify-center gap-2 text-center"
              >
                {isCreating && <Spinner className="border-white" />}
                Update Profile
              </CustomButton>
            </div>
          </form>
        </PlannerModal>
      )}
    </div>
  );
};

export default ProfilePage;
