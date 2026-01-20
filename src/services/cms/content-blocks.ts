import {
  IContentBlocksTopLevel,
  ISingleContentBlockTopLevel,
} from "@/types/contentBlockTypes";
import { api } from "..";

interface CreateContentBlockType {
  title: string;
  description?: null | string;
  short_description: string;
  image: null | string;
  is_active: number; // boolean represented as 0 or 1
  link_url: string;
  link_text: string;
}
interface CreateContentGroupBlockType {
  content_blocks: {
    id?: string;
    title: string;
    description?: string | null;
    short_description?: string | null;
    image?: string | null;
    is_active?: number;
    link_url?: string;
    link_text?: string;
  }[];
}
export const contentBlocksApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getContentBlocksList: builder.query<
      IContentBlocksTopLevel,
      {
        q?: string;
        sort?: string;
        paginate?: boolean;
        per_page?: number;
        page?: number;
        filter?: {
          [key: string]: any;
        };
      }
    >({
      query: ({
        sort,
        q,
        paginate,
        per_page,
        page,
        filter,
      }: {
        sort?: string;
        q?: string;
        paginate?: boolean;
        per_page?: number;
        page?: number;
        filter?: {
          [key: string]: any;
        };
      }) => {
        const params: any = {};
        if (q) params.q = q;

        if (paginate !== undefined) params.paginate = paginate;
        if (per_page) params.per_page = per_page;
        if (page) params.page = page;
        if (sort) params.sort = sort;
        if (filter) {
          Object.keys(filter).forEach((key) => {
            if (
              filter[key] !== undefined &&
              filter[key] !== null &&
              filter[key] !== ""
            ) {
              params[`filter[${key}]`] = filter[key];
            }
          });
        }

        return {
          url: "content-blocks",
          method: "GET",
          params,
          providesTags: ["content-blocks"],
        };
      },
    }),
    getSingleContentBlock: builder.query<
      ISingleContentBlockTopLevel,
      {
        id: string;
      }
    >({
      query: ({ id }: { id: string }) => {
        const params: any = {};
        return {
          url: `content-blocks/${id}`,
          method: "GET",

          providesTags: ["content-blocks"],
        };
      },
    }),
    createBulkContentBlock: builder.mutation<any, CreateContentGroupBlockType>({
      query: (body) => ({
        url: "content-blocks/bulk-update",
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["content-blocks"],
      }),
    }),
    updateContentBlock: builder.mutation<
      any,
      { id: string; body: CreateContentBlockType }
    >({
      query: ({ id, body }) => ({
        url: `content-blocks/${id}`,
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["content-blocks"],
      }),
    }),
    deleteImageContentBlock: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `content-blocks/${id}/image`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["content-blocks"],
      }),
    }),
  }),
});

export const {
  useGetContentBlocksListQuery,
  useGetSingleContentBlockQuery,
  useCreateBulkContentBlockMutation,
  useUpdateContentBlockMutation,
  useDeleteImageContentBlockMutation,
} = contentBlocksApi;
