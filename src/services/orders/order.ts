import { IOrdersResponse, ISingleOrderResponse } from "@/types/orderTypes";
import { api } from "..";

interface CreateColourType {
  name: string;
  hex: string;
}
export const ordersApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllOrders: builder.query<
      IOrdersResponse,
      {
        sort?: string;
        q?: string;
        paginate?: boolean;
        per_page?: number;
        page?: number;
        include?: string;
        filter?: { [key: string]: any };
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
        filter?: { [key: string]: any };
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
          url: "orders",
          method: "GET",
          params,
          providesTags: ["orders"],
        };
      },
    }),
    getSingleOrders: builder.query<
      ISingleOrderResponse,
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
          url: `orders/${id}`,
          method: "GET",
          params,
          providesTags: ["orders"],
        };
      },
    }),
    // update order mutation
    updateOrderStatus: builder.mutation<
      any,
      {
        id: string;
        body: {
          status: string;
        };
      }
    >({
      query: ({ id, body }) => ({
        url: `orders/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
        invalidatesTags: ["orders"],
      }),
    }),
    deleteOrder: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `orders/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["orders"],
      }),
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetSingleOrdersQuery,
  useDeleteOrderMutation,
  useUpdateOrderStatusMutation,
} = ordersApi;
