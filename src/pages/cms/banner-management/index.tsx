import AttributeHeader from "@/components/Attributes/AttributeHeader";
import Header from "@/components/header";
import TextAreaInput from "@/components/Input/TextAreaInput";
import TextInput from "@/components/Input/TextInput";
import BannerFilter, {
  BannerFilterState,
} from "@/components/ItemComponent/BannerFilter";
import PermissionGuard from "@/components/RolesPermission/PermissionGuard";
import CustomButton from "@/components/sharedUI/Buttons/Button";
import PaginationComponent from "@/components/sharedUI/PaginationComponent";
import PlannerModal from "@/components/sharedUI/PlannerModal";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import CustomTable from "@/components/tables/CustomTable";
import {
  useDeleteImageContentBlockMutation,
  useGetContentBlocksListQuery,
  useUpdateContentBlockMutation,
} from "@/services/cms/content-blocks";
import { useGetAllEnumsQuery } from "@/services/global";
import { compressImage, fileToBase64 } from "@/utils/compressImage";
import {
  EditOutlined,
  FolderOpenOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { Icon } from "@iconify/react";
import {
  Button,
  Checkbox,
  CheckboxChangeEvent,
  Tag,
  Tooltip,
  Upload,
  message,
} from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo, useRef, useState } from "react";

const placeholderImg = "/images/empty_box.svg";

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

