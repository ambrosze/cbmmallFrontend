import { api } from "@/services";

export const variantProductImageApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createVariantProductImage: builder.mutation<
      any,
      {
        product_variant_id: string;
        body: { image: string };
      }
    >({
      query: ({ product_variant_id, body }) => ({
        url: `product-variants/${product_variant_id}/images`,
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["product-variants", "products"],
      }),
    }),
    updateVariantProductImage: builder.mutation<
      any,
      { product_variant_id: string; image_id: string; body: { image: string } }
    >({
      query: ({ product_variant_id, image_id, body }) => ({
        url: `product-variants/${product_variant_id}/images/${image_id}`,
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["product-variants", "products"],
      }),
    }),
    deleteVariantProductImage: builder.mutation<
      any,
      { product_variant_id: string; image_id: string }
    >({
      query: ({ product_variant_id, image_id }) => ({
        url: `product-variants/${product_variant_id}/images/${image_id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["product-variants", "products"],
      }),
    }),
  }),
});

export const {
  useCreateVariantProductImageMutation,
  useUpdateVariantProductImageMutation,
  useDeleteVariantProductImageMutation,
} = variantProductImageApi;
