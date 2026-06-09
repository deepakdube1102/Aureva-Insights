import { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

function NavChart({ data, range }) {
  // Parse, filter, and sort data based on selected range
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Parse dates from dd-mm-yyyy format and sort oldest-first
    const parsed = data
      .map((item) => {
        const [dd, mm, yyyy] = item.date.split('-');
        const dateObj = new Date(`${yyyy}-${mm}-${dd}`);
        return {
          date: dateObj,
          nav: parseFloat(item.nav),
          dateStr: item.date,
        };
      })
      .filter((item) => !isNaN(item.nav) && !isNaN(item.date.getTime()))
      .sort((a, b) => a.date - b.date);

    if (parsed.length === 0) return [];

    // Filter by range
    const now = new Date();
    let cutoff;

    switch (range) {
      case '1Y':
        cutoff = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      case '3Y':
        cutoff = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());
        break;
      case '5Y':
        cutoff = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
        break;
      case 'All':
      default:
        cutoff = new Date(0);
        break;
    }

    const filtered = parsed.filter((item) => item.date >= cutoff);

    if (filtered.length === 0) return [];

    // DOWNSAMPLING OPTIMIZATION:
    // Limit data points to ~150 for rendering performance while preserving the visual curve.
    // We always include the last point (most recent NAV) to ensure the current valuation remains exact.
    const maxPoints = 150;
    let sampled = filtered;
    if (filtered.length > maxPoints) {
      const step = Math.ceil(filtered.length / maxPoints);
      sampled = filtered.filter(
        (item, index) => index % step === 0 || index === filtered.length - 1
      );
    }

    return sampled.map((item) => ({
      date: item.date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: '2-digit',
      }),
      nav: item.nav,
      fullDate: item.date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    }));
  }, [data, range]);

  if (chartData.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '48px 16px' }}>
        <h3>No Data Available</h3>
        <p>No NAV data is available for the selected time range.</p>
      </div>
    );
  }

  // Smart tick calculation for x-axis
  const tickInterval = Math.max(1, Math.floor(chartData.length / 6));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: 'rgba(13, 17, 48, 0.95)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            borderRadius: '10px',
            padding: '12px 16px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          }}
        >
          <p style={{ color: '#8b92b3', fontSize: '0.75rem', marginBottom: '4px' }}>
            {payload[0].payload.fullDate}
          </p>
          <p style={{ color: '#00d4ff', fontSize: '1.1rem', fontWeight: 700 }}>
            ₹{payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={380}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="navGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.35} />
            <stop offset="50%" stopColor="#7b2ff7" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#7b2ff7" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#7b2ff7" />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255, 255, 255, 0.04)"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#5a6180' }}
          axisLine={{ stroke: 'rgba(255, 255, 255, 0.06)' }}
          tickLine={false}
          interval={tickInterval}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#5a6180' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => `₹${value}`}
          domain={['auto', 'auto']}
          width={65}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="nav"
          stroke="url(#lineGradient)"
          strokeWidth={2}
          fill="url(#navGradient)"
          dot={false}
          activeDot={{
            r: 5,
            stroke: '#00d4ff',
            strokeWidth: 2,
            fill: '#0d1130',
          }}
          animationDuration={800}
          animationEasing="ease-in-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default NavChart;
