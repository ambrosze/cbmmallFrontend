import AttributeHeader from "@/components/Attributes/AttributeHeader";
import Header from "@/components/header";
import RichTextEditor from "@/components/Input/RichTextEditor";
import SelectInput from "@/components/Input/SelectInput";
import TextAreaInput from "@/components/Input/TextAreaInput";
import TextInput from "@/components/Input/TextInput";
import PermissionGuard from "@/components/RolesPermission/PermissionGuard";
import CustomButton from "@/components/sharedUI/Buttons/Button";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import Spinner from "@/components/sharedUI/Spinner";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";
import { useGetAllAttributesQuery } from "@/services/attributes-values/attributes";
import { useGetAllCategoryQuery } from "@/services/category";
import { useCreateProductsMutation } from "@/services/products/product-list";
import { compressImage, fileToBase64 } from "@/utils/compressImage";
import debounce from "@/utils/debounce";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Breadcrumb, Upload, message } from "antd";
import React, { useCallback, useMemo, useRef, useState } from "react";
import * as yup from "yup";
const imgError = "/states/notificationToasts/error.svg";
const imgSuccess = "/states/notificationToasts/successcheck.svg";

type Variant = {
  name: string;
  price: number | "";
  compare_price: number | null | "";
  cost_price: number | "";
  quantity: number | "";
  is_serialized: 1 | 0;
  serial_number?: string;
  images?: string[];
  attribute_value_ids?: string[];
  batch_number?: string;
  // UI-only file list for previews
  ui_files?: any[];
  // UI-only: whether this variant was copied from main
  copy_from_main?: boolean;
};

const productSchema = yup.object().shape({
  name: yup.string().required("Product name is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .min(0, "Price cannot be negative")
    .required("Price is required"),
  compare_price: yup
    .number()
    .nullable()
    .transform((v, o) => (o === "" ? null : v))
    .min(0, "Compare price cannot be negative")
    .optional(),
  cost_price: yup
    .number()
    .typeError("Cost price must be a number")
    .min(0, "Cost price cannot be negative")
    .required("Cost price is required"),
  quantity: yup
    .number()
    .typeError("Quantity must be a number")
    .min(0, "Quantity cannot be negative")
    .required("Quantity is required"),
  short_description: yup.string().optional(),
  description: yup.string().optional(),
  category_ids: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one category"),
  attribute_value_ids: yup.array().of(yup.string()).optional(),
  images: yup
    .array()
    .of(yup.string())
    .min(1, "Add at least one image")
    .max(6, "You can only upload up to 6 images"),
  is_serialized: yup.mixed<1 | 0>().oneOf([0, 1]).required(),
  serial_number: yup.string().when("is_serialized", {
    is: 1,
    then: (schema) => schema.required("Serial number is required"),
    otherwise: (schema) => schema.optional(),
  }),
  variants: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Variant name is required"),
        price: yup
          .number()
          .typeError("Variant price must be a number")
          .min(0)
          .required("Variant price is required"),
        compare_price: yup
          .number()
          .nullable()
          .transform((v, o) => (o === "" ? null : v))
          .min(0)
          .optional(),
        cost_price: yup
          .number()
          .typeError("Variant cost must be a number")
          .min(0)
          .required("Variant cost is required"),
        quantity: yup
          .number()
          .typeError("Variant qty must be a number")
          .min(0)
          .required("Variant quantity is required"),
        is_serialized: yup.mixed<1 | 0>().oneOf([0, 1]).required(),
        serial_number: yup.string().when("is_serialized", {
          is: 1,
          then: (schema) => schema.required("Variant serial is required"),
          otherwise: (schema) => schema.optional(),
        }),
        batch_number: yup.string().optional(),
        attribute_value_ids: yup.array().of(yup.string()).optional(),
        images: yup
          .array()
          .of(yup.string())
          .max(6, "You can only upload up to 6 images per variant")
          .optional(),
      })
    )
    .optional(),
});

