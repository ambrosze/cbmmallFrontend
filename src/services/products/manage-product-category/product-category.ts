import { api } from "@/services";

export const productCategoryApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createProductCategory: builder.mutation<
      any,
      {
        product_id: string;
        category_id: string;
      }
    >({
      query: ({ product_id, category_id }) => ({
        url: `products/${product_id}/categories/${category_id}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["products"],
      }),
    }),
    updateProductCategory: builder.mutation<
      any,
      { product_id: string; body: { category_ids: string[] } }
    >({
      query: ({ product_id, body }) => ({
        url: `products/${product_id}/categories`,
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["products"],
      }),
    }),
    deleteProductCategory: builder.mutation<
      any,
      { product_id: string; category_id: string }
    >({
      query: ({ product_id, category_id }) => ({
        url: `products/${product_id}/categories/${category_id}`,
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
  useCreateProductCategoryMutation,
  useUpdateProductCategoryMutation,
  useDeleteProductCategoryMutation,
} = productCategoryApi;
