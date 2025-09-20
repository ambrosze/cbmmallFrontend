import { api } from "@/services";

export const productAttributeValuesApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createProductAttributeValue: builder.mutation<
      any,
      {
        product_id: string;
        attribute_value_id: string;
      }
    >({
      query: ({ product_id, attribute_value_id }) => ({
        url: `products/${product_id}/attribute-values/${attribute_value_id}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["products"],
      }),
    }),
    updateProductAttributeValue: builder.mutation<
      any,
      { product_id: string; body: { attribute_value_ids: string[] } }
    >({
      query: ({ product_id, body }) => ({
        url: `products/${product_id}/attribute-values`,
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["products"],
      }),
    }),
    deleteProductAttributeValue: builder.mutation<
      any,
      { product_id: string; attribute_value_id: string }
    >({
      query: ({ product_id, attribute_value_id }) => ({
        url: `products/${product_id}/attribute-values/${attribute_value_id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["products"],
      }),
    }),
  }),
});

export const {
  useCreateProductAttributeValueMutation,
  useUpdateProductAttributeValueMutation,
  useDeleteProductAttributeValueMutation,
} = productAttributeValuesApi;
