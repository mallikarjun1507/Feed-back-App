import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import StoreCard from '../components/StoreCard';
import '../styles/theme.css';

const StoreList = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user')); 

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await API.get('/stores');
        setStores(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading stores...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;

  return (
    <div className="store-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4>Stores</h4>

        {/* Add Store button only for Admins */}
        {user?.role === 'ADMIN' && (
          <button className="btn btn-primary" onClick={() => navigate('/add-store')}>
            + Add Store
          </button>
        )}
      </div>

      {stores.length === 0 && <p>No stores found.</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {stores.map(store => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
};

export default StoreList;
