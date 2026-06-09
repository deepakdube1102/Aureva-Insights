function RangeToggle({ activeRange, onRangeChange }) {
  const ranges = ['1Y', '3Y', '5Y', 'All'];

  return (
    <div className="range-toggle" id="range-toggle">
      {ranges.map((range) => (
        <button
          key={range}
          className={`range-btn ${activeRange === range ? 'active' : ''}`}
          onClick={() => onRangeChange(range)}
          id={`range-btn-${range.toLowerCase()}`}
        >
          {range}
        </button>
      ))}
    </div>
  );
}

export default RangeToggle;
