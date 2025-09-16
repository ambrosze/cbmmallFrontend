import { ISingleStaffTopLevel, IStaffTopLevel } from "@/types/staffTypes";
import { api } from "..";

interface CreateStaffType {
  first_name: string;
  last_name?: string;
  middle_name?: string;
  email: string;
  phone_number: string;
  store_id: string;
  role_id?: string;
}
export const staffApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllStaff: builder.query<
      IStaffTopLevel,
      {
        sort?: string;
        q?: string;
        paginate?: boolean;
        per_page?: number;
        page?: number;
        include?: string;
        filter?: { is_store_manager?: number | string };
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
        filter?: { is_store_manager?: number | string };
      }) => {
        const params: any = {};
        if (q) params.q = q;
        if (include) params.include = include;

        if (paginate !== undefined) params.paginate = paginate;
        if (per_page) params.per_page = per_page;
        if (page) params.page = page;
        if (sort) params.sort = sort;
        if (filter?.is_store_manager) {
          params["filter[is_store_manager]"] = filter.is_store_manager;
        }
        return {
          url: "admin/staff",
          method: "GET",
          params,
          providesTags: ["staff"],
        };
      },
    }),
    getSingleStaff: builder.query<
      ISingleStaffTopLevel,
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
          url: `/admin/staff/${id}`,
          method: "GET",

          providesTags: ["staff"],
        };
      },
    }),
    createStaff: builder.mutation<any, CreateStaffType>({
      query: (body) => ({
        url: "admin/staff",
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["staff"],
      }),
    }),
    updateStaff: builder.mutation<any, { id: string; body: CreateStaffType }>({
      query: ({ id, body }) => ({
        url: `admin/staff/${id}`,
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["staff"],
      }),
    }),
    deleteStaff: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `admin/staff/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["staff"],
      }),
    }),
  }),
});

export const {
  useGetAllStaffQuery,
  useGetSingleStaffQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} = staffApi;
