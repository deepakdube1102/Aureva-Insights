import { Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" id="nav-home-link">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stopColor="#00d4ff" />
                <stop offset="100%" stopColor="#7b2ff7" />
              </linearGradient>
            </defs>
            <path d="M16 2L28 8V24L16 30L4 24V8L16 2Z" stroke="url(#logo-grad)" strokeWidth="2" fill="none" />
            <path d="M16 8L22 11V17L16 20L10 17V11L16 8Z" fill="url(#logo-grad)" />
          </svg>
          <span>Aureva</span>
        </Link>

        <div className="navbar-links">
          <SignedIn>
            <Link
              to="/watchlist"
              className={`nav-link ${location.pathname === '/watchlist' ? 'active' : ''}`}
              id="nav-watchlist-link"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
              Watchlist
            </Link>
          </SignedIn>

          <div className="nav-auth">
            <SignedOut>
              <Link to="/sign-in" className="btn btn-primary btn-sm" id="nav-signin-btn">
                Sign In
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: {
                      width: 32,
                      height: 32,
                    },
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
