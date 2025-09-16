import { JewelryApiResponse } from "@/types/AdminItemsTypes";
import { api } from "..";

interface CreateAdminItemsType {
  material: string;
  category_id: string;
  colour_id: string;
  type_id: string;
  weight: string;
  price: string;
  quantity: string;
  upload_image: null | string; // Assuming upload_image can be null or a string (URL or base64)
  sku?: string;
}
export const adminItemsApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllAdminItems: builder.query<
      JewelryApiResponse,
      {
        q?: string;
        paginate?: boolean;
        per_page?: number;
        page?: number;
      }
    >({
      query: ({
        q,
        paginate,
        per_page,
        page,
      }: {
        q?: string;
        paginate?: boolean;
        per_page?: number;
        page?: number;
      }) => {
        const params: any = {};
        if (q) params.q = q;

        if (paginate !== undefined) params.paginate = paginate;
        if (per_page) params.per_page = per_page;
        if (page) params.page = page;

        return {
          url: "admin/items",
          method: "GET",
          params,
          providesTags: ["adminItems"],
        };
      },
    }),
    getSingleAdminItems: builder.query<
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
        id: string;
        include?: string; //cryptoNetwork
      }) => {
        const params: any = {};

        if (include) params.include = include;
        return {
          url: `items/${id}`,
          method: "GET",

          providesTags: ["adminItems"],
        };
      },
    }),
    createAdminItems: builder.mutation<any, CreateAdminItemsType>({
      query: (body) => ({
        url: "admin/items",
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["adminItems"],
      }),
    }),
    updateAdminItems: builder.mutation<
      any,
      { item_id: string; body: CreateAdminItemsType }
    >({
      query: ({ item_id, body }) => ({
        url: `admin/items/${item_id}`,
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["adminItems"],
      }),
    }),
    deleteAdminItems: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `admin/items/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["adminItems"],
      }),
    }),
  }),
});

export const {
  useGetAllAdminItemsQuery,
  useGetSingleAdminItemsQuery,
  useCreateAdminItemsMutation,
  useUpdateAdminItemsMutation,
  useDeleteAdminItemsMutation,
} = adminItemsApi;
