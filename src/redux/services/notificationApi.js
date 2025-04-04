import { apiSlice } from "./apiSlice";

export const notificationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllNotifications: builder.query({
            query: () => "/notification/all-notifications",
            providesTags: ["Notification"],
        }),

        getNotificationById: builder.query({
            query: (id) => `/notification/${id}`,
            providesTags: ["Notification"],
        }),

        getNotificationsByUser: builder.query({
            query: (userId) => `/notification/user/${userId}`,
            providesTags: ["Notification"],
        }),

        createNotification: builder.mutation({
            query: (notification) => ({
                url: "/notification/create-notification",
                method: "POST",
                body: notification,
            }),
            invalidatesTags: ["Notification"],
        }),

        updateNotification: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/notification/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Notification"],
        }),

        deleteNotification: builder.mutation({
            query: (id) => ({
                url: `/notification/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Notification"],
        }),
    }),
});

export const {
    useGetAllNotificationsQuery,
    useGetNotificationByIdQuery,
    useGetNotificationsByUserQuery,
    useCreateNotificationMutation,
    useUpdateNotificationMutation,
    useDeleteNotificationMutation,
} = notificationApi;
