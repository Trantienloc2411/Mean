import { apiSlice } from "./apiSlice";

export const ownerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOwnerById: builder.query({
      query: (id) => `owner/${id}`,
      providesTags: (result, error, id) => [{ type: "Owner", id }],
    }),

    updateOwner: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `owner/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Owner", id }],
    }),

    getOwnerDetailByUserId: builder.query({
      query: (id) => `owner/detail-owner/${id}`,
      providesTags: (result, error, id) => [{ type: "OwnerDetail", id }],
    }),

    createOwner: builder.mutation(
        {
          query: ({createOwnerData}) => ({
            url: `owner/create-owner/`,
            method: "POST",
            body: createOwnerData,
          }),
          providesTags: (result, error, id) => [{ type: "OwnerDetail", id }],
        }
    )
  }),
});

export const {
  useLazyGetOwnerByIdQuery,
  useGetOwnerByIdQuery,
  useUpdateOwnerMutation,
  useGetOwnerDetailByUserIdQuery,
  useCreateOwnerMutation: useCreateOwnerMutation,
} = ownerApi;
