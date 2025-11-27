
import { UserProfileTopLevel } from "@/types/userProfileTypes";
import { api } from ".";
import { CountryTopLevel, StateTopLevel } from "@/types/globalTypes";
export interface IEnumsResponse {
  enum: string;
  values: IEnumsValue[];
}

export interface IEnumsValue {
  name: string;
  value: string;
  label: string;
}

export const authApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getUserProfile: builder.query<
      UserProfileTopLevel,
      {
        include?: string;
        append?: string;
      }
    >({
      query: ({ include, append }: { include?: string; append?: string }) => {
        const params: any = {};
        if (include) params.include = include;
        if (append) params.append = append;
        return {
          url: "user/profile",
          method: "GET",
          params,
          providesTags: ["user"],
        };
      },
    }),
    getAllEnums: builder.query<
      IEnumsResponse,
      {
        enum?:
          | "NotificationLevel"
          | "AttributeType"
          | "PaymentMethod"
          | "SaleChannel"
          | "ScrapeType"
          | "ConditionStatus"
          | "Status"
          | "InventoryStatus"
          | "OrderStatus";
      }
    >({
      query: ({ enum: enumValue }: { enum?: string }) => {
        const params: any = {};
        if (enumValue) params.enum = enumValue;
        return {
          url: "enums",
          method: "GET",
          params,
          providesTags: ["enum"],
        };
      },
    }),
    getAllCountries: builder.query<
      CountryTopLevel,
      {
        paginate?: boolean;
        per_page?: number;
        sort?: string;
      }
    >({
      query: ({
        paginate,
        per_page,
        sort,
      }: {
        paginate?: boolean;
        per_page?: number;
        sort?: string;
      }) => {
        const params: any = {};
        if (per_page) params.per_page = per_page;
        if (sort) params.sort = sort;
        if (paginate !== undefined) params.paginate = paginate;
        return {
          url: `countries`,
          method: "GET",
          params,
          providesTags: ["country"],
        };
      },
    }),
    getAllStates: builder.query<
      StateTopLevel,
      {
        include?: string;
        append?: string;
        paginate?: boolean;
        per_page?: number;
        sort?: string;
        filter?: { country_id?: number | string };
      }
    >({
      query: ({
        include,
        append,
        paginate,
        per_page,
        sort,
        filter,
      }: {
        include?: string;
        append?: string;
        paginate?: boolean;
        per_page?: number;
        sort?: string;
        filter?: { country_id?: number | string };
      }) => {
        const params: any = {};
        if (include) params.include = include;
        if (append) params.search = append;
        if (paginate !== undefined) params.paginate = paginate;
        if (per_page) params.per_page = per_page;
        if (sort) params.sort = sort;
        if (filter?.country_id) {
          params["filter[country_id]"] = filter.country_id;
        }
        return {
          url: "states",
          method: "GET",
          params,
          providesTags: ["country"],
        };
      },
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useGetAllEnumsQuery,
  useGetAllCountriesQuery,
  useGetAllStatesQuery,
} = authApi;
