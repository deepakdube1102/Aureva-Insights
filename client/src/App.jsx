import { Routes, Route, Outlet } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { setAuthToken } from './services/api';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import WatchlistPage from './pages/WatchlistPage';
import FundDetailPage from './pages/FundDetailPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import SearchPage from './pages/SearchPage';
import './App.css';

// Public layout wrapper with the top navbar
function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
}

function App() {
  const { getToken } = useAuth();

  useEffect(() => {
    setAuthToken(getToken);
  }, [getToken]);

  return (
    <>
      <Routes>
        {/* Public Landing & Authentication Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
        </Route>

        {/* Protected Dashboard Sidebar Layout Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="watchlist" element={<WatchlistPage />} />
          <Route path="fund/:schemeCode" element={<FundDetailPage />} />
        </Route>
      </Routes>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(15, 20, 55, 0.95)',
            color: '#f0f2ff',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            fontSize: '0.875rem',
          },
          success: {
            iconTheme: { primary: '#00e68a', secondary: '#0d1130' },
          },
          error: {
            iconTheme: { primary: '#ff4757', secondary: '#0d1130' },
          },
        }}
      />
    </>
  );
}

export default App;
