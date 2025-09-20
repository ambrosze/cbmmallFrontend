import { IColourTopLevel, ISingleColoursTopLevel } from "@/types/colourTypes";
import { api } from ".";


interface CreateColourType {
  name: string;
  hex: string;
}
export const coloursApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllColours: builder.query<
      IColourTopLevel,
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
          url: "colours",
          method: "GET",
          params,
          providesTags: ["colours"],
        };
      },
    }),
    getSingleColours: builder.query<
      ISingleColoursTopLevel,
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
          url: `colours/${id}`,
          method: "GET",

          providesTags: ["colours"],
        };
      },
    }),
    createColour: builder.mutation<any, CreateColourType>({
      query: (body) => ({
        url: "colours",
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["colours"],
      }),
    }),
    updateColour: builder.mutation<any, { id: string; body: CreateColourType }>(
      {
        query: ({ id, body }) => ({
          url: `colours/${id}`,
          method: "PUT",
          body: body,
          headers: {
            "Content-Type": "application/json",
          },
          invalidatesTags: ["colours"],
        }),
      }
    ),
    deleteColour: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `colours/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["colours"],
      }),
    }),
  }),
});

export const {
  useGetAllColoursQuery,
  useGetSingleColoursQuery,
  useCreateColourMutation,
  useUpdateColourMutation,
  useDeleteColourMutation,
} = coloursApi;
