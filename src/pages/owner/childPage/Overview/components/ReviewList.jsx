import React from 'react';
import ReviewItem from './ReviewItem';
import './ReviewList.scss';

const ReviewList = ({ reviews }) => {
  return (
    <div className="reviews-container">
      <h2 className="reviews-title">Đánh giá gần đây</h2>
      <div className="reviews-list">
        {reviews.map((review, index) => (
          <ReviewItem
            key={index}
            avatar={review.avatar}
            name={review.name}
            rating={review.rating}
            comment={review.comment}
            date={review.date}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewList;