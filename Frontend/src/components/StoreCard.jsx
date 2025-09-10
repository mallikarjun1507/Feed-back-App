import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/theme.css'; 

const StoreCard = ({ store }) => {
  const navigate = useNavigate();

  return (
    <div className="store-card">
      <h6>{store.name}</h6>
      <p>{store.address}</p>
      <p>Total Ratings: {store.totalRatings || 0}</p>
      <button className="btn-view" onClick={() => navigate(`/stores/${store.id}/ratings`)}>
        View Ratings
      </button>
    </div>
  );
};

export default StoreCard;
