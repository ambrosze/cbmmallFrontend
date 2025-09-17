import { IAttributesTopLevel, ISingleAttributeValueTopLevel } from "@/types/attributeTypes";
import { api } from "..";

interface CreateAttributesType {
  name: string;
  type: "text" | "number" | "date" | "color" | "image";
  values: string[]; // Array of value IDs
}
export const attributesApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllAttributes: builder.query<
      IAttributesTopLevel,
      {
        sort?: string;

        q?: string;
        paginate?: boolean;
        per_page?: number;
        page?: number;
        include?: string;
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
        include,
        filter,
      }: {
        sort?: string;
        q?: string;
        paginate?: boolean;
        per_page?: number;
        page?: number;
        include?: string;
        filter?: {
          [key: string]: any;
        };
      }) => {
        const params: any = {};
        if (q) params.q = q;
        if (include) params.include = include;

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
          url: "attributes",
          method: "GET",
          params,
          providesTags: ["attributes"],
        };
      },
    }),
    getSingleAttributes: builder.query<
      ISingleAttributeValueTopLevel,
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
        include?: string; //values
      }) => {
        const params: any = {};

        if (include) params.include = include;
        return {
          url: `attributes/${id}`,
          method: "GET",

          providesTags: ["attributes"],
        };
      },
    }),
    createAttributes: builder.mutation<any, CreateAttributesType>({
      query: (body) => ({
        url: "attributes",
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["attributes"],
      }),
    }),
    updateAttributes: builder.mutation<
      any,
      { id: string; body: CreateAttributesType }
    >({
      query: ({ id, body }) => ({
        url: `attributes/${id}`,
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["attributes"],
      }),
    }),
    deleteAttributes: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `attributes/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["attributes"],
      }),
    }),
  }),
});

export const {
  useGetAllAttributesQuery,
  useGetSingleAttributesQuery,
  useCreateAttributesMutation,
  useUpdateAttributesMutation,
  useDeleteAttributesMutation,
} = attributesApi;
