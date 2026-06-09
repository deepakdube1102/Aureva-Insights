import { useAuth } from '@clerk/clerk-react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useState } from 'react';

function DashboardLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isLoaded) {
    return (
      <div className="loading-container" style={{ minHeight: '100vh' }}>
        <div className="spinner spinner-lg" />
        <p className="loading-text">Loading dashboard...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <div className="dashboard-layout">
      {/* Mobile Toggle Button */}
      <button 
        className="mobile-sidebar-toggle" 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle Navigation Menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {isSidebarOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" />
          )}
        </svg>
      </button>

      {/* Sidebar navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Pane */}
      <main className="dashboard-main-content">
        <Outlet />
      </main>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div className="mobile-sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  );
}

export default DashboardLayout;
