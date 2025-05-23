import { apiSlice } from "./apiSlice";

export const couponApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCoupons: builder.query({
            query: () => ({
                url: `/coupon/all-coupons`,
            }),
        }),
        createCoupon: builder.mutation({
            query: (coupon) => ({
                url: `/coupon/create-coupon`,
                method: "POST",
                body: coupon,
            }),
        }),
        updateCoupon: builder.mutation({
            query: (coupon) => ({
                url: `/coupon/${coupon.id}`,
                method: "PUT",
                body: {
                    name: coupon.name,
                    couponCode: coupon.couponCode,
                    discountBasedOn: coupon.discountBasedOn,
                    amount: coupon.amount,
                    maxDiscount: coupon.maxDiscount,
                    startDate: coupon.startDate,
                    endDate: coupon.endDate,
                    isActive: coupon.isActive
                },
            }),
        }),
        deleteCoupon: builder.mutation({
            query: (id) => ({
                url: `/coupon/deactivate/${id}`,
                method: "PUT",
            }),
        }),
    }),
});

export const {
    useGetCouponsQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
} = couponApi;