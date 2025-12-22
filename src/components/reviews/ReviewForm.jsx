import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewForm = ({ onAddReview }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return alert("¡Por favor selecciona una calificación!");
    if (!name.trim() || !comment.trim()) return;

    // Crear objeto de nueva review
    const newReview = {
      id: Date.now(),
      name,
      date: new Date().toLocaleDateString(),
      rating,
      comment
    };

    onAddReview(newReview);
    
    // Resetear form
    setRating(0);
    setName('');
    setComment('');
  };

  return (
    <form className="review-form bump-animation" onSubmit={handleSubmit}>
      <h4>Comparte tu experiencia</h4>
      
      <div className="star-input-container">
        <p className="label-text">¿Qué calificación nos das?</p>
        <div className="star-rating-input">
          {[...Array(5)].map((_, i) => {
            const ratingValue = i + 1;
            return (
              <label key={i}>
                <input 
                  type="radio" 
                  name="rating" 
                  value={ratingValue} 
                  onClick={() => setRating(ratingValue)}
                />
                <FaStar 
                  className="star-icon" 
                  color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"} 
                  size={32}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                />
              </label>
            );
          })}
        </div>
      </div>

      <div className="input-group">
        <input 
          type="text" 
          placeholder="Tu nombre o Empresa" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required 
        />
      </div>
      
      <div className="input-group">
        <textarea 
          rows="4" 
          placeholder="¿Qué te pareció el servicio?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        ></textarea>
      </div>

      <button type="submit" className="btn-submit-review">Publicar Comentario</button>
    </form>
  );
};

export default ReviewForm;