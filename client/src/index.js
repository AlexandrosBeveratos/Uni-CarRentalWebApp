import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import ErrorPage from "./screens/errorPage";
import PathNotFound from './screens/pathNotFound';
import Navbar from './components/navbar';
import Home from './screens/home';
import Dashboard from './screens/dashboard'
import Reservations from './screens/reservations'
import Register from './screens/register'
import ProtectedRoute from './protected-route';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './screens/login';
import Admin from './screens/admin';
import Fleet from './screens/fleet';

//React Frontend Routing configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/dashboard",
        element: (
        <ProtectedRoute requiredRole={['user', 'admin']}>
          <Dashboard />
        </ProtectedRoute>
        ),
      },
      {
        path: "/admin",
        element: (
        <ProtectedRoute requiredRole={['admin']}>
          <Admin />
        </ProtectedRoute>
        ),
      },
      {
        path: "/fleet",
        element: <Fleet />,
      },
      {
        path: "/reservations",
        element: (
        <ProtectedRoute requiredRole={['user', 'admin']}>
          <Reservations />
        </ProtectedRoute>
        ),
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      //In case url path doesn't exist
      {
        path: "*",
        element: <PathNotFound />,
      },
    ]
  },

]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


