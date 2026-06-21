import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from 'react-bootstrap';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  return user && user.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

export default AdminRoute;