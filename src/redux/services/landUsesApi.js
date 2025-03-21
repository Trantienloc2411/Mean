import { apiSlice } from "./apiSlice";

export const landUsesRightApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLandUsesRight: builder.query({
      query: (id) => `/land-uses-right/rental/${id}`,
      providesTags: ["LandUsesRight"],
    }),
    createLandUsesRight: builder.mutation({
      query: ({ data }) => ({
        url: `/land-uses-right/create-land-uses-right`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LandUsesRight"],
    }),
    updateLandUsesRight: builder.mutation({
      query: ({ id, updatedLandUsesRight }) => ({
        url: `/land-uses-right/${id}`,
        method: "PUT",
        body: updatedLandUsesRight,
      }),
      invalidatesTags: ["LandUsesRight"],
    }),
  }),
});

export const {
  useGetLandUsesRightQuery,
  useCreateLandUsesRightMutation,
  useUpdateLandUsesRightMutation,
} = landUsesRightApi;
