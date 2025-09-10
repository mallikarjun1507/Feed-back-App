import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser(); 
    navigate('/login'); 
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">FeedbackApp</Link>
        <Link to="/" className="nav-link">Home</Link>
        {user && user.role === 'ADMIN' && (
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
        )}
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <span className="welcome-text">Welcome, {user.name}</span>
            <button onClick={handleLogout} className="btn btn-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-login">Login</Link>
            <Link to="/register" className="btn btn-register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
