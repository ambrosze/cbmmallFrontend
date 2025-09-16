import { IColourTopLevel } from "@/types/colourTypes";
import { api } from ".";

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
      IColourTopLevel,
      {
        sort?: string;
        include?: string;
      }
    >({
      query: ({ sort, include }: { sort?: string; include?: string }) => {
        const params: any = {};
        if (include) params.include = include;
        if (sort) params.sort = sort;

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
