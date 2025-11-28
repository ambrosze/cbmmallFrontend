import AttributeHeader from "@/components/Attributes/AttributeHeader";
import Header from "@/components/header";
import ImageComponent from "@/components/sharedUI/ImageComponent";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import { useGetSingleProductsQuery } from "@/services/products/product-list";
import { useGetSingleProductVariantQuery } from "@/services/products/variant/variant-product-list";
import { newUserTimeZoneFormatDate } from "@/utils/fx";
import { Breadcrumb } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";

const ProductDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  // variant selection
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );
  const { data, isLoading } = useGetSingleProductsQuery(
    { id: id as string, include: "variants,images,attributeValues,categories" },
    { skip: !id }
  );
  const { data: variantResp, isLoading: isVariantLoading } =
    useGetSingleProductVariantQuery(
      {
        product_variant_id: selectedVariantId || "",
        include:
          "product,product.images,product.variants,product.attributeValues,product.categories,images,attributeValues",
      },
      { skip: !selectedVariantId }
    );
  console.log("🚀 ~ ProductDetailsPage ~ data:", data);

  // The single product response type here returns a variant as data per types file
  // so attempt to normalize: if variant contains product, lift it; else it's a core product
  // base product model
  const product = useMemo(() => {
    const d: any = data?.data;
    if (!d) return null;
    // If API returns variant with nested product
    if (d.product) {
      // merge some top-level helpfuls
      return {
        ...(d.product || {}),
        variants: d.product?.variants || [],
        images: d.product?.images || [],
      };
    }
    // else assume it's the core product shape
    return d;
  }, [data]);

  const selectedVariant: any = useMemo(() => variantResp?.data, [variantResp]);

  // derive current view model (variant takes precedence when selected)
  const view = useMemo(() => {
    if (selectedVariantId && selectedVariant) {
      const p = selectedVariant.product || {};
      return {
        // display fields
        name: selectedVariant.name || p.name,
        created_at: selectedVariant.created_at || p.created_at,
        updated_at: selectedVariant.updated_at || p.updated_at,
        // media & attributes prefer variant then fallback to product
        images: selectedVariant.images?.length
          ? selectedVariant.images
          : p.images || [],
        attribute_values: selectedVariant.attribute_values?.length
          ? selectedVariant.attribute_values
          : p.attribute_values || [],
        // categories belong to product
        categories: p.categories || [],
        // always show product variants list for navigation
        variants: p.variants || [],
        // surface some variant specific fields
        variant: selectedVariant,
      } as any;
    }
    if (product) {
      return {
        ...product,
        categories: (product as any)?.categories || [],
        variant: null,
      } as any;
    }
    return null;
  }, [selectedVariantId, selectedVariant, product]);

  const images: string[] = useMemo(
    () => (view?.images || []).map((img: any) => img.url).filter(Boolean),
    [view]
  );

  const [activeImage, setActiveImage] = useState<string | null>(null);
  useEffect(() => {
    if (images?.length) {
      setActiveImage(images[0]);
    } else {
      setActiveImage(`https://placehold.co/600x400?text=${view?.name}`);
    }
  }, [images, view?.name]);

  return (
    <div className="bg-white">
      <Header
        search={""}
        setSearch={() => {}}
        showSearch={false}
        placeHolderText="Search product, supplier, order"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="Product details"
        showAddButton={false}
        btnText=""
        onClick={() => {}}
      />
      <SharedLayout className="bg-white">
        <Breadcrumb
          className="mb-4"
          items={[
            { title: "Products", href: "/products" },
            {
              title: (
                <span className="font-semibold">{view?.name || "Details"}</span>
              ),
            },
          ]}
        />

        {isLoading ? (
          <div className="pb-20">
            <SkeletonLoaderForPage />
          </div>
        ) : !view ? (
          <div className="py-20 text-center text-gray-500">
            Product not found.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
            {/* Gallery */}
            <section>
              <div className="w-full aspect-[4/3] bg-white border rounded-lg flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <ImageComponent
                  isLoadingImage={isLoadingImage}
                  setIsLoadingImage={setIsLoadingImage}
                  aspectRatio="1/1"
                  width={600}
                  height={600}
                  src={
                    activeImage ||
                    `https://placehold.co/600x400?text=${view?.name}`
                  }
                  alt={view?.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {(images.length
                  ? images
                  : [`https://placehold.co/600x400?text=${view?.name}`]
                ).map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(src)}
                    className={`border rounded-md overflow-hidden h-[80px] md:h-[100px] focus:outline-none focus:ring-2 focus:ring-primary-40 p-1 block ${
                      activeImage === src ? "ring-2 ring-primary-40" : ""
                    }`}
                    title={view?.name}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <ImageComponent
                      isLoadingImage={isLoadingImage}
                      setIsLoadingImage={setIsLoadingImage}
                      aspectRatio="1/1"
                      width={100}
                      height={100}
                      src={src}
                      alt="thumb"
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            </section>

            {/* Info */}
            <section className="bg-white">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-xl font-semibold mb-2">{view?.name}</h2>
                {selectedVariantId ? (
                  <button
                    type="button"
                    onClick={() => setSelectedVariantId(null)}
                    className="text-sm px-3 py-1 border rounded-md hover:bg-gray-50 "
                    title="Back to main product"
                  >
                    View main product
                  </button>
                ) : null}
              </div>

              <p
                dangerouslySetInnerHTML={{ __html: (view as any).description }}
                className="text-sm text-[#667085] mb-4"
              />

              {(view as any)?.short_description && (
                <div className="">
                  <p className="text-base font-semibold mb-2">
                    Additional information
                  </p>
                  <p className="text-sm text-[#667085] mb-4">
                    {(view as any).short_description}
                  </p>
                </div>
              )}

              <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <dt className="text-xs text-[#667085]">Created</dt>
                  <dd className="text-sm font-medium">
                    {newUserTimeZoneFormatDate(view?.created_at, "DD/MM/YYYY")}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[#667085]">Updated</dt>
                  <dd className="text-sm font-medium">
                    {newUserTimeZoneFormatDate(view?.updated_at, "DD/MM/YYYY")}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[#667085]">Images</dt>
                  <dd className="text-sm font-medium">
                    {view?.images?.length || 0}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[#667085]">Variants</dt>
                  <dd className="text-sm font-medium">
                    {view?.variants?.length || 0}
                  </dd>
                </div>
              </dl>

              {view?.attribute_values?.length ? (
                <div className="mt-5">
                  <h3 className="text-sm font-semibold mb-2">Attributes</h3>
                  <div className="flex flex-wrap gap-2">
                    {view.attribute_values.map((av: any) => (
                      <span
                        key={av.id}
                        className="px-2 py-1 rounded-md text-xs bg-gray-100 border"
                      >
                        {av?.value}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Variant-only details */}
              {(view as any)?.variant ? (
                <div className="mt-5">
                  <h3 className="text-sm font-semibold mb-2">
                    Variant details
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-xs text-[#667085] block">SKU</span>
                      <span className="font-medium">
                        {(view as any).variant.sku || "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-[#667085] block">
                        Price
                      </span>
                      <span className="font-medium">
                        ₦{(view as any).variant.price ?? "-"}
                      </span>
                    </div>
                    {(view as any).variant.compare_price ? (
                      <div>
                        <span className="text-xs text-[#667085] block">
                          Compare price
                        </span>
                        <span className="font-medium">
                          ₦{(view as any).variant.compare_price}
                        </span>
                      </div>
                    ) : null}
                    {(view as any).variant.cost_price ? (
                      <div>
                        <span className="text-xs text-[#667085] block">
                          Cost price
                        </span>
                        <span className="font-medium">
                          ₦{(view as any).variant.cost_price}
                        </span>
                      </div>
                    ) : null}
                    <div>
                      <span className="text-xs text-[#667085] block">
                        Serialized
                      </span>
                      <span className="font-medium">
                        {(view as any).variant.is_serialized === 1
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>
                    {(view as any).variant.serial_number ? (
                      <div>
                        <span className="text-xs text-[#667085] block">
                          Serial number
                        </span>
                        <span className="font-medium">
                          {(view as any).variant.serial_number}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  {(view as any).variant.barcode ? (
                    <div className="mt-3">
                      <span className="text-xs text-[#667085] block mb-1">
                        Barcode
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={(view as any).variant.barcode}
                        alt="Barcode"
                        className="max-h-16"
                      />
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="mt-5">
                  <h3 className="text-sm font-semibold mb-2">Details</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-xs text-[#667085] block">SKU</span>
                      <span className="font-medium">
                        {(view as any)?.sku || "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-[#667085] block">
                        Price
                      </span>
                      <span className="font-medium">
                        ₦{(view as any).display_price ?? "-"}
                      </span>
                    </div>
                    {(view as any).display_compare_price ? (
                      <div>
                        <span className="text-xs text-[#667085] block">
                          Compare price
                        </span>
                        <span className="font-medium">
                          ₦{(view as any).display_compare_price}
                        </span>
                      </div>
                    ) : null}
                    {(view as any).cost_price ? (
                      <div>
                        <span className="text-xs text-[#667085] block">
                          Cost price
                        </span>
                        <span className="font-medium">
                          ₦{(view as any).cost_price}
                        </span>
                      </div>
                    ) : null}
                    <div>
                      <span className="text-xs text-[#667085] block">
                        Serialized
                      </span>
                      <span className="font-medium">
                        {(view as any).is_serialized === 1 ? "Yes" : "No"}
                      </span>
                    </div>
                    {(view as any).serial_number ? (
                      <div>
                        <span className="text-xs text-[#667085] block">
                          Serial number
                        </span>
                        <span className="font-medium">
                          {(view as any).serial_number}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  {(view as any).barcode ? (
                    <div className="mt-3">
                      <span className="text-xs text-[#667085] block mb-1">
                        Barcode
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={(view as any).barcode}
                        alt="Barcode"
                        className="max-h-16"
                      />
                    </div>
                  ) : null}
                </div>
              )}

              {(view as any)?.categories?.length ? (
                <div className="mt-5">
                  <h3 className="text-sm font-semibold mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {(view as any).categories.map((c: any) => (
                      <span
                        key={c.id}
                        className="px-2 py-1 rounded-md text-xs bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        {c?.name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {view?.variants?.length ? (
                <div className="mt-6">
                  <div className="">
                    {view.variants.map((v: any, index: number) => (
                      <React.Fragment key={v.id}>
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold mb-2">
                            Variant({index + 1})
                          </h3>
                          <button
                            onClick={() => {
                              setSelectedVariantId(v.id);
                              // scroll to top
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="text-sm font-semibold text-blue-500 mb-2 underline"
                          >
                            View
                          </button>
                        </div>
                        <div
                          className={`p-3 border rounded-md grid grid-cols-1 sm:grid-cols-3 mb-2 gap-2 ${
                            selectedVariantId === v.id ? "bg-primary-50/30" : ""
                          }`}
                          onClick={() => {
                            setSelectedVariantId(v.id);
                            // scroll to top
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          role="button"
                          tabIndex={0}
                        >
                          <div>
                            <p className="text-sm font-medium">{v.name}</p>
                            {v.sku ? (
                              <p className="text-[11px] text-[#667085]">
                                SKU: {v.sku}
                              </p>
                            ) : null}
                          </div>
                          <div className="text-sm">
                            <p>Price: {v.price ?? "-"}</p>
                            {v.compare_price ? (
                              <p className="text-[#667085] text-xs">
                                Compare: {v.compare_price}
                              </p>
                            ) : null}
                          </div>
                          <div className="text-sm">
                            <p>
                              Serialized: {v.is_serialized === 1 ? "Yes" : "No"}
                            </p>
                            {v.serial_number ? (
                              <p className="text-[#667085] text-xs">
                                SN: {v.serial_number}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  {isVariantLoading && selectedVariantId ? (
                    <p className="text-xs text-[#667085] mt-2">
                      Loading selected variant…
                    </p>
                  ) : null}
                </div>
              ) : null}
            </section>
          </div>
        )}
      </SharedLayout>
    </div>
  );
};

export default ProductDetailsPage;
