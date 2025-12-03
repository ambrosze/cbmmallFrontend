import AttributeHeader from "@/components/Attributes/AttributeHeader";
import Header from "@/components/header";
import RichTextEditor from "@/components/Input/RichTextEditor";
import SelectInput from "@/components/Input/SelectInput";
import TextAreaInput from "@/components/Input/TextAreaInput";
import TextInput from "@/components/Input/TextInput";
import PermissionGuard from "@/components/RolesPermission/PermissionGuard";
import CustomButton from "@/components/sharedUI/Buttons/Button";
import ImageComponent from "@/components/sharedUI/ImageComponent";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import Spinner from "@/components/sharedUI/Spinner";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";
import { useAppDispatch } from "@/redux-store/hooks";
import { api } from "@/services";
import { useGetAllAttributesQuery } from "@/services/attributes-values/attributes";
import { useGetAllCategoryQuery } from "@/services/category";
import {
  useDeleteProductAttributeValueMutation,
  useUpdateProductAttributeValueMutation,
} from "@/services/products/manage-attributes-values/product-attribute-values";
import {
  useDeleteProductCategoryMutation,
  useUpdateProductCategoryMutation,
} from "@/services/products/manage-product-category/product-category";
import {
  useCreateProductImageMutation,
  useDeleteProductImageMutation,
} from "@/services/products/manage-product-images/product-image";
import {
  useGetSingleProductsQuery,
  useUpdateProductsMutation,
} from "@/services/products/product-list";
import {
  useDeleteVariantProductAttributeValueMutation,
  useUpdateVariantProductAttributeValueMutation,
} from "@/services/products/variant/variant-product-attribute-values";
import {
  useCreateVariantProductImageMutation,
  useDeleteVariantProductImageMutation,
} from "@/services/products/variant/variant-product-image";
import {
  useDeleteProductVariantMutation,
  useGetSingleProductVariantQuery,
  useUpdateProductVariantMutation,
} from "@/services/products/variant/variant-product-list";
import { compressImage, fileToBase64 } from "@/utils/compressImage";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Breadcrumb, Upload, message } from "antd";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import * as yup from "yup";
import imgError from "/public/states/notificationToasts/error.svg";
import imgSuccess from "/public/states/notificationToasts/successcheck.svg";

type Variant = {
  id?: string;
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

type FormValues = {
  name: string;
  short_description: string;
  description: string;
  price: number | "";
  compare_price: number | null | "";
  cost_price: number | "";
  quantity: number | "";
  images: string[];
  category_ids: string[];
  attribute_value_ids: string[];
  is_serialized: 0 | 1;
  serial_number: string;
  variants: Variant[];
};

// For update, only enforce fields we actually submit
const productSchema = yup.object().shape({
  name: yup.string().required("Product name is required"),
  short_description: yup.string().optional(),
  description: yup.string().optional(),
  // The rest of the fields are displayed but managed via other APIs; keep them optional to avoid blocking submit
  category_ids: yup.array().of(yup.string()).optional(),
  attribute_value_ids: yup.array().of(yup.string()).optional(),
  images: yup.array().of(yup.string()).max(6).optional(),
  is_serialized: yup.mixed<1 | 0>().oneOf([0, 1]).optional(),
  serial_number: yup.string().optional(),
  variants: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().optional(),
        price: yup
          .number()
          .typeError("Variant price must be a number")
          .min(0)
          .optional(),
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
          .optional(),
        quantity: yup
          .number()
          .typeError("Variant qty must be a number")
          .min(0)
          .optional(),
        is_serialized: yup.mixed<1 | 0>().oneOf([0, 1]).optional(),
        serial_number: yup.string().optional(),
        batch_number: yup.string().optional(),
        attribute_value_ids: yup.array().of(yup.string()).optional(),
        images: yup.array().of(yup.string()).max(6).optional(),
      })
    )
    .optional(),
});

