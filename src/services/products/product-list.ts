import { api } from "..";

interface CreateProductsType {
  name: string;
  price: number;
  compare_price: null | number;
  cost_price: number;
  quantity: number;
  short_description: string;
  description: string;
  images: string[]; //images
  category_ids: string[]; //category ids
  attribute_value_ids: string[]; //attribute value ids
  is_serialized: 1 | 0;
  serial_number: string; //required_if:is_serialized-true|unique
  variants: {
    name: string;
    price: number;
    compare_price: null | number;
    cost_price: number;
    quantity: number;
    is_serialized: 1 | 0;
    serial_number?: string; // required if is_serialized === 1 and should be unique
    images?: string[];
    attribute_value_ids?: string[];
    batch_number?: string;
  }[];
}
export const productListApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllProducts: builder.query<
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
          url: "products",
          method: "GET",
          params,
          providesTags: ["products"],
        };
      },
    }),
    getSingleProducts: builder.query<
      any,
      {
        id: string;
        include?: string;
      }
    >({
      query: ({
        id,
        include,
      }: {
        id: string; //product_id
        include?: string; //variants,images,attributeValues,categories
      }) => {
        const params: any = {};

        if (include) params.include = include;
        return {
          url: `products/${id}`,
          method: "GET",

          providesTags: ["products"],
        };
      },
    }),
    createProducts: builder.mutation<any, CreateProductsType>({
      query: (body) => ({
        url: "products",
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["products"],
      }),
    }),
    updateProducts: builder.mutation<
      any,
      { id: string; body: CreateProductsType }
    >({
      query: ({ id, body }) => ({
        url: `products/${id}`,
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["products"],
      }),
    }),
    deleteProducts: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `products/${id}`,
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
  useGetAllProductsQuery,
  useGetSingleProductsQuery,
  useCreateProductsMutation,
  useUpdateProductsMutation,
  useDeleteProductsMutation,
} = productListApi;
