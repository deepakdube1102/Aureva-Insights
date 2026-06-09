import { useState, useEffect, useCallback } from 'react';

function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');

  // Debounce search - 300ms delay
  useEffect(() => {
    if (query.trim().length < 2) return;

    const timer = setTimeout(() => {
      onSearch(query.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (query.trim().length >= 2) {
        onSearch(query.trim());
      }
    },
    [query, onSearch]
  );

  return (
    <form onSubmit={handleSubmit} className="search-wrapper">
      <div className="search-input-container">
        <svg
          className="search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search mutual funds... (e.g. Axis, SBI, HDFC)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          id="search-input"
          autoComplete="off"
        />
        {isLoading && (
          <div className="search-spinner">
            <div className="spinner" />
          </div>
        )}
      </div>
    </form>
  );
}

export default SearchBar;
