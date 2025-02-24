import { apiSlice } from "./apiSlice";
import dayjs from 'dayjs';

const formatDateForAPI = (dateString) => {
  if (!dateString) return null;
  return dayjs(dateString, "DD-MM-YYYY HH:mm:ss").toISOString();
};

const transformPolicyData = (data) => {
  const transformed = { ...data };
  if (transformed.startDate) {
    transformed.startDate = formatDateForAPI(transformed.startDate);
  }
  if (transformed.endDate) {
    transformed.endDate = formatDateForAPI(transformed.endDate);
  }
  return transformed;
};

export const policySystemApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllPolicySystems: builder.query({
      query: () => "/policy-system/all-policy-systems",
      transformResponse: (response) => {
        if (Array.isArray(response)) {
          return response.map(policy => ({
            ...policy,
            // startDate: dayjs(policy.startDate).format('DD-MM-YYYY HH:mm:ss'),
            // endDate: dayjs(policy.endDate).format('DD-MM-YYYY HH:mm:ss')
          }));
        }
        return response;
      },
      providesTags: ["PolicySystem"],
    }),

    getPolicySystemById: builder.query({
      query: (id) => `/policy-system/${id}`,
      transformResponse: (response) => ({
        ...response,
        // startDate: dayjs(response.startDate).format('DD-MM-YYYY HH:mm:ss'),
        // endDate: dayjs(response.endDate).format('DD-MM-YYYY HH:mm:ss')
      }),
      providesTags: ["PolicySystem"],
    }),

    createPolicySystem: builder.mutation({
      query: (policySystem) => ({
        url: "/policy-system/create-policy-system",
        method: "POST",
        body: transformPolicyData(policySystem),
      }),
      invalidatesTags: ["PolicySystem"],
    }),

    updatePolicySystem: builder.mutation({
      query: (policySystem) => ({
        url: `/policy-system/${policySystem.id}`,
        method: "PUT",
        body: transformPolicyData(policySystem),
      }),
      invalidatesTags: ["PolicySystem"],
    }),

    deletePolicySystem: builder.mutation({
      query: (id) => ({
        url: `/policy-system/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PolicySystem"],
    }),
  }),
});

export const {
  useGetAllPolicySystemsQuery,
  useGetPolicySystemByIdQuery,
  useCreatePolicySystemMutation,
  useUpdatePolicySystemMutation,
  useDeletePolicySystemMutation,
} = policySystemApi;