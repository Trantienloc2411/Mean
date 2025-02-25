import { apiSlice } from "./apiSlice";

export const businessInformationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllBusinessInformation: builder.query({
            query: () => "/business-information/all-business-information",
            providesTags: ["BusinessInformation"],
        }),

        getBusinessInformationById: builder.query({
            query: (id) => `/business-information/${id}`,
            providesTags: ["BusinessInformation"],
        }),

        createBusinessInformation: builder.mutation({
            query: (businessInformation) => ({
                url: "/business-information/create-business-information",
                method: "POST",
                body: businessInformation,
            }),
            invalidatesTags: ["BusinessInformation"],
        }),

        updateBusinessInformation: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/business-information/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["BusinessInformation"],
        }),

        deleteBusinessInformation: builder.mutation({
            query: (id) => ({
                url: `/business-information/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["BusinessInformation"],
        }),
    }),
});

export const {
    useGetAllBusinessInformationQuery,
    useGetBusinessInformationByIdQuery,
    useCreateBusinessInformationMutation,
    useUpdateBusinessInformationMutation,
    useDeleteBusinessInformationMutation,
} = businessInformationApi;