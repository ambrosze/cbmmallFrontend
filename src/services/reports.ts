import { InventoryTopLevel } from "@/types/inventoryListType";
import { ICustomersReportResponse } from "@/types/reports/CustomersReport";
import { InventoryReportResponse } from "@/types/reports/InventoryReport";
import { IOrdersReportResponse } from "@/types/reports/OrdersReport";
import { ISalesReportResponse } from "@/types/reports/SalesReport";
import { IStaffPerformanceReportResponse } from "@/types/reports/StaffPerformanceReport";
import { api } from ".";
import { IProductPerformanceReportResponse } from "@/types/reports/ProductPerformanceReport";
import { IRevenueAnalyticsReportResponse } from "@/types/reports/RevenueAnalyticsReport";
import { IProfitAnalysisReportResponse } from "@/types/reports/ProfitAnalysisReport";

export const reportsApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllSalesReport: builder.query<
      ISalesReportResponse,
      {
        filter?: {
          [key: string]: any;
        };
      }
    >({
      query: ({
        filter,
      }: {
        filter?: {
          [key: string]: any;
        };
      }) => {
        const params: any = {};
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
          url: "reports/sales",
          method: "GET",
          params,
          providesTags: ["reports"],
        };
      },
    }),
    getAllOrdersReport: builder.query<
      IOrdersReportResponse,
      {
        filter?: {
          [key: string]: any;
        };
      }
    >({
      query: ({
        filter,
      }: {
        filter?: {
          [key: string]: any;
        };
      }) => {
        const params: any = {};
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
          url: "reports/orders",
          method: "GET",
          params,
          providesTags: ["reports"],
        };
      },
    }),
    getAllStaffPerformanceReport: builder.query<
      IStaffPerformanceReportResponse,
      {
        filter?: {
          [key: string]: any;
        };
      }
    >({
      query: ({
        filter,
      }: {
        filter?: {
          [key: string]: any;
        };
      }) => {
        const params: any = {};
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
          url: "reports/staff-performance",
          method: "GET",
          params,
          providesTags: ["reports"],
        };
      },
    }),
    getAllCustomersReport: builder.query<
      ICustomersReportResponse,
      {
        filter?: {
          [key: string]: any;
        };
      }
    >({
      query: ({
        filter,
      }: {
        filter?: {
          [key: string]: any;
        };
      }) => {
        const params: any = {};
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
          url: "reports/customers",
          method: "GET",
          params,
          providesTags: ["reports"],
        };
      },
    }),
    getAllInventoryReport: builder.query<
      InventoryReportResponse,
      {
        filter?: {
          [key: string]: any;
        };
      }
    >({
      query: ({
        filter,
      }: {
        filter?: {
          [key: string]: any;
        };
      }) => {
        const params: any = {};
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
          url: "reports/inventory",
          method: "GET",
          params,
          providesTags: ["reports"],
        };
      },
    }),
    getAllProductPerformanceReport: builder.query<
      IProductPerformanceReportResponse,
      {
        filter?: {
          [key: string]: any;
        };
      }
    >({
      query: ({
        filter,
      }: {
        filter?: {
          [key: string]: any;
        };
      }) => {
        const params: any = {};
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
          url: "reports/product-performance",
          method: "GET",
          params,
          providesTags: ["reports"],
        };
      },
    }),
    getAllRevenueAnalyticsReport: builder.query<
      IRevenueAnalyticsReportResponse,
      {
        filter?: {
          [key: string]: any;
        };
      }
    >({
      query: ({
        filter,
      }: {
        filter?: {
          [key: string]: any;
        };
      }) => {
        const params: any = {};
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
          url: "reports/revenue-analytics",
          method: "GET",
          params,
          providesTags: ["reports"],
        };
      },
    }),
    getAllProfitAnalysisReport: builder.query<
      IProfitAnalysisReportResponse,
      {
        filter?: {
          [key: string]: any;
        };
      }
    >({
      query: ({
        filter,
      }: {
        filter?: {
          [key: string]: any;
        };
      }) => {
        const params: any = {};
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
          url: "reports/profit-analysis",
          method: "GET",
          params,
          providesTags: ["reports"],
        };
      },
    }),
  }),
});

export const {
  useGetAllSalesReportQuery,
  useGetAllOrdersReportQuery,
  useGetAllStaffPerformanceReportQuery,
  useGetAllCustomersReportQuery,
  useGetAllInventoryReportQuery,
  useGetAllProductPerformanceReportQuery,
  useGetAllRevenueAnalyticsReportQuery,
  useGetAllProfitAnalysisReportQuery,
} = reportsApi;
