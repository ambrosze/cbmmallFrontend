import { api } from "@/services";

export const productAttributeValuesApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createVariantProductAttributeValue: builder.mutation<
      any,
      {
        product_variant_id: string;
        attribute_value_id: string;
      }
    >({
      query: ({ product_variant_id, attribute_value_id }) => ({
        url: `product-variants/${product_variant_id}/attribute-values/${attribute_value_id}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["product-variants", "products"],
      }),
    }),
    updateVariantProductAttributeValue: builder.mutation<
      any,
      { product_variant_id: string; body: { attribute_value_ids: string[] } }
    >({
      query: ({ product_variant_id, body }) => ({
        url: `product-variants/${product_variant_id}/attribute-values`,
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["product-variants", "products"],
      }),
    }),
    deleteVariantProductAttributeValue: builder.mutation<
      any,
      { product_variant_id: string; attribute_value_id: string }
    >({
      query: ({ product_variant_id, attribute_value_id }) => ({
        url: `product-variants/${product_variant_id}/attribute-values/${attribute_value_id}`,
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
  useCreateVariantProductAttributeValueMutation,
  useUpdateVariantProductAttributeValueMutation,
  useDeleteVariantProductAttributeValueMutation,
} = productAttributeValuesApi;
