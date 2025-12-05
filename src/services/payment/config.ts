import { ISingleStoreTopLevel, IStoreTopLevel } from "@/types/storeTypes";
import { api } from "..";


interface CreatePaymentConfigType {
  name: string;
  email: string;
  phone_number: string;
  country: string;
  city: string;
  address: string;
  payment_gateway_id?: string;
  mode?: 'test' | 'live';
  credentials?: {
    secret_key?: string;
    public_key?: string;
    encryption_key?: string;
    secret_hash?: string;
    [key: string]: string | undefined;
  };
  settings?: {
    merchant_email?: string;
    [key: string]: any;
  };
}

export const paymentConfigApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllPaymentConfigs: builder.query<
      IStoreTopLevel,
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
          url: "payment-gateway-configs",
          method: "GET",
          params,
          providesTags: ["payment-gateway-configs"],
        };
      },
    }),
    getSinglePaymentConfig: builder.query<
      ISingleStoreTopLevel,
      {
        id: string;
      }
    >({
      query: ({ id }: { id: string }) => {
        const params: any = {};
        return {
          url: `payment-gateway-configs/${id}`,
          method: "GET",

          providesTags: ["payment-gateway-configs"],
        };
      },
    }),
    createPaymentConfig: builder.mutation<any, CreatePaymentConfigType>({
      query: (body) => ({
        url: "payment-gateway-configs",
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["payment-gateway-configs"],
      }),
    }),
    updatePaymentConfig: builder.mutation<
      any,
      { id: string; body: CreatePaymentConfigType }
    >({
      query: ({ id, body }) => ({
        url: `payment-gateway-configs/${id}`,
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["payment-gateway-configs"],
      }),
    }),
    deletePaymentConfig: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `payment-gateway-configs/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["payment-gateway-configs"],
      }),
    }),
  }),
});

export const {
  useGetAllPaymentConfigsQuery,
  useGetSinglePaymentConfigQuery,
  useCreatePaymentConfigMutation,
  useUpdatePaymentConfigMutation,
  useDeletePaymentConfigMutation,
} = paymentConfigApi;
