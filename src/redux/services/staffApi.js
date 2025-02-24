import { apiSlice } from "./apiSlice";

export const staffApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllStaffs: builder.query({
            query: () => "/staff/all-staffs",
            providesTags: ["Staff"],
        }),

        getStaffById: builder.query({
            query: (id) => `/staff/${id}`,
            providesTags: ["Staff"],
        }),

        updateStaff: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/staff/${id}`,
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