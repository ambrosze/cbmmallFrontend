import { IDeliveryLocationListResponse } from "@/types/deliveryLocations";
import { ISingleStoreTopLevel } from "@/types/storeTypes";
import { api } from "..";

interface CreateDeliveryType {
  store_id: string;
  country_id: string;
  state_id: string;
  city_id: string;
  delivery_fee: number;
  estimated_delivery_days: number;
}

export const deliveryLocationsApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllDeliveryLocations: builder.query<
      IDeliveryLocationListResponse,
      {
        sort?: string;
        q?: string;
        paginate?: boolean;
        per_page?: number;
        page?: number;
        include?: string; //country,state,city
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
        include?: string; //country,state,city
      }) => {
        const params: any = {};
        if (q) params.q = q;
        if (paginate !== undefined) params.paginate = paginate;
        if (per_page) params.per_page = per_page;
        if (page) params.page = page;
        if (sort) params.sort = sort;
        if (include) params.include = include;

        return {
          url: "delivery-locations",
          method: "GET",
          params,
          providesTags: ["delivery-locations"],
        };
      },
    }),
    getSingleDeliveryLocation: builder.query<
      ISingleStoreTopLevel,
      {
        id: string;
      }
    >({
      query: ({ id }: { id: string }) => {
        const params: any = {};
        return {
          url: `delivery-locations/${id}`,
          method: "GET",

          providesTags: ["delivery-locations"],
        };
      },
    }),
    createDeliveryLocation: builder.mutation<any, CreateDeliveryType>({
      query: (body) => ({
        url: "delivery-locations",
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["delivery-locations"],
      }),
    }),
    updateDeliveryLocation: builder.mutation<
      any,
      { id: string; body: CreateDeliveryType }
    >({
      query: ({ id, body }) => ({
        url: `delivery-locations/${id}`,
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["delivery-locations"],
      }),
    }),
    deleteDeliveryLocations: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `delivery-locations/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["delivery-locations"],
      }),
    }),
  }),
});

export const {
  useGetAllDeliveryLocationsQuery,
  useGetSingleDeliveryLocationQuery,
  useCreateDeliveryLocationMutation,
  useUpdateDeliveryLocationMutation,
  useDeleteDeliveryLocationsMutation,
} = deliveryLocationsApi;
