import { apiSlice } from "./apiSlice";

export const feedbackApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFeedbackByRentalId: builder.query({
      query: (rentalId) => `/feedback/rental/${rentalId}`,
      providesTags: ["LandUsesRight"],
    }),

    getFeedbackByOwnerId: builder.query({
      query: (ownerId) => `/feedback/owner/${ownerId}`,
      providesTags: ["LandUsesRight"],
    }),
    updateFeedbackReply: builder.mutation({
      query: ({ feedbackId, contentReply }) => ({
        url: `/feedback/${feedbackId}`,
        method: "PUT",
        body: { contentReply },
      }),
      invalidatesTags: ["Feedback"], // Để refresh dữ liệu sau khi cập nhật
    }),
  }),
});

export const {
  useGetFeedbackByRentalIdQuery,
  useGetFeedbackByOwnerIdQuery,
  useUpdateFeedbackReplyMutation,
} = feedbackApi;
