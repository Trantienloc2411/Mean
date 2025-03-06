import { apiSlice } from "./apiSlice";
import dayjs from "dayjs";
export const feedbackApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({}),
});

export const {
  useGetAllFeedbacksQuery,
  useGetFeedbackByIdQuery,
  useCreateFeedbackMutation,
  useUpdateFeedbackMutation,
} = feedbackApi;
