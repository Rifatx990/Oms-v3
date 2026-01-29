import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import OrderCreate from './pages/Orders/Create';
import OrderView from './pages/Orders/View';
import Dues from './pages/Dues';
import Workers from './pages/Workers';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50',
    },
    secondary: {
      main: '#3498db',
    },
    success: {
      main: '#27ae60',
    },
    error: {
      main: '#e74c3c',
    },
    warning: {
      main: '#f39c12',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Toaster position="top-right" />
            <Routes>
              {/* Auth Routes */}
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>

              {/* Protected Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="orders">
                  <Route index element={<Orders />} />
                  <Route path="create" element={<OrderCreate />} />
                  <Route path=":id" element={<OrderView />} />
                  <Route path="edit/:id" element={<OrderCreate />} />
                </Route>
                <Route path="dues" element={<Dues />} />
                <Route path="workers" element={<Workers />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
