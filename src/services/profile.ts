import { IColourTopLevel } from "@/types/colourTypes";
import { api } from ".";
import { IPermissionsResponse } from "@/types/ProfileTYpes";

interface CreateProfileType {
  first_name: string;
  middle_name: string;
  last_name: string;
  phone_number: string;
  profile_photo: string;
}
export const userProfileApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllProfile: builder.query<
      IPermissionsResponse,
      {
        sort?: string;
        include?: string;
        append?: string;
      }
    >({
      query: ({
        sort,
        include,
        append,
      }: {
        sort?: string;
        include?: string;
        append?: string;
      }) => {
        const params: any = {};
        if (include) params.include = include;
        if (sort) params.sort = sort;
        if (append) params.append = append;

        return {
          url: "user/profile",
          method: "GET",
          params,
          providesTags: ["profile"],
        };
      },
    }),

    createProfile: builder.mutation<any, { body: CreateProfileType }>({
      query: ({ body }) => ({
        url: `user/profile`,
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["profile"],
      }),
    }),
  }),
});

export const { useGetAllProfileQuery, useCreateProfileMutation } =
  userProfileApi;
