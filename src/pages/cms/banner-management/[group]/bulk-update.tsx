import AttributeHeader from "@/components/Attributes/AttributeHeader";
import Header from "@/components/header";
import TextAreaInput from "@/components/Input/TextAreaInput";
import TextInput from "@/components/Input/TextInput";
import PermissionGuard from "@/components/RolesPermission/PermissionGuard";
import CustomButton from "@/components/sharedUI/Buttons/Button";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import Spinner from "@/components/sharedUI/Spinner";
import {
  useCreateBulkContentBlockMutation,
  useDeleteImageContentBlockMutation,
  useGetContentBlocksListQuery,
} from "@/services/cms/content-blocks";
import { compressImage, fileToBase64 } from "@/utils/compressImage";
import { Icon } from "@iconify/react";
import { Checkbox, CheckboxChangeEvent, Upload, message } from "antd";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

const buildInitialFileList = (
  url: string | null,
  title: string,
  uid: string,
) => {
  if (!url) return [];
  return [
    {
      uid,
      name: `${title}-image`,
      status: "done",
      url,
    },
  ];
};

const UpdateBannerManagement = () => {
  const router = useRouter();
  const { group } = router.query;

  const [search, setSearch] = useState<string>("");
  const [bulkFileLists, setBulkFileLists] = useState<Record<string, any[]>>({});
  const [bulkFormValues, setBulkFormValues] = useState<any[]>([]);
  const [formErrors, setFormErrors] = useState<any>({});

  const { data, isLoading, isFetching, refetch } = useGetContentBlocksListQuery(
    {
      q: search,
      paginate: false,
      filter: {
        group: group || "",
      },
    },
    {
      skip: !group,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    },
  );

  const [updateBulkContent, { isLoading: isUpdating }] =
    useCreateBulkContentBlockMutation();
  const [deleteImage, { isLoading: isDeletingImage }] =
    useDeleteImageContentBlockMutation();

  const groupItems = useMemo(() => {
    if (!data?.data || !group) return [];
    return data.data
      .filter((item: any) => item.group === group)
      .sort((a: any, b: any) => a.sort_order - b.sort_order);
  }, [data, group]);

  useEffect(() => {
    if (isFetching) {
      setBulkFormValues([]);
      setBulkFileLists({});
    }
  }, [isFetching]);

  useEffect(() => {
    if (!isFetching && groupItems.length > 0 && bulkFormValues.length === 0) {
      const initialFileLists: Record<string, any[]> = {};
      const initialValues = groupItems.map((child: any) => {
        initialFileLists[child.id] = buildInitialFileList(
          child.image_url,
          child.title,
          child.id,
        );
        return {
          id: child.id,
          title: child.title,
          description: child.description || "",
          short_description: child.short_description || "",
          link_text: child.link_text || "",
          link_url: child.link_url || "",
          image: null, // Send null if not changed
          is_active: child.is_active,
          existing_image_url: child.image_url, // Keep track for UI
        };
      });
      setBulkFileLists(initialFileLists);
      setBulkFormValues(initialValues);
    }
  }, [groupItems, isFetching]);

  const handleBulkImageChange = async (info: any, index: number) => {
    const trimmedList = info.fileList.slice(-1);
    const item = bulkFormValues[index];
    const itemKey = item.id || `idx-${index}`;

    setBulkFileLists((prev) => ({ ...prev, [itemKey]: trimmedList }));

    const fileObj = trimmedList[0]?.originFileObj;
    const newValues = [...bulkFormValues];

    if (fileObj) {
      try {
        const compressed = await compressImage(fileObj);
        const base64 = await fileToBase64(compressed);
        newValues[index] = { ...newValues[index], image: base64 };
      } catch (error) {
        message.error("Error processing image");
      }
    } else if (trimmedList.length === 0) {
      // If list is empty, it means we removed the NEW image, or the OLD image
      // If we had an existing image and removed it via X, we handle that in handleRemoveImage
      // But if we just uploaded one and then removed it, we set image back to null
      newValues[index] = { ...newValues[index], image: null };
    }
    setBulkFormValues(newValues);
  };

  const handleRemoveImage = async (index: number) => {
    const item = bulkFormValues[index];
    const itemKey = item.id || `idx-${index}`;
    const fileList = bulkFileLists[itemKey] || [];
    const isExistingImage =
      fileList.length > 0 &&
      item.existing_image_url &&
      fileList[0].url === item.existing_image_url;

    if (isExistingImage && item.id) {
      try {
        await deleteImage({ id: item.id }).unwrap();
        message.success("Image deleted successfully");
        // Update local state to reflect deletion
        const newValues = [...bulkFormValues];
        newValues[index] = { ...newValues[index], existing_image_url: null };
        setBulkFormValues(newValues);
        setBulkFileLists((prev) => ({ ...prev, [itemKey]: [] }));
        refetch();
      } catch (error) {
        message.error("Failed to delete image");
      }
    } else {
      // Removing a newly added image draft
      const newFileLists = { ...bulkFileLists };
      newFileLists[itemKey] = [];
      setBulkFileLists(newFileLists);

      const newValues = [...bulkFormValues];
      newValues[index] = { ...newValues[index], image: null };
      setBulkFormValues(newValues);
    }
  };

  const handleBulkInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => {
    const newValues = [...bulkFormValues];
    newValues[index] = {
      ...newValues[index],
      [e.target.name]: e.target.value,
    };
    setBulkFormValues(newValues);
  };

  const handleBulkCheckboxChange = (e: CheckboxChangeEvent, index: number) => {
    const newValues = [...bulkFormValues];
    newValues[index] = {
      ...newValues[index],
      is_active: e.target.checked ? 1 : 0,
    };
    setBulkFormValues(newValues);
  };

  const handleSubmit = async () => {
    try {
      setFormErrors({});
      // Filter out existing_image_url before sending
      const payload = bulkFormValues.map(
        ({ existing_image_url, ...rest }) => rest,
      );

      await updateBulkContent({
        content_blocks: payload,
      }).unwrap();
      message.success("Bulk update successful");
      router.push("/cms/banner-management");
    } catch (error: any) {
      console.log(error);
      message.error(error?.data?.message || "Operation failed");
      if (error?.data?.errors) {
        setFormErrors(error.data.errors);
      }
    }
  };

  if (!group) return null;

  return (
    <div>
      <Header
        search={search}
        setSearch={setSearch}
        showSearch={false}
        placeHolderText=""
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText={`Update Group: ${group}`}
        btnText=""
        showAddButton={false}
        onClick={() => {}}
      />
      <SharedLayout className="bg-white">
        <PermissionGuard permission="products.viewAny">
          <div className="flex flex-col gap-6 max-w-5xl mx-auto py-6">
            {isFetching && bulkFormValues.length === 0 ? (
              <div className="flex justify-center p-10">
                <SkeletonLoaderForPage />
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-5">
                  {bulkFormValues.map((item, index) => {
                    const itemKey = item.id || `idx-${index}`;
                    const fileList = bulkFileLists[itemKey] || [];

                    return (
                      <div
                        key={itemKey}
                        className="p-6 border border-gray-200 rounded-xl bg-gray-50 shadow-sm"
                      >
                        <h3 className="font-bold mb-4 text-lg text-gray-800">
                          Item {index + 1}: {item.title}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <TextInput
                            type="text"
                            name="title"
                            errorMessage={
                              formErrors[`content_blocks.${index}.title`] || ""
                            }
                            value={item.title}
                            onChange={(e) => handleBulkInputChange(e, index)}
                            placeholder="Enter title"
                            title={<span className="font-[500]">Title*</span>}
                            required
                          />
                          <TextInput
                            type="text"
                            name="link_text"
                            errorMessage={
                              formErrors[`content_blocks.${index}.link_text`] ||
                              ""
                            }
                            value={item.link_text}
                            onChange={(e) => handleBulkInputChange(e, index)}
                            placeholder="Shop Now"
                            title={
                              <span className="font-[500]">Link Text</span>
                            }
                          />
                          <TextInput
                            type="text"
                            name="link_url"
                            errorMessage={
                              formErrors[`content_blocks.${index}.link_url`] ||
                              ""
                            }
                            value={item.link_url}
                            onChange={(e) => handleBulkInputChange(e, index)}
                            placeholder="https://..."
                            title={<span className="font-[500]">Link URL</span>}
                          />
                          <TextInput
                            type="text"
                            name="short_description"
                            errorMessage={
                              formErrors[
                                `content_blocks.${index}.short_description`
                              ] || ""
                            }
                            value={item.short_description}
                            onChange={(e) => handleBulkInputChange(e, index)}
                            placeholder="Short description"
                            title={
                              <span className="font-[500]">
                                Short Description
                              </span>
                            }
                          />
                        </div>

                        <div className="mt-5">
                          <label className="text-sm font-[500] text-[#000] block mb-1">
                            Description
                          </label>
                          <TextAreaInput
                            name="description"
                            value={item.description}
                            onChange={(e) => handleBulkInputChange(e, index)}
                            placeholder="Enter description"
                            row={3}
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm "
                          />
                        </div>

                        <div className="mt-5">
                          <p className="text-sm capitalize font-[500] text-[#000] mb-2">
                            Banner Image
                          </p>
                          {fileList.length === 0 ? (
                            <div className="relative w-full">
                              <Upload
                                className="hidden-upload w-full hidden"
                                maxCount={1}
                                fileList={fileList}
                                onChange={(info) =>
                                  handleBulkImageChange(info, index)
                                }
                                beforeUpload={() => false}
                                accept="image/*"
                                showUploadList={false}
                                customRequest={({ onSuccess }) => {
                                  if (onSuccess) onSuccess("ok", undefined);
                                }}
                              >
                                <div></div>
                              </Upload>

                              <button
                                type="button"
                                onClick={() => {
                                  const uploadControl =
                                    document.querySelectorAll(
                                      '.hidden-upload .ant-upload input[type="file"]',
                                    )[index];
                                  if (uploadControl) {
                                    (uploadControl as HTMLElement).click();
                                  }
                                }}
                                className="p-4 w-full border-2 border-dashed border-gray-300 rounded-lg mb-2 cursor-pointer hover:border-blue-500 transition-colors bg-white"
                              >
                                <div className="flex justify-center items-center gap-2 py-4">
                                  <Icon
                                    icon="ic:round-plus"
                                    width="24"
                                    height="24"
                                  />
                                  <p className="text-xs font-bold text-center">
                                    Add Image
                                  </p>
                                </div>
                              </button>
                            </div>
                          ) : (
                            <div className="mb-3 w-full">
                              <div className="flex items-center gap-3 p-3 border rounded-lg w-full bg-white">
                                <img
                                  src={
                                    fileList[0].thumbUrl ||
                                    fileList[0].url ||
                                    (fileList[0].originFileObj &&
                                      URL.createObjectURL(
                                        fileList[0].originFileObj,
                                      ))
                                  }
                                  alt="Preview"
                                  className="w-16 h-16 object-cover rounded-md"
                                />
                                <div className="flex-1">
                                  <p className="text-sm font-medium truncate">
                                    {fileList[0].name.length > 30
                                      ? `${fileList[0].name.slice(0, 30)}...`
                                      : fileList[0].name}
                                  </p>
                                  <button
                                    type="button"
                                    className="text-red-500 text-xs mt-2 hover:underline"
                                    onClick={() => handleRemoveImage(index)}
                                    disabled={isDeletingImage}
                                  >
                                    {isDeletingImage
                                      ? "Removing..."
                                      : "Remove Image"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-5">
                          <Checkbox
                            checked={item.is_active === 1}
                            onChange={(e) => handleBulkCheckboxChange(e, index)}
                          >
                            <span className="font-[500]">Active</span>
                          </Checkbox>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end gap-4 mt-4 pb-10">
                  <CustomButton
                    type="button"
                    onClick={() => router.push("/cms/banner-management")}
                    className="border bg-gray-100 text-black flex justify-center items-center gap-2 px-6 py-5 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </CustomButton>
                  <CustomButton
                    type="button"
                    onClick={handleSubmit}
                    disabled={isUpdating}
                    className="border bg-primary-40 flex justify-center items-center gap-2 text-white px-6 py-5 rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    {isUpdating ? (
                      <Spinner className="w-5 h-5 border-white" />
                    ) : (
                      "Save Changes"
                    )}
                  </CustomButton>
                </div>
              </>
            )}
          </div>
        </PermissionGuard>
      </SharedLayout>
    </div>
  );
};

export default UpdateBannerManagement;
