import { apiSlice } from "./apiSlice";

export const accommodationTypeApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllAccommodationTypes: builder.query({
            query: () => "/accommodation-type/all-accommodation-types",
            providesTags: ["AccommodationType"],
        }),

        getAccommodationTypeById: builder.query({
            query: (id) => `/accommodation-type/${id}`,
            providesTags: ["AccommodationType"],
        }),

        getAccommodationTypeDetail: builder.query({
            query: (id) => `/accommodation-type/detail/${id}`,
            providesTags: ["AccommodationType"],
        }),

        createAccommodationType: builder.mutation({
            query: (accommodationType) => ({
                url: "/accommodation-type/create-accommodation-type",
                method: "POST",
                body: accommodationType,
            }),
            invalidatesTags: ["AccommodationType"],
        }),

        updateAccommodationType: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/accommodation-type/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["AccommodationType"],
        }),

        deleteAccommodationType: builder.mutation({
            query: (id) => ({
                url: `/accommodation-type/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["AccommodationType"],
        }),
    }),
});

export const {
    useGetAllAccommodationTypesQuery,
    useGetAccommodationTypeByIdQuery,
    useGetAccommodationTypeDetailQuery,
    useCreateAccommodationTypeMutation,
    useUpdateAccommodationTypeMutation,
    useDeleteAccommodationTypeMutation,
} = accommodationTypeApi;