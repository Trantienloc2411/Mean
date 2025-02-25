import { apiSlice } from "./apiSlice";

export const policySystemCategoryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllPolicySystemCategories: builder.query({
            query: () => "/policy-system-category/all-policy-system-categories",
            providesTags: ["PolicySystemCategory"],
        }),

        getPolicySystemCategoryById: builder.query({
            query: (id) => `/policy-system-category/${id}`,
            providesTags: ["PolicySystemCategory"],
        }),

        createPolicySystemCategory: builder.mutation({
            query: (category) => ({
                url: "/policy-system-category/create-policy-system-category",
                method: "POST",
                body: category,
            }),
            invalidatesTags: ["PolicySystemCategory"],
        }),

        updatePolicySystemCategory: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/policy-system-category/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["PolicySystemCategory"],
        }),
    }),
});

export const {
    useGetAllPolicySystemCategoriesQuery,
    useGetPolicySystemCategoryByIdQuery,
    useCreatePolicySystemCategoryMutation,
    useUpdatePolicySystemCategoryMutation,
} = policySystemCategoryApi;