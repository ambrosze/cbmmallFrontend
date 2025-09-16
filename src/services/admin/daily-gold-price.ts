import {
  IDailyGoldPriceTopLevel,
  IDailyGoldSinglePriceTopLevel,
} from "@/types/dailyGoldPriceTypes";
import { api } from "..";

interface CreateDailyGoldPricesType {
  category_id: string;
  price_per_gram: string;
}
export const dailyGoldPricesApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllDailyGoldPrices: builder.query<
      IDailyGoldPriceTopLevel,
      {
        q?: string;
        paginate?: boolean;
        per_page?: number;
        page?: number;
        sort?: string;
        include?: string;
        filter?: {
          period?: string;
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
          period?: string;
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
          url: "admin/daily-gold-prices",
          method: "GET",
          params,
          providesTags: ["dailyGoldPrices"],
        };
      },
    }),
    getSingleDailyGoldPrices: builder.query<
      IDailyGoldSinglePriceTopLevel,
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
          url: `admin/daily-gold-prices/${id}`,
          method: "GET",

          providesTags: ["dailyGoldPrices"],
        };
      },
    }),
    createDailyGoldPrices: builder.mutation<any, CreateDailyGoldPricesType>({
      query: (body) => ({
        url: "admin/daily-gold-prices",
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["dailyGoldPrices"],
      }),
    }),
    updateDailyGoldPrices: builder.mutation<
      any,
      { daily_gold_price_id: string; body: CreateDailyGoldPricesType }
    >({
      query: ({ daily_gold_price_id, body }) => ({
        url: `admin/daily-gold-prices/${daily_gold_price_id}`,
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["dailyGoldPrices"],
      }),
    }),
    deleteDailyGoldPrices: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `admin/daily-gold-prices/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["dailyGoldPrices"],
      }),
    }),
  }),
});

export const {
  useGetAllDailyGoldPricesQuery,
  useGetSingleDailyGoldPricesQuery,
  useCreateDailyGoldPricesMutation,
  useUpdateDailyGoldPricesMutation,
  useDeleteDailyGoldPricesMutation,
} = dailyGoldPricesApi;
