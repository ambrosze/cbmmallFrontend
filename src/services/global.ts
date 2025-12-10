import { ICountryTopLevel } from "@/types/global";
import { StateTopLevel } from "@/types/globalTypes";
import { api } from ".";
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
          | "OrderStatus"
          | "PaymentMode"
          | "TimePeriod"
          | "DeliveryMethod";
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
      ICountryTopLevel,
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
          url: `countries?fields=iso2,iso3,phone_code,emoji&filters[iso2]=NG`,
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
        if (append) params.append = append;
        if (paginate !== undefined) params.paginate = paginate;
        if (per_page) params.per_page = per_page;
        if (sort) params.sort = sort;
        if (filter?.country_id) {
          params["filters[country_id]"] = filter.country_id;
        }
        return {
          url: "states",
          method: "GET",
          params,
          providesTags: ["country"],
        };
      },
    }),
    getAllCities: builder.query<
      StateTopLevel,
      {
        include?: string;
        append?: string;
        paginate?: boolean;
        per_page?: number;
        sort?: string;
        filter?: { country_id?: number | string; state_id?: number | string };
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
        filter?: { country_id?: number | string; state_id?: number | string };
      }) => {
        const params: any = {};
        if (include) params.include = include;
        if (append) params.append = append;
        if (paginate !== undefined) params.paginate = paginate;
        if (per_page) params.per_page = per_page;
        if (sort) params.sort = sort;
        if (filter?.country_id) {
          params["filters[country_id]"] = filter.country_id;
        }
        if (filter?.state_id) {
          params["filters[state_id]"] = filter.state_id;
        }
        return {
          url: "cities",
          method: "GET",
          params,
          providesTags: ["country"],
        };
      },
    }),
  }),
});

export const {
  useGetAllEnumsQuery,
  useGetAllCountriesQuery,
  useGetAllStatesQuery,
  useGetAllCitiesQuery,
} = authApi;
