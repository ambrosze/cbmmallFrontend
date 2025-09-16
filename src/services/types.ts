
import { ISingleAttributeTopLevel, ITypesTopLevel } from "@/types/attributeTypes";
import { api } from ".";

interface CreateTypesType {
  name: string;
  parent_id?: string;
}
export const typesApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllTypes: builder.query<
      ITypesTopLevel,
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
          url: "types",
          method: "GET",
          params,
          providesTags: ["types"],
        };
      },
    }),
    getSingleTypes: builder.query<
      ISingleAttributeTopLevel,
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
          url: `types/${id}`,
          method: "GET",

          providesTags: ["types"],
        };
      },
    }),
    createTypes: builder.mutation<any, CreateTypesType>({
      query: (body) => ({
        url: "types",
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["types"],
      }),
    }),
    updateTypes: builder.mutation<
      any,
      { id: string; body: CreateTypesType }
    >({
      query: ({ id, body }) => ({
        url: `types/${id}`,
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["types"],
      }),
    }),
    deleteTypes: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `types/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["types"],
      }),
    }),
  }),
});

export const {
  useGetAllTypesQuery,
  useGetSingleTypesQuery,
  useCreateTypesMutation,
  useUpdateTypesMutation,
  useDeleteTypesMutation,
} = typesApi;
