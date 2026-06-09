import { useAuth } from '@clerk/clerk-react';
import { Navigate, useNavigate } from 'react-router-dom';

function HomePage() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  // Wait for auth to load
  if (!isLoaded) {
    return (
      <div className="loading-container" style={{ minHeight: '100vh' }}>
        <div className="spinner spinner-lg" />
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  // Redirect to dashboard if logged in
  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="page landing-page">
      {/* Hero Section */}
      <section className="landing-hero animate-fade-in">
        <div className="container landing-hero-inner">
          <div className="landing-badge badge badge-cyan animate-fade-in-up">
            ✨ Premium Mutual Fund Analytics
          </div>
          
          <h1 className="hero-title animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Smart Wealth Tracking
            <br />
            <span className="gradient-text">Aureva Fund Insights</span>
          </h1>
          
          <p className="hero-subtitle animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            Empowering investors with real-time NAV analytics, interactive performance charts, and direct watchlists for Indian Mutual Funds.
          </p>

          <div className="landing-ctas animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/sign-up')} id="landing-signup-btn">
              Get Started for Free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/sign-in')} id="landing-signin-btn">
              Sign In to Portfolio
            </button>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="landing-features">
        <div className="container">
          <h2 className="section-header gradient-text text-center">Comprehensive Tracker Features</h2>
          <div className="features-grid">
            <div className="glass-card feature-card animate-fade-in-up" style={{ animationDelay: '250ms' }}>
              <div className="feature-icon bg-cyan">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <h3>Explore 10,000+ Schemes</h3>
              <p>Instant search for direct and regular plans across all leading Asset Management Companies (AMCs) in India.</p>
            </div>

            <div className="glass-card feature-card animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="feature-icon bg-purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18" />
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                </svg>
              </div>
              <h3>Interactive Visual NAV Charts</h3>
              <p>Analyze historical NAV records spanning up to 5 years. Interactively filter ranges from 1 month to max duration.</p>
            </div>

            <div className="glass-card feature-card animate-fade-in-up" style={{ animationDelay: '355ms' }}>
              <div className="feature-icon bg-pink">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
              </div>
              <h3>Custom Watchlists</h3>
              <p>Pin your preferred investments to your dashboard for rapid tracking. Synchronized securely with MongoDB.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Mockup section */}
      <section className="landing-mockup">
        <div className="container">
          <div className="glass-card mockup-wrapper animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="mockup-header">
              <div className="mockup-dots">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
              </div>
              <div className="mockup-address-bar">https://aureva.insights/dashboard</div>
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar">
                <div className="mockup-nav-item active">Dashboard</div>
                <div className="mockup-nav-item">Search Funds</div>
                <div className="mockup-nav-item">Watchlist</div>
              </div>
              <div className="mockup-content">
                <div className="mockup-welcome">Welcome back, Explorer 👋</div>
                <div className="mockup-charts-grid">
                  <div className="mockup-mini-card">
                    <span>Active Watchlist</span>
                    <strong>4 Schemes</strong>
                  </div>
                  <div className="mockup-mini-card">
                    <span>Upstream Sync</span>
                    <strong>6x Daily</strong>
                  </div>
                </div>
                <div className="mockup-chart-placeholder">
                  {/* Simulated Sparkline / Chart */}
                  <svg viewBox="0 0 400 100" fill="none" className="sparkline">
                    <path d="M 0 80 Q 50 20 100 60 T 200 10 T 300 50 T 400 30" stroke="url(#mockup-chart-grad)" strokeWidth="3" />
                    <defs>
                      <linearGradient id="mockup-chart-grad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#00d4ff" />
                        <stop offset="100%" stopColor="#7b2ff7" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <p>© 2026 Aureva Insights. Powered by MFAPI.in. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
