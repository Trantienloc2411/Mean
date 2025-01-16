import React from 'react';
import { Avatar, Rate } from 'antd';
import './ReviewList.scss';

const ReviewItem = ({ avatar, name, rating, comment, date }) => {
  return (
    <div className="review-item">
      <Avatar src={avatar} size={50} className="review-avatar" />
      <div className="review-content-wrapper">
        <div className="review-content">
          <div className="review-header">
            <span className="review-name">{name}</span>
            <Rate disabled defaultValue={rating} className="review-rating" />
          </div>
          <span className="review-date">{date}</span>
        </div>
        <p className="review-comment">{comment}</p>
      </div>
    </div>
  );
};

export default ReviewItem;
