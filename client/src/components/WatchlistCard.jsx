import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { removeFromWatchlist } from '../services/api';

function WatchlistCard({ item, onRemoved }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/dashboard/fund/${item.schemeCode}`);
  };

  const handleRemove = async (e) => {
    e.stopPropagation();
    try {
      await removeFromWatchlist(item.schemeCode);
      toast.success('Removed from watchlist');
      onRemoved(item.schemeCode);
    } catch (error) {
      toast.error('Failed to remove');
    }
  };

  const addedDate = new Date(item.addedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      className="glass-card watchlist-card"
      onClick={handleClick}
      id={`watchlist-card-${item.schemeCode}`}
    >
      <div className="watchlist-card-header">
        <h3 className="watchlist-card-title">{item.schemeName}</h3>
        <button
          className="watchlist-card-remove"
          onClick={handleRemove}
          title="Remove from watchlist"
          id={`remove-btn-${item.schemeCode}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="watchlist-card-meta">
        <span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
          #{item.schemeCode}
        </span>
        <span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Added {addedDate}
        </span>
      </div>
    </div>
  );
}

export default WatchlistCard;
