import { apiSlice } from "./apiSlice";

export const serviceApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllServices: builder.query({
            query: () => "/service/all-services",
            providesTags: ["Service"],
        }),

        getServiceById: builder.query({
            query: (id) => `/service/${id}`,
            providesTags: ["Service"],
        }),

        createService: builder.mutation({
            query: (service) => ({
                url: "/service/create-service",
                method: "POST",
                body: service,
            }),
            invalidatesTags: ["Service"],
        }),

        updateService: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/service/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Service"],
        }),

        deleteService: builder.mutation({
            query: (id) => ({
                url: `/service/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Service"],
        }),
    }),
});

export const {
    useGetAllServicesQuery,
    useGetServiceByIdQuery,
    useCreateServiceMutation,
    useUpdateServiceMutation,
    useDeleteServiceMutation,
} = serviceApi;