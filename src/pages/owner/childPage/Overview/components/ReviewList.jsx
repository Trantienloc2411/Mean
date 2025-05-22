import React from "react";
import ReviewItem from "./ReviewItem";
import "./ReviewList.scss";

const ReviewList = ({ reviews }) => {
  // Safety check for reviews
  const reviewsData = Array.isArray(reviews) ? reviews : [];

  return (
    <div className="reviews-container">
      <h2 className="reviews-title">Đánh giá gần đây</h2>
      <div className="reviews-list">
        {reviewsData.length > 0 ? (
          [...reviewsData]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((review, index) => (
              <ReviewItem
                key={review._id || index}
                avatar={
                  review.bookingId?.customerId?.userId?.avatar ||
                  "default-avatar.png"
                }
                name={
                  review.bookingId?.customerId?.userId?.fullName || "Anonymous"
                }
                rating={review.rating}
                comment={
                  review.content.length > 70
                    ? review.content.slice(0, 70) + "..."
                    : review.content
                }
                date={
                  new Date(review.createdAt).toLocaleDateString("vi-VN") +
                  " " +
                  new Date(review.createdAt).toLocaleTimeString("vi-VN")
                }
                accommodationType={
                  review?.bookingId?.accommodationId?.accommodationTypeId
                    ?.name || "Unknown Rental Location"
                }
              />
            ))
        ) : (
          <p>Chưa có đánh giá nào</p>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
