import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../hooks/useAuth';
import StoreCard from '../components/StoreCard';
import '../styles/theme.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [ratingsCount, setRatingsCount] = useState(0);

  const fetchData = async () => {
    try {
      if (user.role === 'ADMIN') {
        const storesRes = await API.get('/stores');
        const usersRes = await API.get('/users');
        setStores(storesRes.data.data);
        setUsers(usersRes.data.data);
        setRatingsCount(storesRes.data.data.reduce((acc, s) => acc + s.totalRatings, 0));
      } else if (user.role === 'STORE_OWNER') {
        const storesRes = await API.get('/stores');
        const myStore = storesRes.data.data.find(s => s.owner_id === user.id);
        setStores(myStore ? [myStore] : []);
      } else {
        // Normal user
        const storesRes = await API.get('/stores');
        setStores(storesRes.data.data);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="page-container" style={{ background: '#f5f5f5', minHeight: '100vh', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
        {user.role} Dashboard
      </h2>

      {/* Admin Stats */}
      {user.role === 'ADMIN' && (
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div className="stat-card">
            <h4>Total Users</h4>
            <p>{users.length}</p>
          </div>
          <div className="stat-card">
            <h4>Total Stores</h4>
            <p>{stores.length}</p>
          </div>
          <div className="stat-card">
            <h4>Total Ratings</h4>
            <p>{ratingsCount}</p>
          </div>
        </div>
      )}

      {/* Add Store Button - visible to everyone, restricted to admin */}
      <div style={{ marginBottom: '2rem' }}>
        <Link 
          to={user?.role === 'ADMIN' ? '/add-store' : '#'} 
          className="btn btn-add-store"
          onClick={(e) => {
            if (user?.role !== 'ADMIN') {
              e.preventDefault();
              alert('Only admins can add a store.');
            }
          }}
        >
          Add Store
        </Link>
      </div>

      {/* Store Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {stores.map(store => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
