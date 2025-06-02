import { apiSlice } from "./apiSlice"

// Helper to create ISO date strings for MongoDB queries
const getISODateString = (date) => date.toISOString()

// MongoDB Aggregation Pipeline Templates (as comments for clarity, constructed in code)

// Template for Weekly/Monthly Booking Stats (Bookings & Revenue)
/*
Weekly Pipeline Example:
[
  { "$lookup": { "from": "accommodations", "localField": "accommodationId", "foreignField": "_id", "as": "accDetails" } },
  { "$unwind": "$accDetails" },
  { "$lookup": { "from": "rentallocations", "localField": "accDetails.rentalLocationId", "foreignField": "_id", "as": "rlDetails" } },
  { "$unwind": "$rlDetails" },
  { "$match": { "rlDetails.ownerId": { "$oid": "OWNER_ID_PLACEHOLDER" } } },
  { "$match": {
      "createdAt": {
        "$gte": { "$date": "START_DATE_ISO_PLACEHOLDER" },
        "$lte": { "$date": "END_DATE_ISO_PLACEHOLDER" }
      },
      "status": { "$ne": 6 } // Exclude cancelled bookings
    }
  },
  { "$group": {
      "_id": { "dayOfWeek": { "$dayOfWeek": "$createdAt" } }, // 1 (Sun) to 7 (Sat)
      "bookings": { "$sum": 1 },
      "revenue": { "$sum": { "$cond": [{ "$eq": ["$paymentStatus", 3] }, "$totalPrice", 0] } }
    }
  },
  { "$project": { "_id": 0, "dayOfWeek": "$_id.dayOfWeek", "bookings": 1, "revenue": 1 } },
  { "$sort": { "dayOfWeek": 1 } }
]

Monthly Pipeline Example (similar structure, groups by year/month):
[
  // ... lookups and owner match ...
  { "$match": {
      "createdAt": { // e.g., last 6 months
        "$gte": { "$date": "START_DATE_ISO_PLACEHOLDER_6_MONTHS_AGO" },
        "$lte": { "$date": "END_DATE_ISO_PLACEHOLDER_TODAY" }
      },
      "status": { "$ne": 6 }
    }
  },
  { "$group": {
      "_id": { "year": { "$year": "$createdAt" }, "month": { "$month": "$createdAt" } },
      "bookings": { "$sum": 1 },
      "revenue": { "$sum": { "$cond": [{ "$eq": ["$paymentStatus", 3] }, "$totalPrice", 0] } }
    }
  },
  { "$project": { "_id": 0, "year": "$_id.year", "month": "$_id.month", "bookings": 1, "revenue": 1 } },
  { "$sort": { "year": 1, "month": 1 } }
]
*/

// Template for Room Type Distribution
/*
[
  { "$lookup": { "from": "accommodations", "localField": "accommodationId", "foreignField": "_id", "as": "accDetails" } },
  { "$unwind": "$accDetails" },
  { "$lookup": { "from": "rentallocations", "localField": "accDetails.rentalLocationId", "foreignField": "_id", "as": "rlDetails" } },
  { "$unwind": "$rlDetails" },
  { "$match": { "rlDetails.ownerId": { "$oid": "OWNER_ID_PLACEHOLDER" } } },
  { "$match": { "status": { "$ne": 6 } } }, // Exclude cancelled bookings
  { "$lookup": { "from": "accommodationtypes", "localField": "accDetails.accommodationTypeId", "foreignField": "_id", "as": "atDetails" } },
  { "$unwind": "$atDetails" },
  { "$group": { "_id": "$atDetails.name", "count": { "$sum": 1 } } },
  { "$project": { "_id": 0, "name": "$_id", "value": "$count" } },
  { "$sort": { "value": -1 } }
]
*/

const customQueryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint for total revenue (existing)
    getTotalRevenue: builder.query({
      query: () => ({
        url: "secret/query",
        method: "POST",
        body: {
          collection: "Booking",
          pipeline: [
            { $match: { paymentStatus: { $in: [3] } } },
            { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
            { $project: { _id: 0, totalRevenue: 1 } },
          ],
        },
      }),
      transformResponse: (response) => response?.data[0]?.totalRevenue || 0,
    }),
    // Endpoint for total transactions (existing)
    getTotalTransactions: builder.query({
      query: () => ({
        url: "secret/query",
        method: "POST",
        body: {
          collection: "Transaction", // Assuming 'Transaction' collection
          pipeline: [
            { $group: { _id: null, totalTransactions: { $sum: 1 } } },
            { $project: { _id: 0, totalTransactions: 1 } },
          ],
        },
      }),
      transformResponse: (response) => response?.data[0]?.totalTransactions || 0,
    }),
    // Endpoint for recent bookings (existing)
    getRecentBookings: builder.query({
      query: () => {
        const endDate = new Date()
        endDate.setHours(23, 59, 59, 999)
        const startDate = new Date(endDate)
        startDate.setMonth(endDate.getMonth() - 5)
        startDate.setDate(1)
        startDate.setHours(0, 0, 0, 0)
        return {
          url: "secret/query", // Assuming this is the correct endpoint for all queries
          method: "POST",
          body: {
            collection: "Booking",
            pipeline: [
              { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
              { $project: { _id: 1, createdAt: 1, totalPrice: 1, status: 1 } },
              { $facet: { data: [{ $skip: 0 }, { $limit: 10 }], totalCount: [{ $count: "count" }] } },
            ],
          },
        }
      },
      transformResponse: (response) => ({
        data: response?.data?.[0]?.data || [], // Adjusted to match typical secret/query response
        totalCount: response?.data?.[0]?.totalCount[0]?.count || 0,
      }),
    }),

    // NEW ENDPOINT: Booking Statistics (Số lượng đặt phòng & Doanh thu)
    getBookingStats: builder.query({
      query: ({ ownerId, period }) => {
        let startDate, endDate
        const pipelineBase = [
          { $lookup: { from: "accommodations", localField: "accommodationId", foreignField: "_id", as: "accDetails" } },
          { $unwind: "$accDetails" },
          {
            $lookup: {
              from: "rentallocations",
              localField: "accDetails.rentalLocationId",
              foreignField: "_id",
              as: "rlDetails",
            },
          },
          { $unwind: "$rlDetails" },
          { $match: { "rlDetails.ownerId": { $oid: ownerId } } },
        ]

        let periodSpecificPipeline

        endDate = new Date()
        endDate.setHours(23, 59, 59, 999)

        if (period === "weekly") {
          startDate = new Date()
          startDate.setDate(endDate.getDate() - 6) // Last 7 days including today
          startDate.setHours(0, 0, 0, 0)

          periodSpecificPipeline = [
            ...pipelineBase,
            {
              $match: {
                createdAt: { $gte: { $date: getISODateString(startDate) }, $lte: { $date: getISODateString(endDate) } },
                status: { $ne: 6 },
              },
            },
            {
              $group: {
                _id: { dayOfWeek: { $dayOfWeek: "$createdAt" } },
                bookings: { $sum: 1 },
                revenue: { $sum: { $cond: [{ $eq: ["$paymentStatus", 3] }, "$totalPrice", 0] } },
              },
            },
            { $project: { _id: 0, dayOfWeek: "$_id.dayOfWeek", bookings: 1, revenue: 1 } },
            { $sort: { dayOfWeek: 1 } },
          ]
        } else {
          // monthly
          startDate = new Date(endDate)
          startDate.setMonth(endDate.getMonth() - 5) // Last 6 months
          startDate.setDate(1)
          startDate.setHours(0, 0, 0, 0)

          periodSpecificPipeline = [
            ...pipelineBase,
            {
              $match: {
                createdAt: { $gte: { $date: getISODateString(startDate) }, $lte: { $date: getISODateString(endDate) } },
                status: { $ne: 6 },
              },
            },
            {
              $group: {
                _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                bookings: { $sum: 1 },
                revenue: { $sum: { $cond: [{ $eq: ["$paymentStatus", 3] }, "$totalPrice", 0] } },
              },
            },
            { $project: { _id: 0, year: "$_id.year", month: "$_id.month", bookings: 1, revenue: 1 } },
            { $sort: { year: 1, month: 1 } },
          ]
        }

        return {
          url: "secret/query",
          method: "POST",
          body: {
            collection: "Booking",
            pipeline: periodSpecificPipeline,
          },
        }
      },
      transformResponse: (response, meta, arg) => {
        const rawData = response?.data || []
        if (arg.period === "weekly") {
          const daysOrder = [2, 3, 4, 5, 6, 7, 1] // Mon(2) to Sun(1)
          const dayLabels = { 1: "CN", 2: "T2", 3: "T3", 4: "T4", 5: "T5", 6: "T6", 7: "T7" }
          return daysOrder.map((apiDayOfWeek) => {
            const entry = rawData.find((d) => d.dayOfWeek === apiDayOfWeek)
            return {
              name: dayLabels[apiDayOfWeek],
              bookings: entry ? entry.bookings : 0,
              revenue: entry ? entry.revenue : 0,
            }
          })
        } else {
          // monthly
          const result = []
          const today = new Date()
          for (let i = 5; i >= 0; i--) {
            const targetDate = new Date(today.getFullYear(), today.getMonth() - i, 1)
            const year = targetDate.getFullYear()
            const month = targetDate.getMonth() + 1
            const entry = rawData.find((d) => d.year === year && d.month === month)
            result.push({
              name: `Tháng ${month}`,
              bookings: entry ? entry.bookings : 0,
              revenue: entry ? entry.revenue : 0,
            })
          }
          return result
        }
      },
    }),

    // NEW ENDPOINT: Room Type Distribution (Phân bổ loại phòng)
    getRoomTypeDistribution: builder.query({
      query: ({ ownerId }) => {
        const pipeline = [
          { $lookup: { from: "accommodations", localField: "accommodationId", foreignField: "_id", as: "accDetails" } },
          { $unwind: "$accDetails" },
          {
            $lookup: {
              from: "rentallocations",
              localField: "accDetails.rentalLocationId",
              foreignField: "_id",
              as: "rlDetails",
            },
          },
          { $unwind: "$rlDetails" },
          { $match: { "rlDetails.ownerId": { $oid: ownerId } } },
          { $match: { status: { $ne: 6 } } },
          {
            $lookup: {
              from: "accommodationtypes",
              localField: "accDetails.accommodationTypeId",
              foreignField: "_id",
              as: "atDetails",
            },
          },
          { $unwind: "$atDetails" },
          { $group: { _id: "$atDetails.name", count: { $sum: 1 } } },
          { $project: { _id: 0, name: "$_id", value: "$count" } },
          { $sort: { value: -1 } },
        ]
        return {
          url: "secret/query",
          method: "POST",
          body: {
            collection: "Booking",
            pipeline: pipeline,
          },
        }
      },
      transformResponse: (response) => response?.data || [],
    }),
  }),
})

export const {
  useGetTotalRevenueQuery,
  useGetTotalTransactionsQuery,
  useGetRecentBookingsQuery, // Make sure this is exported if used elsewhere
  useGetBookingStatsQuery,
  useGetRoomTypeDistributionQuery,
  
} = customQueryApi
