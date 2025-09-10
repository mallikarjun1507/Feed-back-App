import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RatingForm from '../components/RatingForm';
import API from '../services/api';
import '../styles/theme.css';

const StoreRatings = () => {
  const { storeId } = useParams();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRating, setUserRating] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await API.get(`/stores/${storeId}/ratings`);
        const ratingList = res.data.data || [];
        setRatings(ratingList);

        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          setUser(storedUser);
          //  Check if this user has rated before
          const ur = ratingList.find(r => r.user_id === storedUser.id);
          setUserRating(ur);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [storeId]);

  const handleRatingSubmit = (newRating) => {
    setRatings(prev => {
      const updated = prev.filter(r => r.user_id !== newRating.user_id);
      return [...updated, newRating];
    });
    setUserRating(newRating);
  };

  if (loading) return <div className="loading">Loading ratings...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="ratings-page">
      <h3 className="ratings-title">⭐ Store Ratings</h3>

      {/*  Only show form if user is not a store owner */}
      {user && user.role !== 'STORE_OWNER' && (
        <RatingForm
          storeId={storeId}
          userRating={userRating}
          onRatingSubmit={handleRatingSubmit}
        />
      )}

      <div className="ratings-list">
        {ratings.length === 0 && (
          <p className="no-ratings">No ratings yet. Be the first!</p>
        )}

        {ratings.map(r => (
          <div key={r.id} className="rating-item">
            <div className="rating-header">
              <strong>{r.User?.name || 'Anonymous'}</strong>
              <span className="rating-stars">⭐ {r.rating}/5</span>
            </div>
            {r.comment && <p className="rating-comment">“{r.comment}”</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreRatings;
