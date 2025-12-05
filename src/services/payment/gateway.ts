import { ISingleStoreTopLevel, IStoreTopLevel } from "@/types/storeTypes";
import { api } from "..";
import { IPaymentGatewayResponse, ISinglePaymentGatewayResponse } from "@/types/paymentTypes";

interface CreatePaymentGatewayType {
  name: string;
  logo?: null | string;
  is_disabled?: number; // 0 or 1
  mode?: string;
  is_default?: number; // 0 or 1
}

export const paymentGatewayApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllPaymentGateways: builder.query<
      IPaymentGatewayResponse,
      {
        sort?: string;
        q?: string;
        paginate?: boolean;
        per_page?: number;
        page?: number;
      }
    >({
      query: ({
        sort,
        q,
        paginate,
        per_page,
        page,
      }: {
        sort?: string;
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
        if (sort) params.sort = sort;

        return {
          url: "payment-gateways",
          method: "GET",
          params,
          providesTags: ["payment-gateways"],
        };
      },
    }),
    getSinglePaymentGateway: builder.query<
      ISinglePaymentGatewayResponse,
      {
        id: string;
      }
    >({
      query: ({ id }: { id: string }) => {
        const params: any = {};
        return {
          url: `payment-gateways/${id}`,
          method: "GET",

          providesTags: ["payment-gateways"],
        };
      },
    }),

    updatePaymentGateway: builder.mutation<
      any,
      { id: string; body: CreatePaymentGatewayType }
    >({
      query: ({ id, body }) => ({
        url: `payment-gateways/${id}`,
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["payment-gateways"],
      }),
    }),
  }),
});

export const {
  useGetAllPaymentGatewaysQuery,
  useGetSinglePaymentGatewayQuery,
  useUpdatePaymentGatewayMutation,
} = paymentGatewayApi;
