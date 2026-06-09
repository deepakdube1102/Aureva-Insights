import { NavLink, Link } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';

function Sidebar({ isOpen, onClose }) {
  const { user } = useUser();

  return (
    <aside className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand">
        <Link to="/dashboard" onClick={onClose} className="navbar-brand">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logo-grad-sidebar" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stopColor="#00d4ff" />
                <stop offset="100%" stopColor="#7b2ff7" />
              </linearGradient>
            </defs>
            <path d="M16 2L28 8V24L16 30L4 24V8L16 2Z" stroke="url(#logo-grad-sidebar)" strokeWidth="2" fill="none" />
            <path d="M16 8L22 11V17L16 20L10 17V11L16 8Z" fill="url(#logo-grad-sidebar)" />
          </svg>
          <span>Aureva</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9" />
            <rect x="14" y="3" width="7" height="5" />
            <rect x="14" y="12" width="7" height="9" />
            <rect x="3" y="16" width="7" height="5" />
          </svg>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/dashboard/search"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <span>Search Funds</span>
        </NavLink>

        <NavLink
          to="/dashboard/watchlist"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
          <span>Watchlist</span>
        </NavLink>
      </nav>

      {/* Footer Profile Area */}
      <div className="sidebar-footer">
        <div className="sidebar-profile">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: {
                  width: 38,
                  height: 38,
                },
              },
            }}
          />
          <div className="sidebar-profile-info">
            <p className="profile-name">{user?.fullName || 'Aureva User'}</p>
            <p className="profile-email">{user?.primaryEmailAddress?.emailAddress || ''}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