const BannerManagement = () => {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<BannerFilterState>({});
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [singleFileList, setSingleFileList] = useState<any[]>([]);
  const [formValues, setFormValues] = useState<any>({});
  const [formErrors, setFormErrors] = useState<any>({});
  const uploadRef = useRef<any>(null);

  const { data, isLoading, refetch } = useGetContentBlocksListQuery({
    paginate: true,
    page: currentPage,
    per_page: 50,
    q: search,
    filter: {
      ...filters,
    },
  });
  const { data: enumsData, isLoading: isLoadingEnums } = useGetAllEnumsQuery({
    enum: "ContentBlockGroup",
  });

  const enumOptions = useMemo(
    () =>
      (enumsData?.values ?? []).map((enumItem) => ({
        label: enumItem.name,
        value: enumItem.value,
      })),
    [enumsData],
  );
  console.log("🚀 ~ BannerManagement ~ enumOptions:", enumOptions);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch();
  };

  const handleFilterChange = (newFilters: BannerFilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const [updateSingleContent, { isLoading: isUpdating }] =
    useUpdateContentBlockMutation();
  const [deleteImage, { isLoading: isDeletingImage }] =
    useDeleteImageContentBlockMutation();

  const transformedData = useMemo(() => {
    if (!data?.data) return [];

    const groupedMap = new Map<string, any>();

    data.data.forEach((item: any) => {
      const groupName = item.group || "Uncategorized";
      if (!groupedMap.has(groupName)) {
        groupedMap.set(groupName, {
          key: `group-${groupName}`,
          title: groupName,
          isGroup: true,
          children: [],
          groupName,
        });
      }
      groupedMap.get(groupName).children.push({
        ...item,
        key: item.id,
        isGroup: false,
      });
    });

    groupedMap.forEach((group) => {
      group.children.sort((a: any, b: any) => a.sort_order - b.sort_order);
    });

    return Array.from(groupedMap.values());
  }, [data]);

  const handleBulkUpdate = (groupName: string) => {
    router.push(`/cms/banner-management/update?group=${groupName}`);
  };

  const handleSingleEdit = (record: any) => {
    setSelectedId(record.id);
    setSingleFileList(
      buildInitialFileList(record.image_url, record.title, record.id),
    );
    setFormValues({
      title: record.title || "",
      description: record.description || "",
      short_description: record.short_description || "",
      link_text: record.link_text || "",
      link_url: record.link_url || "",
      image: null, // Send null if not changed
      is_active: record.is_active,
      existing_image_url: record.image_url,
    });
    setFormErrors({});
    setIsOpenModal(true);
  };

  const handleSingleImageChange = async (info: any) => {
    const trimmedList = info.fileList.slice(-1);
    setSingleFileList(trimmedList);
    const fileObj = trimmedList[0]?.originFileObj;
    if (fileObj) {
      try {
        const compressed = await compressImage(fileObj);
        const base64 = await fileToBase64(compressed);
        setFormValues({ ...formValues, image: base64 });
      } catch (error) {
        message.error("Error processing image");
      }
    } else if (trimmedList.length === 0) {
      setFormValues({ ...formValues, image: null });
    }
  };

  const handleRemoveImage = async () => {
    const isExistingImage =
      singleFileList.length > 0 &&
      formValues.existing_image_url &&
      singleFileList[0].url === formValues.existing_image_url;

    if (isExistingImage && selectedId) {
      try {
        await deleteImage({ id: selectedId }).unwrap();
        message.success("Image deleted successfully");
        setSingleFileList([]);
        setFormValues({
          ...formValues,
          image: null,
          existing_image_url: null,
        });
        refetch();
      } catch (error) {
        message.error("Failed to delete image");
      }
    } else {
      setSingleFileList([]);
      setFormValues({ ...formValues, image: null });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    setFormValues({
      ...formValues,
      is_active: e.target.checked ? 1 : 0,
    });
  };

  const triggerUpload = () => {
    const uploadControl = document.querySelector(
      '.hidden-upload .ant-upload input[type="file"]',
    );
    if (uploadControl) {
      (uploadControl as HTMLElement).click();
    }
  };

  const handleSubmit = async () => {
    if (!selectedId) return;
    try {
      setFormErrors({});
      const { existing_image_url, ...payload } = formValues;

      await updateSingleContent({
        id: selectedId,
        body: payload,
      }).unwrap();
      message.success("Update successful");
      setIsOpenModal(false);
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Operation failed");
      if (error?.data?.errors) {
        setFormErrors(error.data.errors);
      }
      console.error(error);
    }
  };

  const columns: any = [
    {
      title: "Title / Group",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: any) => {
        if (record.isGroup) {
          return (
            <div className="flex items-center gap-3 font-semibold text-base">
              <FolderOpenOutlined />
              <span className="text-gray-800">{text}</span>
              <Tag color="blue">{record.children?.length || 0} items</Tag>
            </div>
          );
        }
        return (
          <div className="flex flex-col gap-1 pl-4">
            <span className="text-sm font-semibold text-gray-900">{text}</span>
            <span className="text-xs text-gray-500">Key: {record.key}</span>
          </div>
        );
      },
      width: 380,
    },
    {
      title: "Image",
      dataIndex: "image_url",
      key: "image",
      width: 140,
      render: (_: any, record: any) => {
        if (record.isGroup) return null;
        const src = record.image_url || placeholderImg;
        return (
          <div className="w-[70px] h-[64px] overflow-hidden rounded-md border border-gray-200 bg-white flex items-center justify-center">
            <Image
              width={70}
              height={64}
              src={src}
              alt={record.title}
              className="object-cover w-full h-full"
            />
          </div>
        );
      },
    },
    {
      title: "Short Description",
      dataIndex: "short_description",
      key: "short_description",
      width: 240,
      render: (text: string, record: any) => {
        if (record.isGroup) return null;
        return <span className="text-sm text-gray-700">{text || "-"}</span>;
      },
    },
    {
      title: "Link",
      dataIndex: "link_text",
      key: "link",
      width: 220,
      render: (_: string, record: any) => {
        if (record.isGroup) return null;
        if (!record.link_url)
          return <span className="text-gray-400">No link</span>;
        return (
          <a
            href={record.link_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
          >
            <LinkOutlined />
            <span>{record.link_text || record.link_url}</span>
          </a>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      width: 120,
      render: (active: number, record: any) => {
        if (record.isGroup) return null;
        return (
          <Tag color={active ? "success" : "error"}>
            {active ? "Active" : "Inactive"}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 150,
      render: (_: any, record: any) => {
        if (record.isGroup) {
          return (
            <Tooltip title="Bulk Update Banners in this Group">
              <Button
                type="text"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBulkUpdate(record.groupName);
                }}
              >
                <Icon icon="la:mail-bulk" width="30" height="30" />
              </Button>
            </Tooltip>
          );
        }
        return (
          <Button
            icon={<EditOutlined />}
            onClick={() => handleSingleEdit(record)}
            type="text"
          />
        );
      },
    },
  ];

  return (
    <div>
      <Header
        search={search}
        setSearch={setSearch}
        showSearch={true}
        placeHolderText="Search banners, links, groups..."
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="Banner Management"
        btnText={"Create Banner"}
        showAddButton={false}
        onClick={() => {}}
      />
      <SharedLayout className="bg-white">
        <PermissionGuard permission="products.viewAny">
          <div className="mb-4">
            <BannerFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              groupOptions={enumOptions}
            />
          </div>
          <CustomTable
            columns={columns}
            transformedData={transformedData}
            isLoading={isLoading}
            rowKey="key"
            expandable={{ defaultExpandAllRows: true, expandRowByClick: true }}
            rowClassName={(record: any) =>
              record.isGroup ? "bg-gray-50 font-semibold" : ""
            }
          />
          <div className="flex lg:justify-between justify-end items-center w-full py-10">
            {data?.meta &&
            ((currentPage === 1 && data?.meta?.total! >= 10) ||
              (currentPage > 1 && data?.meta?.total! >= 1)) ? (
              <div className={`text-sm hidden lg:block font-[500] text-black`}>
                Showing {(currentPage - 1) * data?.meta?.per_page! + 1} to{" "}
                {Math.min(
                  currentPage * data?.meta?.per_page!,
                  data?.meta?.total!,
                )}{" "}
                of {data?.meta?.total!} results
              </div>
            ) : null}
            {data?.meta &&
            ((currentPage === 1 && data?.meta?.total! >= 10) ||
              (currentPage > 1 && data?.meta?.total! >= 1)) ? (
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

      <PlannerModal
        title="Edit Banner"
        setModalOpen={setIsOpenModal}
        modalOpen={isOpenModal}
        width={600}
        className="order-details-modal"
        onCloseModal={() => setIsOpenModal(false)}
      >
        <style jsx global>{`
          .order-details-modal .ant-modal-body {
            padding: 0;
            max-height: 85vh;
            overflow-y: auto;
            // reduce scrollbar width
            scrollbar-width: 1px;
            &::-webkit-scrollbar {
              width: 6px;
            }
          }
          .order-details-modal .ant-modal-content {
            border-radius: 16px;
            overflow: hidden;
          }
          .order-details-container {
            padding: 0.2rem;
          }
          @media (max-width: 768px) {
            .order-details-container {
              padding: 0;
            }
          }
        `}</style>
        <div className="mt-5 flex flex-col gap-5 order-details-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              type="text"
              name="title"
              errorMessage={formErrors.title || ""}
              value={formValues.title}
              onChange={handleInputChange}
              placeholder="Enter title"
              title={<span className="font-[500]">Title*</span>}
              required={false}
            />
            <TextInput
              type="text"
              name="link_text"
              errorMessage={formErrors.link_text || ""}
              value={formValues.link_text}
              onChange={handleInputChange}
              placeholder="Shop Now"
              title={<span className="font-[500]">Link Text</span>}
              required={false}
            />
            <TextInput
              type="text"
              name="link_url"
              errorMessage={formErrors.link_url || ""}
              value={formValues.link_url}
              onChange={handleInputChange}
              placeholder="https://..."
              title={<span className="font-[500]">Link URL</span>}
              required={false}
            />
            <TextInput
              type="text"
              name="short_description"
              errorMessage={formErrors.short_description || ""}
              value={formValues.short_description}
              onChange={handleInputChange}
              placeholder="Short description"
              title={<span className="font-[500]">Short Description</span>}
              required={false}
            />
          </div>

          <div>
            <label className="text-sm font-[500] text-[#000] block mb-1">
              Description
            </label>
            <TextAreaInput
              name="description"
              value={formValues.description}
              onChange={handleInputChange}
              placeholder="Enter description"
              row={4}
              className="w-full text-sm"
            />
          </div>

          <div>
            <p className="text-sm capitalize font-[500] text-[#000] mb-2">
              Banner Image
            </p>
            {singleFileList.length === 0 ? (
              <div className="relative w-full">
                <Upload
                  ref={uploadRef}
                  className="hidden-upload w-full hidden"
                  maxCount={1}
                  fileList={singleFileList}
                  onChange={handleSingleImageChange}
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
                  onClick={triggerUpload}
                  className="p-4 w-full border-2 border-dashed border-gray-300 rounded-lg mb-2 cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <div className="flex justify-center items-center gap-2 py-4">
                    <Icon icon="ic:round-plus" width="24" height="24" />
                    <p className="text-xs font-bold text-center">Add Image</p>
                  </div>
                </button>
              </div>
            ) : (
              <div className="mb-3 w-full">
                <div className="flex items-center gap-2 p-2 border rounded w-full">
                  <img
                    src={
                      singleFileList[0].thumbUrl ||
                      singleFileList[0].url ||
                      (singleFileList[0].originFileObj &&
                        URL.createObjectURL(singleFileList[0].originFileObj))
                    }
                    alt="Preview"
                    className="w-8 h-8 object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm truncate">
                      {singleFileList[0].name.length > 20
                        ? `${singleFileList[0].name.slice(0, 20)}...`
                        : singleFileList[0].name}
                    </p>
                    <button
                      type="button"
                      disabled={isDeletingImage}
                      className="text-red-500 text-xs mt-1"
                      onClick={handleRemoveImage}
                    >
                      {isDeletingImage ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <Checkbox
              checked={formValues.is_active === 1}
              onChange={handleCheckboxChange}
            >
              <span className="font-[500]">Active</span>
            </Checkbox>
          </div>

          <div className="flex justify-end border-t border-gray-300 pt-4 mt-4">
            <div className="w-fit flex gap-3">
              <CustomButton
                type="button"
                onClick={() => setIsOpenModal(false)}
                className="border bg-border-300 text-black flex justify-center items-center gap-2 px-5"
              >
                Cancel
              </CustomButton>
              <CustomButton
                type="button"
                onClick={handleSubmit}
                disabled={isUpdating}
                className="border bg-primary-40 flex justify-center items-center gap-2 text-white px-5"
              >
                {isUpdating ? (
                  <span className="loading loading-spinner text-white"></span>
                ) : (
                  "Save Changes"
                )}
              </CustomButton>
            </div>
          </div>
        </div>
      </PlannerModal>
    </div>
  );
};

export default BannerManagement;
