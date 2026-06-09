import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import { searchFunds, getWatchlist } from '../services/api';

function SearchPage() {
  const { isSignedIn } = useAuth();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [watchlistCodes, setWatchlistCodes] = useState([]);

  // Fetch user's watchlist codes to show "already added" state
  useEffect(() => {
    if (isSignedIn) {
      getWatchlist()
        .then((items) => setWatchlistCodes(items.map((i) => i.schemeCode)))
        .catch(() => {}); // Silently fail
    }
  }, [isSignedIn]);

  const handleSearch = useCallback(async (query) => {
    if (!query || query.trim().length === 0) return;
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await searchFunds(query);
      setResults(data || []);
    } catch (err) {
      setError('Failed to search funds. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="page search-page">
      <div className="container">
        {/* Header */}
        <div className="page-header animate-fade-in">
          <h1 className="page-title">
            Search <span className="gradient-text">Mutual Funds</span>
          </h1>
          <p className="page-subtitle">
            Query across thousands of Indian mutual fund schemes by AMC or name.
          </p>
        </div>

        {/* Search Controls */}
        <div className="search-controls-container animate-fade-in-up">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Error State */}
        {error && (
          <div className="error-container animate-fade-in">
            <div className="error-icon">⚠️</div>
            <p className="error-message">{error}</p>
            <button className="btn btn-secondary" onClick={() => setError(null)}>
              Dismiss
            </button>
          </div>
        )}

        {/* Results */}
        <SearchResults results={results} watchlistCodes={watchlistCodes} />

        {/* Empty State After Search */}
        {hasSearched && !isLoading && !error && results.length === 0 && (
          <div className="empty-state animate-fade-in">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
              <path d="M8 11h6" />
            </svg>
            <h3>No Funds Found</h3>
            <p>Try a different search term like &quot;Axis&quot;, &quot;SBI&quot;, or &quot;HDFC&quot;.</p>
          </div>
        )}

        {/* Initial CTA before search */}
        {!hasSearched && (
          <div className="initial-search-state glass-card animate-fade-in-up" style={{ marginTop: 32, padding: '40px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>🔍</div>
            <h3>Discover & Track Schemes</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 450, margin: '8px auto 0' }}>
              Enter a keyword above to look up performance details, historical NAV records, and add them to your watchlist.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
