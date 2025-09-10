import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import StoreList from './pages/StoreList.jsx';
import AddStore from './pages/AddStore.jsx';
import StoreRatings from './pages/StoreRatings.jsx';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <StoreList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stores/:storeId/ratings"
          element={
            <ProtectedRoute>
              <StoreRatings />
            </ProtectedRoute>
          }
        />

        {/* Add Store Route – Only for Admin */}
        <Route
          path="/add-store"
          element={
            <ProtectedRoute adminOnly={true}>
              <AddStore />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
