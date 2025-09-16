import { SummaryTopLevel } from "@/types/dashboardSummary";
import { api } from ".";

export const dashboardSummaryApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<SummaryTopLevel, any>({
      query: ({}: {}) => {
        return {
          url: "dashboard/summary",
          method: "GET",

          providesTags: ["DashboardSummary"],
        };
      },
    }),
  }),
});

export const { useGetDashboardSummaryQuery } = dashboardSummaryApi;
