import { SubCategoryForm } from "@/components/Forms/Category/SubCategoryForm";
import CustomButton from "@/components/sharedUI/Buttons/Button";
import ImageComponent from "@/components/sharedUI/ImageComponent";
import SecondaryModal from "@/components/sharedUI/SecondaryModal";
import { CategoryDatum } from "@/types/categoryTypes";
import { capitalizeOnlyFirstLetter } from "@/utils/fx";
import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";

interface CategoryDetailsProps {
  category: CategoryDatum;
  onClose: () => void;
  // create/update hooks passed from parent list to keep invalidation consistent
  onRefetch?: () => void;
  createSubCategory?: (body: any) => Promise<any> | any;
  updateSubCategory?: (args: { id: string; body: any }) => Promise<any> | any;
  isMutating?: boolean;
  serverError?: any;
}

export default function CategoryDetails({
  category,
  onClose,
  onRefetch,
  createSubCategory,
  updateSubCategory,
  isMutating,
  serverError,
}: CategoryDetailsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSub, setSelectedSub] = useState<CategoryDatum | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [formValues, setFormValues] = useState({
    name: "",
    image: null as null | string,
    parent_category_id: category?.id || "",
  });

  const [formErrors, setFormErrors] = useState<any>({});

  const subs = useMemo(() => category?.sub_categories || [], [category]);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setSelectedSub(null);
    setFormValues({
      name: "",
      image: null,
      parent_category_id: category?.id || "",
    });
    setFormErrors({});
    setEditOpen(true);
  };

  const handleOpenEdit = (sub: CategoryDatum) => {
    setIsEditing(true);
    setSelectedSub(sub);
    setFormValues({
      name: sub?.name || "",
      image: null,
      parent_category_id: category?.id || "",
    });
    setFormErrors({});
    setEditOpen(true);
  };

  const handleSubmit = async () => {
    try {
      // lightweight client validation
      if (!formValues.name?.trim()) {
        setFormErrors({ name: "Name is required" });
        return;
      }
      if (isEditing && selectedSub && updateSubCategory) {
        (await updateSubCategory({
          id: selectedSub.id,
          body: formValues,
        })?.unwrap?.()) ??
          updateSubCategory({ id: selectedSub.id, body: formValues });
      } else if (!isEditing && createSubCategory) {
        (await createSubCategory(formValues)?.unwrap?.()) ??
          createSubCategory(formValues);
      }
      setEditOpen(false);
      onRefetch?.();
    } catch (e) {
      // surfaced by serverError typically; keep silent here
    }
  };

  return (
    <div className="min-w-[320px]">
      <div className="flex gap-4 items-center">
        <div className="w-[50%] h-[180px] rounded-md border">
          <ImageComponent
            src={category?.image_url || "/images/empty_box.svg"}
            width={72}
            height={72}
            alt={category?.name}
            className="w-full h-full rounded-md object-cover"
            aspectRatio="1/1"
            isLoadingImage={isLoadingImage}
            setIsLoadingImage={setIsLoadingImage}
          />
        </div>
        <div className="w-[50%]">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {capitalizeOnlyFirstLetter(category?.name)}
          </h3>
          <div className="text-sm text-gray-500 mt-1">
            Slug:{" "}
            <span className="font-mono bg-gray-50 px-1 py-0.5 rounded border">
              {category?.slug}
            </span>
          </div>
          {category?.parent_category && (
            <div className="text-sm text-gray-600 mt-1">
              Parent: {capitalizeOnlyFirstLetter(category.parent_category.name)}
            </div>
          )}
          <div className="mt-3 flex flex-col gap-3">
            <CustomButton
              onClick={handleOpenCreate}
              className="bg-primary-40 text-white px-4 h-9"
            >
              <span className="flex items-center justify-center gap-2">
                <Icon icon="ic:round-plus" /> Add subcategory
              </span>
            </CustomButton>
            <CustomButton onClick={onClose} bordered className="px-4 h-9">
              Close
            </CustomButton>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Icon icon="mdi:folder-multiple" /> Subcategories ({subs.length})
        </h4>
        {subs.length === 0 ? (
          <div className="border rounded-lg p-6 text-center text-gray-500 bg-gray-50">
            No subcategories yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subs.map((sub) => (
              <button
                key={sub.id}
                onClick={() => handleOpenEdit(sub)}
                className="group flex items-center gap-3 p-3 rounded-lg border bg-white hover:shadow-sm hover:border-primary-40/40 transition"
                type="button"
                title="Edit subcategory"
              >
                <div className="w-10 h-10">
                  <ImageComponent
                    src={sub.image_url || "/images/empty_box.svg"}
                    width={40}
                    height={40}
                    alt={sub.name}
                    className="w-full h-full rounded object-cover"
                    aspectRatio="1/1"
                    isLoadingImage={isLoadingImage}
                    setIsLoadingImage={setIsLoadingImage}
                  />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-800 truncate">
                    {capitalizeOnlyFirstLetter(sub.name)}
                  </div>
                  <div className="text-xs text-gray-500">Slug: {sub.slug}</div>
                </div>
                <Icon
                  className="text-gray-400 group-hover:text-primary-40"
                  icon="mdi:pencil"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <SecondaryModal
        modalOpen={editOpen}
        setModalOpen={setEditOpen}
        title={isEditing ? "Edit Subcategory" : "Create Subcategory"}
        onCloseModal={() => setEditOpen(false)}
        width={420}
      >
        <SubCategoryForm
          isEditing={isEditing}
          selectedItem={isEditing ? selectedSub ?? undefined : category}
          parentCategoryName={category?.name}
          error={serverError}
          btnText={isEditing ? "Save changes" : "Create Subcategory"}
          formErrors={formErrors}
          formValues={formValues}
          handleInputChange={(e: any) => {
            const { name, value } = e.target;
            setFormValues((s) => ({ ...s, [name]: value }));
          }}
          setFormValues={setFormValues}
          handleSubmit={handleSubmit}
          isLoadingCreate={!!isMutating}
          setIsOpenModal={setEditOpen}
        />
      </SecondaryModal>
    </div>
  );
}
