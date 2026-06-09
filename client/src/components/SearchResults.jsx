import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { addToWatchlist } from '../services/api';
import toast from 'react-hot-toast';
import { useState } from 'react';

function SearchResults({ results, watchlistCodes = [] }) {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [addingCode, setAddingCode] = useState(null);

  const handleAdd = async (schemeCode, schemeName) => {
    if (!isSignedIn) {
      toast.error('Please sign in to add to watchlist');
      navigate('/sign-in');
      return;
    }

    try {
      setAddingCode(schemeCode);
      await addToWatchlist(schemeCode, schemeName);
      toast.success('Added to watchlist!');
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error('Already in your watchlist');
      } else {
        toast.error('Failed to add to watchlist');
      }
    } finally {
      setAddingCode(null);
    }
  };

  if (!results || results.length === 0) return null;

  return (
    <div className="search-results" id="search-results">
      <div className="search-results-header">
        <h3>Results</h3>
        <span className="search-results-count">{results.length} schemes found</span>
      </div>

      {results.slice(0, 50).map((fund, index) => {
        const isInWatchlist = watchlistCodes.includes(fund.schemeCode);

        return (
          <div
            key={fund.schemeCode}
            className="search-result-item"
            style={{ animationDelay: `${index * 30}ms`, cursor: 'pointer' }}
            id={`result-${fund.schemeCode}`}
            onClick={() => navigate(`/dashboard/fund/${fund.schemeCode}`)}
          >
            <div className="result-info">
              <div className="result-name" title={fund.schemeName}>
                {fund.schemeName}
              </div>
              <div className="result-code">#{fund.schemeCode}</div>
            </div>

            <div className="result-actions">
              <button
                className={`btn btn-sm ${isInWatchlist ? 'btn-secondary' : 'btn-primary'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdd(fund.schemeCode, fund.schemeName);
                }}
                disabled={isInWatchlist || addingCode === fund.schemeCode}
                id={`add-btn-${fund.schemeCode}`}
              >
                {addingCode === fund.schemeCode ? (
                  <div className="spinner" style={{ width: 14, height: 14, borderWidth: 1.5 }} />
                ) : isInWatchlist ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    In Watchlist
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    Add to Watchlist
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SearchResults;
