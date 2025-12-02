import { IRolesPermissionsResponse, IRolesTopLevel, ISingleRolesTopLevel } from "@/types/roleTypes";
import { api } from "..";

interface CreateRolesType {
  name: string;
}
export const permissionsApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllPermissions: builder.query<
      IRolesPermissionsResponse,
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

        if (paginate !== undefined) params.paginate = paginate;
        if (per_page) params.per_page = per_page;
        if (page) params.page = page;
        if (sort) params.sort = sort;
        if (include) params.include = include;

        return {
          url: "permissions",
          method: "GET",
          params,
          providesTags: ["permissions"],
        };
      },
    }),
    getSinglePermissions: builder.query<
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
          url: `permissions/${id}`,
          method: "GET",

          providesTags: ["permissions"],
        };
      },
    }),
  }),
});

export const { useGetAllPermissionsQuery, useGetSinglePermissionsQuery } =
  permissionsApi;
