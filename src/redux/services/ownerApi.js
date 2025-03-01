import { apiSlice } from "./apiSlice";

export const ownerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOwnerById: builder.query({
      query: (id) => `owner/${id}`,
    }),

    updateOwner: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `owner/${id}`,
        method: "PUT",
        body: updatedData,
      }),
    }),

    getOwnerDetailByUserId: builder.query({
      query: (id) => `owner/detail-owner/${id}`,
    }),
    
  }),
});

export const {
  useLazyGetOwnerByIdQuery,
  useGetOwnerDetailByUserIdQuery,
  useUpdateOwnerMutation,
} = ownerApi;
