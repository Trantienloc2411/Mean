import { apiSlice } from './apiSlice';

const customQueryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Endpoint for total transactions
        getTotalRevenue: builder.query({
            query: () => ({
                url: 'secret/query',
                method: 'POST',
                body: {
                    "collection": "Booking",
                    "pipeline": [
                        {
                            "$match": {
                                "paymentStatus": { "$in": [3] }
                            }
                        },
                        {
                            "$group": {
                                "_id": null,
                                "totalRevenue": { "$sum": "$totalPrice" }
                            }
                        },
                        {
                            "$project": {
                                "_id": 0,
                                "totalRevenue": 1
                            }
                        }
                    ]
                }
            }),
            // Transform the response if needed (e.g., extract the value)
            transformResponse: (response) => response?.data[0]?.totalRevenue || 0,

        }),
        getTotalTransactions: builder.query({
            query: () => ({
                url: 'secret/query',
                method: 'POST',
                body: {
                    "collection": "Transaction",
                    "pipeline": [
                        {
                            "$group": {
                                "_id": null,
                                "totalTransactions": { "$sum": 1 }
                            }
                        },
                        {
                            "$project": {
                                "_id": 0,
                                "totalTransactions": 1
                            }
                        }
                    ]
                }
            }),
            transformResponse: (response) => response?.data[0]?.totalTransactions || 0,
        }),
        getRecentBookings: builder.query({
            query: () => {
                // Compute the date range dynamically
                const endDate = new Date(); // Current date (e.g., May 31, 2025)
                endDate.setHours(23, 59, 59, 999); // End of the current day

                const startDate = new Date(endDate);
                startDate.setMonth(endDate.getMonth() - 5); // Subtract 5 months (6 months total including current)
                startDate.setDate(1); // First day of the month
                startDate.setHours(0, 0, 0, 0); // Start of the day

                return {
                    url: '/recent-bookings',
                    body: {
                        collection: 'Booking',
                        pipeline: [
                            {
                                $match: {
                                    createdAt: {
                                        $gte: startDate,
                                        $lte: endDate,
                                    },
                                },
                            },
                            {
                                $project: {
                                    _id: 1,
                                    createdAt: 1,
                                    totalPrice: 1,
                                    status: 1,
                                },
                            },
                            {
                                $facet: {
                                    data: [{ $skip: 0 }, { $limit: 10 }],
                                    totalCount: [{ $count: 'count' }],
                                },
                            },
                        ],
                    },
                };
            },
            transformResponse: (response) => ({
                data: response[0]?.data || [],
                totalCount: response[0]?.totalCount[0]?.count || 0,
            }),
        }),
    }),
});

export const { useGetTotalRevenueQuery, useGetTotalTransactionsQuery } = customQueryApi;

