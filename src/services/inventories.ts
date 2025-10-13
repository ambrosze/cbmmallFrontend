import { InventoryTopLevel } from "@/types/inventoryListType";
import { api } from ".";

export const inventoryApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllInventory: builder.query<
      InventoryTopLevel,
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
          url: "inventories",
          method: "GET",
          params,
          providesTags: ["inventories"],
        };
      },
    }),
    getSingleInventory: builder.query<
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
        id: string; //inventory id
        include?: string; //parentCategory,subCategories
      }) => {
        const params: any = {};

        if (include) params.include = include;
        return {
          url: `inventories/${id}`,
          method: "GET",

          providesTags: ["inventories"],
        };
      },
    }),
    updateInventoryQuantity: builder.mutation<
      any,
      {
        id: string;
        body: {
          quantity?: number;
          serial_number?: string;
          batch_number?: string;
        };
      }
    >({
      query: ({ id, body }) => ({
        url: `inventories/${id}`,
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["inventories"],
      }),
    }),
  }),
});

export const {
  useGetAllInventoryQuery,
  useGetSingleInventoryQuery,
  useUpdateInventoryQuantityMutation,
} = inventoryApi;
