import { Outlet, Navigate } from 'react-router-dom';

// hoc adalah hire order component

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to={'/login'} />;
  }

  return <>{children || <Outlet />}</>;
};

export default ProtectedRoute;
