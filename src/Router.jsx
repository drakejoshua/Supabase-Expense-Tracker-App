/**
 * Router configuration for the Supabase Expense Tracker application.
 *
 * This file defines the application's main routes using React Router's `createBrowserRouter`.
 * It maps URL paths to their corresponding page components, including protected routes
 * that require authentication (Transactions, Categories, Settings) and public routes
 * (Dashboard, Login, Signup, NotFound).
 *
 * Protected routes are wrapped with the `ProtectedRoute` component to restrict access
 * to authenticated users only.
 *
 * @file Router.jsx
 */


import { createBrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Transactions from './pages/Transactions'
import Categories from './pages/Categories'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter( [
    { 
        path: '/', element: <Dashboard/> 
    },

    { 
        path: "/login", element: <Login/> 
    },

    { 
        path: "/signup", element: <Signup/> 
    },

    { 
        path: "/transactions", 
        element:
            <ProtectedRoute>
                <Transactions/> 
            </ProtectedRoute>
    },

    { 
        path: "/categories", 
        element:
            <ProtectedRoute>
                <Categories/> 
            </ProtectedRoute>
    },

    { 
        path: "/settings", 
        element:
            <ProtectedRoute>
                <Settings/> 
            </ProtectedRoute>
    },

    { 
        path: "*", element: <NotFound/> 
    },

])