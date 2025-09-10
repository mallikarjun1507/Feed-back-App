import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../styles/theme.css';

const AddStore = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')); 
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  //  Restrict non-admin users
  if (user?.role !== 'ADMIN') {
    return (
      <div className="page-container">
        <div className="form-card">
          <h2 className="form-title">Access Denied</h2>
          <p className="error-message">You do not have permission to add stores.</p>
        </div>
      </div>
    );
  }

  // Live validation
  const isNameValid = name.trim().length >= 3;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isNameValid) {
      setError('Store name must be at least 3 characters.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await API.post('/stores', { name, address });
      setMessage('Store added successfully!');
      setName('');
      setAddress('');

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate('/'); 
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <h2 className="form-title">Add New Store</h2>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="form">
          <label className="form-label">Store Name*</label>
          <input
            type="text"
            placeholder="Enter store name"
            className={`form-input ${!isNameValid && name ? 'input-error' : ''}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {!isNameValid && name && (
            <small className="input-error-text">Store name must be at least 3 characters.</small>
          )}

          <label className="form-label">Address</label>
          <textarea
            placeholder="Optional address"
            className="form-input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <button type="submit" className="btn btn-submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Store'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStore;
