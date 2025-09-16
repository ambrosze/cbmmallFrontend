import {
  AdminDiscountSingleTopLevel,
  AdminDiscountTopLevel,
  CreateDiscountAdminType,
} from "@/types/discountTypes";
import { api } from "..";

export const discountAdminApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllDiscountAdmin: builder.query<
      AdminDiscountTopLevel,
      {
        q?: string;
        paginate?: boolean;
        per_page?: number;
        page?: number;
        sort?: string;
        include?: string;
        filter?: {
          is_active?: string;
          // Add more filter fields as needed here
        };
      }
    >({
      query: ({
        q,
        paginate,
        per_page,
        page,
        sort,
        include,
        filter,
      }: {
        q?: string;
        paginate?: boolean;
        per_page?: number;
        page?: number;
        sort?: string;
        include?: string;
        filter?: {
          is_active?: string;
          // Add more filter fields as needed here
        };
      }) => {
        const params: any = {};
        if (q) params.q = q;

        if (paginate !== undefined) params.paginate = paginate;
        if (per_page) params.per_page = per_page;
        if (page) params.page = page;
        if (sort) params.sort = sort;
        if (include) params.include = include;
        if (filter) {
          Object.entries(filter).forEach(([key, value]) => {
            if (value !== undefined) {
              params[`filter[${key}]`] = value;
            }
          });
        }

        return {
          url: "admin/discounts",
          method: "GET",
          params,
          providesTags: ["discountAdmin"],
        };
      },
    }),
    getSingleDiscountAdmin: builder.query<
      AdminDiscountSingleTopLevel,
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
          url: `admin/discounts/${id}`,
          method: "GET",
          providesTags: ["discountAdmin"],
        };
      },
    }),
    createDiscountAdmin: builder.mutation<any, CreateDiscountAdminType>({
      query: (body) => ({
        url: "admin/discounts",
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["discountAdmin"],
      }),
    }),
    updateDiscountAdmin: builder.mutation<
      any,
      { discount_id: string; body: CreateDiscountAdminType }
    >({
      query: ({ discount_id, body }) => ({
        url: `admin/discounts/${discount_id}`,
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["discountAdmin"],
      }),
    }),
    deleteDiscountAdmin: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `admin/discounts/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["discountAdmin"],
      }),
    }),
  }),
});

export const {
  useGetAllDiscountAdminQuery,
  useGetSingleDiscountAdminQuery,
  useCreateDiscountAdminMutation,
  useUpdateDiscountAdminMutation,
  useDeleteDiscountAdminMutation,
} = discountAdminApi;
