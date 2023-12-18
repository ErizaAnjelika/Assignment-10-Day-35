import User  from './pages/user';
import Login from './pages/login';
import ProtectedRoute from './hoc/ProtectedRoute';
import { Navigate } from 'react-router-dom';

export const routes = [
  {
    path: '/',
    element: <Navigate to="/login" />,
  },
  {
    path: '/user',
    element: (
      <ProtectedRoute>
        <User />
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
];
