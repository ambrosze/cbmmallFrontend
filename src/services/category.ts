import {
  CategoryTopLevel,
  ISingleCategoryTopLevel,
} from "@/types/categoryTypes";
import { api } from ".";

interface CreateCategoryType {
  name: string;
  parent_category_id?: null | string;
  image?: null | string;
}
export const categoryApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllCategory: builder.query<
      CategoryTopLevel,
      {
        sort?: string;
        q?: string;
        paginate?: boolean;
        per_page?: number;
        page?: number;
        include?: string; //parentCategory,subCategories
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
          url: "categories",
          method: "GET",
          params,
          providesTags: ["category"],
        };
      },
    }),
    getSingleCategory: builder.query<
      ISingleCategoryTopLevel,
      {
        id: string;
        include?: string;
      }
    >({
      query: ({
        id,
        include,
      }: {
        id: string; //category_id
        include?: string; //parentCategory,subCategories
      }) => {
        const params: any = {};

        if (include) params.include = include;
        return {
          url: `categories/${id}`,
          method: "GET",

          providesTags: ["category"],
        };
      },
    }),
    createCategory: builder.mutation<any, CreateCategoryType>({
      query: (body) => ({
        url: "categories",
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["category"],
      }),
    }),
    updateCategory: builder.mutation<
      any,
      { id: string; body: CreateCategoryType }
    >({
      query: ({ id, body }) => ({
        url: `categories/${id}`,
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["category"],
      }),
    }),
    deleteCategory: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `categories/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["category"],
      }),
    }),
  }),
});

export const {
  useGetAllCategoryQuery,
  useGetSingleCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
