import { useState, useEffect } from 'react';
import API from '../services/api';
import '../styles/theme.css';

const RatingForm = ({ storeId, userRating, onRatingSubmit }) => {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  // Prefill when editing
  useEffect(() => {
    if (userRating) {
      setRating(userRating.rating?.toString() || '');
      setComment(userRating.comment || '');
    } else {
      setRating('');
      setComment('');
    }
  }, [userRating]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert rating to number for backend
    const numericRating = parseInt(rating, 10);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      alert('Rating must be a number between 1 and 5');
      return;
    }

    try {
      const method = userRating ? 'put' : 'post';
      const res = await API[method](`/stores/${storeId}/ratings`, {
        rating: numericRating,
        comment
      });

      alert('Rating submitted!');
      if (onRatingSubmit) onRatingSubmit(res.data.data);

      // Reset form if new rating
      if (!userRating) {
        setRating('');
        setComment('');
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rating-form">
      <h4 className="rating-form-title">
        {userRating ? 'Update Your Rating' : 'Leave a Rating'}
      </h4>

      <label className="form-label">Rating (1–5)</label>
      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={e => setRating(e.target.value)}
        required
        className="form-input"
      />

      <label className="form-label">Comment</label>
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Write your feedback..."
        className="form-input"
      />

      <button type="submit" className="btn btn-submit">
        {userRating ? 'Update' : 'Submit'} Rating
      </button>
    </form>
  );
};

export default RatingForm;
