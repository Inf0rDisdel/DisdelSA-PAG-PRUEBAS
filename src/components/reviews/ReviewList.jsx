import React from 'react';
import { FaStar, FaUserCircle } from 'react-icons/fa';

const ReviewList = ({ reviews }) => {
  return (
    <div className="reviews-grid">
      {reviews.map((review) => (
        <div key={review.id} className="review-card">
          <div className="card-header">
            <div className="user-info">
              <FaUserCircle className="user-avatar" />
              <div>
                <h4 className="user-name">{review.name}</h4>
                <span className="review-date">{review.date}</span>
              </div>
            </div>
            <div className="card-stars">
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i} 
                  color={i < review.rating ? "#ffc107" : "#e4e5e9"} 
                  size={14} 
                />
              ))}
            </div>
          </div>
          <p className="review-text">"{review.comment}"</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;