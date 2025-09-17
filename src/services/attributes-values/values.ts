import { ISingleAttributeValueTopLevel } from "@/types/attributeTypes";
import { IAttributesValuesTopLevel } from "@/types/attributeValuesTypes";
import { api } from "..";

interface CreateAttributeValueType {
  value: string; // Value of the attribute value
}
export const attributeValuesApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllAttributeValues: builder.query<
      IAttributesValuesTopLevel,
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
        include?: string; //attribute
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
          url: "attribute-values",
          method: "GET",
          params,
          providesTags: ["attribute-values"],
        };
      },
    }),
    getSingleAttributeValue: builder.query<
      ISingleAttributeValueTopLevel,
      {
        id: string; //attribute_value_id
        include?: string;
      }
    >({
      query: ({
        id,
        include,
      }: {
        id: string; //attribute_value_id
        include?: string; //cryptoNetwork
      }) => {
        const params: any = {};

        if (include) params.include = include;
        return {
          url: `attribute-values/${id}`,
          method: "GET",

          providesTags: ["attribute-values"],
        };
      },
    }),
    createAttributeValue: builder.mutation<any, CreateAttributeValueType>({
      query: (body) => ({
        url: "attribute-values",
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["attribute-values"],
      }),
    }),
    updateAttributeValue: builder.mutation<
      any,
      { id: string; body: CreateAttributeValueType }
    >({
      query: ({ id, body }) => ({
        url: `attribute-values/${id}`,
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["attribute-values"],
      }),
    }),
    deleteAttributeValue: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `attribute-values/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["attribute-values"],
      }),
    }),
  }),
});

export const {
  useGetSingleAttributeValueQuery,
  useGetAllAttributeValuesQuery,
  useCreateAttributeValueMutation,
  useUpdateAttributeValueMutation,
  useDeleteAttributeValueMutation,
} = attributeValuesApi;
