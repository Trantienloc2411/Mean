import { apiSlice } from "./apiSlice";

export const staffApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllStaffs: builder.query({
      query: () => "/admin/all-staffs",
      providesTags: ["Staff"],
    }),

    getStaffById: builder.query({
      query: (id) => `/admin/${id}`,
      providesTags: ["Staff"],
    }),

    updateStaff: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Staff"],
    }),
  }),
});

export const {
  useGetAllStaffsQuery,
  useGetStaffByIdQuery,
  useUpdateStaffMutation,
} = staffApi;
