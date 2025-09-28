import { SalesTopLevel, SingleSalesTopLevel } from "@/types/SalesTypes";
import { api } from "..";
import { PosTopLevel } from "@/types/PosTypes";

interface CreateSalesType {
  customer_id: string;
  discount_code?: string;
  payment_method: string; // ATM,Cheque,Cash,Transfer,POS,Other
  sale_inventories: {
    inventory_id: string; // nullable|string|max:191|exists:inventory,id
    quantity: number;
  }[];
}
interface AddItemToSalesType {
  inventory_id: string; // nullable|string|max:191|exists:inventory,id
  quantity: number;
  price_per_gram: number;
}
export const salesApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllSales: builder.query<
      SalesTopLevel,
      {
        sort?: string;
        q?: string;
        paginate?: boolean;
        per_page?: number;
        page?: number;
        include?: string;
      }
    >({
      query: ({
        sort,
        q,
        paginate,
        per_page,
        page,
        include,
      }: {
        sort?: string;
        q?: string;
        paginate?: boolean;
        per_page?: number;
        page?: number;
        include?: string;
      }) => {
        const params: any = {};
        if (q) params.q = q;
        if (include) params.include = include;

        if (paginate !== undefined) params.paginate = paginate;
        if (per_page) params.per_page = per_page;
        if (page) params.page = page;
        if (sort) params.sort = sort;

        return {
          url: "sales",
          method: "GET",
          params,
          providesTags: ["sales"],
        };
      },
    }),
    getAllPosSalesCheckout: builder.query<
      PosTopLevel,
      {
        sort?: string;
        q?: string;
        paginate?: boolean;
        per_page?: number;
        page?: number;
        include?: string;
      }
    >({
      query: ({
        sort,
        q,
        paginate,
        per_page,
        page,
        include,
      }: {
        sort?: string;
        q?: string;
        paginate?: boolean;
        per_page?: number;
        page?: number;
        include?: string;
      }) => {
        const params: any = {};
        if (q) params.q = q;
        if (include) params.include = include;

        if (paginate !== undefined) params.paginate = paginate;
        if (per_page) params.per_page = per_page;
        if (page) params.page = page;
        if (sort) params.sort = sort;

        return {
          url: "pos/cart-items",
          method: "GET",
          params,
          providesTags: ["pos"],
        };
      },
    }),
    getSingleSales: builder.query<
      SingleSalesTopLevel,
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
          url: `sales/${id}`,
          method: "GET",
          providesTags: ["sales"],
        };
      },
    }),
    createSales: builder.mutation<any, CreateSalesType>({
      query: (body) => ({
        url: "sales",
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["sales"],
      }),
    }),
    addItemToSales: builder.mutation<
      any,
      { id: string; body: AddItemToSalesType }
    >({
      query: ({ id, body }) => ({
        url: `sales/${id}sale-inventories`,
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["sales"],
      }),
    }),
    updateSales: builder.mutation<any, { id: string; body: CreateSalesType }>({
      query: ({ id, body }) => ({
        url: `sales/${id}`,
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["sales"],
      }),
    }),
    deleteSales: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `sales/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["sales"],
      }),
    }),
    removeItemsFromSales: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `sales/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["sales"],
      }),
    }),
  }),
});

export const {
  useGetAllSalesQuery,
  useGetAllPosSalesCheckoutQuery,
  useGetSingleSalesQuery,
  useCreateSalesMutation,
  useUpdateSalesMutation,
  useDeleteSalesMutation,
  useAddItemToSalesMutation,
  useRemoveItemsFromSalesMutation,
} = salesApi;
