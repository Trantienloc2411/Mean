import { apiSlice } from "./apiSlice";
import dayjs from "dayjs";

const formatDateForAPI = (dateString) => {
  if (!dateString) return null;

  try {
    if (dateString.includes("T") && dateString.includes("Z")) {
      return dateString;
    }
    if (dayjs.isDayjs(dateString)) {
      return dateString.toISOString();
    }
    return dayjs(dateString).toISOString();
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString;
  }
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
          return response.map((policy) => ({
            ...policy,
          }));
        }
        return response;
      },
      providesTags: ["PolicySystem"],
    }),

    getPolicySystemById: builder.query({
      query: (id) => `/policy-system/${id}`,
      transformResponse: (response) => {
        if (response.success) {
          return {
            ...response.data,
            staffId: response.data.staffId || {},
            policySystemCategoryId: response.data.policySystemCategoryId || {},
            values: response.data.values || [],
          };
        }
        return response;
      },
      providesTags: ["PolicySystem"],
    }),

    createPolicySystem: builder.mutation({
      query: (policySystem) => {
        const transformedData = transformPolicyData(policySystem);
        console.log("Sending to API:", transformedData);
        return {
          url: "/policy-system/create-policy-system",
          method: "POST",
          body: transformedData,
        };
      },
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
    getPolicyByHashtag: builder.query({
      query: (hashtag) =>
        `policy-system/all-policy-systems-by-hashtag/${hashtag}`,
      providesTags: (result, error, hashtag) => [
        { type: "PolicySystem", id: hashtag },
      ],
    }),
  }),
});

export const {
  useGetAllPolicySystemsQuery,
  useGetPolicySystemByIdQuery,
  useCreatePolicySystemMutation,
  useUpdatePolicySystemMutation,
  useDeletePolicySystemMutation,
  useGetPolicyByHashtagQuery,
} = policySystemApi;
