import { apiSlice } from "./apiSlice";
import dayjs from 'dayjs';

const formatDateForAPI = (dateString) => {
  if (!dateString) return null;
  try {
    if (dateString.includes(' ')) {
      const [date, time] = dateString.split(' ');
      const [day, month, year] = date.split('/');
      return `${year}-${month}-${day}T${time}.000Z`;
    }
    if (dateString.includes('T') && dateString.includes('Z')) {
      return dateString;
    }
    if (dayjs.isDayjs(dateString)) {
      return dateString.toISOString();
    }
    return dayjs(dateString).toISOString();
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return dateString;
  }
};

const transformReportData = (data) => {
  const transformed = { ...data };
  if (transformed.createdAt && typeof transformed.createdAt === 'string' && !transformed.createdAt.includes(' ')) {
    transformed.createdAt = formatDateForAPI(transformed.createdAt);
  }
  if (transformed.updatedAt && typeof transformed.updatedAt === 'string' && !transformed.updatedAt.includes(' ')) {
    transformed.updatedAt = formatDateForAPI(transformed.updatedAt);
  }
  return transformed;
};

export const reportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllReports: builder.query({
      query: () => "/report/all-reports",
      transformResponse: (response) => {
        if (Array.isArray(response)) {
          return response.map(report => ({ 
            ...report,
            id: report.id || report._id  
          }));
        }
        return response;
      },
      providesTags: ["Report"],
    }),

    getReportById: builder.query({
      query: (id) => `/report/${id}`,
      transformResponse: (response) => ({ 
        ...response,
        id: response.id || response._id  // Ensure we have an id property
      }),
      providesTags: (result, error, id) => [{ type: "Report", id }],
    }),

    createReport: builder.mutation({
      query: (report) => {
        const transformedData = transformReportData(report);
        return {
          url: "/report/create-report",
          method: "POST",
          body: transformedData,
        };
      },
      invalidatesTags: ["Report"],
    }),

    updateReport: builder.mutation({
      query: (report) => {
        const id = report.id || report._id;
        const { _id, __v, id: reportId, ...reportData } = report;
        
        return {
          url: `/report/${id}`,
          method: "PUT",
          body: transformReportData(reportData),
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Report", id },
        "Report"
      ],
    }),
  }),
});

export const {
  useGetAllReportsQuery,
  useGetReportByIdQuery,
  useCreateReportMutation,
  useUpdateReportMutation,
} = reportApi;