const index = () => {
  const [formValues, setFormValues] = useState({
    name: "",
    price: "" as number | "",
    compare_price: "" as number | null | "",
    cost_price: "" as number | "",
    quantity: "" as number | "",
    short_description: "",
    description: "",
    images: [] as string[],
    category_ids: [] as string[],
    attribute_value_ids: [] as string[],
    is_serialized: 0 as 1 | 0,
    serial_number: "",
    variants: [] as Variant[],
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [fileList, setFileList] = useState<any[]>([]);
  const uploadRef = useRef(null);

  // Queries
  const [categorySearch, setCategorySearch] = useState<string>("");
  const [categoryPage] = useState<number>(1);
  const [attrSearch, setAttrSearch] = useState<string>("");
  const [attrPage] = useState<number>(1);

  // Debounced server search handlers to avoid excessive requests
  const debouncedCategorySearch = useMemo(
    () => debounce((q: string) => setCategorySearch(q.trim()), 400),
    []
  );
  const debouncedAttrSearch = useMemo(
    () => debounce((q: string) => setAttrSearch(q.trim()), 400),
    []
  );

  const { data: categoriesResp, isLoading: isLoadingCategories } =
    useGetAllCategoryQuery({
      q: categorySearch,
      page: categoryPage,
      per_page: 100,
      paginate: false,
      include: "parentCategory,subCategories",
    });

  const { data: attributesResp, isLoading: isLoadingAttributes } =
    useGetAllAttributesQuery({
      q: attrSearch,
      page: attrPage,
      include: "values",
      per_page: 100,
      paginate: false,
    });

  const [createProducts, { isLoading: isLoadingCreate, error }] =
    useCreateProductsMutation();

  // Options
  const categoryOptions = useMemo(
    () =>
      (categoriesResp?.data ?? []).map((c) => ({ label: c.name, value: c.id })),
    [categoriesResp]
  );
  const attributeValueOptions = useMemo(() => {
    const attrs = attributesResp?.data ?? [];
    const options: { label: string; value: string }[] = [];
    attrs.forEach((attr) => {
      const values = (attr.values ?? []) as any[];
      values.forEach((v) => {
        options.push({ label: `${attr.name}: ${v.value}`, value: v.id });
      });
    });
    return options;
  }, [attributesResp]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const triggerUpload = () => {
    if (fileList.length >= 4) {
      message.warning("You can only upload up to 6 images");
      return;
    }
    const uploadControl = document.querySelector(
      '.main-hidden-upload .ant-upload input[type="file"]'
    );
    if (uploadControl) {
      (uploadControl as HTMLElement).click();
    }
  };

  const handleFileChange = async ({ fileList: newFileList }: any) => {
    const limitedList =
      newFileList.length > 4 ? newFileList.slice(0, 4) : newFileList;
    if (newFileList.length > 4) {
      message.warning("You can only upload up to 4 images");
    }
    setFileList(limitedList);
    try {
      const base64Images: string[] = [];
      for (const f of limitedList) {
        const fileObj = f.originFileObj;
        if (!fileObj) continue;
        const compressed = await compressImage(fileObj);
        const base64 = await fileToBase64(compressed);
        base64Images.push(base64 as string);
      }
      setFormValues((prev) => ({ ...prev, images: base64Images }));
    } catch (err) {
      console.error("Error processing images", err);
      message.error("Error processing image(s)");
    }
  };

  const addVariant = useCallback(() => {
    setFormValues((prev) => ({
      ...prev,
      variants: [
        {
          name: "",
          price: "",
          compare_price: "",
          cost_price: "",
          quantity: "",
          is_serialized: 0,
          serial_number: "",
          attribute_value_ids: [],
          batch_number: "",
          ui_files: [],
          copy_from_main: false,
        },
        ...prev.variants,
      ],
    }));
  }, []);

  const removeVariant = (index: number) => {
    setFormValues((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const updateVariantField = (
    index: number,
    field: keyof Variant,
    value: any
  ) => {
    setFormValues((prev) => {
      const updated = [...prev.variants];
      // Ensure numeric fields remain numbers or ""
      updated[index] = { ...updated[index], [field]: value } as Variant;
      return { ...prev, variants: updated };
    });
  };

  const parseNumber = (v: any): number => {
    if (v === "" || v === null || v === undefined) return 0;
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  };

  const toNullableNumber = (v: any): number | null => {
    if (v === "" || v === null || v === undefined) return null;
    const n = Number(v);
    return isNaN(n) ? null : n;
  };

  // Handle per-variant image uploads (compress + base64) and preview list
  const handleVariantFileChange = async (
    index: number,
    { fileList: newFileList }: { fileList: any[] }
  ) => {
    const limitedList =
      newFileList.length > 4 ? newFileList.slice(0, 4) : newFileList;
    if (newFileList.length > 4) {
      message.warning("You can only upload up to 4 images per variant");
    }
    // Update UI previews immediately
    setFormValues((prev) => {
      const variants = [...prev.variants];
      variants[index] = {
        ...variants[index],
        ui_files: limitedList,
      } as Variant;
      return { ...prev, variants };
    });

    try {
      const base64Images: string[] = [];
      for (const f of limitedList) {
        const fileObj = (f as any).originFileObj;
        if (!fileObj) continue;
        const compressed = await compressImage(fileObj);
        const base64 = await fileToBase64(compressed);
        base64Images.push(base64 as string);
      }
      setFormValues((prev) => {
        const variants = [...prev.variants];
        variants[index] = {
          ...variants[index],
          images: base64Images,
        } as Variant;
        return { ...prev, variants };
      });
    } catch (err) {
      console.error("Error processing variant images", err);
      message.error("Error processing variant image(s)");
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate client side
      await productSchema.validate(
        {
          ...formValues,
          // coerce for validation for numbers
          price: parseNumber(formValues.price),
          cost_price: parseNumber(formValues.cost_price),
          quantity: parseNumber(formValues.quantity),
          compare_price: toNullableNumber(formValues.compare_price),
          variants: formValues.variants.map((v) => ({
            ...v,
            price: parseNumber(v.price),
            cost_price: parseNumber(v.cost_price),
            quantity: parseNumber(v.quantity),
            compare_price: toNullableNumber(v.compare_price),
          })),
        },
        { abortEarly: false }
      );

      setFormErrors({});

      const payload = {
        name: formValues.name,
        price: parseNumber(formValues.price),
        compare_price: toNullableNumber(formValues.compare_price),
        cost_price: parseNumber(formValues.cost_price),
        quantity: parseNumber(formValues.quantity),
        short_description: formValues.short_description,
        description: formValues.description,
        images: formValues.images,
        category_ids: formValues.category_ids,
        attribute_value_ids: formValues.attribute_value_ids,
        is_serialized: formValues.is_serialized,
        serial_number: formValues.serial_number,
        variants: formValues.variants.map((v) => ({
          name: v.name,
          price: parseNumber(v.price),
          compare_price: toNullableNumber(v.compare_price),
          cost_price: parseNumber(v.cost_price),
          quantity: parseNumber(v.quantity),
          is_serialized: v.is_serialized,
          serial_number: v.serial_number || undefined,
          images: v.images && v.images.length ? v.images : undefined,
          attribute_value_ids:
            v.attribute_value_ids && v.attribute_value_ids.length
              ? v.attribute_value_ids
              : undefined,
          batch_number: v.batch_number || undefined,
        })),
      };

      await createProducts(payload as any).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={"Product Created Successfully"}
              image={imgSuccess}
              textColor="green"
              message={"Your product has been created."}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Success",
      });

      // Reset a few fields
      setFormValues((prev) => ({
        ...prev,
        name: "",
        price: "",
        compare_price: "",
        cost_price: "",
        quantity: "",
        short_description: "",
        description: "",
        images: [],
        category_ids: [],
        attribute_value_ids: [],
        is_serialized: 0,
        serial_number: "",
        variants: [],
      }));
      setFileList([]);
    } catch (err: any) {
      if (err?.name === "ValidationError") {
        const errors: { [key: string]: string } = {};
        err.inner?.forEach((validationError: yup.ValidationError) => {
          if (validationError.path && !errors[validationError.path]) {
            errors[validationError.path] = validationError.message;
          }
        });
        setFormErrors(errors);
      } else {
        // API error
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText={"Error"}
                title={"Product Creation Failed"}
                image={imgError}
                textColor="red"
                message={(err as any)?.data?.message || "Something went wrong"}
                backgroundColor="#FCFCFD"
              />
            ),
          },
          message: "Error",
        });
      }
    }
  };

  // Copy selected main product values into a specific variant
  const handleCopyFromMain = (index: number, checked: boolean) => {
    setFormValues((prev) => {
      const variants = [...prev.variants];
      const target = { ...variants[index] } as Variant;
      if (checked) {
        // Copy core numeric and serialization fields; leave images and attrs untouched
        target.price = prev.price;
        target.compare_price = prev.compare_price as any;
        target.cost_price = prev.cost_price;
        target.quantity = prev.quantity;
        target.is_serialized = prev.is_serialized;
        target.serial_number =
          prev.is_serialized === 1 ? prev.serial_number : "";
      }
      target.copy_from_main = checked;
      variants[index] = target;
      return { ...prev, variants };
    });
  };

  // Helper: read variant field error from client (Yup) and server API errors
  const getVariantError = useCallback(
    (i: number, field: string): string => {
      const keyYup = `variants[${i}].${field}`;
      if (formErrors[keyYup]) return formErrors[keyYup];

      const apiErrors = (error as any)?.data?.errors;
      if (!apiErrors) return "";

      const toMsg = (val: any): string => {
        if (!val) return "";
        if (Array.isArray(val)) return val.join?.("\n") ?? String(val);
        if (typeof val === "string") return val;
        return "";
      };

      // Common server shapes: nested object, or flat dotted or bracketed keys
      const nested = apiErrors?.variants?.[i]?.[field];
      if (nested) return toMsg(nested);

      const dotted = apiErrors?.[`variants.${i}.${field}`];
      if (dotted) return toMsg(dotted);

      const bracketed = apiErrors?.[`variants[${i}].${field}`];
      if (bracketed) return toMsg(bracketed);

      return "";
    },
    [formErrors, error]
  );

  return (
    <div className={``}>
      <Header
        search={""}
        setSearch={() => {}}
        showSearch={false}
        placeHolderText="Search product, supplier, order"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="Create Product"
        showAddButton={false}
        btnText="Add New Product"
        onClick={() => {}}
      />
      <SharedLayout className="bg-white">
        <PermissionGuard permission="products.create">
          <Breadcrumb
            className="mb-4"
            items={[
              { title: "Back", href: "/products" },
              {
                title: (
                  <span className="font-semibold">
                    {formValues.name || "Create Product"}
                  </span>
                ),
              },
            ]}
          />
          <div>
            <form className="mt-5 flex flex-col gap-8">
              {/* Basic Info */}
              <section>
                <h3 className="text-base font-semibold mb-3">Basic info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    type="text"
                    name="name"
                    errorMessage={
                      formErrors.name ||
                      (error as any)?.data?.errors?.name?.join?.("\n") ||
                      ""
                    }
                    value={formValues.name}
                    onChange={handleInputChange}
                    className="py-[11px]"
                    placeholder="Enter product name"
                    title={<span className="font-[500]">Name*</span>}
                    required={false}
                  />
                  <div
                    className={`grid  gap-4 ${
                      formValues.is_serialized === 1
                        ? "grid-cols-2"
                        : "grid-cols-1"
                    }`}
                  >
                    <div>
                      <div className={`pb-1`}>
                        <label className={"text-sm capitalize text-[#2C3137]"}>
                          Serialized
                        </label>
                      </div>
                      <SelectInput
                        onChange={(v) =>
                          setFormValues((p) => ({
                            ...p,
                            is_serialized: Number(v) as 0 | 1,
                            serial_number:
                              Number(v) === 1 ? p.serial_number : "",
                          }))
                        }
                        value={formValues.is_serialized}
                        placeholder={
                          <span className="text-sm font-bold">Select</span>
                        }
                        data={[
                          { label: "No", value: 0 },
                          { label: "Yes", value: 1 },
                        ]}
                      />
                    </div>
                    {formValues.is_serialized === 1 && (
                      <TextInput
                        type="text"
                        name="serial_number"
                        errorMessage={
                          formErrors.serial_number ||
                          (error as any)?.data?.errors?.serial_number?.join?.(
                            "\n"
                          ) ||
                          ""
                        }
                        value={formValues.serial_number}
                        onChange={handleInputChange}
                        placeholder="e.g., SN-12345"
                        title={
                          <span className="font-[500]">Serial number*</span>
                        }
                      />
                    )}
                  </div>
                </div>
              </section>

              {/* Pricing & Inventory */}
              <section>
                <h3 className="text-base font-semibold mb-3">
                  Pricing & inventory
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <TextInput
                    type="number"
                    name="price"
                    errorMessage={
                      formErrors.price ||
                      (error as any)?.data?.errors?.price?.join?.("\n") ||
                      ""
                    }
                    value={formValues.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    title={<span className="font-[500]">Price*</span>}
                  />
                  <TextInput
                    type="number"
                    name="compare_price"
                    errorMessage={
                      formErrors.compare_price ||
                      (error as any)?.data?.errors?.compare_price?.join?.(
                        "\n"
                      ) ||
                      ""
                    }
                    value={formValues.compare_price as any}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    title={<span className="font-[500]">Compare price</span>}
                  />
                  <TextInput
                    type="number"
                    name="cost_price"
                    errorMessage={
                      formErrors.cost_price ||
                      (error as any)?.data?.errors?.cost_price?.join?.("\n") ||
                      ""
                    }
                    value={formValues.cost_price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    title={<span className="font-[500]">Cost price*</span>}
                  />
                  <TextInput
                    type="number"
                    name="quantity"
                    errorMessage={
                      formErrors.quantity ||
                      (error as any)?.data?.errors?.quantity?.join?.("\n") ||
                      ""
                    }
                    value={formValues.quantity}
                    onChange={handleInputChange}
                    placeholder="0"
                    title={<span className="font-[500]">Quantity*</span>}
                  />
                </div>
              </section>

              {/* Categorization & Attributes */}
              <section>
                <h3 className="text-base font-semibold mb-3">Categorization</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className={`pb-1`}>
                      <label className={"text-sm capitalize text-[#2C3137]"}>
                        Categories*
                      </label>
                    </div>
                    <SelectInput
                      onChange={(values) =>
                        setFormValues((p) => ({ ...p, category_ids: values }))
                      }
                      handleSearchSelect={(q: string) =>
                        debouncedCategorySearch(q ?? "")
                      }
                      loading={isLoadingCategories}
                      notFoundContent={
                        isLoadingCategories ? (
                          <Spinner />
                        ) : (
                          <span className="text-gray-500">
                            No categories found
                          </span>
                        )
                      }
                      value={formValues.category_ids}
                      placeholder={
                        <span className="text-sm font-bold">Select</span>
                      }
                      data={categoryOptions}
                      mode="multiple"
                    />
                    {(formErrors.category_ids ||
                      (error as any)?.data?.errors?.category_ids) && (
                      <p className="flex flex-col gap-1 text-xs italic text-red-600">
                        {formErrors.category_ids ||
                          (error as any)?.data?.errors?.category_ids?.join?.(
                            "\n"
                          ) ||
                          ""}
                      </p>
                    )}
                  </div>
                  <div>
                    <div className={`pb-1`}>
                      <label className={"text-sm capitalize text-[#2C3137]"}>
                        Attribute values
                      </label>
                    </div>
                    <SelectInput
                      onChange={(values) =>
                        setFormValues((p) => ({
                          ...p,
                          attribute_value_ids: values,
                        }))
                      }
                      notFoundContent={
                        isLoadingAttributes ? (
                          <Spinner />
                        ) : (
                          <span className="text-gray-500">
                            No attributes found{" "}
                          </span>
                        )
                      }
                      handleSearchSelect={(q: string) =>
                        debouncedAttrSearch(q ?? "")
                      }
                      loading={isLoadingAttributes}
                      value={formValues.attribute_value_ids}
                      placeholder={
                        <span className="text-sm font-bold">Select</span>
                      }
                      data={attributeValueOptions}
                      mode="multiple"
                    />
                  </div>
                </div>
              </section>

              {/* Descriptions */}
              <section>
                <h3 className="text-base font-semibold mb-3">Descriptions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="w-full">
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-sm font-[500]">
                        Short description (maximum 200 characters)
                      </span>
                      <span className="text-xs text-gray-500">
                        {Math.max(
                          0,
                          200 - (formValues.short_description?.length ?? 0)
                        )}{" "}
                        left
                      </span>
                    </div>
                    <TextAreaInput
                      row={8}
                      maxLength={200}
                      name="short_description"
                      errorMessage={""}
                      className="w-full"
                      value={formValues.short_description}
                      onChange={handleInputChange}
                      placeholder="Short description"
                    />
                  </div>
                  <div>
                    <RichTextEditor
                      value={formValues.description}
                      onChange={(html) =>
                        setFormValues((p) => ({ ...p, description: html }))
                      }
                      placeholder="Write full description..."
                      className="h-[205px]"
                      label={<span className="font-[500]">Description</span>}
                      errorMessage={""}
                    />
                  </div>
                </div>
              </section>

              {/* Images */}
              <section>
                <h3 className="text-base font-semibold mb-3">
                  Images ({fileList.length || 0})
                </h3>
                <div className="w-full">
                  <div
                    className={`relative w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 ${
                      fileList.length > 0 ? "grid" : "block"
                    }`}
                  >
                    <Upload
                      ref={uploadRef}
                      className="main-hidden-upload w-full hidden"
                      multiple
                      maxCount={6}
                      fileList={fileList}
                      onChange={handleFileChange}
                      beforeUpload={(f) => {
                        if (fileList.length >= 4) {
                          message.warning("You can only upload up to 4 images");
                          return (Upload as any).LIST_IGNORE ?? false;
                        }
                        return false;
                      }}
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
                      className={`p-6 w-full block border-2 border-dashed ${
                        formErrors.images ||
                        (error as any)?.data?.errors?.images?.join?.("\n")
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg cursor-pointer hover:border-blue-500 transition-colors`}
                    >
                      <div className="flex justify-center items-center gap-2 py-4">
                        <Icon icon="ic:round-plus" width="24" height="24" />
                        <p className="text-xs font-bold text-center">
                          Add Images
                        </p>
                      </div>
                    </button>
                    {(formErrors.images ||
                      (error as any)?.data?.errors?.images) && (
                      <p className="text-xs text-red-500 mt-1">
                        {formErrors.images ||
                          (error as any)?.data?.errors?.images?.join?.("\n") ||
                          ""}
                      </p>
                    )}

                    {fileList.length > 0 && (
                      <>
                        {fileList.map((f, idx) => (
                          <div
                            key={f.uid ?? idx}
                            className="border rounded p-2 flex flex-col items-center gap-2"
                          >
                            <img
                              src={
                                f.thumbUrl ||
                                f.url ||
                                (f.originFileObj &&
                                  URL.createObjectURL(f.originFileObj))
                              }
                              alt="Preview"
                              className="w-20 h-20 object-cover"
                            />
                            <p className="text-xs truncate w-full text-center">
                              {f.name}
                            </p>
                            <button
                              type="button"
                              className="text-red-500 text-xs"
                              onClick={() => {
                                const copy = [...fileList];
                                copy.splice(idx, 1);
                                handleFileChange({ fileList: copy });
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </section>

              {/* Variants */}
              <section>
                <div className="flex items-center justify-between w-full mb-3">
                  <h3 className="text-base font-semibold">Variants</h3>
                  <div className="">
                    <CustomButton
                      onClick={addVariant}
                      className="bg-primary-20 w-fit text-white px-4"
                    >
                      Add variant
                    </CustomButton>
                  </div>
                </div>

                {formValues.variants.length === 0 ? (
                  <p className="text-sm text-gray-500">No variants added.</p>
                ) : (
                  <div className="flex flex-col gap-6">
                    {formValues.variants.map((v, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">Variant {i + 1}</h4>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 text-xs">
                              <input
                                type="checkbox"
                                checked={!!v.copy_from_main}
                                onChange={(e) =>
                                  handleCopyFromMain(i, e.target.checked)
                                }
                              />
                              <span>Copy main product values</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => removeVariant(i)}
                              className="text-red-500 font-[500] text-xs"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <TextInput
                            type="text"
                            name={`variant_name_${i}`}
                            errorMessage={getVariantError(i, "name")}
                            value={v.name}
                            className="py-[11px]"
                            onChange={(e) =>
                              updateVariantField(i, "name", e.target.value)
                            }
                            placeholder="Variant name"
                            title={<span className="font-[500]">Name*</span>}
                          />
                          <div
                            className={`grid  gap-4 ${
                              v.is_serialized === 1
                                ? "grid-cols-2"
                                : "grid-cols-1"
                            }`}
                          >
                            <div className="">
                              {" "}
                              <div className={`pb-1`}>
                                <label
                                  className={
                                    "text-sm capitalize text-[#2C3137]"
                                  }
                                >
                                  Serialized
                                </label>
                              </div>
                              <SelectInput
                                onChange={(val) =>
                                  updateVariantField(
                                    i,
                                    "is_serialized",
                                    Number(val)
                                  )
                                }
                                className="h-fit"
                                value={v.is_serialized}
                                placeholder={
                                  <span className="text-sm font-bold">
                                    Serialized
                                  </span>
                                }
                                data={[
                                  { label: "No", value: 0 },
                                  { label: "Yes", value: 1 },
                                ]}
                              />
                            </div>
                            {v.is_serialized === 1 && (
                              <TextInput
                                type="text"
                                name={`variant_serial_${i}`}
                                errorMessage={getVariantError(
                                  i,
                                  "serial_number"
                                )}
                                value={v.serial_number || ""}
                                onChange={(e) =>
                                  updateVariantField(
                                    i,
                                    "serial_number",
                                    e.target.value
                                  )
                                }
                                placeholder="Serial number"
                                title={
                                  <span className="font-[500]">Serial*</span>
                                }
                              />
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
                          <TextInput
                            type="number"
                            name={`variant_price_${i}`}
                            errorMessage={getVariantError(i, "price")}
                            value={v.price}
                            onChange={(e) =>
                              updateVariantField(i, "price", e.target.value)
                            }
                            placeholder="0.00"
                            title={<span className="font-[500]">Price*</span>}
                          />
                          <TextInput
                            type="number"
                            name={`variant_compare_${i}`}
                            errorMessage={getVariantError(i, "compare_price")}
                            value={v.compare_price as any}
                            onChange={(e) =>
                              updateVariantField(
                                i,
                                "compare_price",
                                e.target.value
                              )
                            }
                            placeholder="0.00"
                            title={<span className="font-[500]">Compare</span>}
                          />
                          <TextInput
                            type="number"
                            name={`variant_cost_${i}`}
                            errorMessage={getVariantError(i, "cost_price")}
                            value={v.cost_price}
                            onChange={(e) =>
                              updateVariantField(
                                i,
                                "cost_price",
                                e.target.value
                              )
                            }
                            placeholder="0.00"
                            title={<span className="font-[500]">Cost*</span>}
                          />
                          <TextInput
                            type="number"
                            name={`variant_qty_${i}`}
                            errorMessage={getVariantError(i, "quantity")}
                            value={v.quantity}
                            onChange={(e) =>
                              updateVariantField(i, "quantity", e.target.value)
                            }
                            placeholder="0"
                            title={<span className="font-[500]">Qty*</span>}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          <div>
                            <div className={`pb-1`}>
                              <label
                                className={"text-sm capitalize text-[#2C3137]"}
                              >
                                Attribute values
                              </label>
                            </div>
                            <SelectInput
                              onChange={(values) =>
                                updateVariantField(
                                  i,
                                  "attribute_value_ids",
                                  values
                                )
                              }
                              handleSearchSelect={(q: string) =>
                                debouncedAttrSearch(q ?? "")
                              }
                              loading={isLoadingAttributes}
                              notFoundContent={
                                isLoadingAttributes ? (
                                  <Spinner />
                                ) : (
                                  <span className="text-gray-500">
                                    No attributes found{" "}
                                  </span>
                                )
                              }
                              value={v.attribute_value_ids}
                              placeholder={
                                <span className="text-sm font-bold">
                                  Select
                                </span>
                              }
                              data={attributeValueOptions}
                              mode="multiple"
                            />
                            {getVariantError(i, "attribute_value_ids") && (
                              <p className="text-xs text-red-500 mt-1">
                                {getVariantError(i, "attribute_value_ids")}
                              </p>
                            )}
                          </div>
                          <TextInput
                            type="text"
                            name={`variant_batch_${i}`}
                            errorMessage={""}
                            value={v.batch_number || ""}
                            onChange={(e) =>
                              updateVariantField(
                                i,
                                "batch_number",
                                e.target.value
                              )
                            }
                            placeholder="Batch number (optional)"
                            title={
                              <span className="font-[500]">Batch No.</span>
                            }
                          />
                        </div>

                        {/* Variant Images */}
                        <div className="mt-4">
                          <p className="text-sm capitalize font-[500] text-[#000]">
                            Variant Images ({v.ui_files?.length || 0})
                          </p>
                          <div
                            className={`relative w-full mt-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 ${
                              v.ui_files?.length! > 0 ? "grid" : "block"
                            }`}
                            id={`variant-upload-${i}`}
                          >
                            <Upload
                              className="hidden-upload w-full hidden"
                              multiple
                              maxCount={6}
                              fileList={v.ui_files as any}
                              onChange={(info) =>
                                handleVariantFileChange(i, info)
                              }
                              beforeUpload={() => {
                                if ((v.ui_files?.length ?? 0) >= 4) {
                                  message.warning(
                                    "You can only upload up to 6 images per variant"
                                  );
                                  return (Upload as any).LIST_IGNORE ?? false;
                                }
                                return false;
                              }}
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
                                if ((v.ui_files?.length ?? 0) >= 4) {
                                  message.warning(
                                    "You can only upload up to 4 images per variant"
                                  );
                                  return;
                                }
                                const container = document.getElementById(
                                  `variant-upload-${i}`
                                );
                                const input = container?.querySelector(
                                  '.ant-upload input[type="file"]'
                                ) as HTMLElement | null;
                                input?.click?.();
                              }}
                              className={`p-4 w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors`}
                            >
                              <div className="flex justify-center items-center gap-2 py-3">
                                <Icon
                                  icon="ic:round-plus"
                                  width="20"
                                  height="20"
                                />
                                <p className="text-xs font-bold text-center">
                                  Add Variant Images
                                </p>
                              </div>
                            </button>

                            {getVariantError(i, "images") && (
                              <p className="text-xs text-red-500 mt-1">
                                {getVariantError(i, "images")}
                              </p>
                            )}

                            {(v.ui_files?.length ?? 0) > 0 && (
                              <>
                                {(v.ui_files as any[]).map((file, idx) => (
                                  <div
                                    key={file.uid ?? idx}
                                    className="border rounded p-2 flex flex-col items-center gap-2"
                                  >
                                    <img
                                      src={
                                        file.thumbUrl ||
                                        file.url ||
                                        (file.originFileObj &&
                                          URL.createObjectURL(
                                            file.originFileObj
                                          ))
                                      }
                                      alt="Variant Preview"
                                      className="w-16 h-16 object-cover"
                                    />
                                    <p className="text-[10px] truncate w-full text-center">
                                      {file.name}
                                    </p>
                                    <button
                                      type="button"
                                      className="text-red-500 text-[10px]"
                                      onClick={() => {
                                        const copy = [...(v.ui_files as any[])];
                                        copy.splice(idx, 1);
                                        handleVariantFileChange(i, {
                                          fileList: copy,
                                        });
                                      }}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ))}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Actions */}
              <div className="flex justify-end border-t border-gray-300 pt-3 pb-20">
                <div className="w-fit flex gap-5">
                  <CustomButton
                    type="button"
                    onClick={() => {
                      // simple reset
                      setFormValues((prev) => ({
                        ...prev,
                        name: "",
                        price: "",
                        compare_price: "",
                        cost_price: "",
                        quantity: "",
                        short_description: "",
                        description: "",
                        images: [],
                        category_ids: [],
                        attribute_value_ids: [],
                        is_serialized: 0,
                        serial_number: "",
                        variants: [],
                      }));
                      setFileList([]);
                    }}
                    className="border bg-border-300 text-black flex justify-center items-center gap-2 px-5"
                  >
                    Clear
                  </CustomButton>
                  <CustomButton
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoadingCreate}
                    className="border bg-primary-40 flex justify-center items-center gap-2 text-white px-5"
                  >
                    {isLoadingCreate ? (
                      <Spinner className="border-white" />
                    ) : (
                      "Create product"
                    )}
                  </CustomButton>
                </div>
              </div>
            </form>
          </div>
        </PermissionGuard>
      </SharedLayout>
    </div>
  );
};

export default index;
