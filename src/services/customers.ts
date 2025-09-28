import { ISingleStoreTopLevel, IStoreTopLevel } from "@/types/storeTypes";
import { api } from ".";


interface CreateCustomerType {
  name: string;
  email: string;
  phone_number: string;
  country: string;
  city: string;
  address: string;
}

export const customerApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllCustomers: builder.query<
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
          url: "customers",
          method: "GET",
          params,
          providesTags: ["customers"],
        };
      },
    }),
    getSingleCustomer: builder.query<
      ISingleStoreTopLevel,
      {
        id: string;
      }
    >({
      query: ({ id }: { id: string }) => {
        const params: any = {};
        return {
          url: `customers/${id}`,
          method: "GET",

          providesTags: ["customers"],
        };
      },
    }),
    createCustomer: builder.mutation<any, CreateCustomerType>({
      query: (body) => ({
        url: "customers",
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["customers"],
      }),
    }),
    updateCustomer: builder.mutation<
      any,
      { id: string; body: CreateCustomerType }
    >({
      query: ({ id, body }) => ({
        url: `customers/${id}`,
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["customers"],
      }),
    }),
    deleteCustomer: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `customers/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["customers"],
      }),
    }),
  }),
});

export const {
  useGetAllCustomersQuery,
  useGetSingleCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;
