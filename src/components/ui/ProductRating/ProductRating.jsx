import React from 'react';
import { FaStar } from 'react-icons/fa';
import './ProductRating.css';

const toNumberOrNull = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
};

const ProductRating = ({
  rating,
  total,
  variant = 'card',
  showScore = false,
  showTotal = false,
}) => {
  const average = toNumberOrNull(rating);
  const totalReviews = Math.max(0, Number(total) || 0);
  const roundedRating = average ? Math.round(average) : 0;
  const label = average
    ? `${average.toFixed(1)} de 5 estrellas`
    : 'Este producto aún no tiene opiniones publicadas';

  return (
    <div className={`product-rating product-rating--${variant}`} aria-label={label}>
      <span className="product-rating__stars" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={star <= roundedRating ? 'is-filled' : ''}
          />
        ))}
      </span>

      {showScore && (
        <strong className="product-rating__score">
          {average ? average.toFixed(1) : '—'}
        </strong>
      )}

      {showTotal && (
        <span className="product-rating__total">
          {totalReviews === 1 ? '1 opinión' : `${totalReviews} opiniones`}
        </span>
      )}
    </div>
  );
};

export default ProductRating;
