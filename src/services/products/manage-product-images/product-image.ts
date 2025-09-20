import { api } from "@/services";

export const productImageApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createProductImage: builder.mutation<
      any,
      {
        product_id: string;
        body: { image: string };
      }
    >({
      query: ({ product_id, body }) => ({
        url: `products/${product_id}/images`,
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["products"],
      }),
    }),
    updateProductImage: builder.mutation<
      any,
      { product_id: string; image_id: string; body: { image: string } }
    >({
      query: ({ product_id, image_id, body }) => ({
        url: `products/${product_id}/images/${image_id}`,
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["products"],
      }),
    }),
    deleteProductImage: builder.mutation<
      any,
      { product_id: string; image_id: string }
    >({
      query: ({ product_id, image_id }) => ({
        url: `products/${product_id}/images/${image_id}`,
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
  useCreateProductImageMutation,
  useUpdateProductImageMutation,
  useDeleteProductImageMutation,
} = productImageApi;
