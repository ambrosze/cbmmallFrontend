import { api } from "@/services";


interface CreateProductsType {
  name: string;
  price: number;
  compare_price: null | number;
  quantity: number;
  short_description: string;
  description: string;
  images: string[]; //images
  product_id: string; //product id
  attribute_value_ids: string[]; //attribute value ids
  is_serialized: 1 | 0;
  serial_number: string; //required_if:is_serialized-true|unique
}
export const variantProductListApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllProductVariants: builder.query<
      any,
      {
        sort?: string;
        q?: string;
        paginate?: boolean;
        per_page?: number;
        page?: number;
        include?: string; //variants,images,attributeValues
        filter?: {
          [key: string]: any;
        };
      }
    >({
      query: ({
        sort,
        q,
        paginate,
        per_page,
        page,
        include,
        filter,
      }: {
        sort?: string;
        q?: string;
        paginate?: boolean;
        per_page?: number;
        page?: number;
        include?: string;
        filter?: {
          [key: string]: any;
        };
      }) => {
        const params: any = {};
        if (q) params.q = q;
        if (include) params.include = include;

        if (paginate !== undefined) params.paginate = paginate;
        if (per_page) params.per_page = per_page;
        if (page) params.page = page;
        if (sort) params.sort = sort;
        if (filter) {
          Object.keys(filter).forEach((key) => {
            if (
              filter[key] !== undefined &&
              filter[key] !== null &&
              filter[key] !== ""
            ) {
              params[`filter[${key}]`] = filter[key];
            }
          });
        }
        return {
          url: "product-variants",
          method: "GET",
          params,
          providesTags: ["product-variants", "products"],
        };
      },
    }),
    getSingleProductVariant: builder.query<
      any,
      {
        product_variant_id: string;
        include?: string;
      }
    >({
      query: ({
        product_variant_id,
        include,
      }: {
        product_variant_id: string; //product_variant_id
        include?: string; //product.categories
      }) => {
        const params: any = {};

        if (include) params.include = include;
        return {
          url: `product-variants/${product_variant_id}`,
          method: "GET",

          providesTags: ["product-variants", "products"],
        };
      },
    }),
    createProductVariant: builder.mutation<any, CreateProductsType>({
      query: (body) => ({
        url: "product-variants",
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["product-variants", "products"],
      }),
    }),
    updateProductVariant: builder.mutation<
      any,
      { product_variant_id: string; body: CreateProductsType }
    >({
      query: ({ product_variant_id, body }) => ({
        url: `product-variants/${product_variant_id}`,
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["product-variants", "products"],
      }),
    }),
    deleteProductVariant: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `product-variants/${id}`,
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
  useGetAllProductVariantsQuery,
  useGetSingleProductVariantQuery,
  useCreateProductVariantMutation,
  useUpdateProductVariantMutation,
  useDeleteProductVariantMutation,
} = variantProductListApi;
