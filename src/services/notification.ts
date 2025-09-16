import {
  NotificationSingleTopLevel,
  NotificationTopLevel,
} from "@/types/notificationTypes";
import { api } from ".";

export const notificationApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllNotification: builder.query<
      NotificationTopLevel,
      {
        q?: string;
        page?: number;
        per_page?: number;
        filter?: boolean | string;
      }
    >({
      query: ({
        q,
        page,
        per_page,
        filter,
      }: {
        q?: string;
        page?: number;
        per_page?: number;
        filter?: boolean | string;
      }) => {
        const params: any = {};
        if (q) params.q = q;
        if (page) params.page = page;
        if (per_page) params.per_page = per_page;

        // Handle read filter specifically
        if (filter !== undefined && filter !== "all") {
          params["filter[read]"] = filter;
        }

        return {
          url: "notifications",
          method: "GET",
          params,
          providesTags: ["notification"],
        };
      },
    }),
    getSingleNotification: builder.query<
      NotificationSingleTopLevel,
      {
        id: string;
      }
    >({
      query: ({ id }: { id: string }) => {
        const params: any = {};
        return {
          url: `notifications/${id}`,
          method: "GET",
          providesTags: ["notification"],
        };
      },
    }),

    markNotificationAsRead: builder.mutation<any, { notification_id: string }>({
      query: ({ notification_id }) => ({
        url: `notifications/${notification_id}/mark-as-read`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["notification"],
      }),
    }),
    markNotificationAsUnread: builder.mutation<
      any,
      { notification_id: string }
    >({
      query: ({ notification_id }) => ({
        url: `notifications/${notification_id}/mark-as-unread`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["notification"],
      }),
    }),
    markEveryNotificationAsRead: builder.mutation<any, void>({
      query: () => ({
        url: `notifications/mark-all-as-read`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["notification"],
      }),
    }),
    markEveryNotificationAsUnread: builder.mutation<any, void>({
      query: () => ({
        url: `notifications/mark-all-as-unread`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["notification"],
      }),
    }),
    deleteNotification: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `notifications/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["notification"],
      }),
    }),
  }),
});

export const {
  useGetAllNotificationQuery,
  useGetSingleNotificationQuery,
  useMarkNotificationAsReadMutation,
  useMarkNotificationAsUnreadMutation,
  useMarkEveryNotificationAsReadMutation,
  useMarkEveryNotificationAsUnreadMutation,
  useDeleteNotificationMutation,
} = notificationApi;
