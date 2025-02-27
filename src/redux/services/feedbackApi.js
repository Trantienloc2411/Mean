import { apiSlice } from "./apiSlice";
import dayjs from "dayjs";

const formatDateForAPI = (dateString) => {
  if (!dateString) return null;
  try {
    if (dateString.includes(" ")) {
      const [date, time] = dateString.split(" ");
      const [day, month, year] = date.split("/");
      return `${year}-${month}-${day}T${time}.000Z`;
    }
    if (dateString.includes("T") && dateString.includes("Z")) {
      return dateString;
    }
    if (dayjs.isDayjs(dateString)) {
      return dateString.toISOString();
    }
    return dayjs(dateString).toISOString();
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString;
  }
};

const transformFeedbackData = (data) => {
  const transformed = { ...data };
  if (transformed.createdAt) transformed.createdAt = formatDateForAPI(transformed.createdAt);
  if (transformed.updatedAt) transformed.updatedAt = formatDateForAPI(transformed.updatedAt);
  return transformed;
};

export const feedbackApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllFeedbacks: builder.query({
      query: () => "/feedback/all-feedbacks",
      transformResponse: (response) => {
        if (Array.isArray(response)) {
          return response.map((feedback) => ({
            ...feedback,
            id: feedback.id || feedback._id,
          }));
        }
        return response;
      },
      providesTags: ["Feedback"],
    }),

    getFeedbackById: builder.query({
      query: (id) => `/feedback/${id}`,
      transformResponse: (response) => ({
        ...response,
        id: response.id || response._id,
      }),
      providesTags: (result, error, id) => [{ type: "Feedback", id }],
    }),

    createFeedback: builder.mutation({
      query: (feedback) => {
        const transformedData = transformFeedbackData(feedback);
        return {
          url: "/feedback/create-feedback",
          method: "POST",
          body: transformedData,
        };
      },
      invalidatesTags: ["Feedback"],
    }),

    updateFeedback: builder.mutation({
      query: (feedback) => {
        const id = feedback.id || feedback._id;
        const { _id, __v, id: feedbackId, ...feedbackData } = feedback;
        return {
          url: `/feedback/${id}`,
          method: "PUT",
          body: transformFeedbackData(feedbackData),
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Feedback", id },
        "Feedback",
      ],
    }),
  }),
});

export const {
  useGetAllFeedbacksQuery,
  useGetFeedbackByIdQuery,
  useCreateFeedbackMutation,
  useUpdateFeedbackMutation,
} = feedbackApi;