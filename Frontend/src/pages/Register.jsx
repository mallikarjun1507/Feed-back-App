import { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import "../styles/theme.css"; 

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'USER'
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await register(form);
      alert('Registration successful');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.errors?.map(e => e.msg).join(', ') || err.message);
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <h2 className="form-title">Create an Account</h2>

        <form onSubmit={handleSubmit} className="form">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="form-input"
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="form-input"
          />
          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="form-input"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="form-input"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="form-input"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="STORE_OWNER">Store Owner</option>
          </select>

          <button type="submit" className="btn">Register</button>
        </form>

        <p className="form-footer">
          Already have an account?
          <span className="link" onClick={() => navigate('/login')}> Login</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
