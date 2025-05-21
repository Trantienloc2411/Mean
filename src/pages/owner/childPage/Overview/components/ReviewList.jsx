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
          reviewsData.map((review, index) => (
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
              comment={review.content}
              date={
                new Date(review.createdAt).toLocaleDateString("vi-VN") +
                " " +
                new Date(review.createdAt).toLocaleTimeString("vi-VN")
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
