import { InventoryItemTopLevel } from "@/types/InventoryItemTypes";
import { api } from ".";

interface CreateInventoryScrapeItemsType {
  inventory_id?: string; // ID of the inventory item
  quantity: number; // Quantity of the item
  customer?: {
    id?: string; // Optional customer ID
    name?: string; // Optional customer name
    phone_number?: string; // Optional customer phone number
    email?: string; // Optional customer email
  };
  type?: "returned" | "damaged"; // Type of the inventory scrape
  comments?: string; // Optional comments about the inventory scrape
}
export const InventoryScrapeItemsApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllInventoryScrapeItems: builder.query<
      InventoryItemTopLevel,
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
          url: "inventory/scrapes",
          method: "GET",
          params,
          providesTags: ["inventoryScrapesItems"],
        };
      },
    }),
    getSingleInventoryScrapeItems: builder.query<
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
          url: `inventory/scrapes/${id}`,
          method: "GET",

          providesTags: ["InventoryScrapeItems"],
        };
      },
    }),
    createInventoryScrapeItems: builder.mutation<
      any,
      CreateInventoryScrapeItemsType
    >({
      query: (body) => ({
        url: "inventory/scrapes",
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["InventoryScrapeItems"],
      }),
    }),
    addSingleScrapeItemToInventory: builder.mutation<
      any,
      {
        item_id: string;
        body: {
          quantity: number;
        };
      }
    >({
      query: ({ item_id, body }) => ({
        url: `inventory/scrapes/${item_id}/add-to-inventory`,
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["InventoryScrapeItems"],
      }),
    }),
  }),
});

export const {
  useGetAllInventoryScrapeItemsQuery,
  useGetSingleInventoryScrapeItemsQuery,
  useCreateInventoryScrapeItemsMutation,
  useAddSingleScrapeItemToInventoryMutation,
} = InventoryScrapeItemsApi;
