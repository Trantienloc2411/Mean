import { apiSlice } from "./apiSlice";

export const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerById: builder.query({
      query: (id) => `customer/${id}`,
      providesTags: (result, error, id) => [{ type: "Customer", id }],
    }),
    updateCustomer: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `customer/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      // Sau khi update, invalidate lại cache của customer có id tương ứng
      invalidatesTags: (result, error, { id }) => [{ type: "Customer", id }],
    }),
    getCustomerDetailByUserId: builder.query({
      query: (id) => `customer/detail-customer/${id}`,
      providesTags: (result, error, id) => [{ type: "CustomerDetail", id }],
    }),
  }),
});

export const {
  useGetCustomerByIdQuery,
  useGetCustomerDetailByUserIdQuery,
  useUpdateCustomerMutation,
} = customerApi;
