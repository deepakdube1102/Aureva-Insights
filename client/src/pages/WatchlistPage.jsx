import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import WatchlistCard from '../components/WatchlistCard';
import { getWatchlist } from '../services/api';

function WatchlistPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isSignedIn) {
      fetchWatchlist();
    }
  }, [isSignedIn]);

  const fetchWatchlist = async () => {
    try {
      setIsLoading(true);
      const data = await getWatchlist();
      setItems(data);
    } catch (err) {
      setError('Failed to load watchlist');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoved = (schemeCode) => {
    setItems((prev) => prev.filter((item) => item.schemeCode !== schemeCode));
  };

  if (!isLoaded || (isLoaded && !isSignedIn)) {
    return null;
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span className="gradient-text">Your Watchlist</span>
          </h1>
          <p className="page-subtitle">
            Track your favorite mutual fund schemes and monitor their performance.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="watchlist-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card" style={{ padding: 24 }}>
                <div className="skeleton" style={{ height: 20, width: '80%', marginBottom: 12 }} />
                <div className="skeleton" style={{ height: 16, width: '60%', marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 14, width: '40%' }} />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="error-container">
            <div className="error-icon">❌</div>
            <p className="error-message">{error}</p>
            <button className="btn btn-primary" onClick={fetchWatchlist}>
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && items.length === 0 && (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
            <h3>No Funds in Your Watchlist</h3>
            <p>Search for mutual funds and add them to your watchlist to start tracking.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/dashboard/search')}
              style={{ marginTop: 16 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              Search Funds
            </button>
          </div>
        )}

        {/* Watchlist Grid */}
        {!isLoading && !error && items.length > 0 && (
          <div className="watchlist-grid">
            {items.map((item, index) => (
              <div
                key={item.schemeCode}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <WatchlistCard item={item} onRemoved={handleRemoved} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WatchlistPage;
