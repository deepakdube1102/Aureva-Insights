import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavChart from '../components/NavChart';
import RangeToggle from '../components/RangeToggle';
import { getFundDetail } from '../services/api';

function FundDetailPage() {
  const { schemeCode } = useParams();
  const navigate = useNavigate();
  const [fund, setFund] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState('5Y');

  useEffect(() => {
    fetchFundDetail();
  }, [schemeCode]);

  const fetchFundDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getFundDetail(schemeCode);
      setFund(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Fund scheme not found');
      } else {
        setError('Failed to load fund data. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Get latest NAV info
  const latestNav = fund?.data?.[0];
  const latestNavValue = latestNav ? parseFloat(latestNav.nav) : null;
  const latestNavDate = latestNav?.date;

  return (
    <div className="page">
      <div className="container fund-detail">
        {/* Back Button */}
        <button className="fund-back" onClick={() => navigate(-1)} id="fund-back-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Loading */}
        {isLoading && (
          <div className="loading-container">
            <div className="spinner spinner-lg" />
            <p className="loading-text">Loading fund data...</p>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="error-container">
            <div className="error-icon">📉</div>
            <p className="error-message">{error}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={fetchFundDetail}>
                Retry
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                Go Home
              </button>
            </div>
          </div>
        )}

        {/* Fund Detail Content */}
        {!isLoading && !error && fund && (
          <>
            {/* Fund Header */}
            <div className="fund-header">
              <h1 className="fund-title">{fund.meta?.scheme_name || `Scheme #${schemeCode}`}</h1>

              <div className="fund-meta-tags">
                {fund.meta?.fund_house && (
                  <span className="badge badge-cyan">{fund.meta.fund_house}</span>
                )}
                {fund.meta?.scheme_category && (
                  <span className="badge badge-purple">{fund.meta.scheme_category}</span>
                )}
                {fund.meta?.scheme_type && (
                  <span className="badge badge-green">{fund.meta.scheme_type}</span>
                )}
              </div>

              {latestNavValue && (
                <div className="fund-nav-current">
                  <span className="fund-nav-value">₹{latestNavValue.toFixed(2)}</span>
                  <div>
                    <span className="fund-nav-label">Current NAV</span>
                    {latestNavDate && (
                      <div className="fund-nav-date">as of {latestNavDate}</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Chart Section */}
            <div className="chart-section">
              <div className="glass-card chart-container">
                <div className="chart-header">
                  <h2 className="chart-title">NAV Performance</h2>
                  <RangeToggle activeRange={range} onRangeChange={setRange} />
                </div>
                <NavChart data={fund.data || []} range={range} />
              </div>
            </div>

            {/* ISIN Info */}
            {(fund.meta?.isin_growth || fund.meta?.isin_div_reinvestment) && (
              <div
                className="glass-card"
                style={{ padding: '20px 24px', marginTop: 24 }}
              >
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>
                  ISIN Details
                </h3>
                <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', fontSize: '0.875rem' }}>
                  {fund.meta.isin_growth && (
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Growth: </span>
                      <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                        {fund.meta.isin_growth}
                      </span>
                    </div>
                  )}
                  {fund.meta.isin_div_reinvestment && (
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Div Reinvestment: </span>
                      <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                        {fund.meta.isin_div_reinvestment}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default FundDetailPage;
