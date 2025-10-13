import { IRolesTopLevel, ISingleRolesTopLevel } from "@/types/roleTypes";
import { api } from "..";

interface CreateRolesType {
  name: string;
}
export const rolesApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllRoles: builder.query<
      IRolesTopLevel,
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
          url: "roles",
          method: "GET",
          params,
          providesTags: ["roles"],
        };
      },
    }),
    getSingleRoles: builder.query<
      ISingleRolesTopLevel,
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
          url: `roles/${id}`,
          method: "GET",

          providesTags: ["roles"],
        };
      },
    }),
    createRoles: builder.mutation<any, CreateRolesType>({
      query: (body) => ({
        url: "roles",
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["roles"],
      }),
    }),
    updateRoles: builder.mutation<any, { id: string; body: CreateRolesType }>({
      query: ({ id, body }) => ({
        url: `roles/${id}`,
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["roles"],
      }),
    }),
    deleteRoles: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `roles/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["roles"],
      }),
    }),
  }),
});

export const {
  useGetAllRolesQuery,
  useGetSingleRolesQuery,
  useCreateRolesMutation,
  useUpdateRolesMutation,
  useDeleteRolesMutation,
} = rolesApi;
