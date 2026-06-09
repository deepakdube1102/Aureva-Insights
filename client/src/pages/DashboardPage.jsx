import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { getWatchlist } from '../services/api';
import WatchlistCard from '../components/WatchlistCard';

// Sample curated list of popular funds for quick exploration
const POPULAR_FUNDS = [
  { schemeCode: '119835', schemeName: 'SBI Contra Fund - Direct Plan - Growth' },
  { schemeCode: '118989', schemeName: 'HDFC Mid Cap Fund - Direct Plan - Growth' },
  { schemeCode: '118632', schemeName: 'Nippon India Large Cap Fund - Direct Plan - Growth' },
  { schemeCode: '118825', schemeName: 'Mirae Asset Large Cap Fund - Direct Plan - Growth' },
];

function DashboardPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const watchlistData = await getWatchlist();
      setWatchlist(watchlistData || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Could not sync dashboard details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoved = (schemeCode) => {
    setWatchlist((prev) => prev.filter((item) => item.schemeCode !== schemeCode));
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="page dashboard-page">
      <div className="container">
        {/* Top Header Section */}
        <header className="dashboard-header animate-fade-in">
          <div className="welcome-banner">
            <h1>
              {greeting()},{' '}
              <span className="gradient-text">{user?.firstName || 'Explorer'}</span> 👋
            </h1>
            <p>Welcome back to Aureva Insights. Here is your portfolio tracker overview.</p>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="dashboard-stats-grid">
          <div className="glass-card stat-card animate-fade-in-up" style={{ animationDelay: '50ms' }}>
            <div className="stat-icon purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
            </div>
            <div className="stat-details">
              <h3>Watchlist</h3>
              <p className="stat-value">{isLoading ? '...' : watchlist.length}</p>
              <p className="stat-subtitle">Tracked schemes</p>
            </div>
          </div>

          <div className="glass-card stat-card animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="stat-icon cyan">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div className="stat-details">
              <h3>Last Updated</h3>
              <p className="stat-value">6x Daily</p>
              <p className="stat-subtitle">MFAPI Real-time updates</p>
            </div>
          </div>

          <div className="glass-card stat-card animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <div className="stat-icon green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="stat-details">
              <h3>System Status</h3>
              <p className="stat-value text-green">Online</p>
              <p className="stat-subtitle">Connected to upstream</p>
            </div>
          </div>
        </section>

        {/* Interactive Actions & Curated Section */}
        <div className="dashboard-grid">
          {/* Watchlist Section */}
          <div className="dashboard-section main-sec">
            <div className="section-title-bar">
              <h2>My Portfolio Watchlist</h2>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/dashboard/watchlist')}>
                View Full
              </button>
            </div>

            {isLoading ? (
              <div className="watchlist-grid">
                {[1, 2].map((i) => (
                  <div key={i} className="glass-card" style={{ padding: 24, height: 160 }}>
                    <div className="skeleton" style={{ height: 20, width: '80%', marginBottom: 12 }} />
                    <div className="skeleton" style={{ height: 16, width: '60%', marginBottom: 8 }} />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="error-container" style={{ padding: '24px 0' }}>
                <p className="error-message">{error}</p>
                <button className="btn btn-primary" onClick={fetchDashboardData}>Retry</button>
              </div>
            ) : watchlist.length === 0 ? (
              <div className="dashboard-empty-card glass-card">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
                <h3>Watchlist is Empty</h3>
                <p>Add schemes to track NAV history, performance analytics, and visual charts.</p>
                <button className="btn btn-primary" onClick={() => navigate('/dashboard/search')}>
                  Browse Schemes
                </button>
              </div>
            ) : (
              <div className="watchlist-grid">
                {watchlist.slice(0, 4).map((item) => (
                  <WatchlistCard key={item.schemeCode} item={item} onRemoved={handleRemoved} />
                ))}
              </div>
            )}
          </div>

          {/* Quick recommendations/Popular Section */}
          <div className="dashboard-section side-sec">
            <div className="section-title-bar">
              <h2>Trending Mutual Funds</h2>
            </div>
            <div className="trending-list">
              {POPULAR_FUNDS.map((fund, index) => (
                <div 
                  key={fund.schemeCode} 
                  className="glass-card trending-item animate-fade-in-up"
                  style={{ animationDelay: `${index * 50 + 200}ms` }}
                  onClick={() => navigate(`/dashboard/fund/${fund.schemeCode}`)}
                >
                  <div className="trending-info">
                    <h4>{fund.schemeName}</h4>
                    <span>Code: {fund.schemeCode}</span>
                  </div>
                  <div className="trending-action">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            <div className="search-cta-banner glass-card">
              <h3>Looking for another scheme?</h3>
              <p>Explore thousands of other Direct/Regular Mutual Fund plans.</p>
              <button className="btn btn-primary" onClick={() => navigate('/dashboard/search')} style={{ width: '100%' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                Find Mutual Funds
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
