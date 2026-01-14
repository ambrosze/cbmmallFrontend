import {
  SingleStockTransferTopLevel,
  StockTransferTopLevel,
} from "@/types/StockTransferTypes";
import { api } from ".";

interface CreateStockTransferType {
  comment?: string; // nullable|string|max:1000
  to_store_id: string; // required|string|max:191|exists:stores,id
  driver_name?: string; // nullable|string|max:191
  driver_phone_number?: string; // nullable|string|max:191
  stock_transfer_inventories: AddItemToStockTransferType[]; // required|array|min:1
}
interface AddItemToStockTransferType {
  inventory_id: string; // nullable|string|max:191|exists:inventory,id
  quantity: number;
}
export const stockTransferApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllStockTransfer: builder.query<
      StockTransferTopLevel,
      {
        sort?: string;
        q?: string;
        paginate?: boolean;
        per_page?: number;
        page?: number;
        include?: string;
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
          url: "stock-transfers",
          method: "GET",
          params,
          providesTags: ["stockTransfer"],
        };
      },
    }),
    getSingleStockTransfer: builder.query<
      SingleStockTransferTopLevel,
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
          url: `stock-transfers/${id}`,
          method: "GET",
          params,
          providesTags: ["stockTransfer"],
        };
      },
    }),
    createStockTransfer: builder.mutation<any, CreateStockTransferType>({
      query: (body) => ({
        url: "stock-transfers",
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["stockTransfer"],
      }),
    }),
    updateStockTransfer: builder.mutation<
      any,
      { id: string; body: CreateStockTransferType }
    >({
      query: ({ id, body }) => ({
        url: `stock-transfers/${id}`,
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["stockTransfer"],
      }),
    }),

    dispatchStockTransfer: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `stock-transfers/${id}/dispatch`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["stockTransfer"],
      }),
    }),
    acceptStockTransfer: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `stock-transfers/${id}/accept`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["stockTransfer"],
      }),
    }),
    rejectStockTransfer: builder.mutation<
      any,
      {
        id: string;
        body: {
          rejection_reason: string;
        };
      }
    >({
      query: ({ id, body }) => ({
        url: `stock-transfers/${id}/reject`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
        invalidatesTags: ["stockTransfer"],
      }),
    }),

    deleteSingleItemStockTransfer: builder.mutation<
      any,
      { stock_transfer_id: string; id: string }
    >({
      query: ({ stock_transfer_id, id }) => ({
        url: `stock-transfers/${stock_transfer_id}/stock-transfer-inventories/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["stockTransfer"],
      }),
    }),
    deleteStockTransfer: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `stock-transfers/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["stockTransfer"],
      }),
    }),
    removeItemsFromStockTransfer: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `stockTransfer/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["stockTransfer"],
      }),
    }),
  }),
});

export const {
  useGetAllStockTransferQuery,
  useGetSingleStockTransferQuery,
  useCreateStockTransferMutation,
  useUpdateStockTransferMutation,
  useDeleteStockTransferMutation,
  useDispatchStockTransferMutation,
  useAcceptStockTransferMutation,
  useRejectStockTransferMutation,
  useDeleteSingleItemStockTransferMutation,
  useRemoveItemsFromStockTransferMutation,
} = stockTransferApi;
