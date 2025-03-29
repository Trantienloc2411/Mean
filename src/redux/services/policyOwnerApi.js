import { apiSlice } from "./apiSlice";
import dayjs from "dayjs";

// Format date for display (API to UI format)
const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  try {
    // Check if the date is already in DD/MM/YYYY HH:mm:ss format
    if (dateString.includes('/')) {
      return dateString;
    }
    
    const parsedDate = dayjs(dateString);
    if (!parsedDate.isValid()) {
      console.error("Invalid date format:", dateString);
      return 'Invalid Date';
    }
    return parsedDate.format('DD/MM/YYYY HH:mm:ss');
  } catch (error) {
    console.error("Error formatting date for display:", dateString, error);
    return dateString;
  }
};

// Format date for API (UI to API format)
const formatDateForAPI = (dateInput) => {
  if (!dateInput) return null;
  
  try {
    // If it's a dayjs object
    if (dayjs.isDayjs(dateInput)) {
      return dateInput.toISOString();
    }
    
    // If it's a Date object
    if (dateInput instanceof Date) {
      return dateInput.toISOString();
    }
    
    // If it's a string in DD/MM/YYYY HH:mm:ss format
    if (typeof dateInput === 'string' && dateInput.includes('/')) {
      return dayjs(dateInput, "DD/MM/YYYY HH:mm:ss").toISOString();
    }
    
    // Default: assume ISO string or any format dayjs can parse
    return dayjs(dateInput).toISOString();
  } catch (error) {
    console.error("Error formatting date for API:", dateInput, error);
    return null;
  }
};

const transformPolicyOwnerData = (data) => {
  const transformed = { ...data };
  
  // Convert UI field names to API field names
  if (transformed.Name) {
    transformed.policyTitle = transformed.Name;
    delete transformed.Name;
  }
  
  if (transformed.Description) {
    transformed.policyDescription = transformed.Description;
    delete transformed.Description;
  }
  
  if (transformed.ApplyDate) {
    transformed.startDate = formatDateForAPI(transformed.ApplyDate);
    delete transformed.ApplyDate;
  }
  
  if (transformed.EndDate) {
    transformed.endDate = formatDateForAPI(transformed.EndDate);
    delete transformed.EndDate;
  }
  
  // Remove UI-specific fields that shouldn't be sent to API
  delete transformed.Status;
  delete transformed.CreatedDate;
  delete transformed.No;
  
  return transformed;
};

export const policyOwnerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllPolicyOwners: builder.query({
      query: () => "/policy-owner/all-policy-owner",
      transformResponse: (response) => {
        // Ensure response is properly handled
        if (!response || !response.data) {
          return { success: false, data: [] };
        }
        
        // Format dates in the response data
        const formattedData = response.data.map(item => ({
          ...item,
          createdAt: formatDateForDisplay(item.createdAt),
          updatedAt: formatDateForDisplay(item.updatedAt),
          startDate: formatDateForDisplay(item.startDate),
          endDate: formatDateForDisplay(item.endDate)
        }));
        
        return { ...response, data: formattedData };
      },
      providesTags: ["PolicyOwner"],
    }),

    getPolicyOwnerById: builder.query({
      query: (id) => `/policy-owner/${id}`,
      transformResponse: (response) => {
        // Format dates if response exists
        if (response) {
          return {
            ...response,
            createdAt: formatDateForDisplay(response.createdAt),
            updatedAt: formatDateForDisplay(response.updatedAt),
            startDate: formatDateForDisplay(response.startDate),
            endDate: formatDateForDisplay(response.endDate)
          };
        }
        return response;
      },
      providesTags: ["PolicyOwner"],
    }),

    createPolicyOwner: builder.mutation({
      query: (policyOwner) => {
        const transformedData = transformPolicyOwnerData(policyOwner);
        return {
          url: "/policy-owner/create-policy-owner",
          method: "POST",
          body: transformedData,
        };
      },
      invalidatesTags: ["PolicyOwner"],
    }),

    updatePolicyOwner: builder.mutation({
      query: (policyOwner) => ({
        url: `/policy-owner/${policyOwner.id || policyOwner._id}`,
        method: "PUT",
        body: transformPolicyOwnerData(policyOwner),
      }),
      invalidatesTags: ["PolicyOwner"],
    }),

    deletePolicyOwner: builder.mutation({
      query: (id) => ({
        url: `/policy-owner/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PolicyOwner"],
    }),
    getPolicyOwnerByOwnerId: builder.query({
      query: (ownerId) => `/policy-owner/get-policy-owner-by-owner/${ownerId}`,
      transformResponse: (response) => {
        if (response) {
          return {
            ...response,
            createdAt: formatDateForDisplay(response.createdAt),
            updatedAt: formatDateForDisplay(response.updatedAt),
            startDate: formatDateForDisplay(response.startDate),
            endDate: formatDateForDisplay(response.endDate)
          };
        }
        return response;
      },
      providesTags: ["PolicyOwner"],
    }),    
  }),
});

export const {
  useGetAllPolicyOwnersQuery,
  useGetPolicyOwnerByIdQuery,
  useGetPolicyOwnerByOwnerIdQuery,
  useCreatePolicyOwnerMutation,
  useUpdatePolicyOwnerMutation,
  useDeletePolicyOwnerMutation,
} = policyOwnerApi;