import { ISingleStoreTopLevel, IStoreTopLevel } from "@/types/storeTypes";
import { api } from "..";

interface CreateStoreType {
  name: string;
  address?: string;
  manager_staff_id?: string;
  is_headquarters: number;
}
export const storeApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllStores: builder.query<
      IStoreTopLevel,
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
          url: "admin/stores",
          method: "GET",
          params,
          providesTags: ["stores"],
        };
      },
    }),
    getSingleStore: builder.query<
      ISingleStoreTopLevel,
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
          url: `/admin/stores/${id}`,
          method: "GET",

          providesTags: ["stores"],
        };
      },
    }),
    createStore: builder.mutation<any, CreateStoreType>({
      query: (body) => ({
        url: "admin/stores",
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["stores"],
      }),
    }),
    updateStore: builder.mutation<any, { id: string; body: CreateStoreType }>({
      query: ({ id, body }) => ({
        url: `admin/stores/${id}`,
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["stores"],
      }),
    }),
    deleteStore: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `admin/stores/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["stores"],
      }),
    }),
  }),
});

export const {
  useGetAllStoresQuery,
  useGetSingleStoreQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
} = storeApi;
