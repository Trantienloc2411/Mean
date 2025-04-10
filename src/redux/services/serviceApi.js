import { apiSlice } from "./apiSlice";

export const serviceApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllAmenities: builder.query({
            query: ({ ownerId, rentalLocationId } = {}) => {
                let url = "/service/all-services";
                const params = new URLSearchParams();

                if (ownerId) {
                    params.append('ownerId', ownerId);
                }

                if (rentalLocationId) {
                    params.append('rentalLocationId', rentalLocationId);
                }

                if (params.toString()) {
                    url += `?${params.toString()}`;
                }

                return url;
            },
            transformResponse: (response) => response.data,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Service', id })),
                        { type: 'Service', id: 'LIST' },
                    ]
                    : [{ type: 'Service', id: 'LIST' }],
        }),

        getAmenityById: builder.query({
            query: (id) => `/service/${id}`,
            providesTags: (result, error, id) => [{ type: "Service", id }],
        }),

        createAmenity: builder.mutation({
            query: (amenity) => ({
                url: "/service/create-service",
                method: "POST",
                body: amenity,
            }),
            invalidatesTags: ["Service"],
        }),

        updateAmenity: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/service/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Service", id },
                "Service",
            ],
        }),

        deleteAmenity: builder.mutation({
            query: (id) => ({
                url: `/service/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Service"],
        }),
    }),
});

export const {
    useGetAllAmenitiesQuery,
    useGetAmenityByIdQuery,
    useCreateAmenityMutation,
    useUpdateAmenityMutation,
    useDeleteAmenityMutation,
} = serviceApi;