const index = () => {
  const router = useRouter();
  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    short_description: "",
    description: "",
    // Display-only fields managed by separate APIs; we keep them in state for the UI
    price: "",
    compare_price: "",
    cost_price: "",
    quantity: "",
    images: [],
    category_ids: [],
    attribute_value_ids: [],
    is_serialized: 0 as 0 | 1,
    serial_number: "",
    variants: [] as Variant[],
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [fileList, setFileList] = useState<any[]>([]);
  console.log("🚀 ~ index ~ fileList:", fileList);
  const uploadRef = useRef(null);
  // Avoid overwriting user edits on incidental refetches (e.g., image mutations)
  const hydratedProductIdRef = useRef<string | null>(null);
  const { id } = router.query as { id?: string };
  const dispatch = useAppDispatch();

  // Reset hydration when navigating between products
  React.useEffect(() => {
    if (!id) return;
    hydratedProductIdRef.current = null;
  }, [id]);

  // Queries
  const [categorySearch] = useState<string>("");
  const [categoryPage] = useState<number>(1);
  const [attrSearch] = useState<string>("");
  const [attrPage] = useState<number>(1);
  // variant selection
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );
  const { data, isLoading } = useGetSingleProductsQuery(
    {
      id: id as string,
      // Include variant images up-front so their previews show without needing to click a variant
      include: "variants,images,attributeValues,categories",
    },
    { skip: !id }
  );
  const {
    data: variantResp,
    isLoading: isVariantLoading,
    refetch: variantRefetch,
  } = useGetSingleProductVariantQuery(
    {
      product_variant_id: selectedVariantId ? String(selectedVariantId) : "",
      include:
        "images,product,product.categories,product.attributeValues,product.attributeValues.attribute,attributeValues,attributeValues.attribute",
    },
    { skip: !selectedVariantId }
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

  const [updateProducts, { isLoading: isLoadingUpdate, error }] =
    useUpdateProductsMutation();
  const [updateProductCategories, { isLoading: isUpdatingCategories }] =
    useUpdateProductCategoryMutation();
  const [deleteProductCategory] = useDeleteProductCategoryMutation();
  const [updateProductAttributeValues, { isLoading: isUpdatingAttributes }] =
    useUpdateProductAttributeValueMutation();
  const [deleteProductAttributeValue] =
    useDeleteProductAttributeValueMutation();
  const [createProductImage, { isLoading: isCreatingProductImage }] =
    useCreateProductImageMutation();
  const [deleteProductImage] = useDeleteProductImageMutation();
  const [updateVariant, { isLoading: isUpdatingVariant }] =
    useUpdateProductVariantMutation();
  const [createVariantImage, { isLoading: isCreatingVariantImage }] =
    useCreateVariantProductImageMutation();
  const [updateVariantAttributes, { isLoading: isUpdatingVariantAttrs }] =
    useUpdateVariantProductAttributeValueMutation();
  const [deleteVariantAttributes] =
    useDeleteVariantProductAttributeValueMutation();
  const [deleteVariantImage] = useDeleteVariantProductImageMutation();
  const [deleteVariantApi] = useDeleteProductVariantMutation();

  // Preload form values from product data (or nested product inside variant)
  React.useEffect(() => {
    const d: any = data?.data;
    if (!d) return;
    const product = d?.product ? d.product : d;
    const productId = product?.id as string | undefined;
    if (!product || !productId) return;

    // Only hydrate once per product id to avoid clobbering user edits on refetch
    if (hydratedProductIdRef.current === productId) return;
    hydratedProductIdRef.current = productId;

    // Hydrate main fields (initial load)
    setFormValues((prev: FormValues) => ({
      ...prev,
      name: product?.name ?? "",
      short_description: product?.short_description ?? "",
      description: product?.description ?? "",
      is_serialized: (product?.is_serialized ?? 0) as 0 | 1,
      serial_number: product?.serial_number ?? "",
      price: product?.price ?? prev.price ?? "",
      compare_price: product?.compare_price ?? prev.compare_price ?? "",
      cost_price: product?.cost_price ?? prev.cost_price ?? "",
      quantity: product?.quantity ?? prev.quantity ?? "",
      category_ids: (product?.categories || [])?.map((c: any) => c.id) ?? [],
      attribute_value_ids:
        (product?.attribute_values || [])?.map((av: any) => av.id) ?? [],
      variants: ((product?.variants as any[]) || []).map((v: any) => ({
        id: v?.id != null ? String(v.id) : undefined,
        name: v?.name ?? "",
        price: v?.price != null ? Number(v.price) : ("" as any),
        compare_price:
          v?.compare_price != null && v?.compare_price !== ""
            ? Number(v.compare_price)
            : ("" as any),
        cost_price: v?.cost_price != null ? Number(v.cost_price) : ("" as any),
        quantity: v?.quantity != null ? Number(v.quantity) : ("" as any),
        is_serialized: (v?.is_serialized ?? 0) as 0 | 1,
        serial_number: v?.serial_number ?? "",
        batch_number: v?.batch_number ?? "",
        attribute_value_ids:
          (v?.attribute_values || [])?.map((av: any) => av.id) ?? [],
        images: (v?.images || [])?.map((img: any) => img.url).filter(Boolean),
        ui_files: (v?.images || []).map((img: any) => ({
          uid: img.id,
          name: img.name ?? `image-${img.id}`,
          url: img.url,
          status: "done",
        })),
        copy_from_main: false,
      })),
    }));

    // Hydrate product image previews (initial)
    const images = (product?.images || []) as any[];
    if (images.length) {
      const fl = images.map((img: any) => ({
        uid: img.id,
        name: img.name ?? `image-${img.id}`,
        url: img.url,
        status: "done",
      }));
      setFileList(fl as any);
    }
    // Ensure a selected variant is set automatically (first available)
    if (!selectedVariantId) {
      const firstId = product?.variants?.[0]?.id;
      if (firstId != null) setSelectedVariantId(String(firstId));
    }
  }, [data, selectedVariantId]);

  // Default selected variant to the first one if none chosen
  React.useEffect(() => {
    if (!selectedVariantId && formValues.variants?.length) {
      const first = formValues.variants[0];
      if (first?.id != null) setSelectedVariantId(String(first.id));
    }
  }, [selectedVariantId, formValues.variants]);

  // If current selected variant is no longer present (e.g., after delete), reselect the first available
  React.useEffect(() => {
    if (!formValues.variants?.length) return;
    const exists = formValues.variants.some(
      (v) => String(v.id) === String(selectedVariantId)
    );
    if (!exists) {
      const first = formValues.variants[0];
      if (first?.id != null) setSelectedVariantId(String(first.id));
    }
  }, [formValues.variants, selectedVariantId]);

  // Prefill the selected variant from variantResp
  React.useEffect(() => {
    if (!selectedVariantId || !variantResp?.data) return;
    const vr: any = variantResp.data;
    // If response is a product with variants, find the selected variant
    const variantFromProduct = Array.isArray(vr?.variants)
      ? (vr.variants as any[]).find((vv) => vv.id === selectedVariantId)
      : null;
    // If response is a variant with nested product shape
    const looksLikeVariant =
      vr?.product && vr?.id === selectedVariantId ? vr : null;
    const source: any = looksLikeVariant || variantFromProduct;
    if (!source) return;

    const images = (source.images || []) as any[];
    const attrVals = (source.attribute_values || []) as any[];

    setFormValues((prev: FormValues) => {
      const variants = [...prev.variants];
      const idx = variants.findIndex(
        (v) => String(v.id) === String(selectedVariantId)
      );
      if (idx === -1) return prev;
      const curr = { ...(variants[idx] || {}) } as Variant;
      variants[idx] = {
        ...curr,
        name: source.name ?? curr.name ?? "",
        price:
          source.price != null
            ? Number(source.price)
            : curr.price ?? ("" as any),
        compare_price:
          source.compare_price != null && source.compare_price !== ""
            ? Number(source.compare_price)
            : curr.compare_price ?? ("" as any),
        cost_price:
          source.cost_price != null
            ? Number(source.cost_price)
            : curr.cost_price ?? ("" as any),
        quantity:
          source.quantity != null
            ? Number(source.quantity)
            : curr.quantity ?? ("" as any),
        is_serialized: (source.is_serialized ?? curr.is_serialized ?? 0) as
          | 0
          | 1,
        serial_number: source.serial_number ?? curr.serial_number ?? "",
        attribute_value_ids: attrVals.map((av: any) => av.id),
        images: images.map((img: any) => img.url).filter(Boolean),
        ui_files: images.map((img: any) => ({
          uid: img.id,
          name: img.name ?? `image-${img.id}`,
          url: img.url,
          status: "done",
        })),
      };
      return { ...prev, variants };
    });
  }, [selectedVariantId, variantResp]);

  // Prefetch and hydrate ALL variants' details (images + attribute values) once per variant id
  const prefetchedVariantIdsRef = React.useRef<Set<string>>(new Set());
  React.useEffect(() => {
    const list = formValues.variants || [];
    if (!list.length) return;
    const include = "images,attributeValues,attributeValues.attribute,product";

    list.forEach((v) => {
      const vid = v?.id ? String(v.id) : "";
      if (!vid) return;
      if (prefetchedVariantIdsRef.current.has(vid)) return; // avoid duplicate fetches
      prefetchedVariantIdsRef.current.add(vid);

      const sub = dispatch(
        (api as any).endpoints.getSingleProductVariant.initiate({
          product_variant_id: vid,
          include,
        })
      );

      sub
        .unwrap()
        .then((resp: any) => {
          const variant = resp?.data || resp;
          const images = (variant?.images || []) as any[];
          const attrVals = (variant?.attribute_values || []) as any[];

          setFormValues((prev: FormValues) => {
            const variants = [...prev.variants];
            const idx = variants.findIndex(
              (vv) => String(vv.id) === String(vid)
            );
            if (idx === -1) return prev;
            const curr = { ...(variants[idx] || {}) } as Variant;
            variants[idx] = {
              ...curr,
              name: variant?.name ?? curr.name ?? "",
              price:
                variant?.price != null
                  ? Number(variant.price)
                  : curr.price ?? ("" as any),
              compare_price:
                variant?.compare_price != null && variant?.compare_price !== ""
                  ? Number(variant.compare_price)
                  : curr.compare_price ?? ("" as any),
              cost_price:
                variant?.cost_price != null
                  ? Number(variant.cost_price)
                  : curr.cost_price ?? ("" as any),
              quantity:
                variant?.quantity != null
                  ? Number(variant.quantity)
                  : curr.quantity ?? ("" as any),
              is_serialized: (variant?.is_serialized ??
                curr.is_serialized ??
                0) as 0 | 1,
              serial_number: variant?.serial_number ?? curr.serial_number ?? "",
              attribute_value_ids: attrVals.map((av: any) => av.id),
              images: images.map((img: any) => img.url).filter(Boolean),
              ui_files: images.map((img: any) => ({
                uid: img.id,
                name: img.name ?? `image-${img.id}`,
                url: img.url,
                status: "done",
              })),
            } as Variant;
            return { ...prev, variants };
          });
        })
        .catch(() => {})
        .finally(() => {
          // optional: nothing to do; RTK Query caches this call
        });
    });
  }, [dispatch, formValues.variants]);

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
    setFormValues((prev: FormValues) => ({ ...prev, [name]: value } as any));
  };

  const triggerUpload = () => {
    if (fileList.length >= 6) {
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
      newFileList.length > 6 ? newFileList.slice(0, 6) : newFileList;
    if (newFileList.length > 6) {
      message.warning("You can only upload up to 6 images");
    }

    // 1) Immediately show local previews and mark uploading for new files
    const withPreviews = limitedList.map((f: any) => {
      if (f?.originFileObj) {
        const previewUrl = URL.createObjectURL(f.originFileObj);
        return {
          ...f,
          status: "uploading",
          url: previewUrl,
          _previewUrl: previewUrl,
        };
      }
      return f;
    });
    setFileList(withPreviews);

    try {
      // 2) Auto-upload to product if id exists, and update each item as it finishes
      if (id) {
        for (let idx = 0; idx < withPreviews.length; idx++) {
          const f: any = withPreviews[idx];
          if (!f?.originFileObj) continue;
          const tempUid = f.uid; // antd's generated uid before server id
          try {
            const compressed = await compressImage(f.originFileObj);
            const base64 = (await fileToBase64(compressed)) as string;
            const resp: any = await createProductImage({
              product_id: id,
              body: { image: base64 },
            }).unwrap();
            const created = resp?.data || resp;
            // Update this one item to done
            setFileList((prev) => {
              const copy = [...prev];
              const foundIdx = copy.findIndex((ff: any) => ff.uid === tempUid);
              if (foundIdx !== -1) {
                const current = copy[foundIdx];
                copy[foundIdx] = {
                  uid: created?.id ?? current.uid,
                  name:
                    created?.name ??
                    current.name ??
                    `image-${created?.id ?? foundIdx}`,
                  url: created?.url ?? current.url ?? current._previewUrl,
                  status: "done",
                } as any;
              }
              return copy;
            });
          } catch (e) {
            // Mark as error but keep preview
            setFileList((prev) => {
              const copy = [...prev];
              const foundIdx = copy.findIndex((ff: any) => ff.uid === tempUid);
              if (foundIdx !== -1) {
                copy[foundIdx] = { ...copy[foundIdx], status: "error" } as any;
              }
              return copy;
            });
          }
        }
      } else {
        // No product id: keep base64s for later upload
        const base64Images: string[] = [];
        for (const f of limitedList) {
          const fileObj = (f as any).originFileObj;
          if (!fileObj) continue;
          const compressed = await compressImage(fileObj);
          const base64 = await fileToBase64(compressed);
          base64Images.push(base64 as string);
        }
        setFormValues((prev: FormValues) => ({
          ...prev,
          images: base64Images,
        }));
      }
    } catch (err) {
      console.error("Error processing images", err);
      message.error("Error processing image(s)");
    }
  };

  // Remove a product image: if persisted (no originFileObj), delete via API; otherwise just remove locally
  const removeProductImage = async (idx: number) => {
    const f = fileList[idx];
    if (!f) return;
    const isPersisted = !f?.originFileObj && !!f?.uid;
    if (isPersisted && id) {
      try {
        // mark this tile as deleting so UI disables the button
        const mark = [...fileList];
        mark[idx] = { ...mark[idx], _deleting: true };
        setFileList(mark);
        await deleteProductImage({
          product_id: id,
          image_id: String(f.uid),
        }).unwrap();
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText={"Success"}
                title={"Deleted"}
                image={imgSuccess}
                textColor="green"
                message="Image deleted successfully"
                backgroundColor="#FCFCFD"
              />
            ),
          },
          message: "Deleted",
        });
      } catch (e: any) {
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText={"Error"}
                title={"Delete Failed"}
                image={imgError}
                textColor="red"
                message={e?.data?.message || "Unable to delete image"}
                backgroundColor="#FCFCFD"
              />
            ),
          },
          message: "Error",
        });
        // revert deleting mark
        const revert = [...fileList];
        if (revert[idx]) delete revert[idx]._deleting;
        setFileList(revert);
        return; // keep UI unchanged on failure
      }
    }
    const copy = [...fileList];
    copy.splice(idx, 1);
    setFileList(copy);
  };

  const addVariant = useCallback(() => {
    setFormValues((prev: FormValues) => ({
      ...prev,
      variants: [
        ...prev.variants,
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
      ],
    }));
  }, []);

  // Helpers for variants UI
  const updateVariantField = useCallback(
    (index: number, field: keyof Variant | any, value: any) => {
      setFormValues((prev: FormValues) => {
        const variants: Variant[] = [...(prev.variants || [])];
        const current = { ...(variants[index] || {}) } as Variant;
        let v: any = value;
        if (["price", "cost_price", "quantity"].includes(field)) {
          v = parseNumber(value);
        }
        if (field === "compare_price") {
          v = toNullableNumber(value) as any;
        }
        variants[index] = { ...current, [field]: v } as Variant;
        return { ...prev, variants };
      });
    },
    []
  );

  const removeVariant = useCallback((index: number) => {
    setFormValues((prev: FormValues) => {
      const variants = [...(prev.variants || [])];
      variants.splice(index, 1);
      return { ...prev, variants };
    });
  }, []);

  const handleCopyFromMain = useCallback((index: number, checked: boolean) => {
    setFormValues((prev: FormValues) => {
      const variants: Variant[] = [...(prev.variants || [])];
      const v = { ...(variants[index] || {}) } as Variant;
      v.copy_from_main = checked;
      if (checked) {
        v.price = parseNumber(prev.price);
        v.compare_price = toNullableNumber(prev.compare_price) as any;
        v.cost_price = parseNumber(prev.cost_price);
        v.quantity = parseNumber(prev.quantity);
        v.is_serialized = prev.is_serialized as 0 | 1;
        v.serial_number = prev.is_serialized ? prev.serial_number : "";
      }
      variants[index] = v;
      return { ...prev, variants };
    });
  }, []);

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
      newFileList.length > 6 ? newFileList.slice(0, 6) : newFileList;
    if (newFileList.length > 6) {
      message.warning("You can only upload up to 6 images per variant");
    }
    // Update UI previews immediately (mark new files as uploading + preview)
    const withPreviews = limitedList.map((f: any) => {
      if (f?.originFileObj) {
        const previewUrl = URL.createObjectURL(f.originFileObj);
        return {
          ...f,
          status: "uploading",
          url: previewUrl,
          _previewUrl: previewUrl,
        };
      }
      return f;
    });
    setFormValues((prev: FormValues) => {
      const variants = [...prev.variants];
      variants[index] = {
        ...variants[index],
        ui_files: withPreviews,
      } as Variant;
      return { ...prev, variants };
    });

    try {
      const vid = (formValues.variants[index] || {}).id;
      if (vid) {
        for (let idx = 0; idx < withPreviews.length; idx++) {
          const f: any = withPreviews[idx];
          if (!f?.originFileObj) continue;
          const tempUid = f.uid;
          try {
            const compressed = await compressImage(f.originFileObj);
            const base64 = (await fileToBase64(compressed)) as string;
            const resp: any = await createVariantImage({
              product_variant_id: vid,
              body: { image: base64 },
            }).unwrap();
            const created = resp?.data || resp;
            setFormValues((prev: FormValues) => {
              const variants = [...prev.variants];
              const current = { ...(variants[index] || {}) } as Variant;
              const files = [...((current.ui_files as any[]) || [])];
              const foundIdx = files.findIndex((ff: any) => ff.uid === tempUid);
              if (foundIdx !== -1) {
                const cur = files[foundIdx];
                files[foundIdx] = {
                  uid: created?.id ?? cur.uid,
                  name:
                    created?.name ??
                    cur.name ??
                    `image-${created?.id ?? foundIdx}`,
                  url: created?.url ?? cur.url ?? cur._previewUrl,
                  status: "done",
                } as any;
              }
              variants[index] = { ...current, ui_files: files } as Variant;
              return { ...prev, variants };
            });
          } catch (e) {
            setFormValues((prev: FormValues) => {
              const variants = [...prev.variants];
              const current = { ...(variants[index] || {}) } as Variant;
              const files = [...((current.ui_files as any[]) || [])];
              const foundIdx = files.findIndex((ff: any) => ff.uid === tempUid);
              if (foundIdx !== -1) {
                files[foundIdx] = {
                  ...files[foundIdx],
                  status: "error",
                } as any;
              }
              variants[index] = { ...current, ui_files: files } as Variant;
              return { ...prev, variants };
            });
          }
        }
      } else {
        // No variant id yet: compute base64 and keep in state only
        const base64Images: string[] = [];
        for (const f of limitedList) {
          const fileObj = (f as any).originFileObj;
          if (!fileObj) continue;
          const compressed = await compressImage(fileObj);
          const base64 = await fileToBase64(compressed);
          base64Images.push(base64 as string);
        }
        setFormValues((prev: FormValues) => {
          const variants = [...prev.variants];
          variants[index] = {
            ...variants[index],
            images: base64Images,
          } as Variant;
          return { ...prev, variants };
        });
      }
    } catch (err) {
      console.error("Error processing variant images", err);
      message.error("Error processing variant image(s)");
    }
  };

  // Remove a variant image: if persisted (no originFileObj), delete via API; otherwise just remove locally
  const removeVariantImage = async (
    variantIndex: number,
    fileIndex: number
  ) => {
    const v = formValues.variants[variantIndex];
    const file: any = v?.ui_files?.[fileIndex];
    if (!file) return;
    const isPersisted = !file?.originFileObj && !!file?.uid;
    const vid = v?.id;
    if (isPersisted && vid) {
      try {
        // mark deleting in UI
        setFormValues((prev: FormValues) => {
          const variants = [...prev.variants];
          const current = { ...(variants[variantIndex] || {}) } as Variant;
          const files = [...((current.ui_files as any[]) || [])];
          files[fileIndex] = { ...files[fileIndex], _deleting: true };
          variants[variantIndex] = { ...current, ui_files: files } as Variant;
          return { ...prev, variants };
        });
        await deleteVariantImage({
          product_variant_id: vid,
          image_id: String(file.uid),
        }).unwrap();
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText={"Success"}
                title={"Deleted"}
                image={imgSuccess}
                textColor="green"
                message="Variant Image deleted successfully"
                backgroundColor="#FCFCFD"
              />
            ),
          },
          message: "Deleted",
        });
      } catch (e: any) {
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText={"Error"}
                title={"Delete Failed"}
                image={imgError}
                textColor="red"
                message={e?.data?.message || "Unable to delete variant image"}
                backgroundColor="#FCFCFD"
              />
            ),
          },
          message: "Error",
        });
        // unmark deleting on failure
        setFormValues((prev: FormValues) => {
          const variants = [...prev.variants];
          const current = { ...(variants[variantIndex] || {}) } as Variant;
          const files = [...((current.ui_files as any[]) || [])];
          files[fileIndex] = { ...files[fileIndex] };
          delete (files[fileIndex] as any)._deleting;
          variants[variantIndex] = { ...current, ui_files: files } as Variant;
          return { ...prev, variants };
        });
        return; // keep UI unchanged on failure
      }
    }
    setFormValues((prev: FormValues) => {
      const variants = [...prev.variants];
      const current = { ...(variants[variantIndex] || {}) } as Variant;
      const files = [...((current.ui_files as any[]) || [])];
      files.splice(fileIndex, 1);
      variants[variantIndex] = { ...current, ui_files: files } as Variant;
      return { ...prev, variants };
    });
  };

  const handleSubmit = async () => {
    try {
      // Validate client side
      await productSchema.validate(
        {
          ...formValues,
          name: formValues.name.trim(),
          description: formValues.description.trim(),
          short_description: formValues.short_description.trim(),
        },
        { abortEarly: false }
      );

      setFormErrors({});

      const payload = {
        name: formValues.name,
        short_description: formValues.short_description,
        description: formValues.description,
      };

      await updateProducts({ id: id as string, body: payload }).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={"Product Updated Successfully"}
              image={imgSuccess}
              textColor="green"
              message={"Your product has been updated."}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Success",
      });
      // After successful update, do not wipe the form; keep values in place
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
                title={"Update Failed"}
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

  // Product-level apply helpers using dedicated APIs
  const applyProductCategories = async () => {
    if (!id) return;
    try {
      await updateProductCategories({
        product_id: id,
        body: { category_ids: formValues.category_ids },
      }).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={"Categories Updated"}
              image={imgSuccess}
              textColor="green"
              message={"Product categories updated."}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Success",
      });
    } catch (e: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Error"}
              title={"Categories Update Failed"}
              image={imgError}
              textColor="red"
              message={e?.data?.message || "Unable to update categories"}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Error",
      });
    }
  };

  const applyProductAttributes = async () => {
    if (!id) return;
    try {
      await updateProductAttributeValues({
        product_id: id,
        body: { attribute_value_ids: formValues.attribute_value_ids },
      }).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={"Attributes Updated"}
              image={imgSuccess}
              textColor="green"
              message={"Product attributes updated."}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Success",
      });
    } catch (e: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Error"}
              title={"Attributes Update Failed"}
              image={imgError}
              textColor="red"
              message={e?.data?.message || "Unable to update attributes"}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Error",
      });
    }
  };

  const uploadProductImages = async () => {
    if (!id) return;
    try {
      for (const b64 of formValues.images || []) {
        if (!b64) continue;
        await createProductImage({
          product_id: id,
          body: { image: b64 },
        }).unwrap();
      }
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={"Images Uploaded"}
              image={imgSuccess}
              textColor="green"
              message={"Product images uploaded."}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Success",
      });
    } catch (e: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Error"}
              title={"Image Upload Failed"}
              image={imgError}
              textColor="red"
              message={e?.data?.message || "Unable to upload images"}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Error",
      });
    }
  };

  // Variant-level helpers
  const saveVariant = async (variant: Variant) => {
    if (!variant.id || !id) return;
    try {
      await updateVariant({
        product_variant_id: variant.id,
        body: {
          name: variant.name || "",
          price: typeof variant.price === "number" ? variant.price : 0,
          compare_price:
            typeof variant.compare_price === "number"
              ? variant.compare_price
              : null,
          quantity: typeof variant.quantity === "number" ? variant.quantity : 0,
          short_description: formValues.short_description || "",
          description: formValues.description || "",
          images: [],
          product_id: id,
          attribute_value_ids: variant.attribute_value_ids || [],
          is_serialized: (variant.is_serialized ?? 0) as 0 | 1,
          serial_number: variant.is_serialized
            ? variant.serial_number || ""
            : "",
        },
      }).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={"Variant Saved"}
              image={imgSuccess}
              textColor="green"
              message={"Variant details updated."}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Success",
      });
    } catch (e: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Error"}
              title={"Variant Save Failed"}
              image={imgError}
              textColor="red"
              message={e?.data?.message || "Unable to save variant"}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Error",
      });
    }
  };

  const uploadVariantImages = async (variant: Variant) => {
    if (!variant.id) return;
    try {
      for (const b64 of variant.images || []) {
        if (!b64) continue;
        await createVariantImage({
          product_variant_id: variant.id,
          body: { image: b64 },
        }).unwrap();
      }
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={"Variant Images Uploaded"}
              image={imgSuccess}
              textColor="green"
              message={"Variant images uploaded."}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Success",
      });
    } catch (e: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Error"}
              title={"Upload Failed"}
              image={imgError}
              textColor="red"
              message={e?.data?.message || "Unable to upload variant images"}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Error",
      });
    }
  };

  const applyVariantAttributes = async (variant: Variant) => {
    if (!variant.id) return;
    try {
      await updateVariantAttributes({
        product_variant_id: variant.id,
        body: { attribute_value_ids: variant.attribute_value_ids || [] },
      }).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={"Variant Attributes Updated"}
              image={imgSuccess}
              textColor="green"
              message={"Variant attributes updated."}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Success",
      });
    } catch (e: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Error"}
              title={"Update Failed"}
              image={imgError}
              textColor="red"
              message={
                e?.data?.message || "Unable to update variant attributes"
              }
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Error",
      });
    }
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
        headerText="Edit Product"
        showAddButton={false}
        btnText="Update Product"
        onClick={() => {}}
      />
      <SharedLayout className="bg-white">
        <PermissionGuard permission="products.update">
          <Breadcrumb
            className="mb-4"
            items={[
              { title: "Products", href: "/products" },
              {
                title: (
                  <span className="font-semibold">
                    {data?.data?.name || "Edit"}
                  </span>
                ),
              },
            ]}
          />
          {isLoading ? (
            <div className="pb-20">
              <SkeletonLoaderForPage />
            </div>
          ) : (
            <div>
              <form className="mt-5 flex flex-col gap-5">
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
                          <label
                            className={"text-sm capitalize text-[#2C3137]"}
                          >
                            Serialized
                          </label>
                        </div>
                        <SelectInput
                          onChange={(v) =>
                            setFormValues((p: FormValues) => ({
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
                <section className="hidden">
                  <h3 className="text-base font-semibold mb-3">
                    Pricing & inventory
                  </h3>
                  <div className=" md:grid grid-cols-1 md:grid-cols-4 gap-4 ">
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
                        (error as any)?.data?.errors?.cost_price?.join?.(
                          "\n"
                        ) ||
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
                  <h3 className="text-base font-semibold mb-3">
                    Categorization
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className={`pb-1`}>
                        <label className={"text-sm capitalize text-[#2C3137]"}>
                          Categories*
                        </label>
                      </div>
                      <SelectInput
                        loading={isUpdatingCategories}
                        onChange={async (values) => {
                          setFormValues((p: FormValues) => ({
                            ...p,
                            category_ids: values,
                          }));
                          if (!id) return;
                          try {
                            await updateProductCategories({
                              product_id: id,
                              body: { category_ids: values },
                            }).unwrap();
                            showPlannerToast({
                              options: {
                                customToast: (
                                  <CustomToast
                                    altText={"Success"}
                                    title={"Categories Updated"}
                                    image={imgSuccess}
                                    textColor="green"
                                    message={"Product categories updated."}
                                    backgroundColor="#FCFCFD"
                                  />
                                ),
                              },
                              message: "Success",
                            });
                          } catch (e: any) {
                            showPlannerToast({
                              options: {
                                customToast: (
                                  <CustomToast
                                    altText={"Error"}
                                    title={"Categories Update Failed"}
                                    image={imgError}
                                    textColor="red"
                                    message={
                                      e?.data?.message ||
                                      "Unable to update categories"
                                    }
                                    backgroundColor="#FCFCFD"
                                  />
                                ),
                              },
                              message: "Error",
                            });
                          }
                        }}
                        onDeselect={async (value) => {
                          if (!id || !value) return;
                          try {
                            await deleteProductCategory({
                              product_id: id,
                              category_id: value as string,
                            }).unwrap();
                          } catch (e) {}
                        }}
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
                        loading={isUpdatingAttributes}
                        onChange={async (values) => {
                          setFormValues((p: FormValues) => ({
                            ...p,
                            attribute_value_ids: values,
                          }));
                          if (!id) return;
                          try {
                            await updateProductAttributeValues({
                              product_id: id,
                              body: { attribute_value_ids: values },
                            }).unwrap();
                            showPlannerToast({
                              options: {
                                customToast: (
                                  <CustomToast
                                    altText={"Success"}
                                    title={"Attributes Updated"}
                                    image={imgSuccess}
                                    textColor="green"
                                    message={"Product attributes updated."}
                                    backgroundColor="#FCFCFD"
                                  />
                                ),
                              },
                              message: "Success",
                            });
                          } catch (e: any) {
                            showPlannerToast({
                              options: {
                                customToast: (
                                  <CustomToast
                                    altText={"Error"}
                                    title={"Attributes Update Failed"}
                                    image={imgError}
                                    textColor="red"
                                    message={
                                      e?.data?.message ||
                                      "Unable to update attributes"
                                    }
                                    backgroundColor="#FCFCFD"
                                  />
                                ),
                              },
                              message: "Error",
                            });
                          }
                        }}
                        onDeselect={async (value) => {
                          if (!id || !value) return;
                          try {
                            await deleteProductAttributeValue({
                              product_id: id,
                              attribute_value_id: value as string,
                            }).unwrap();
                          } catch (e) {}
                        }}
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
                    <TextAreaInput
                      row={8}
                      name="short_description"
                      errorMessage={""}
                      className="w-full"
                      value={formValues.short_description}
                      onChange={handleInputChange}
                      placeholder="Short description"
                      title={
                        <span className="font-[500]">Short description</span>
                      }
                    />
                    <div>
                      <RichTextEditor
                        value={formValues.description}
                        onChange={(html) =>
                          setFormValues((p: FormValues) => ({
                            ...p,
                            description: html,
                          }))
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
                          if (fileList.length >= 6) {
                            message.warning(
                              "You can only upload up to 6 images"
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
                        onClick={triggerUpload}
                        className={`p-6 w-full border-2 border-dashed ${
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
                            (error as any)?.data?.errors?.images?.join?.(
                              "\n"
                            ) ||
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
                              <div className="w-16 h-16">
                                <ImageComponent
                                  isLoadingImage={false}
                                  setIsLoadingImage={() => {}}
                                  width={64}
                                  aspectRatio="1/1"
                                  src={f.url || f._previewUrl || f.thumbUrl}
                                  alt="Variant Preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {f.status === "uploading" && (
                                <span className="text-[10px] text-gray-500">
                                  Uploading…
                                </span>
                              )}
                              {f.status === "error" && (
                                <span className="text-[10px] text-red-500">
                                  Upload failed
                                </span>
                              )}
                              {f._deleting && (
                                <span className="text-[10px] text-gray-500">
                                  Deleting…
                                </span>
                              )}
                              <p className="text-xs truncate w-full text-center">
                                {f.name}
                              </p>
                              <button
                                type="button"
                                className="text-red-500 text-xs disabled:opacity-50"
                                disabled={
                                  f.status === "uploading" || f._deleting
                                }
                                onClick={() => removeProductImage(idx)}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                  {/* Upload is automatic on add; no manual upload button */}
                </section>

                {/* Variants */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold">Variants</h3>
                    <div className="w-fit">
                      <CustomButton
                        onClick={addVariant}
                        className="bg-primary-30 text-white w-auto px-4"
                      >
                        Add variant
                      </CustomButton>
                    </div>
                  </div>

                  {formValues.variants.length === 0 ? (
                    <p className="text-sm text-gray-500">No variants added.</p>
                  ) : (
                    <div className="flex flex-col gap-6">
                      {formValues.variants.map((v: Variant, i: number) => (
                        <div
                          key={i}
                          className="border rounded-lg p-4"
                          onClick={() => {
                            if (v.id) setSelectedVariantId(v.id);
                          }}
                        >
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
                              {!v.id && (
                                <button
                                  type="button"
                                  onClick={() => removeVariant(i)}
                                  className="text-red-500 font-[500] text-xs"
                                >
                                  Remove
                                </button>
                              )}
                              {v.id && (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    try {
                                      await deleteVariantApi({
                                        id: v.id!,
                                      }).unwrap();
                                      removeVariant(i);
                                    } catch (e) {
                                      showPlannerToast({
                                        options: {
                                          customToast: (
                                            <CustomToast
                                              altText={"Error"}
                                              title={"Delete Failed"}
                                              image={imgError}
                                              textColor="red"
                                              message={
                                                "Unable to delete variant"
                                              }
                                              backgroundColor="#FCFCFD"
                                            />
                                          ),
                                        },
                                        message: "Error",
                                      });
                                    }
                                  }}
                                  className="text-red-500 font-[500] text-xs"
                                >
                                  Delete variant
                                </button>
                              )}
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
                              title={
                                <span className="font-[500]">Compare</span>
                              }
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
                                updateVariantField(
                                  i,
                                  "quantity",
                                  e.target.value
                                )
                              }
                              placeholder="0"
                              title={<span className="font-[500]">Qty*</span>}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                            <div>
                              <div className={`pb-1`}>
                                <label
                                  className={
                                    "text-sm capitalize text-[#2C3137]"
                                  }
                                >
                                  Attribute values
                                </label>
                              </div>
                              <SelectInput
                                loading={isUpdatingVariantAttrs}
                                onChange={async (values) => {
                                  updateVariantField(
                                    i,
                                    "attribute_value_ids",
                                    values
                                  );
                                  const vid =
                                    (formValues.variants[i] || {}).id || v.id;
                                  if (!vid) return;
                                  try {
                                    await updateVariantAttributes({
                                      product_variant_id: vid,
                                      body: { attribute_value_ids: values },
                                    }).unwrap();
                                    showPlannerToast({
                                      options: {
                                        customToast: (
                                          <CustomToast
                                            altText={"Success"}
                                            title={"Variant Attributes Updated"}
                                            image={imgSuccess}
                                            textColor="green"
                                            message={
                                              "Variant attributes updated."
                                            }
                                            backgroundColor="#FCFCFD"
                                          />
                                        ),
                                      },
                                      message: "Success",
                                    });
                                  } catch (e: any) {
                                    showPlannerToast({
                                      options: {
                                        customToast: (
                                          <CustomToast
                                            altText={"Error"}
                                            title={"Update Failed"}
                                            image={imgError}
                                            textColor="red"
                                            message={
                                              e?.data?.message ||
                                              "Unable to update variant attributes"
                                            }
                                            backgroundColor="#FCFCFD"
                                          />
                                        ),
                                      },
                                      message: "Error",
                                    });
                                  }
                                }}
                                onDeselect={async (value) => {
                                  const vid =
                                    (formValues.variants[i] || {}).id || v.id;
                                  if (!vid || !value) return;
                                  try {
                                    await deleteVariantAttributes({
                                      product_variant_id: vid,
                                      attribute_value_id: value as string,
                                    }).unwrap();
                                  } catch (e) {}
                                }}
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
                                  if ((v.ui_files?.length ?? 0) >= 6) {
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
                                  if ((v.ui_files?.length ?? 0) >= 6) {
                                    message.warning(
                                      "You can only upload up to 6 images per variant"
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
                                className={`p-4 w-full border-2 border-dashed border-gray-300 rounded-lg  cursor-pointer hover:border-blue-500 transition-colors`}
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
                                      <div className="w-16 h-16">
                                        <ImageComponent
                                          isLoadingImage={false}
                                          setIsLoadingImage={() => {}}
                                          width={64}
                                          aspectRatio="1/1"
                                          src={
                                            file.url ||
                                            file._previewUrl ||
                                            file.thumbUrl
                                          }
                                          alt="Variant Preview"
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      {file.status === "uploading" && (
                                        <span className="text-[10px] text-gray-500">
                                          Uploading…
                                        </span>
                                      )}
                                      {file.status === "error" && (
                                        <span className="text-[10px] text-red-500">
                                          Upload failed
                                        </span>
                                      )}
                                      {file._deleting && (
                                        <span className="text-[10px] text-gray-500">
                                          Deleting…
                                        </span>
                                      )}
                                      <p className="text-[10px] truncate w-full text-center">
                                        {file.name}
                                      </p>
                                      <button
                                        type="button"
                                        className="text-red-500 text-[10px] disabled:opacity-50"
                                        disabled={
                                          file.status === "uploading" ||
                                          file._deleting
                                        }
                                        onClick={() =>
                                          removeVariantImage(i, idx)
                                        }
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  ))}
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-end gap-3 mt-4">
                            <div className="">
                              <CustomButton
                                type="button"
                                onClick={() => saveVariant(v)}
                                disabled={isUpdatingVariant || !v.id}
                                className="border bg-black text-white px-4 py-2"
                              >
                                {isUpdatingVariant ? (
                                  <span className="flex items-center gap-2">
                                    <Spinner className="border-white" /> Saving…
                                  </span>
                                ) : (
                                  "Save variant"
                                )}
                              </CustomButton>
                            </div>
                            {/* Variant image upload is automatic on add; no manual upload button */}
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
                        setFormValues((prev: FormValues) => ({
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
                      Cancel
                    </CustomButton>
                    <CustomButton
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoadingUpdate}
                      className="border bg-primary-40 flex justify-center items-center gap-2 text-white px-5"
                    >
                      {isLoadingUpdate ? (
                        <Spinner className="border-white" />
                      ) : (
                        "Update product"
                      )}
                    </CustomButton>
                  </div>
                </div>
              </form>
            </div>
          )}
        </PermissionGuard>
      </SharedLayout>
    </div>
  );
};

export default index;
